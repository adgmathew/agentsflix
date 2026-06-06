with open('style.css', 'r') as f:
    content = f.read()

# The "featured" section has white text and cards on a white/light gray background (bg-alt).
# We need to change the text color to dark, and borders/backgrounds to dark ones.

content = content.replace('.featured-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:24px;display:flex;flex-direction:column;gap:12px;}', '.featured-card{background:var(--bg);border:1px solid var(--border);border-radius:18px;padding:24px;display:flex;flex-direction:column;gap:12px;}')
content = content.replace('.featured-card h3{font-size:1.05rem;line-height:1.4;color:#fff;margin:0;}', '.featured-card h3{font-size:1.05rem;line-height:1.4;color:var(--ink);margin:0;}')
content = content.replace('.featured-card p{font-size:0.95rem;color:rgba(255,255,255,.75);line-height:1.75;margin:0;}', '.featured-card p{font-size:0.95rem;color:var(--ink3);line-height:1.75;margin:0;}')
content = content.replace('.featured-logos{margin-top:22px;padding:18px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);border-radius:18px;display:flex;align-items:center;justify-content:center;}', '.featured-logos{margin-top:22px;padding:18px;border:1px solid var(--border);background:var(--bg);border-radius:18px;display:flex;align-items:center;justify-content:center;}')

with open('style.css', 'w') as f:
    f.write(content)
