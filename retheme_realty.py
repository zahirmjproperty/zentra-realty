#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""retheme_realty.py — Convert Zentra Realty mock-up (ex-Zentra Hub) from its
light green/blue palette to the Zentra Property Group theme:
  deep navy ground #0b1b2e + metallic gold #c9a227, dark by default.
Plus a light variant (.theme-light) for user choice.

Strategy:
  A. Replace the :root token block with ZPG tokens (+ add .theme-light block).
  B. Context-aware hex substitution: choose the replacement by CSS property
     (background vs border vs color) and by the hue family of the old colour.
  C. Append a component override layer for rules that hardcode light styling.
Run:  python3 retheme_realty.py [--dry]
"""
import re, os, sys, glob

ROOT = "/home/ubuntu/mockup-hartanah/zentra-realty"
DRY = "--dry" in sys.argv

# ---------------------------------------------------------------- A. tokens
ZPG_ROOT = """:root{
  /* ZPG — Zentra Property Group theme (dark, navy + gold) */
  --gold:#c9a227; --gold-soft:rgba(201,162,39,.12);
  --navy:#0b1b2e; --navy-2:#122840; --navy-3:#1a3050;
  --blue:#c9a227; --blue-soft:rgba(201,162,39,.14);
  --ink:#f0ead6; --ink-2:#cbd5e1; --ink-3:#94a3b8; --line:rgba(201,162,39,.18);
  --bg:#0a1628; --card:rgba(18,40,72,.72);
  --green:#5fc79d; --green-soft:rgba(95,199,157,.12);
  --amber:#f0b34a; --amber-soft:rgba(240,179,74,.12);
  --red:#E8776A; --red-soft:rgba(232,119,106,.12);
  --violet:#a78bfa; --violet-soft:rgba(167,139,250,.12);
  --radius:14px;
  --shadow:0 2px 12px rgba(0,0,0,.30), inset 0 1px 0 rgba(201,162,39,.06);
  --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  --line-2:rgba(201,162,39,.10);
  --sh-2:0 1px 3px rgba(0,0,0,.25);
  --sh-3:0 6px 20px rgba(0,0,0,.35);
  --t:180ms cubic-bezier(.2,.7,.3,1);
}
/* Light variant — user-selectable */
:root.theme-light{
  --gold:#8a6418; --gold-soft:rgba(138,100,24,.10);
  --navy:#0b1b2e; --navy-2:#122840; --navy-3:#1a3050;
  --blue:#8a6418; --blue-soft:rgba(138,100,24,.10);
  --ink:#1e293b; --ink-2:#475569; --ink-3:#94a3b8; --line:rgba(138,100,24,.16);
  --bg:#f7f5f0; --card:#ffffff;
  --green:#166b41; --green-soft:rgba(22,107,65,.10);
  --amber:#8a5a0b; --amber-soft:rgba(138,90,11,.10);
  --red:#a33a2c; --red-soft:rgba(163,58,44,.10);
  --violet:#5b3fa8; --violet-soft:rgba(91,63,168,.10);
  --shadow:0 1px 3px rgba(0,0,0,.05), 0 2px 12px rgba(0,0,0,.05);
  --line-2:rgba(138,100,24,.10);
  --sh-2:0 1px 3px rgba(0,0,0,.06);
  --sh-3:0 6px 20px rgba(0,0,0,.08);
}"""

# ---------------------------------------------------------- B. hex mapping
# Explicit brand/semantic colours
EXPLICIT = {
    # navy / green brand -> ZPG navy
    "#0c4437": "#0b1b2e", "#12604e": "#122840", "#17806a": "#1a3050",
    "#062a22": "#0b1b2e", "#0a3b30": "#122840", "#09342a": "#122840",
    "#0b1a15": "#0b1b2e", "#16211d": "#0f2036",
    # positive greens
    "#0b6b3a": "#5fc79d", "#0f9d58": "#5fc79d", "#1b9c6b": "#5fc79d",
    "#465049": "#94a3b8", "#4b5752": "#94a3b8", "#5c6b64": "#94a3b8",
    "#7a857f": "#64748b",
    # teal -> info
    "#0ea5a4": "#6bb5e0", "#0e7490": "#6bb5e0",
    # blue accent -> gold
    "#2563eb": "#c9a227", "#1d4ed8": "#a5851b", "#3b82f6": "#c9a227",
    "#4f7ff5": "#c9a227", "#bfdbfe": "rgba(201,162,39,.28)",
    "#dbe3ee": "rgba(201,162,39,.18)", "#a9bde0": "#a5851b",
    "#a5b4fc": "#c9a227", "#f7f8ff": "rgba(255,255,255,.04)",
    # violet
    "#7c3aed": "#a78bfa", "#6d28d9": "#a78bfa", "#f1eafe": "rgba(167,139,250,.12)",
    # amber
    "#b45309": "#f0b34a", "#f59e0b": "#f0b34a", "#8a5300": "#f0b34a",
    "#92700a": "#f0b34a", "#a5851b": "#a5851b",
    # red
    "#c0392b": "#E8776A", "#d92d20": "#E8776A", "#8f2318": "#E8776A",
    "#fecaca": "rgba(232,119,106,.30)", "#fef2f2": "rgba(232,119,106,.08)",
    "#fff8f7": "rgba(232,119,106,.06)", "#fdf5f4": "rgba(232,119,106,.06)",
    # ink
    "#0f172a": "#f0ead6", "#334155": "#cbd5e1", "#475569": "#94a3b8",
    "#64748b": "#64748b",
    # dark-on-gold text (keep dark)
    "#3a2c00": "#1a1206", "#332600": "#1a1206", "#2a2000": "#1a1206",
    "#6a5200": "#1a1206", "#7a5c00": "#1a1206",
    # gold shades
    "#e6c85f": "#e8ce86", "#e2c258": "#e8ce86", "#dfc05a": "#e8ce86",
    "#e6d391": "rgba(201,162,39,.35)", "#ecd9a3": "rgba(201,162,39,.35)",
    "#92700a": "#a5851b",
    # sidebar light text
    "#8fa3c8": "#94a3b8", "#c7d2e6": "#94a3b8", "#7d90b4": "#64748b",
    "#9db0d2": "#94a3b8", "#cbd5e1": "#94a3b8",
    # greys used as light bg/border
    "#94a3b8": "#64748b",
    "#f8fafc": "rgba(255,255,255,.04)", "#f1f5f9": "rgba(255,255,255,.04)",
    "#e2e8f0": "rgba(201,162,39,.18)", "#f5f7fb": "#0a1628",
    "#ffffff": "rgba(255,255,255,.04)", "#fff": "rgba(255,255,255,.04)",
    "#fcfdff": "rgba(255,255,255,.04)", "#fbfdfc": "rgba(255,255,255,.04)",
    "#f4f8f6": "rgba(255,255,255,.04)", "#f7faf8": "rgba(255,255,255,.04)",
    "#f8fbf9": "rgba(255,255,255,.04)", "#fdf..." : "",
}
EXPLICIT.pop("#fdf...", None)

# Neutral light tints -> dark surface / hairline, chosen by property context
NEUTRAL_LIGHT = {
    "#eef2f7", "#eef2f0", "#e6ebe8", "#e3e8e5", "#dfe7e3", "#dfe5e1",
    "#d8ded9", "#cfd8d3", "#b9c4be", "#eef4f1", "#e8eeeb", "#f2f7f4",
    "#f2f6f4", "#e6ece9", "#eef5f1", "#e8f1ec", "#f7faf8", "#f8fbf9",
    "#fcfdff", "#fbfdfc", "#f4f8f6", "#f1f5f9", "#f8fafc", "#fffdf5",
    "#f7faff", "#fef2f2", "#fff8f7", "#fdf5f4", "#e6f7f6", "#f4fffd",
    "#e9f4ef", "#eef8f2", "#dff3ec", "#dfeee7", "#dbe9e2", "#cfe3d8",
    "#cfe8da", "#e0e8e3",
}
PALE_GREEN = {"#e6f6ec", "#f0fdf4", "#bbf7d0", "#a7d8bd", "#a9d6c6",
              "#9dc3b6", "#cbe0d6", "#e6e9e6"}
PALE_BLUE = {"#e8effd", "#e6effd"}
PALE_AMBER = {"#fef3c7", "#fde68a", "#fffbeb", "#fcd34d"}
PALE_RED = {"#fdecea"}
PALE_VIOLET = {"#f1eafe"}

def fam(hexv):
    h = hexv.lower()
    if h in PALE_GREEN: return "green"
    if h in PALE_BLUE:  return "blue"
    if h in PALE_AMBER: return "amber"
    if h in PALE_RED:   return "red"
    if h in PALE_VIOLET:return "violet"
    return None

DARK_TINT = {"green": "rgba(95,199,157,.12)", "blue": "rgba(201,162,39,.12)",
             "amber": "rgba(240,179,74,.12)", "red": "rgba(232,119,106,.12)",
             "violet": "rgba(167,139,250,.12)"}
BORDER_TINT = {"green": "rgba(95,199,157,.28)", "blue": "rgba(201,162,39,.28)",
               "amber": "rgba(240,179,74,.28)", "red": "rgba(232,119,106,.28)",
               "violet": "rgba(167,139,250,.28)"}

HEX_RE = re.compile(r'#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b')

def convert_value(prop, value):
    """Replace hexes inside one declaration value, context-aware."""
    def repl(m):
        h = m.group(0).lower()
        # normalise 3-digit
        if len(h) == 4:
            h = "#" + h[1]*2 + h[2]*2 + h[3]*2
        if h in EXPLICIT:
            new = EXPLICIT[h]
            # sidebar/nav text colours should stay light
            if prop == "color" and h in ("#cbd5e1", "#334155"):
                return "#cbd5e1"
            return new
        f = fam(h)
        if f:
            if prop.startswith("background") or prop.endswith("-color"):
                return DARK_TINT[f]
            if prop.startswith("border") or prop in ("outline",):
                return BORDER_TINT[f]
            if prop == "color":
                return {"green":"#5fc79d","blue":"#c9a227","amber":"#f0b34a",
                        "red":"#E8776A","violet":"#a78bfa"}[f]
            return DARK_TINT[f]
        if h in NEUTRAL_LIGHT:
            if prop.startswith("background") or prop.endswith("-color"):
                return "rgba(255,255,255,.04)"
            if prop.startswith("border") or prop == "outline":
                return "rgba(201,162,39,.18)"
            if prop == "color":
                return "#94a3b8"
            return "rgba(255,255,255,.05)"
        return m.group(0)
    return HEX_RE.sub(repl, value)

DECL_RE = re.compile(r'([-a-zA-Z]+)\s*:\s*([^;{}]+)')

def convert_block(css):
    def fix(m):
        prop, val = m.group(1), m.group(2)
        if "#" not in val:
            return m.group(0)
        return f"{prop}:{convert_value(prop, val)}"
    return DECL_RE.sub(fix, css)

# ------------------------------------------------------------------ run
ROOT_BLOCK_RE = re.compile(r':root\s*\{.*?\}', re.S)

changed = []
for f in glob.glob(ROOT + "/**/*", recursive=True):
    if not os.path.isfile(f) or not f.endswith((".css", ".html", ".js")):
        continue
    t = open(f, encoding="utf-8", errors="surrogateescape").read()
    orig = t
    if f.endswith(".css"):
        if ROOT_BLOCK_RE.search(t):
            t = ROOT_BLOCK_RE.sub(lambda m: ZPG_ROOT, t, count=1)
        t = convert_block(t)
    else:
        # html/js: use property-agnostic conversion but default to plain swap
        t = HEX_RE.sub(lambda m: convert_value("background", m.group(0))
                       if m.group(0).lower() not in EXPLICIT else EXPLICIT[m.group(0).lower()],
                       t)
    if t != orig:
        if not DRY:
            open(f, "w", encoding="utf-8", errors="surrogateescape").write(t)
        changed.append(os.path.relpath(f, ROOT))

print(f"{'DRY RUN — ' if DRY else ''}changed {len(changed)} files")
for c in changed[:40]:
    print("  ", c)
