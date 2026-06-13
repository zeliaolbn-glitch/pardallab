import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Diretório onde as imagens serão salvas
output_dir = Path(__file__).parent

# Fonte padrão (se não houver fonte TTF, fallback para default)
def get_font(size):
    try:
        return ImageFont.truetype("arial.ttf", size)
    except IOError:
        return ImageFont.load_default()

# 1. Imagem de início
def create_start_image():
    img = Image.new('RGB', (800, 600), color='#f0f4f8')
    draw = ImageDraw.Draw(img)
    title = "Como iniciar o APP"
    font = get_font(48)
    # Compute text size using textbbox (compatible with newer Pillow)
    bbox = draw.textbbox((0, 0), title, font=font)
    w = bbox[2] - bbox[0]
    draw.text(((800 - w) / 2, 200), title, fill='#1e3a8a', font=font)
    subtitle = "Execute npm run dev e acesse http://localhost:5173"
    font2 = get_font(24)
    bbox2 = draw.textbbox((0, 0), subtitle, font=font2)
    w2 = bbox2[2] - bbox2[0]
    draw.text(((800 - w2) / 2, 300), subtitle, fill='#4b5563', font=font2)
    img.save(output_dir / '00-Iniciar_Nome_do_APP.jpg')

# 2. Imagem de capa do projeto
def create_cover_image():
    img = Image.new('RGB', (800, 600), color='#ffffff')
    draw = ImageDraw.Draw(img)
    title = "CRM IDEIAS"
    font = get_font(60)
    # Compute text size using textbbox (compatible with newer Pillow)
    bbox = draw.textbbox((0, 0), title, font=font)
    w = bbox[2] - bbox[0]
    draw.text(((800 - w) / 2, 50), title, fill='#111827', font=font)
    lines = [
        "Hostname: localhost",
        "Funcionalidades: Ideias, Projetos, Ferramentas, Telegram Bot",
        "Linguagem: TypeScript (React) + Node.js",
        "Ferramentas: Vite, Tailwind, Supabase, Docker",
        "Banco: PostgreSQL (Supabase)"
    ]
    y = 150
    for line in lines:
        draw.text((80, y), line, fill='#374151', font=get_font(24))
        y += 40
    img.save(output_dir / '01-Projeto_Capa.jpg')

if __name__ == '__main__':
    os.makedirs(output_dir, exist_ok=True)
    create_start_image()
    create_cover_image()
    print('Imagens geradas com sucesso.')
