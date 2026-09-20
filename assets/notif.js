/* notif.js — pusat notifikasi Zentra Realty (data + keadaan dibaca), Pakej B */
window.ZTH = window.ZTH || {};
ZTH.notif = [
 {id:'n01', t:'signature', s:'WAITING', ti:'Noraini binti Hassan has not signed ZTH-LOAR-000101', mt:'Letter of Appointment (Rent) · 18-3, Jalan Seri Harmoni 2/5, Kajang', w:'6 days waiting', href:'f2.html', pri:1},
 {id:'n02', t:'stamping', s:'DUE SOON', ti:'ZTH-LOCR-000101 stamping due in 7 days', mt:'Duty RM63.00 · window closes 16 Oct 2026 (30 days from last signature)', w:'today', href:'f2.html', pri:1},
 {id:'n03', t:'money', s:'APPROVED', ti:'Claim ZTH-CLM-000101 approved by operations', mt:'RM16,320.00 to Nadia Rahman · ready for the next payout run', w:'2 hours ago', href:'f3.html'},
 {id:'n04', t:'money', s:'PAID', ti:'Payout run 15 Sep released RM16,320.00', mt:'Voucher ZTH-PVS-000101 · leader share RM2,880.00 also released', w:'yesterday', href:'payouts.html'},
 {id:'n05', t:'team', s:'ONBOARDING', ti:'Ameer Haziq completed step 4 of 6', mt:'Waiting: PI insurance certificate + bank details for e-invoice', w:'yesterday', href:'onboard.html'},
 {id:'n06', t:'signature', s:'SIGNED', ti:'All parties signed ZTH-LOCR-000101', mt:'Package archived: agreement + completion certificate + audit log', w:'2 days ago', href:'f2.html'},
 {id:'n07', t:'money', s:'PAID', ti:'Invoice ZTH-INV-2026-000101 settled', mt:'Official receipt ZTH-OR-2026-000101 issued automatically', w:'3 days ago', href:'f3.html'},
 {id:'n08', t:'compliance', s:'REPORT', ti:'Declared-vs-paid report for August is ready', mt:'Declared 40.0% · paid out 85.0% · exceptions: 1 (documentation)', w:'4 days ago', href:'f4.html'},
 {id:'n09', t:'team', s:'LEVEL UP', ti:'Aisy Karim reached the Level 1 qualifying production', mt:'Production-based promotion · no recruitment element', w:'5 days ago', href:'tree.html'},
 {id:'n10', t:'compliance', s:'FILED', ti:'Stamp certificate for ZTH-TA-000101 received and filed', mt:'Attached to the tenancy agreement package', w:'6 days ago', href:'documents.html'},
 {id:'n11', t:'lead', s:'NEW', ti:'New enquiry: 18-3, Jalan Seri Harmoni 2/5, Kajang', mt:'Rental RM1,100/month · 3 bedrooms · owner wants viewings this week', w:'7 days ago', href:'search.html'},
 {id:'n12', t:'signature', s:'WAITING', ti:'Tenancy agreement ZTH-TA-000101 awaiting the landlord', mt:'All tenants signed · landlord signature outstanding', w:'8 days ago', href:'f2.html', pri:1}
];
ZTH.typeLabel = {signature:'Signature', stamping:'Stamping', money:'Money', team:'Team', compliance:'Compliance', lead:'Lead'};
ZTH.loadRead = () => { try { return JSON.parse(localStorage.getItem('zth_notif_read')||'[]'); } catch(e){ return []; } };
ZTH.saveRead = a => localStorage.setItem('zth_notif_read', JSON.stringify(a));
ZTH.markRead = id => { const a=ZTH.loadRead(); if(!a.includes(id)){ a.push(id); ZTH.saveRead(a);} };
ZTH.markAllRead = () => ZTH.saveRead(ZTH.notif.map(n=>n.id));
ZTH.unread = () => { const a=ZTH.loadRead(); return ZTH.notif.filter(n=>!a.includes(n.id)); };
