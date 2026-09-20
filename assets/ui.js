/* ui.js — Pakej A: ikon KPI automatik + animasi masuk (semua halaman) */
(function(){
  const P = {
    users:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    briefcase:'M3 7h18v13H3zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18',
    wallet:'M3 7h15a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H5a2 2 0 0 1-2-2zM3 7V6a2 2 0 0 1 2-2h11M17 13h.01',
    mail:'M3 6h18v12H3zM3 7l9 6 9-6',
    file:'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5',
    clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 7v5l3 2',
    shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
    chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',
    check:'M20 6L9 17l-5-5',
    scale:'M12 3v18M5 7h14M7 7l-3 6h6zM17 7l-3 6h6z'
  };
  const svg = p => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="'+p+'"/></svg>';
  const pick = t => {
    t=(t||'').toLowerCase();
    if(/stamp|due|days|clock|age/.test(t)) return P.clock;
    if(/wait|await|signature|unsigned|reminder|sent/.test(t)) return P.mail;
    if(/payout|commission|fee|rm|amount|revenue|pipeline|value/.test(t)) return P.wallet;
    if(/deal|sale|transaction|booking|unit/.test(t)) return P.briefcase;
    if(/compliance|gap|exception|risk|offset|declared/.test(t)) return P.shield;
    if(/document|letter|file|archive|package/.test(t)) return P.file;
    if(/negotiator|agent|leader|member|team|people|party/.test(t)) return P.users;
    if(/progress|level|target|rate|split|share/.test(t)) return P.chart;
    if(/income|earned|nett|net/.test(t)) return P.scale;
    return P.check;
  };
  function icons(){
    document.querySelectorAll('.kpi').forEach(k=>{
      if(k.querySelector('.ki')) return;
      const lab=(k.querySelector('.lab')||{}).textContent||'';
      const s=document.createElement('span'); s.className='ki'; s.innerHTML=svg(pick(lab));
      k.insertBefore(s, k.firstChild);
    });
    document.querySelectorAll('.kpi .val, .tbl td.num, .tbl th.num').forEach(e=>e.classList.add('dotnum'));
  }
  function revealUnused(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els=[...document.querySelectorAll('main .card, main .kpi')].slice(0,26);
    els.forEach((e,i)=>{ e.classList.add('reveal'); e.style.animationDelay=Math.min(i*28,520)+'ms'; });
  }
  /* reveal() dibuang 15/9: kandungan mesti sentiasa kelihatan walau animasi gagal */
  (document.readyState!=='loading') ? icons() : document.addEventListener('DOMContentLoaded',icons);
})();

/* ====== Shim label jadual — Zentra Realty (20/9/2026) ======
   Punca: pada telefon, lajur kanan jadual terpotong (PAY…, ACTOR/AC1…, NEGOTIAT…,
   ACTION…, EXPECTED RELE…). 61 jadual, hanya 11 ada <thead> — jadi label diambil
   daripada baris <th> PERTAMA, sama ada ia dibalut <thead> atau tidak.
   Jadual ditanda .zr-kad HANYA selepas berjaya dilabel → jika JS gagal, jadual
   kekal sebagai jadual biasa (tidak muncul sebagai kad tanpa label). */
(function () {
  function tajuk(t) {
    var th = t.querySelectorAll('thead tr:first-child th');
    if (th.length) { return th; }
    var baris = t.querySelector('tr');
    return baris ? baris.querySelectorAll('th') : [];
  }
  function label(t) {
    var th = tajuk(t);
    if (!th.length) { return false; }
    /* Baris tajuk yang TIDAK dibalut <thead> mesti disembunyikan dalam mod kad,
       jika tidak ia muncul sebagai kad kosong. */
    if (!t.tHead && th[0] && th[0].parentElement) {
      th[0].parentElement.classList.add('zr-hdr');
    }
    var baris = [];
    if (t.tBodies && t.tBodies.length) {
      for (var b = 0; b < t.tBodies.length; b++) {
        for (var r = 0; r < t.tBodies[b].rows.length; r++) { baris.push(t.tBodies[b].rows[r]); }
      }
    } else {
      var semua = Array.prototype.slice.call(t.rows);
      baris = semua.slice(1);
    }
    var kira = 0;
    baris.forEach(function (tr) {
      var td = tr.querySelectorAll('td');
      if (!td.length) { return; }
      for (var c = 0; c < td.length; c++) {
        if (!td[c].hasAttribute('data-label') && th[c]) {
          td[c].setAttribute('data-label', (th[c].textContent || '').trim());
        }
      }
      kira++;
    });
    if (kira) { t.classList.add('zr-kad'); return true; }
    return false;
  }
  function semua() {
    var t = document.querySelectorAll('table'), n = 0;
    for (var i = 0; i < t.length; i++) { if (label(t[i])) { n++; } }
    return n;
  }
  function boot() {
    semua();
    if (!window.MutationObserver) { return; }
    var jad = document.querySelectorAll('table');
    for (var i = 0; i < jad.length; i++) {
      var tb = jad[i].tBodies && jad[i].tBodies[0];
      if (!tb) { continue; }
      (function (t) {
        new MutationObserver(function () { label(t); }).observe(t.tBodies[0], { childList: true, subtree: true });
      })(jad[i]);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
