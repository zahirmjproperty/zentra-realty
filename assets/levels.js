/* levels.js — SATU SUMBER tangga level Zentra Realty (Tier A) */
window.ZTH_LEVELS = [
  {id:'L1', tier:'Negotiator',     comm:40, bonus:10, total:50, ovrCap:0,  qual:'REN tag + onboarding complete'},
  {id:'L2', tier:'Negotiator',           comm:40, bonus:20, total:60, ovrCap:0,  qual:'RM600k closed production'},
  {id:'L3', tier:'Negotiator',           comm:40, bonus:30, total:70, ovrCap:0,  qual:'RM1.5m closed production'},
  {id:'L4', tier:'Senior negotiator',    comm:40, bonus:35, total:75, ovrCap:0,  qual:'RM2.5m + 2 mentored agents active'},
  {id:'L5', tier:'Team Leader',          comm:40, bonus:45, total:85, ovrCap:15, qual:'RM3.5m + 3 producing agents (each >= RM500k)'},
  {id:'L6', tier:'Group Leader',         comm:40, bonus:50, total:90, ovrCap:10, qual:'RM6m + 2 team leaders under you'}
];
/* GL — kod akaun mesti berasingan: komisen (dihadkan) vs ganjaran agensi. */
window.ZTH_GL = {commission:'602-100', marketingBonus:'602-150', leaderOverride:'602-200', agencyResidual:'602-900'};

/* Versi kadar (K8) — kadar dikunci pada versi yang berkuat kuasa semasa perjanjian ditandatangani. */
window.ZTH_RATE_VERSION = {v:'v1.0', effective:'2026-01-01'};

/* Peraturan keras (K4/K5/K6/K7) yang dibaca oleh semua skrin. */
window.ZTH_RULES = {
  referrerRecordOnly: true,
  overrideFollowsManagementUpline: true,
  externalReferrerNoPayout: true,
  maxOverrideLevels: 2,
  rounding: 'Setiap split dibundarkan ke sen; beza sen diserap oleh baki agensi supaya jumlah pemegang bayaran tepat.',
  dualRepresentation: 'Wakil dua pihak (pembeli & penjual) memerlukan kelulusan bertulis + persetujuan klien + split fi berasingan.',
  clawbackLedger: 'Clawback dibuka sebagai lejar berasingan per ejen; jika ejen keluar, baki clawback kekal sebagai hutang yang boleh ditolak daripada apa-apa bayaran kelak.'
};

window.ZTH_LEVEL_NOTE = 'Declared commission is capped at 40% for every level. Everything above it is an agency-funded marketing reward. Override is the tier gap, capped per level (L5 15%, L6 10%), paid from the agency share.';
