function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheetName = data.sheet; 
    const action = data.action; 
    const payload = data.payload;
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    
    // Tenta encontrar a aba mesmo se o nome estiver levemente diferente (espaços ou maiúsculas)
    if (!sheet) {
      const allSheets = ss.getSheets();
      sheet = allSheets.find(s => s.getName().toLowerCase().trim() === sheetName.toLowerCase().trim());
    }
    
    if (!sheet) return response({error: 'Aba não encontrada: ' + sheetName});

    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0].map(h => String(h).toLowerCase().trim()); // Cabeçalhos normalizados
    const idColumnIndex = headers.indexOf('id');

    // --- AÇÃO: CRIAR ---
    if (action === 'create') {
      const originalHeaders = values[0]; // Usa os cabeçalhos originais para o mapeamento
      const newRow = originalHeaders.map(header => {
        const key = String(header).toLowerCase().trim();
        // Tenta achar no payload pela chave exata ou pela versão normalizada
        return payload[header] !== undefined ? payload[header] : (payload[key] !== undefined ? payload[key] : '');
      });
      sheet.appendRow(newRow);
      return response({success: true, action: 'create'});
    }

    if (idColumnIndex === -1) return response({error: 'Coluna "id" não encontrada na aba ' + sheetName});

    // --- AÇÃO: ATUALIZAR ---
    if (action === 'update') {
      let updated = false;
      for (let i = 1; i < values.length; i++) {
        if (String(values[i][idColumnIndex]).trim() === String(payload.id).trim()) {
          const originalHeaders = values[0];
          for (let key in payload) {
            const normalizedKey = key.toLowerCase().trim();
            const colIndex = originalHeaders.findIndex(h => String(h).toLowerCase().trim() === normalizedKey);
            if (colIndex !== -1) {
              sheet.getRange(i + 1, colIndex + 1).setValue(payload[key]);
            }
          }
          updated = true;
        }
      }
      return response({success: updated, action: 'update'});
    }

    // --- AÇÃO: DELETAR ---
    if (action === 'delete') {
      let deletedCount = 0;
      // Deleta de baixo para cima para não bugar os índices
      for (let i = values.length - 1; i >= 1; i--) {
        const rowId = String(values[i][idColumnIndex]).trim();
        const targetId = String(payload.id).trim();
        
        if (rowId === targetId) {
          sheet.deleteRow(i + 1);
          deletedCount++;
        }
      }
      return response({success: true, action: 'delete', deletedCount: deletedCount});
    }

    return response({error: 'Ação desconhecida'});
  } catch (error) {
    return response({error: error.toString()});
  }
}

function response(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = e.parameter.sheet;
    const allSheets = ss.getSheets();
    const sheet = allSheets.find(s => s.getName().toLowerCase().trim() === (sheetName || '').toLowerCase().trim());
    
    if (!sheet) return response([]);
    
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return response([]);
    
    const headers = data[0];
    const rows = data.slice(1);
    const result = rows.map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        const key = String(header).toLowerCase().trim();
        obj[key] = row[i];
      });
      return obj;
    });
    return response(result);
  } catch (error) {
    return response([]);
  }
}
