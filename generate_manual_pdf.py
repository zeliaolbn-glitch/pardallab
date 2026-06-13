from fpdf import FPDF
import os

class PDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 12)
        self.cell(0, 10, 'Manual Resumido do Projeto CRM IDEIAS', ln=True, align='C')
        self.ln(5)
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 10, f'Página {self.page_no()}', align='C')

pdf = PDF()
pdf.add_page()
pdf.set_font('Helvetica', size=10)
pdf.multi_cell(0, 5, "Este documento contém um resumo das principais funcionalidades e componentes do projeto.\n\n- Frontend: React + Vite, TypeScript, UI com Tailwind/Componentes customizados.\n- Backend: Node.js (Express) com integração ao Supabase e Telegram Bot.\n- Banco: Supabase (PostgreSQL) com tabelas de ideias, projetos, ferramentas, links, glossário, lembretes e tutoriais.\n- Deploy: Docker, scripts de instalação para Windows (install.bat) e Linux (install-ubuntu.sh).\n- Variáveis de ambiente: .env contendo chaves do Telegram, Supabase e Gemini.\n\nPara detalhes completos, verifique os arquivos PROMPT_REBUILD.txt e INSTRUCOES_DE_INSTALACAO.txt.")
output_path = os.path.join(os.getcwd(), 'MANUAL.pdf')
pdf.output(output_path)
print('PDF gerado:', output_path)
