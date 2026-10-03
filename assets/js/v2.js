(function () {
  var NS = 'http://www.w3.org/2000/svg';
  function el(t, a, p) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  /* ---------- dénudage au scroll ---------- */
  var strip = document.getElementById('strip'), svg = document.getElementById('strip-svg');
  if (strip && svg) {
    var mobile = window.innerWidth < 760;
    var W = mobile ? 720 : 1200, H = mobile ? 212 : 260, CY = H / 2, FAR = W + 60;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var defs = el('defs', {}, svg);
    var cu = el('linearGradient', { id: 'scu', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    [['0', '#8A4521'], ['.3', '#F2BE8E'], ['.55', '#D08A55'], ['1', '#6E3A1A']].forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1] }, cu); });
    var pt = el('pattern', { id: 'strand', width: 14, height: 60, patternUnits: 'userSpaceOnUse', patternTransform: 'skewX(-35)' }, defs);
    el('rect', { width: 14, height: 60, fill: 'url(#scu)' }, pt);
    el('line', { x1: 0, y1: 0, x2: 0, y2: 60, stroke: '#6E3A1A', 'stroke-width': 1.6, 'stroke-opacity': .7 }, pt);
    var ep = el('pattern', { id: 'ecr', width: 9, height: 172, patternUnits: 'userSpaceOnUse', patternTransform: 'skewX(30)' }, defs);
    el('rect', { width: 9, height: 172, fill: '#2a3133' }, ep);
    el('rect', { width: 5, height: 172, fill: '#C9884F' }, ep);
    var sh = el('linearGradient', { id: 'shade', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    [['0', 'rgba(0,0,0,.35)'], ['.35', 'rgba(255,255,255,.12)'], ['.6', 'rgba(0,0,0,0)'], ['1', 'rgba(0,0,0,.45)']].forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1] }, sh); });
    var glow = el('linearGradient', { id: 'glow', x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
    [['0', 'rgba(245,168,0,0)'], ['.5', 'rgba(255,214,120,.95)'], ['1', 'rgba(245,168,0,0)']].forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1] }, glow); });

    var L0 = W * 0.04;
    var layers = [
      { h: 60, fill: 'url(#strand)', face: '#B8693A', from: L0, to: L0, t: [0, 0] },
      { h: 72, fill: '#30383A', face: '#22292A', from: L0, to: W * .22, t: [.73, .88] },
      { h: 150, fill: '#E6EAE7', face: '#C9CFCC', from: L0, to: W * .36, t: [.51, .71] },
      { h: 162, fill: '#30383A', face: '#22292A', from: L0, to: W * .52, t: [.53, .71] },
      { h: 174, fill: 'url(#ecr)', face: '#5B4030', from: L0, to: W * .66, t: [.29, .49] },
      { h: 198, fill: '#8E2B22', face: '#6E1F18', from: L0, to: W * .82, t: [.05, .27] }
    ];
    layers.forEach(function (l) {
      var g = el('g', {}, svg);
      l.rect = el('rect', { x: l.from, y: CY - l.h / 2, width: FAR - l.from, height: l.h, fill: l.fill }, g);
      l.sh = el('rect', { x: l.from, y: CY - l.h / 2, width: FAR - l.from, height: l.h, fill: 'url(#shade)' }, g);
      l.face = el('ellipse', { cx: l.from, cy: CY, rx: l.h * .16, ry: l.h / 2, fill: l.face }, g);
      l.g = g;
    });
    var cp = el('clipPath', { id: 'cuclip' }, defs); el('rect', { x: L0, y: CY - 30, width: FAR, height: 60 }, cp);
    var gl = el('rect', { x: 0, y: CY - 30, width: 160, height: 60, fill: 'url(#glow)', opacity: 0, 'clip-path': 'url(#cuclip)' }, layers[0].g);
    layers[0].g.insertBefore(gl, layers[0].face);

    var steps = [
      ['Gaine extérieure', 'La première couche protège le câble des chocs, de l’eau et du soleil pendant toute sa vie de service.'],
      ['Écran métallique', 'Des fils de cuivre enroulés autour du câble écoulent les courants de défaut vers la terre.'],
      ['Isolation PRC', 'Le polyéthylène réticulé, encadré de deux couches semi-conductrices, tient la tension de 18/30 kV.'],
      ['Âme en cuivre', 'Le conducteur câblé transporte l’énergie. C’est lui qui relie le poste au chantier.']
    ];
    var nEl = document.getElementById('st-n'), tEl = document.getElementById('st-t'), pEl = document.getElementById('st-p'), bar = document.getElementById('st-bar');
    var cur = -1, prog = 0, phase = 0;
    function setStep(i) {
      if (i === cur) return; cur = i;
      var box = tEl.parentNode; box.style.opacity = 0;
      setTimeout(function () { nEl.innerHTML = (i + 1) + '<small>/4</small>'; tEl.textContent = steps[i][0]; pEl.textContent = steps[i][1]; box.style.opacity = 1; }, 160);
    }
    function update() {
      var r = strip.getBoundingClientRect();
      prog = cl(-r.top / (r.height - window.innerHeight));
      layers.forEach(function (l) {
        if (l.t[1] === 0) return;
        var x = l.from + (l.to - l.from) * ease(cl((prog - l.t[0]) / (l.t[1] - l.t[0])));
        l.rect.setAttribute('x', x); l.rect.setAttribute('width', FAR - x);
        l.sh.setAttribute('x', x); l.sh.setAttribute('width', FAR - x);
        l.face.setAttribute('cx', x);
      });
      bar.style.width = (prog * 100) + '%';
      setStep(prog < .28 ? 0 : prog < .5 ? 1 : prog < .72 ? 2 : 3);
    }
    var ticking = false;
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { update(); ticking = false; }); } }, { passive: true });
    update();
    // impulsion de courant sur l'âme dénudée
    (function loop() {
      var o = cl((prog - .86) / .08);
      gl.setAttribute('opacity', o);
      if (o > 0) { phase = (phase + 4) % (W * .22 + 160); gl.setAttribute('x', L0 - 160 + phase); }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- sélecteur de coupes ---------- */
  var tabs = document.getElementById('tabs'), xs = document.getElementById('xs'), lg = document.getElementById('xs-lg'), tt = document.getElementById('xs-t');
  if (tabs && xs) {
    var t0 = Cable.render(xs, 'mt', lg); tt.textContent = t0.title;
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.getAttribute('aria-pressed') === 'true') return;
      tabs.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      xs.classList.add('swap');
      setTimeout(function () {
        var t = Cable.render(xs, b.dataset.t, lg); tt.textContent = t.title;
        xs.classList.remove('dim');
        requestAnimationFrame(function () { xs.classList.remove('swap'); });
      }, 260);
    });
  }
})();
