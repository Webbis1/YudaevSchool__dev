import os
import re
from xml.etree import ElementTree as ET

# Пути
ICONS_DIR = "icons"
OUTPUT_FILE = "sprite.svg"

def slugify(filename):
    """Преобразует имя файла в id в формате kebab-case"""
    name = os.path.splitext(filename)[0]  # Убираем .svg
    name = name.lower()
    name = re.sub(r'[^a-z0-9]+', '-', name)  # Заменяем пробелы и спецсимволы на -
    name = re.sub(r'^-+|-+$', '', name)     # Убираем тире в начале и конце
    return name

def parse_svg(file_path):
    """Парсит SVG и возвращает viewBox и path'ы"""
    try:
        tree = ET.parse(file_path)
        root = tree.getroot()

        # Получаем viewBox
        viewBox = root.get("viewBox", "0 0 20 20")

        # Ищем все path
        paths = []
        for elem in root.iter():
            if elem.tag.endswith('}path') or 'path' in elem.tag:
                path_data = elem.get('d')
                if path_data:
                    paths.append(ET.tostring(elem, encoding='unicode').strip())

        return viewBox, paths
    except Exception as e:
        print(f"⚠️ Ошибка при обработке {file_path}: {e}")
        return None, []

def build_sprite():
    symbols = []

    # Читаем файлы
    files = [f for f in os.listdir(ICONS_DIR) if f.endswith(".svg")]

    for file in files:
        file_path = os.path.join(ICONS_DIR, file)
        viewbox, paths = parse_svg(file_path)

        if not paths:
            continue

        symbol_id = slugify(file)
        paths_str = "\n  ".join(paths)
        symbol = f"""
  <symbol id="{symbol_id}" viewBox="{viewbox}">
    {paths_str}
  </symbol>"""
        symbols.append(symbol)

    # Собираем итоговой SVG
    sprite = f"""<svg style="display: none;" xmlns="http://www.w3.org/2000/svg">
{''.join(symbols)}
</svg>
""".strip()

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(sprite)

    print(f"✅ Спрайт успешно создан: {OUTPUT_FILE}")

if __name__ == "__main__":
    build_sprite()