import os
import requests

TOKEN = "8897032756:AAFSBbqtttzKXvNjFspo-DGuC1nifoY-EoE"
CHAT_ID = "1290728019"

FILES = [
    "PROMPT_REBUILD.txt",
    "INSTRUCOES_DE_INSTALACAO.txt",
    "00-Iniciar_Nome_do_APP.jpg",
    "01-Projeto_Capa.jpg",
    # PDF will be generated later; placeholder name
    "MANUAL.pdf"
]

API_URL = f"https://api.telegram.org/bot{TOKEN}/sendDocument"

for file_name in FILES:
    if not os.path.isfile(file_name):
        print(f"Arquivo não encontrado: {file_name}")
        continue
    with open(file_name, "rb") as f:
        files = {"document": (file_name, f)}
        data = {"chat_id": CHAT_ID}
        response = requests.post(API_URL, data=data, files=files)
        if response.ok:
            print(f"Enviado {file_name} com sucesso")
        else:
            print(f"Erro ao enviar {file_name}: {response.text}")
