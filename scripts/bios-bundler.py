import os
import json

src_base_path = (
    os.path.join("src", "bios")
    if os.getenv("CI")
    else os.path.join("..", "src", "bios")
)

all_bios_path = (
    os.path.join("public", "all-bios.json")
    if os.getenv("CI")
    else os.path.join("..", "public", "all-bios.json")
)

obj: dict[str, dict[str, str]] = {}

for f in os.listdir(src_base_path):
    base, _ = f.split(".")
    parts = base.split("-")
    bga_username = "-".join(parts[:-1])
    lang = parts[-1]

    with open(os.path.join(src_base_path, f), "r", encoding="utf-8") as file:
        raw_markdown = file.read()
        obj.setdefault(bga_username, {}).setdefault(lang, raw_markdown)

obj_str = json.dumps(obj, ensure_ascii=False)
with open(all_bios_path, "w", encoding="utf-8") as file:
    file.write(obj_str)