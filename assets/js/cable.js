/* Coupes de câbles ENICAB — illustrations de principe, dessinées en SVG */
window.Cable = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  var uid = 0;
  function el(t, a, p) {
    var e = document.createElementNS(NS, t);
    for (var k in a) e.setAttribute(k, a[k]);
    if (p) p.appendChild(e);
    return e;
  }
  function strands(g, cx, cy, R, rings, grad) {
    var sr = R / (2 * rings + 1);
    el('circle', { cx: cx, cy: cy, r: R, fill: '#6E3A1A' }, g);
    for (var i = 0; i <= rings; i++) {
      var n = i ? 6 * i : 1;
      for (var j = 0; j < n; j++) {
        var a = (j / n) * Math.PI * 2 + i * 0.35;
        el('circle', { cx: cx + Math.cos(a) * i * 2 * sr, cy: cy + Math.sin(a) * i * 2 * sr, r: sr * 0.97, fill: 'url(#' + grad + ')' }, g);
      }
    }
  }
  function ring(g, cx, cy, r, fill, layer) {
    return el('circle', { cx: cx, cy: cy, r: r, fill: fill, 'data-layer': layer }, g);
  }

  var C = {
    gaine: '#1F2A2C', gaineMT: '#8E2B22', semi: '#343B3C', prc: '#ECEFEC', pvcB: '#2C6FB0',
    bour: '#7B807E', brun: '#7B4A2A', noir: '#2A2E2F', gris: '#8C9294', bleu: '#2C6FB0', ecran: '#C9884F'
  };

  var TYPES = {
    mt: {
      title: 'Câble moyenne tension 18/30 kV',
      layers: [
        ['gaine', C.gaineMT, 'Gaine extérieure', 'Protection mécanique et étanchéité'],
        ['ecran', C.ecran, 'Écran métallique', 'Écoulement des courants de défaut'],
        ['semi', C.semi, 'Semi-conducteurs', 'Répartissent le champ électrique'],
        ['iso', C.prc, 'Isolation PRC', 'Polyéthylène réticulé'],
        ['ame', '#C97B44', 'Âme cuivre', 'Conducteur câblé']
      ],
      draw: function (g, cu) {
        ring(g, 120, 120, 112, C.gaineMT, 'gaine');
        var e = el('g', { 'data-layer': 'ecran' }, g);
        el('circle', { cx: 120, cy: 120, r: 98, fill: '#2a2f30' }, e);
        for (var i = 0; i < 46; i++) { var a = i / 46 * Math.PI * 2; el('circle', { cx: 120 + Math.cos(a) * 95, cy: 120 + Math.sin(a) * 95, r: 3.1, fill: 'url(#' + cu + ')' }, e); }
        var s = el('g', { 'data-layer': 'semi' }, g);
        el('circle', { cx: 120, cy: 120, r: 91, fill: C.semi }, s);
        ring(g, 120, 120, 86, C.prc, 'iso');
        el('circle', { cx: 120, cy: 120, r: 44, fill: C.semi, 'data-layer': 'semi' }, g);
        var a2 = el('g', { 'data-layer': 'ame' }, g); strands(a2, 120, 120, 40, 3, cu);
      }
    },
    dom: {
      title: 'Fil domestique H07V-U',
      layers: [
        ['iso', C.pvcB, 'Isolation PVC', '450/750 V, 70 °C en permanence'],
        ['ame', '#C97B44', 'Âme cuivre massif', 'Classe 1, de 1,5 à 6 mm²']
      ],
      draw: function (g, cu) {
        ring(g, 120, 120, 78, C.pvcB, 'iso');
        el('circle', { cx: 120, cy: 120, r: 46, fill: 'url(#' + cu + ')', 'data-layer': 'ame' }, g);
      }
    },
    ind: {
      title: 'Câble industriel N2XY souple',
      layers: [
        ['gaine', C.gaine, 'Gaine extérieure', 'Protection des conducteurs'],
        ['bour', C.bour, 'Bourrage', 'Maintient la forme ronde'],
        ['iso', C.brun, 'Isolation PR', '0,6/1 kV, IEC 60502-1'],
        ['ame', '#C97B44', 'Âmes cuivre souples', 'De 1,5 à 400 mm²']
      ],
      draw: function (g, cu) {
        ring(g, 120, 120, 112, C.gaine, 'gaine');
        ring(g, 120, 120, 102, C.bour, 'bour');
        var cols = [C.brun, C.noir, C.gris, C.bleu];
        for (var i = 0; i < 4; i++) {
          var a = Math.PI / 4 + i * Math.PI / 2, x = 120 + Math.cos(a) * 46, y = 120 + Math.sin(a) * 46;
          el('circle', { cx: x, cy: y, r: 41, fill: cols[i], 'data-layer': 'iso' }, g);
          var s = el('g', { 'data-layer': 'ame' }, g); strands(s, x, y, 27, 2, cu);
        }
      }
    },
    sol: {
      title: 'Câble solaire CHEMSSI H1Z2Z2-K',
      layers: [
        ['gaine', C.gaine, 'Gaine sans halogène', 'Résiste aux UV et à l’ozone'],
        ['iso', '#DADDD8', 'Isolation sans halogène', 'Norme EN 50618'],
        ['ame', '#C97B44', 'Âme cuivre souple', 'Courant continu photovoltaïque']
      ],
      draw: function (g, cu) {
        ring(g, 120, 120, 96, C.gaine, 'gaine');
        ring(g, 120, 120, 76, '#DADDD8', 'iso');
        var s = el('g', { 'data-layer': 'ame' }, g); strands(s, 120, 120, 54, 5, cu);
      }
    }
  };

  function render(svg, type, legend) {
    var t = TYPES[type]; if (!t) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox', '0 0 240 240');
    var id = 'cu' + (++uid);
    var defs = el('defs', {}, svg);
    var gr = el('radialGradient', { id: id, cx: '38%', cy: '35%', r: '70%' }, defs);
    el('stop', { offset: '0', 'stop-color': '#F7C9A0' }, gr);
    el('stop', { offset: '.45', 'stop-color': '#D08A55' }, gr);
    el('stop', { offset: '1', 'stop-color': '#8A4521' }, gr);
    var g = el('g', {}, svg);
    t.draw(g, id);
    svg.setAttribute('aria-label', t.title + ' (vue en coupe)');
    if (legend) {
      legend.innerHTML = '';
      t.layers.forEach(function (L) {
        var li = document.createElement('li');
        li.dataset.layer = L[0];
        li.innerHTML = '<i style="background:' + L[1] + '"></i><span><b>' + L[2] + '</b><small>' + L[3] + '</small></span>';
        li.tabIndex = 0;
        function on() { svg.classList.add('dim'); legend.querySelectorAll('li').forEach(function (x) { x.classList.toggle('on', x === li); }); svg.querySelectorAll('[data-layer]').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-layer') === L[0]); }); }
        function off() { svg.classList.remove('dim'); li.classList.remove('on'); }
        li.addEventListener('mouseenter', on); li.addEventListener('mouseleave', off);
        li.addEventListener('focus', on); li.addEventListener('blur', off);
        li.addEventListener('click', on);
        legend.appendChild(li);
      });
    }
    return t;
  }

  /* vue de profil dénudée, pour les cartes de gamme */
  var SIDE = {
    dom: [[16, 'cu'], [30, '#2C6FB0']],
    ind: [[10, 'cu'], [20, '#7B4A2A'], [44, '#1F2A2C']],
    bt:  [[10, 'cu'], [18, '#8C9294'], [40, '#2A2E2F']],
    mt:  [[14, 'cu'], [18, '#343B3C'], [36, '#ECEFEC'], [40, '#343B3C'], [44, 'scr'], [52, '#8E2B22']],
    ht:  [[18, 'cu'], [22, '#343B3C'], [44, '#ECEFEC'], [48, '#343B3C'], [52, 'scr'], [60, '#1F2A2C']],
    nus: [[30, 'al']],
    sol: [[14, 'cu'], [28, '#E4E6E2'], [38, '#1F2A2C']],
    sec: [[10, 'cu'], [20, '#C9CFCC'], [42, '#3E8E3A']],
    rail:[[22, 'cu']],
    tel: [[6, 'cu'], [14, '#2C6FB0'], [34, '#8C9294']]
  };
  function side(svg, type) {
    var L = SIDE[type]; if (!L) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var W = 320, H = 80, CY = 40, n = L.length;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var id = 's' + (++uid), defs = el('defs', {}, svg);
    function lg(name, stops, rot) { var g = el('linearGradient', { id: id + name, x1: 0, y1: 0, x2: 0, y2: 1 }, defs); stops.forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1] }, g); }); }
    lg('cu', [['0', '#8A4521'], ['.3', '#F2BE8E'], ['.55', '#D08A55'], ['1', '#6E3A1A']]);
    lg('al', [['0', '#6F7779'], ['.3', '#F1F4F4'], ['.6', '#B9C1C2'], ['1', '#5E6668']]);
    lg('sh', [['0', 'rgba(0,0,0,.3)'], ['.3', 'rgba(255,255,255,.18)'], ['.6', 'rgba(0,0,0,0)'], ['1', 'rgba(0,0,0,.4)']]);
    var sp = el('pattern', { id: id + 'scr', width: 6, height: 60, patternUnits: 'userSpaceOnUse', patternTransform: 'skewX(30)' }, defs);
    el('rect', { width: 6, height: 60, fill: '#2a3133' }, sp); el('rect', { width: 3.4, height: 60, fill: '#C9884F' }, sp);
    var st = el('pattern', { id: id + 'tw', width: 9, height: 60, patternUnits: 'userSpaceOnUse', patternTransform: 'skewX(-35)' }, defs);
    el('rect', { width: 9, height: 60, fill: 'rgba(0,0,0,0)' }, st); el('line', { x1: 0, y1: 0, x2: 0, y2: 60, stroke: 'rgba(60,30,10,.45)', 'stroke-width': 1.2 }, st);
    var x0 = 14, step = (W * 0.62) / Math.max(n - 1, 1);
    L.forEach(function (ly, i) {
      var h = ly[0], f = ly[1], x = n === 1 ? x0 : x0 + i * step;
      var fill = f === 'cu' ? 'url(#' + id + 'cu)' : f === 'al' ? 'url(#' + id + 'al)' : f === 'scr' ? 'url(#' + id + 'scr)' : f;
      el('rect', { x: x, y: CY - h / 2, width: W - x + 10, height: h, fill: fill }, svg);
      if (f === 'cu' || f === 'al') el('rect', { x: x, y: CY - h / 2, width: W - x + 10, height: h, fill: 'url(#' + id + 'tw)' }, svg);
      el('rect', { x: x, y: CY - h / 2, width: W - x + 10, height: h, fill: 'url(#' + id + 'sh)' }, svg);
      var face = f === 'cu' ? '#B8693A' : f === 'al' ? '#9AA3A5' : f === 'scr' ? '#6B4A33' : f;
      el('ellipse', { cx: x, cy: CY, rx: Math.max(h * .16, 2), ry: h / 2, fill: face, style: 'filter:brightness(.82)' }, svg);
    });
  }
  return { render: render, side: side, types: TYPES };
})();
