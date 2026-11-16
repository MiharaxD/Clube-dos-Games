// Confete do sorteio num canvas próprio (sem dependência). Paleta do DESIGN.md: âmbar, rosa neon e
// papel sobre deep (nada de arco-íris). Só roda sem reduced-motion; quem chama confere `calma`.
const CORES = ['#ffc15e', '#ff5c8a', '#f4ecd2', '#ffc15e', '#ff5c8a'];

export function festa(canvas) {
  const g = canvas.getContext('2d');
  let pecas = [];
  let raf = 0;
  let w = 0;
  let h = 0;

  const ajusta = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  ajusta();
  window.addEventListener('resize', ajusta);

  let antes = 0;
  const passo = (agora) => {
    const dt = Math.min(0.05, (agora - (antes || agora)) / 1000);
    antes = agora;
    g.clearRect(0, 0, w, h);
    pecas = pecas.filter((p) => p.y < h + 40 && p.vida > 0);
    for (const p of pecas) {
      p.vx *= 1 - 1.6 * dt; // resistência do ar
      p.vy += 900 * dt * p.peso; // gravidade
      p.vy = Math.min(p.vy, 260 * p.peso); // velocidade terminal: o papel plana
      p.x += (p.vx + Math.sin(p.fase) * 40) * dt;
      p.y += p.vy * dt;
      p.fase += p.giro * dt;
      p.vida -= dt;
      g.save();
      g.globalAlpha = Math.min(1, p.vida / 0.6);
      g.translate(p.x, p.y);
      g.rotate(p.fase);
      g.scale(1, Math.cos(p.fase * 1.7)); // vira no ar (lado fino e lado largo)
      g.fillStyle = p.cor;
      g.fillRect(-p.t / 2, -p.t / 4, p.t, p.t / 2);
      g.restore();
    }
    raf = pecas.length ? requestAnimationFrame(passo) : 0;
    if (!raf) antes = 0;
  };

  return {
    // explosão de confete saindo de (x, y), em px da tela
    estoura(x, y, n = 90) {
      for (let i = 0; i < n; i++) {
        const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
        const vel = 380 + Math.random() * 520;
        pecas.push({
          x, y, vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel,
          t: 7 + Math.random() * 7, cor: CORES[i % CORES.length], fase: Math.random() * 6,
          giro: (Math.random() - 0.5) * 10, peso: 0.7 + Math.random() * 0.5, vida: 3.2 + Math.random() * 1.2,
        });
      }
      if (!raf) raf = requestAnimationFrame(passo);
    },
    para() {
      cancelAnimationFrame(raf);
      raf = 0;
      pecas = [];
      window.removeEventListener('resize', ajusta);
    },
  };
}
