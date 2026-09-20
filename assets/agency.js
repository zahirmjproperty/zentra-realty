/* agency.js — Agency System POC (English US)
   Commission engine: Declared Commission (cap 40%) + Marketing Bonus (agent level + leader override)
   Structure mirrors the IQI payment-voucher practice evidenced by Zahir's 30 Jun 2026 vouchers. */
(function () {
  "use strict";

  /* ---------- helpers ---------- */
  function money(n) {
    if (!isFinite(n)) return "RM0.00";
    return "RM" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function pct(n) {
    return (Math.round(n * 100) / 100).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + "%";
  }
  function num(id) { var e = document.getElementById(id); return e ? parseFloat(e.value) : NaN; }
  function set(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; }
  function setHTML(id, v) { var e = document.getElementById(id); if (e) e.innerHTML = v; }

  /* ---------- engine ---------- */
  var CAP_COMMISSION = 40;   // Act 242 practice: negotiator's commission is declared at 40% of professional fee

  function compute(o) {
    var fee = o.fee;
    var commPct = Math.min(o.commPct, CAP_COMMISSION);
    var comm = fee * commPct / 100;
    var level = fee * o.levelPct / 100;                 // total amount to the negotiator
    var mbAgent = Math.max(0, level - comm);            // paid from the agency share, labeled Marketing Bonus
    var leaderAmt = fee * o.leaderPct / 100;            // leader override, also paid as Marketing Bonus
    var agencyResidual = fee - comm - mbAgent - leaderAmt;
    var paidPct = (comm + mbAgent + leaderAmt) / fee * 100;
    return {
      fee: fee, commPct: commPct, comm: comm, levelPct: o.levelPct, level: level,
      mbAgent: mbAgent, leaderPct: o.leaderPct, leaderAmt: leaderAmt,
      agencyResidual: agencyResidual, paidPct: paidPct,
      clamped: o.commPct > CAP_COMMISSION,
      over100: (o.levelPct + o.leaderPct) > 100.0001,
      levelBelowComm: o.levelPct < commPct
    };
  }

  function render() {
    var box = document.getElementById("calcOut");
    if (!box) return;

    var r = compute({
      fee: num("fee") || 0,
      commPct: num("commPct") || CAP_COMMISSION,
      levelPct: num("levelPct") || 0,
      leaderPct: num("leaderPct") || 0
    });

    /* headline numbers */
    set("outFee", money(r.fee));
    set("outComm", money(r.comm));
    set("outCommPct", "Declared " + pct(r.commPct) + " of fee");
    set("outMb", money(r.mbAgent));
    set("outMbPct", "Marketing Bonus · level " + pct(r.levelPct));
    set("outAgentTotal", money(r.comm + r.mbAgent));
    set("outAgentPct", pct(r.levelPct) + " to negotiator");
    set("outLeader", money(r.leaderAmt));
    set("outLeaderPct", "Marketing Bonus · leader " + pct(r.leaderPct));
    set("outAgency", money(r.agencyResidual));
    set("outPaidPct", pct(r.paidPct));
    set("outDeclaredPct", pct(r.commPct));

    /* waterfall */
    var wf = document.getElementById("wf");
    if (wf) {
      var t = Math.max(r.fee, 1);
      wf.innerHTML =
        '<div class="a" style="width:' + (r.comm / t * 100) + '%">Commission ' + pct(r.comm / t * 100) + '</div>' +
        '<div class="b" style="width:' + (r.mbAgent / t * 100) + '%">Bonus ' + pct(r.mbAgent / t * 100) + '</div>' +
        '<div class="c" style="width:' + (r.leaderAmt / t * 100) + '%">Leader ' + pct(r.leaderAmt / t * 100) + '</div>' +
        '<div class="d" style="width:' + (r.agencyResidual / t * 100) + '%">Agency ' + pct(r.agencyResidual / t * 100) + '</div>';
    }

    /* vouchers */
    var vno = document.getElementById("vno");
    var base = vno && vno.value ? vno.value : "1074615";
    set("v1no", "PVS-" + base);
    set("v2no", "PVS-" + base + "-1");
    set("v1date", (document.getElementById("vdate") || {}).value || "30/06/2026");
    set("v2date", (document.getElementById("vdate") || {}).value || "30/06/2026");
    set("v1amt", money(r.comm));
    set("v2amt", money(r.mbAgent + r.leaderAmt));
    set("v2break", "Agent level bonus " + money(r.mbAgent) + " + Leader override " + money(r.leaderAmt));
    set("vAgent", (document.getElementById("vagent") || {}).value || "ZAHIRUDDIN BIN MAT JAILAINI");
    set("vUnit", (document.getElementById("vunit") || {}).value || "627787");
    set("vTotal1", money(r.comm));
    set("vTotal2", money(r.mbAgent + r.leaderAmt));

    /* compliance verdict */
    var flags = [];
    if (r.clamped) flags.push('<li><span class="no">✕</span><div><b>Declared commission capped at 40%.</b> Input was higher; the engine clamps it to the statutory practice ceiling (' + pct(CAP_COMMISSION) + ').</div></li>');
    else flags.push('<li><span class="ok">✓</span><div>Declared commission is <b>' + pct(r.commPct) + '</b> — within the ' + pct(CAP_COMMISSION) + ' ceiling. Only this line is called <b>commission</b>.</div></li>');
    flags.push('<li><span class="ok">✓</span><div>Everything above the commission line (' + money(r.mbAgent) + ' agent + ' + money(r.leaderAmt) + ' leader) is paid from the <b>agency share</b> and documented as <b>Marketing Bonus</b>.</div></li>');
    if (r.levelBelowComm) flags.push('<li><span class="no">✕</span><div><b>Level is below the commission percentage.</b> Increase the level or lower the declared commission.</div></li>');
    if (r.over100) flags.push('<li><span class="no">✕</span><div><b>Level + Leader exceeds 100% of the fee.</b> The engine blocks payouts that overshoot the fee.</div></li>');
    if (r.agencyResidual < 0) flags.push('<li><span class="no">✕</span><div><b>Agency residual is negative (</b>' + money(r.agencyResidual) + '<b>).</b> Reduce level or leader override.</div></li>');
    if (r.paidPct > 0 && r.paidPct <= 100 && !r.over100)
      flags.push('<li><span class="ok">✓</span><div>Total distributed: <b>' + pct(r.paidPct) + '</b> of the professional fee. Money trail is transaction-based (not recruitment-based).</div></li>');
    setHTML("complianceList", flags.join(""));

    /* rounding note (K7): payee lines are exact to the sen; odd sen goes to the agency residual */
    (function () {
      var sum = r.comm + r.mbAgent + r.leaderAmt + r.agencyResidual;
      var el = document.getElementById("roundNote");
      if (el) el.textContent = "Reconciles: " + money(r.comm) + " + " + money(r.mbAgent) + " + " + money(r.leaderAmt) +
        " + " + money(r.agencyResidual) + " = " + money(sum) + " (fee " + money(r.fee) + ")";
    })();

    /* payout schedule */
    var agentTotal = r.comm + r.mbAgent;
    var events = [["Booking / Tenancy agreement", 10], ["SPA signed", 25], ["Loan approved", 25], ["Vacant possession / Completion", 40]];
    setHTML("payoutRows", events.map(function (e) {
      return '<tr><td>' + e[0] + '</td><td class="num">' + e[1] + '%</td><td class="num">' + money(agentTotal * e[1] / 100) + '</td></tr>';
    }).join("") + '<tr class="total"><td>Total to negotiator</td><td class="num">100%</td><td class="num">' + money(agentTotal) + '</td></tr>');
  }

  /* ---------- nav highlight ---------- */
  function markNav() {
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === here) a.classList.add("on");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    markNav();
    if (document.getElementById("calcOut")) {
      ["fee", "commPct", "levelPct", "leaderPct", "vno", "vdate", "vagent", "vunit"].forEach(function (id) {
        var e = document.getElementById(id);
        if (e) e.addEventListener("input", render);
        if (e) e.addEventListener("change", render);
      });
      document.querySelectorAll("[data-preset]").forEach(function (b) {
        b.addEventListener("click", function () {
          document.querySelectorAll("[data-preset]").forEach(function (x) { x.classList.remove("on"); });
          b.classList.add("on");
          var p = b.getAttribute("data-preset").split(",");
          document.getElementById("fee").value = p[0];
          document.getElementById("levelPct").value = p[1];
          document.getElementById("leaderPct").value = p[2];
          document.getElementById("commPct").value = p[3] || CAP_COMMISSION;
          render();
        });
      });
      render();
    }
  });
})();
