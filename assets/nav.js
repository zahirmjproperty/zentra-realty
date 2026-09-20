/* nav.js — satu sumber navigasi Zentra Realty: ikon SVG, keadaan aktif, menu mudah alih */
(function(){
  const I = {  /* ikon stroke 24px */
    home:'<path d="M3 10.6 12 3l9 7.6V21H3z"/><path d="M9 21v-6h6v6"/>',
    map:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    cog:'<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.4M12 18.8v2.4M4.6 7.2l2 1.2M17.4 15.6l2 1.2M4.6 16.8l2-1.2M17.4 8.4l2-1.2"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/>',
    users:'<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16 5.5a3 3 0 0 1 0 5.8"/><path d="M17.5 20a6 6 0 0 0-2-4.5"/>',
    user:'<circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1.2"/><circle cx="4" cy="12" r="1.2"/><circle cx="4" cy="18" r="1.2"/>',
    sum:'<path d="M5 5h14l-8 7 8 7H5"/>',
    check:'<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.6 2.6L16.5 9"/>',
    swap:'<path d="M4 8h13l-3.2-3.2M20 16H7l3.2 3.2"/>',
    board:'<path d="M3 4h18v12H3z"/><path d="M8 20h8M12 16v4"/>',
    shield:'<path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
    grid:'<circle cx="7.5" cy="7.5" r="2.2"/><circle cx="16.5" cy="7.5" r="2.2"/><circle cx="7.5" cy="16.5" r="2.2"/><circle cx="16.5" cy="16.5" r="2.2"/>',
    sitemap:'<rect x="9" y="3" width="6" height="4" rx="1"/><rect x="3" y="14" width="6" height="4" rx="1"/><rect x="15" y="14" width="6" height="4" rx="1"/><path d="M12 7v4M12 11H6v3M12 11h6v3"/>',
    search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>',
    bell:'<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    sig:'<path d="M3 17c3-6 5-9 6.5-9 2 0-1.5 6.5.5 6.5S14 6 15.5 6c1.2 0 .5 3.5 2 3.5.9 0 1.6-.9 2.5-2"/><path d="M3 21h18"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    rows:'<rect x="3" y="4.5" width="18" height="5" rx="1.5"/><rect x="3" y="14.5" width="18" height="5" rx="1.5"/>'
  };
  const N = [
    {sec:'Operations'},
    {h:'index.html', t:'Overview', i:'home'},
    {h:'platform.html', t:'Platform map', i:'map'},
    {h:'new-listing.html', t:'Listing intake', i:'plus'},
    {h:'listings.html', t:'Listings', i:'rows'},
    {h:'documents.html', t:'Documents & e-sign', i:'file'},
    {h:'search.html', t:'Deals & documents', i:'search'},
    {h:'f1.html', t:'F1 document generator', i:'cog', d:1}, {h:'loc.html', t:'Letter of Confirmation', i:'file', d:1},
    {h:'f2.html', t:'F2 send & track', i:'mail', d:1},
    {h:'sign.html', t:'F2 client signing view', i:'sig', d:1},
    {h:'team.html', t:'Team & referrers', i:'users'},
    {h:'tree.html', t:'Team tree', i:'sitemap'},
    {h:'agents.html', t:'Agent registry', i:'user'},
    {h:'onboard.html', t:'Agent onboarding', i:'list'},
    {h:'hierarchy.html', t:'Levels & hierarchy', i:'list'},
    {sec:'Money'},
    {h:'f3.html', t:'F3 reward engine', i:'sum', d:1},
    {h:'commission.html', t:'Commission engine', i:'sum'},
    {h:'claims.html', t:'Claims & vouchers', i:'check'},
    {h:'payouts.html', t:'Payout runs', i:'swap'},
    {sec:'Governance'},
    {h:'f4.html', t:'F4 monitoring board', i:'board', d:1},
    {h:'security.html', t:'Security & access', i:'lock'},
    {h:'compliance.html', t:'Compliance guard', i:'shield'},
    {h:'audit.html', t:'Audit trail', i:'list'},
    {h:'structure.html', t:'Why the payout (agents)', i:'sig'},
    {h:'notifications.html', t:'Notification centre', i:'bell', d:1},
    {h:'modules.html', t:'Module map', i:'grid'}
  ];
  const here=(location.pathname.split('/').pop()||'index.html');
  const host=document.getElementById('znav');
  if(!host) return;
  let html='<div class="brand"><div class="mark"><img src="assets/zr-mark.png" alt="Zentra Realty" width="34" height="34"></div><div><b>Zentra Realty</b><small>Zentra Property Group</small></div></div><nav class="nav">';
  N.forEach(n=>{
    if(n.sec){ html+='<div class="sec">'+n.sec+'</div>'; return; }
    const on = (n.h===here)||(here===''&&n.h==='index.html');
    html+='<a href="'+n.h+'"'+(on?' class="on"':'')+'><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+I[n.i]+'</svg><span>'+n.t+'</span>'+(n.d?'<span class="pill-live">demo</span>':'')+'</a>';
  });
  html+='</nav><div class="foot">Prototype &middot; sample data only<br>Zentra Property Group &copy; 2026</div>';
  host.innerHTML=html;
  /* bar konteks berterusan (Claude #6) */

  /* ---------- pusat notifikasi (Pakej B) ---------- */
  function bell(){
    if(!document.querySelector('.bellwrap')){
      const w=document.createElement('div'); w.className='bellwrap';
      w.innerHTML='<button class="bell" id="bellBtn" aria-label="Notifications"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg><span class="dot" id="bellDot"></span></button>';
      document.body.appendChild(w);
      const d=document.createElement('div'); d.className='drawer'; d.id='notifDrawer';
      d.setAttribute('role','dialog'); d.setAttribute('aria-modal','true'); d.setAttribute('aria-label','Notifications');
      d.innerHTML='<div class="dhead"><b>Notifications</b><span class="dacts"><button class="btn ghost small" id="ndAll">Mark all read</button><button class="dclose" id="ndClose" type="button" aria-label="Close notifications"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></span></div><div id="ndList"></div><a class="dfoot" href="notifications.html">Open the notification centre &rarr;</a><button class="dclosebar" id="ndCloseBar" type="button">Close panel</button>';
      document.body.appendChild(d);
      /* Skrim sebenar: elemen berasingan supaya ia boleh menutupi SELURUH halaman.
         (Skrim ::before tidak berfungsi: transform pada panel menjadikannya anak
         relatif kepada panel, bukan viewport.) */
      let scr=document.getElementById('notifScrim');
      if(!scr){ scr=document.createElement('div'); scr.id='notifScrim'; scr.className='nscrim'; document.body.appendChild(scr); }
      /* --- tutup panel: butang X, ketukan di luar panel, kekunci Esc (20/9/2026) ---
         Punca: pada telefon panel ini 100% lebar dan menutupi butang loceng, jadi
         satu-satunya cara menutupnya hilang. Kini ada tiga cara. */
      const tutup=()=>{ d.classList.remove('open'); scr.classList.remove('on'); document.body.classList.remove('drawer-open'); };
      scr.onclick=tutup;
      document.getElementById('ndClose').onclick=tutup;
      document.getElementById('ndCloseBar').onclick=tutup;
      d.addEventListener('click',e=>{ if(e.target===d){ tutup(); } });
      document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ tutup(); } });
      document.getElementById('bellBtn').onclick=()=>{ paint(); const on=d.classList.toggle('open'); scr.classList.toggle('on', on); document.body.classList.toggle('drawer-open', on); };
      document.getElementById('ndAll').onclick=()=>{ ZTH.markAllRead(); paint(); };
    }
    paint();
  }
  function paint(){
    const cn=ZTH.unread().length;
    const dot=document.getElementById('bellDot'); if(dot) dot.style.display = cn? 'block':'none';
    const list=document.getElementById('ndList'); if(!list) return;
    const read=ZTH.loadRead();
    list.innerHTML = ZTH.notif.slice().sort((a,b)=>(b.pri||0)-(a.pri||0)).map(x=>`
      <a class="nitem ${read.includes(x.id)?'read':''}" href="${x.href}" data-id="${x.id}">
        <span class="nbar ${x.t}"></span>
        <span class="nbody"><span class="ntop"><b>${x.ti}</b></span>
        <span class="nmeta">${x.mt}</span>
        <span class="nrow"><span class="pill ${x.t}">${x.s}</span><span class="nw">${x.w}</span></span></span>
      </a>`).join('');
    list.querySelectorAll('.nitem').forEach(a=>a.onclick=()=>{ ZTH.markRead(a.dataset.id); });
  }
  if(window.ZTH && ZTH.notif){ bell(); }
  if(here!=='index.html'){
    const main=document.querySelector('main.main');
    if(main && !document.querySelector('.ctxbar')){
      const cb=document.createElement('div'); cb.className='ctxbar';
      cb.innerHTML='<b>Zentra Realty</b> &middot; negotiator commission declared within the ceiling &middot; level and leader rewards are paid by the agency from its own share on completed transactions';
      main.insertBefore(cb, main.firstChild);
    }
  }
  /* menu mudah alih */
  const btn=document.createElement('button');
  btn.className='burger'; btn.setAttribute('aria-label','Menu');
  btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  document.body.appendChild(btn);
  const ov=document.createElement('div'); ov.className='overlay'; document.body.appendChild(ov);
  const close=()=>{ host.classList.remove('open'); ov.classList.remove('on'); };
  btn.onclick=()=>{ host.classList.toggle('open'); ov.classList.toggle('on'); };
  ov.onclick=close;
  host.addEventListener('click',e=>{ if(e.target.closest('a')) close(); });
})();

/* ---- Theme toggle (ZPG dark default, light option) — added 19 Sep 2026 ---- */
(function(){
  var KEY='zr-theme';
  var html=document.documentElement;
  function apply(mode){
    if(mode==='light'){ html.classList.add('theme-light'); }
    else { html.classList.remove('theme-light'); }
    var b=document.getElementById('zrThemeBtn');
    if(b){ b.setAttribute('aria-label', mode==='light'?'Switch to dark theme':'Switch to light theme');
           b.innerHTML = mode==='light' ? SUN : MOON; }
  }
  var SUN='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>';
  var MOON='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
  var mode = localStorage.getItem(KEY) || 'dark';
  if(location.search.indexOf('theme=light')>-1) mode='light';
  apply(mode);
  function build(){
    var b=document.createElement('button');
    b.id='zrThemeBtn'; b.className='zr-theme-btn'; b.type='button';
    b.onclick=function(){
      mode = html.classList.contains('theme-light') ? 'dark' : 'light';
      localStorage.setItem(KEY, mode); apply(mode);
    };
    var host=document.querySelector('.side .foot') || document.querySelector('.side') || document.body;
    host.appendChild(b);
    var st=document.createElement('style');
    st.textContent='.zr-theme-btn{margin-top:10px;display:inline-flex;align-items:center;gap:7px;'+
      'padding:7px 11px;border-radius:10px;cursor:pointer;font:inherit;font-size:12px;font-weight:600;'+
      'background:rgba(201,162,39,.10);color:#e8ce86;border:1px solid rgba(201,162,39,.24)}'+
      '.zr-theme-btn:hover{background:rgba(201,162,39,.18)}';
    document.head.appendChild(st);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build);
  else build();
})();

/* ============================================================
   LAPISAN TINDAKAN DEMO (20/9/2026)
   Zahir: "Most page, button tiada function". Sebabnya: banyak kawalan bukan
   <button> langsung — kolum ACTION F4 dahulunya <span class="flag a">, dan ada
   75 kawalan tanpa href/onclick merentas halaman. Lapisan ini memberi setiap
   kawalan maklum balas yang JUJUR (toast), tanpa berpura-pura melakukan tindakan
   sebenar, dan menawarkan pautan ke halaman berkaitan bila ada.
   ============================================================ */
(function () {
  var PETA = [
    [/^(send reminder|remind|chase)/i, 'Would email the owner and record the reminder in the audit trail.', null],
    [/^(open report|view report|report)/i, 'Opens the compliance report for this exception.', 'compliance.html'],
    [/^stamp now/i, 'Would submit the stamping to LHDN and log the stamped date.', null],
    [/^check in/i, 'Would log a check-in with the agent and their team leader.', 'team.html'],
    [/^upload/i, 'Opens the document picker. (Prototype: no file is stored.)', null],
    [/^invite/i, 'Would email an invitation to the new agent.', 'onboard.html'],
    [/^(approve|reject|decline)/i, 'Would record your decision against this item.', null],
    [/^export/i, 'Would download a CSV of this table.', null],
    [/^(send|submit|issue|notify)/i, 'Would send this and log it in the audit trail.', null],
    [/^(new|add|create|generate)/i, 'Would open the form and generate the document from sample data.', null],
    [/^(view|open)/i, 'Opens the related record.', null]
  ];
  function toast(teks, label, href) {
    var t = document.getElementById('demoToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'demoToast'; t.className = 'dtoast'; t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.innerHTML = '<b>Demo action</b><span>' + (label ? '&ldquo;' + label + '&rdquo; &mdash; ' : '') + teks + '</span>' +
      (href ? '<a href="' + href + '">Open the related page &rarr;</a>' : '') +
      '<i>Prototype only &middot; sample data &middot; no real change is made.</i>';
    t.classList.add('on');
    clearTimeout(window.__dtoast);
    window.__dtoast = setTimeout(function () { t.classList.remove('on'); }, 5000);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('button, a.btn, .btn, .flag.a, .flag.g, .act-demo');
    if (!el) { return; }
    if (el.closest('.drawer') || el.closest('#demoToast')) { return; }
    if (el.id === 'zrThemeBtn' || el.closest('.side') || el.closest('.foot')) { return; }
    if (el.tagName === 'A' && el.getAttribute('href')) { return; }
    if (el.hasAttribute('onclick') || el.hasAttribute('data-demo-ignore')) { return; }
    var label = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!label || label.length > 46) { return; }
    var mesej = 'This is a prototype control &mdash; the live system runs the real action here.', href = null;
    for (var i = 0; i < PETA.length; i++) {
      if (PETA[i][0].test(label)) { mesej = PETA[i][1]; href = PETA[i][2]; break; }
    }
    toast(mesej, label, href);
  }, true);
})();
