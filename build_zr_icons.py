#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""build_zr_icons.py — Zentra Realty icon set from the supplied ZR logo.

Source : /home/ubuntu/.hermes/cache/images/img_00535c744032.jpg
Outputs: assets/zr-mark.png      transparent shield (sidebar brand mark)
         assets/zr-tile.png      navy rounded tile (favicon / PWA)
         icons/*                 favicon + PWA icons for the admin pages
         field/icons/*           same brand for the field PWA

Background removal: flood the dark backdrop inward from the border, then cut the
thin anti-aliased leak channels (binary dilation) and keep only the components
that are genuinely reachable from outside. Everything enclosed by the metallic
rim is restored, so the shield interior survives.
"""
from PIL import Image, ImageDraw, ImageFilter
import numpy as np, os
from collections import deque

D = os.path.dirname(os.path.abspath(__file__))
SRC = "/home/ubuntu/.hermes/cache/images/img_00535c744032.jpg"
TOL = 26          # colour tolerance when flooding the backdrop
SEVER = 2         # px of dilation used to cut leak channels

im = Image.open(SRC).convert("RGB")
a = np.array(im).astype(int); luma = a.mean(axis=2)

# ---- 1. locate the shield (bright cluster on the left; sparkles sit far right)
sub = luma[:, 468:810]
rows = np.where((sub > 105).sum(axis=1) > 3)[0]
X0, X1, Y0, Y1 = 468, 809, int(rows.min()), int(rows.max())
cx, cy = (X0 + X1) // 2, (Y0 + Y1) // 2
half = max(X1 - X0, Y1 - Y0) // 2 + 24
crop = im.crop((cx - half, cy - half, cx + half, cy + half))
print(f"shield bbox x[{X0}..{X1}] y[{Y0}..{Y1}] -> crop {crop.size}")

# ---- 2. knock the backdrop out
def flood_bg(img, tol):
    work = img.copy(); px = work.load(); W, H = work.size; SENT = (255, 0, 255)
    def sim(p, q): return all(abs(int(p[k]) - int(q[k])) <= tol for k in range(3))
    def fl(seed):
        base = px[seed[0], seed[1]]
        if base == SENT: return
        q = deque([seed]); seen = set()
        while q:
            x, y = q.popleft()
            if (x, y) in seen or not (0 <= x < W and 0 <= y < H): continue
            seen.add((x, y))
            if not sim(px[x, y], base): continue
            px[x, y] = SENT
            q.extend([(x+1, y), (x-1, y), (x, y+1), (x, y-1)])
    for s in [(0,0), (W-1,0), (0,H-1), (W-1,H-1), (W//2,0), (W//2,H-1), (0,H//2), (W-1,H//2)]:
        fl(s)
    arr = np.array(work)
    return (arr[:,:,0] == 255) & (arr[:,:,1] == 0) & (arr[:,:,2] == 255)

def dilate(m, it=1):
    for _ in range(it):
        d = m.copy()
        d[1:,:] |= m[:-1,:]; d[:-1,:] |= m[1:,:]
        d[:,1:] |= m[:,:-1]; d[:,:-1] |= m[:,1:]
        m = d
    return m

def outside_components(m):
    """mask of connected components of m that touch the image border"""
    lab = np.zeros(m.shape, np.int32); n = 0; H, W = m.shape
    ys, xs = np.where(m)
    for i, j in zip(ys, xs):
        if lab[i, j]: continue
        n += 1; q = deque([(i, j)]); lab[i, j] = n
        while q:
            y, x = q.popleft()
            for dy, dx in ((1,0), (-1,0), (0,1), (0,-1)):
                yy, xx = y+dy, x+dx
                if 0 <= yy < H and 0 <= xx < W and m[yy, xx] and lab[yy, xx] == 0:
                    lab[yy, xx] = n; q.append((yy, xx))
    if not n: return np.zeros_like(m)
    bl = set(lab[0,:]) | set(lab[-1,:]) | set(lab[:,0]) | set(lab[:,-1]); bl.discard(0)
    return np.isin(lab, list(bl)) if bl else np.zeros_like(m)

bg   = flood_bg(crop, TOL)
keep = outside_components(bg & ~dilate(~bg, SEVER))
keep = dilate(keep, SEVER) & bg
alpha = np.where(keep, 0, 255).astype(np.uint8)
alpha = np.array(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.5)))
print(f"alpha: centre={alpha[alpha.shape[0]//2, alpha.shape[1]//2]} "
      f"opaque={100*(alpha>235).mean():.1f}%")

# ---- 3. trim to the mark, pad to a square
mk = Image.fromarray(np.dstack([np.array(crop), alpha]), "RGBA")
mk = mk.crop(mk.split()[3].getbbox())
side = max(mk.size); pad = int(side * 0.06)
canvas = Image.new("RGBA", (side + 2*pad, side + 2*pad), (0,0,0,0))
canvas.paste(mk, ((canvas.width - mk.width)//2, (canvas.height - mk.height)//2), mk)
mark512 = canvas.resize((512, 512), Image.LANCZOS)

os.makedirs(f"{D}/assets", exist_ok=True); os.makedirs(f"{D}/icons", exist_ok=True)
mark512.save(f"{D}/assets/zr-mark.png")
mark512.save(f"{D}/icons/zr-mark-512.png")
print("wrote assets/zr-mark.png")

# ---- 4. navy tile (favicon / PWA) — legible on light and dark UI
NAVY = (11, 27, 46, 255)
def tile(size, maskable=False, radius_ratio=0.22, mark_ratio=0.76):
    t = Image.new("RGBA", (size, size), (0,0,0,0))
    d = ImageDraw.Draw(t)
    if maskable:
        d.rectangle([0, 0, size, size], fill=NAVY)
        mark_ratio = 0.62
    else:
        d.rounded_rectangle([0, 0, size-1, size-1], radius=int(size*radius_ratio), fill=NAVY)
    inner = int(size * mark_ratio)
    sh = mark512.resize((inner, inner), Image.LANCZOS)
    t.paste(sh, ((size-inner)//2, (size-inner)//2), sh)
    return t

tile(512).save(f"{D}/assets/zr-tile.png")
for s in (192, 512):
    tile(s).save(f"{D}/icons/zr-icon-{s}.png")
tile(512, maskable=True).save(f"{D}/icons/zr-icon-512-maskable.png")
tile(64).save(f"{D}/icons/zr-favicon.png")
tile(180).save(f"{D}/icons/zr-apple-touch-icon.png")
tile(32).save(f"{D}/favicon.png")
print("favicon + PWA icons written")

os.makedirs(f"{D}/field/icons", exist_ok=True)
for s in (192, 512):
    tile(s).save(f"{D}/field/icons/icon-{s}.png")
tile(512, maskable=True).save(f"{D}/field/icons/icon-512-maskable.png")
print("field icons replaced")

for f in ["assets/zr-mark.png","assets/zr-tile.png","icons/zr-icon-192.png",
          "icons/zr-favicon.png","favicon.png","field/icons/icon-192.png"]:
    print(f"  {f:32s} {os.path.getsize(f'{D}/{f}'):>7d}b")
