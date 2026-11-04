#!/usr/bin/env python3
"""Gera js/data/embedded-svgs.js com o texto dos SVG usados na exportação.

Porquê: quando o site é aberto diretamente do ficheiro (file://) ou o servidor
bloqueia fetch(), o navegador "contamina" o canvas ao desenhar um SVG carregado
por URL e a exportação PNG/JPG falha. Com o texto do SVG dentro de um ficheiro JS,
a exportação não depende de carregar a imagem.

Quando mudares/acrescentares fundos ou ilustrações, volta a correr:

    python3 tools/gerar-svgs-embutidos.py

(corre a partir da pasta StoryVerse; só usa a biblioteca standard do Python)
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
FOLDERS = ["assets/backgrounds", "assets/illustrations", "assets/covers"]  # inclui christmas/ e newyear/ e as capas das histórias
OUT = ROOT / "js" / "data" / "embedded-svgs.js"

entries = {}
for folder in FOLDERS:
    for path in sorted((ROOT / folder).rglob("*.svg")):
        key = path.relative_to(ROOT).as_posix()
        entries[key] = path.read_text(encoding="utf-8").strip()

lines = [
    "/* GERADO AUTOMATICAMENTE por tools/gerar-svgs-embutidos.py — não editar à mão.",
    "   Usado só como alternativa na exportação PNG/JPG (ver README-EXPORTACAO.md). */",
    "window.SV_EMBEDDED_SVGS = {",
]
items = ["  %s: %s" % (json.dumps(k), json.dumps(v)) for k, v in entries.items()]
lines.append(",\n".join(items))
lines.append("};")
OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
print("%d SVG embutidos -> %s (%.1f KB)" % (len(entries), OUT.relative_to(ROOT), OUT.stat().st_size / 1024))
