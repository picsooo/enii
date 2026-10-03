(function () {
  // menu mobile
  var hdr = document.querySelector('.hdr'), bg = document.querySelector('.burger');
  if (bg) bg.addEventListener('click', function () {
    var o = hdr.classList.toggle('open'); bg.setAttribute('aria-expanded', o);
  });

  // coupes de câble
  document.querySelectorAll('[data-cable]').forEach(function (svg) {
    var lg = svg.getAttribute('data-legend');
    Cable.render(svg, svg.getAttribute('data-cable'), lg ? document.getElementById(lg) : null);
  });

  // formulaires factices
  document.querySelectorAll('form[data-fake]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = f.querySelector('.ok'); if (ok) { ok.classList.add('show'); ok.focus(); }
      f.querySelectorAll('input,textarea,select').forEach(function (i) { if (i.type !== 'submit') i.value = ''; });
    });
  });

  // filtres gamme
  var fl = document.querySelector('.filters');
  if (fl) fl.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    fl.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    var f = b.dataset.f;
    document.querySelectorAll('.range-row[data-cat]').forEach(function (r) {
      r.hidden = !(f === 'all' || r.dataset.cat.split(' ').indexOf(f) > -1);
    });
  });

  // calculateur de section
  var calc = document.getElementById('calc');
  if (calc) {
    var STD = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400];
    var AMP = [16.5, 23, 30, 38, 52, 69, 90, 111, 133, 168, 201, 232, 258, 294, 344, 394, 470];
    var st = { ph: 'mono', drop: 5 };
    var P = document.getElementById('c-p'), L = document.getElementById('c-l');
    function fmt(n, d) { return n.toLocaleString('fr-FR', { maximumFractionDigits: d, minimumFractionDigits: d }); }
    function run() {
      var p = +P.value, l = +L.value, cos = 0.85, rho = 0.0225;
      document.getElementById('o-p').textContent = fmt(p, 1) + ' kW';
      document.getElementById('o-l').textContent = l + ' m';
      var U = st.ph === 'mono' ? 230 : 400;
      var I = st.ph === 'mono' ? p * 1000 / (U * cos) : p * 1000 / (Math.sqrt(3) * U * cos);
      var k = st.ph === 'mono' ? 2 : Math.sqrt(3);
      var dU = st.drop / 100 * U;
      var sDrop = k * rho * l * I * cos / dU;
      var idx = -1;
      for (var i = 0; i < STD.length; i++) { if (STD[i] >= sDrop && AMP[i] >= I) { idx = i; break; } }
      var res = document.getElementById('r-s'), ref = document.getElementById('r-ref');
      document.getElementById('r-i').textContent = fmt(I, 1) + ' A';
      document.getElementById('r-u').textContent = U + ' V';
      if (idx < 0) {
        res.innerHTML = '&gt;400<small>mm²</small>';
        ref.textContent = 'Pose de câbles en parallèle : notre bureau d’études vous conseille.';
        document.getElementById('r-d').textContent = '–';
        return;
      }
      var S = STD[idx];
      var real = k * rho * l * I * cos / S / U * 100;
      res.innerHTML = fmt(S, S % 1 ? 1 : 0) + '<small>mm²</small>';
      document.getElementById('r-d').textContent = fmt(real, 2) + ' %';
      if (st.ph === 'mono' && S <= 6) ref.textContent = 'Fil H07V-U ou H07V-R sous conduit';
      else if (st.ph === 'mono') ref.textContent = 'Câble N2XY souple 0,6/1 kV, bipolaire';
      else ref.textContent = 'Câble N2XY souple 0,6/1 kV, ' + (S <= 95 ? 'pentapolaire' : 'quadripolaire');
    }
    calc.querySelectorAll('.seg').forEach(function (s) {
      s.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        s.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        st[s.dataset.k] = s.dataset.k === 'drop' ? +b.dataset.v : b.dataset.v; run();
      });
    });
    P.addEventListener('input', run); L.addEventListener('input', run);
    run();
  }
})();
