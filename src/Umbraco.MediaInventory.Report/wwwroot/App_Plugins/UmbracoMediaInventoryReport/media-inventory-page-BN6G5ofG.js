import { UmbElementMixin as w } from "@umbraco-cms/backoffice/element-api";
import { c as m, j as S } from "./client.gen-CBAFThW6.js";
const g = "/umbraco/umbracomediainventoryreport/api/v1/media-inventory", l = (i) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${{ refresh: '<path d="M20 11a8 8 0 0 0-15-3L3 10m0-6v6h6M4 13a8 8 0 0 0 15 3l2-2m0 6v-6h-6"/>', download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19v2h16v-2"/>', search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>', chevron: '<path d="m9 18 6-6-6-6"/>', trash: '<path d="M4 7h16M10 11v6m4-6v6M9 7l1-3h4l1 3m-9 0 1 14h10l1-14"/>', link: '<path d="M10 13a5 5 0 0 0 7 .1l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7-.1l-2 2A5 5 0 0 0 12 20l1-1"/>', media: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 18 5.5-5 3.5 3 2.5-2 4.5 4"/>', check: '<path d="m5 12 4 4L19 6"/>', warning: '<path d="M12 3 3 19h18L12 3Zm0 6v4m0 3h.01"/>' }[i]}</svg>`, k = (i) => i.querySelectorAll("[data-trash]").forEach((e) => {
  e.closest("tr")?.querySelector(".pill.use") && e.remove();
}), $ = (i) => {
  const e = i.querySelector(".search .i");
  e && (e.style.cssText = "position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#6c7d82;pointer-events:none");
}, q = (i, e) => {
  let t = i.querySelector("#media-insights");
  t || (t = document.createElement("section"), t.id = "media-insights", i.querySelector(".filters")?.before(t));
  const o = Math.max(1, e.typeCounts.reduce((r, c) => r + c.count, 0)), s = ["#007c72", "#635bff", "#ed8b37", "#d9577a", "#3b82c4"];
  let a = 0;
  const n = e.typeCounts.map((r, c) => {
    const h = a + r.count / o * 100, f = `${s[c % s.length]} ${a}% ${h}%`;
    return a = h, f;
  }).join(","), p = e.inUseTotal + e.unusedTotal || 1, d = Math.round(e.inUseTotal / p * 100);
  t.innerHTML = `<div style="display:flex;align-items:baseline;justify-content:space-between;margin:20px 0 10px"><div><p style="margin:0;color:#007c72;font-size:11px;font-weight:800;letter-spacing:.1em">MEDIA HEALTH</p><h3 style="margin:3px 0 0;font-size:18px;color:#263a42">Library at a glance</h3></div><span style="color:#718188;font-size:12px">Matches your active filters</span></div><div style="display:grid;grid-template-columns:repeat(3,minmax(130px,1fr)) minmax(300px,2fr);gap:12px"><div style="padding:16px;border:1px solid #dce8e7;border-radius:12px;background:#fff"><span style="color:#718188;font-size:11px;font-weight:700;letter-spacing:.06em">MEDIA ITEMS</span><strong style="display:block;margin-top:7px;color:#263a42;font-size:26px">${o.toLocaleString()}</strong></div><div style="padding:16px;border:1px solid #c8e8d8;border-radius:12px;background:#f3fbf7"><span style="color:#28734c;font-size:11px;font-weight:700;letter-spacing:.06em">IN USE</span><strong style="display:block;margin-top:7px;color:#176a43;font-size:26px">${e.inUseTotal.toLocaleString()}</strong></div><div style="padding:16px;border:1px solid #f0d8b6;border-radius:12px;background:#fff9ef"><span style="color:#9a681a;font-size:11px;font-weight:700;letter-spacing:.06em">UNUSED</span><strong style="display:block;margin-top:7px;color:#8b5c15;font-size:26px">${e.unusedTotal.toLocaleString()}</strong></div><div style="display:flex;align-items:center;gap:16px;padding:14px 18px;border:1px solid #dce8e7;border-radius:12px;background:#fff"><div style="flex:0 0 76px;width:76px;height:76px;border-radius:50%;background:conic-gradient(${n || "#e5eeee 0 100%"});position:relative"><span style="position:absolute;inset:11px;display:grid;place-items:center;border-radius:50%;background:#fff;color:#52666c;font-size:11px;font-weight:700">Types</span></div><div style="min-width:0;flex:1"><strong style="font-size:13px;color:#30464c">Media by type</strong><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${e.typeCounts.map((r, c) => `<span style="display:inline-flex;align-items:center;gap:4px;color:#5d7076;font-size:11px"><i style="display:block;width:8px;height:8px;border-radius:50%;background:${s[c % s.length]}"></i>${r.type} ${r.count}</span>`).join("")}</div><div style="margin-top:11px;height:7px;overflow:hidden;border-radius:99px;background:#edf2f1"><span style="display:block;width:${d}%;height:100%;border-radius:inherit;background:#007c72"></span></div><span style="display:block;margin-top:5px;color:#60737a;font-size:11px">${d}% of media is in use</span></div></div></div>`, t.style.cssText = "max-width:100%;overflow:auto";
}, z = (i) => {
  if (!i.querySelector("#media-health-polish")) {
    const n = document.createElement("style");
    n.id = "media-health-polish", n.textContent = "#media-insights{position:relative}#media-insights>div:first-child h3{font-size:24px!important;letter-spacing:-.035em}#media-insights>div:first-child p{font-size:11px!important}#media-insights>div:nth-child(2)>div{transition:transform .18s ease,box-shadow .18s ease;background:linear-gradient(135deg,#fff,#fbfdff)!important}#media-insights>div:nth-child(2)>div:not(:last-child):hover{transform:translateY(-2px);box-shadow:0 10px 24px rgb(20 55 72 / 12%)!important}#media-insights strong{letter-spacing:-.035em}#media-insights .insight-icon{box-shadow:inset 0 1px 0 rgb(255 255 255 / 85%),0 4px 10px rgb(30 80 120 / 8%)}#media-insights .insight-chevron{transition:transform .18s ease}#media-insights>div:nth-child(2)>div:not(:last-child):hover .insight-chevron{transform:translate(3px,-50%)}#media-insights>div:nth-child(2)>div:last-child{background:linear-gradient(110deg,#fff,#fcfefe)!important;box-shadow:0 7px 22px rgb(20 55 72 / 7%)!important}#media-insights>div:nth-child(2)>div:last-child>div:first-child{box-shadow:0 7px 18px rgb(0 124 114 / 10%)}@media(prefers-reduced-motion:reduce){#media-insights>div:nth-child(2)>div,#media-insights .insight-chevron{transition:none!important}}", i.append(n);
  }
  if (!i.querySelector("#inventory-action-polish")) {
    const n = document.createElement("style");
    n.id = "inventory-action-polish", n.textContent = ".hero .actions button{transition:transform .18s ease,box-shadow .18s ease,background .18s ease,border-color .18s ease}.hero .actions button:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 18px rgb(20 55 72 / 16%)}.hero .actions .primary:hover:not(:disabled){box-shadow:0 9px 20px rgb(0 124 114 / 28%)}.hero .actions button:active:not(:disabled){transform:translateY(0);box-shadow:0 3px 8px rgb(20 55 72 / 12%)}@media(prefers-reduced-motion:reduce){.hero .actions button{transition:none!important}.hero .actions button:hover:not(:disabled){transform:none!important}}", i.append(n);
  }
  if (!i.querySelector("#inventory-action-accessibility")) {
    const n = document.createElement("style");
    n.id = "inventory-action-accessibility", n.textContent = ".hero .actions{position:relative;z-index:2}.hero .actions button{position:relative;z-index:1}.hero .actions button:hover:not(:disabled){transform:none!important}.hero .actions button:focus-visible{outline:3px solid #78b8ff;outline-offset:3px;z-index:3}", i.append(n);
  }
  if (!i.querySelector("#inventory-primary-hover-colour")) {
    const n = document.createElement("style");
    n.id = "inventory-primary-hover-colour", n.textContent = ".hero .actions button.primary:hover:not(:disabled),.hero .actions button.primary:focus-visible{color:#fff!important}", i.append(n);
  }
  const e = i.querySelector("#media-insights"), t = e?.querySelector(":scope > div:nth-child(2)");
  if (!e || !t) return;
  const o = [...t.children].slice(0, 4), s = ["media", "check", "warning", "media"];
  o.forEach((n, p) => {
    n.style.cssText += ";position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:4px;padding:15px 22px 15px 84px;min-height:96px", p === 3 && n.querySelector("span[style*='position:absolute']")?.remove();
    const d = n.querySelector(".insight-icon");
    if (d)
      d.style.cssText += ";left:16px;right:auto;top:50%;transform:translateY(-50%);width:48px;height:48px;border-radius:50%";
    else {
      const r = document.createElement("span");
      r.className = "insight-icon", r.innerHTML = l(s[p]), r.style.cssText = `position:absolute;left:16px;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:${p === 0 ? "#e8f3ff" : p === 1 ? "#dff6ed" : p === 2 ? "#fff0d8" : "#e8f0ff"};color:${p === 0 ? "#2475c5" : p === 1 ? "#009476" : p === 2 ? "#b66b04" : "#2464d7"}`, n.append(r);
    }
    if (p === 3) {
      const r = n.querySelector(".insight-icon");
      r && (r.innerHTML = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"/></svg>');
    }
    n.querySelector(".insight-chevron")?.remove();
  });
  const a = t.lastElementChild;
  if (a) {
    a.style.cssText += ";display:flex;align-items:center;gap:34px;padding:22px 32px";
    const n = a.querySelector("div"), p = o[0]?.querySelector("strong")?.textContent?.trim() || "0", d = n?.querySelector("span");
    d && (d.innerHTML = `<strong style="font-size:17px;color:#17325b">${p}</strong><small style="display:block;margin-top:1px;font-size:9px;font-weight:700;color:#647895;text-transform:uppercase;letter-spacing:.06em">items</small>`), n && (n.style.cssText += ";flex:0 0 114px;width:114px;height:114px;box-shadow:0 8px 20px rgb(23 72 110 / 12%)");
    const c = n?.nextElementSibling?.querySelector("strong");
    c && (c.textContent = "Media by type", c.style.cssText += ";font-size:18px;color:#17325b");
    const h = c?.nextElementSibling;
    h && (h.style.cssText += ";display:flex;gap:9px;flex-wrap:wrap;margin-top:10px", h.querySelectorAll("span").forEach((x) => {
      x.style.cssText += ";padding:5px 8px;border:1px solid #e5edf4;border-radius:999px;background:#fbfdff;font-size:11px;font-weight:600";
    }));
    const f = h?.nextElementSibling;
    if (f && n) {
      const x = n.style.background.replace("conic-gradient(", "linear-gradient(90deg,");
      f.style.cssText = `position:relative;margin-top:14px;height:10px;overflow:hidden;border-radius:99px;background:${x};box-shadow:inset 0 1px 2px rgb(11 42 74 / 12%),0 2px 5px rgb(34 77 123 / 9%)`;
      const b = f.firstElementChild;
      b && (b.style.display = "none");
      const y = document.createElement("span");
      y.style.cssText = "position:absolute;inset:0;background:linear-gradient(180deg,rgb(255 255 255 / 28%),transparent 55%);pointer-events:none", f.append(y);
    }
    const u = f?.nextElementSibling;
    if (u) {
      u.style.cssText += ";margin-top:8px;color:#637b99;font-size:12px;font-weight:600";
      const x = h?.children.length ?? 0;
      u.textContent = `${u.textContent} · ${x} media types`;
    }
  }
}, T = (i) => {
  z(i);
  const e = i.querySelector("#media-insights");
  e && (e.style.marginBottom = "24px");
}, E = (i) => {
  const e = i.querySelectorAll("#media-insights div[style*='grid-template-columns'] > div");
  ["media", "check", "warning"].forEach((t, o) => {
    const s = e[o];
    if (!s || s.querySelector(".insight-icon")) return;
    s.style.position = "relative";
    const a = document.createElement("span");
    a.className = "insight-icon", a.innerHTML = l(t), a.style.cssText = `position:absolute;right:14px;top:14px;display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:${o === 0 ? "#e7f4f2" : o === 1 ? "#dff3e7" : "#fff0d8"};color:${o === 0 ? "#007c72" : o === 1 ? "#217147" : "#a46c15"}`, s.append(a);
  });
}, v = (i) => i < 1024 ? `${i} B` : i < 1048576 ? `${(i / 1024).toFixed(1)} KB` : i < 1073741824 ? `${(i / 1048576).toFixed(1)} MB` : `${(i / 1073741824).toFixed(2)} GB`, M = (i, e) => {
  const t = i.querySelector(".table-wrap table");
  if (!t || t.querySelector("th.size-heading")) return;
  const o = document.createElement("th");
  o.className = "size-heading", o.textContent = "File size", t.querySelector("thead tr")?.children[3].after(o), t.querySelectorAll("tbody > tr").forEach((s, a) => {
    if (!s.querySelector(".url")) return;
    const n = document.createElement("td");
    n.style.cssText = "color:#60737a;font-variant-numeric:tabular-nums;white-space:nowrap", n.textContent = v(e.items[a]?.fileSizeBytes ?? 0), s.querySelector(".url")?.after(n);
  }), i.querySelectorAll(".refs").forEach((s) => s.colSpan = 7);
}, L = (i, e) => {
  const t = i.querySelector(".table-wrap table"), o = t?.querySelector("th.size-heading");
  if (!t || !o || t.querySelector("th.uploaded-heading")) return;
  const s = document.createElement("th");
  s.className = "uploaded-heading", s.textContent = "Uploaded", o.after(s);
  let a = 0;
  t.querySelectorAll("tbody > tr").forEach((n) => {
    const p = n.querySelector(".url");
    if (!p) return;
    const d = document.createElement("td"), r = e.items[a++]?.createdDate;
    d.style.cssText = "color:#60737a;white-space:nowrap;font-variant-numeric:tabular-nums", d.textContent = r ? new Intl.DateTimeFormat(void 0, { day: "2-digit", month: "short", year: "numeric" }).format(new Date(r)) : "—", p.nextElementSibling?.after(d);
  }), i.querySelectorAll(".refs").forEach((n) => n.colSpan = 8);
}, C = (i, e) => {
  const t = i.querySelector("#media-insights div[style*='grid-template-columns']");
  if (!t || t.querySelector(".storage-card")) return;
  t.style.setProperty("grid-template-columns", "repeat(4,minmax(130px,1fr))", "important");
  const o = document.createElement("div");
  o.className = "storage-card", o.style.cssText = "position:relative;padding:16px;border:1px solid #cbdcf5;border-radius:12px;background:#f4f8ff;box-shadow:0 3px 12px rgb(23 55 63 / 5%)", o.innerHTML = `<span style="color:#416eac;font-size:11px;font-weight:700;letter-spacing:.06em">LIBRARY STORAGE</span><strong style="display:block;margin-top:7px;color:#295a9b;font-size:26px">${v(e.totalFileSizeBytes)}</strong><span style="position:absolute;right:14px;top:14px;display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:#dceaff;color:#356eae">${l("media")}</span>`, t.insertBefore(o, t.lastElementChild);
  const s = t.lastElementChild;
  s && (s.style.gridColumn = "span 2");
}, A = (i) => {
  if (i.querySelector("#inventory-modern-theme")) return;
  const e = document.createElement("style");
  e.id = "inventory-modern-theme", e.textContent = ":host{background:#f6f8f9}.inventory{padding:32px 28px 44px!important}.hero{border:0!important;border-radius:18px!important;box-shadow:0 10px 30px rgb(24 67 65 / 9%)!important}.filters,.table-wrap{border:0!important;border-radius:14px!important;box-shadow:0 5px 20px rgb(23 55 63 / 7%)!important}.filters{overflow:hidden}.filters>div:first-child{padding:18px 20px 0!important}.toolbar{padding:16px 20px 20px!important;background:linear-gradient(180deg,#fff,#fbfdfd)}.toolbar label{color:#5c7076!important}.toolbar select,.search input{border-color:#d8e3e5!important;background:#fff!important;box-shadow:0 1px 2px rgb(23 55 63 / 3%)}.toolbar select:hover,.search input:hover{border-color:#90bdb8!important}.status{box-shadow:0 2px 5px rgb(25 108 69 / 7%)}#media-insights>div:first-child{margin-top:26px!important}#media-insights>div:nth-child(2){grid-template-columns:repeat(3,minmax(145px,1fr)) minmax(330px,2fr)!important}#media-insights>div:nth-child(2)>div{box-shadow:0 3px 12px rgb(23 55 63 / 5%)}.content{margin-top:20px!important}.summary{padding-left:2px}.table-wrap table th{background:#f1f6f6!important}.table-wrap table td{padding-top:15px!important;padding-bottom:15px!important}.table-wrap tbody tr:hover{background:#f2faf8!important}.pager{padding:16px 3px!important}.pager button,.pager select{box-shadow:0 1px 2px rgb(23 55 63 / 4%)}@media(max-width:1050px){#media-insights>div:nth-child(2){grid-template-columns:repeat(3,1fr)!important}#media-insights>div:nth-child(2)>div:last-child{grid-column:1/-1}}@media(max-width:700px){.inventory{padding:18px 14px 32px!important}.hero{padding:20px!important}.hero-icon{width:46px!important;height:46px!important}.intro h2{font-size:24px!important}#media-insights>div:first-child{align-items:flex-start!important;gap:8px;flex-direction:column}#media-insights>div:nth-child(2){grid-template-columns:1fr!important}#media-insights>div:nth-child(2)>div:last-child{grid-column:auto}.filters>div:first-child{padding-left:16px!important}.toolbar{padding:14px 16px 18px!important}.hero-actions{width:100%}.actions button{min-height:42px}}", i.append(e);
}, R = (i) => {
  const e = i.querySelector("#status"), t = i.querySelector(".hero .actions");
  !e || !t || (t.append(e), e.style.cssText = "width:100%;justify-content:center;margin:2px 0 0;white-space:nowrap");
}, U = (i) => {
  if (i.querySelector("#inventory-screenshot-theme")) return;
  const e = document.createElement("style");
  e.id = "inventory-screenshot-theme", e.textContent = ":host{background:radial-gradient(circle at 55% 0,#f1fbfb 0,#f7f9fc 36%,#f4f7fb 100%)}.inventory{max-width:1480px!important}.hero{min-height:110px!important;padding:20px 28px!important;background:linear-gradient(105deg,#fff 0%,#fbfefe 65%,#f1fbfa 100%)!important}.hero-icon{border-radius:15px!important}.intro h2{font-size:27px!important}.actions{max-width:405px!important;justify-content:flex-end}.status{font-size:12px!important;background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important}.status .i{color:#009b86!important}#media-insights{margin-top:24px!important}#media-insights>div:first-child{margin:0 0 10px!important}#media-insights>div:nth-child(2){display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:16px!important}#media-insights>div:nth-child(2)>div{min-height:93px!important;border-radius:10px!important;box-shadow:0 4px 14px rgb(20 55 72 / 6%)!important}#media-insights>div:nth-child(2)>div:nth-child(1){border-color:#d7e2ec!important}#media-insights>div:nth-child(2)>div:nth-child(2){border-color:#18ab8d!important}#media-insights>div:nth-child(2)>div:nth-child(3){border-color:#f0b644!important}#media-insights>div:nth-child(2)>div:nth-child(4){border-color:#a8c8ff!important}#media-insights>div:nth-child(2)>div:last-child{grid-column:1 / -1!important;min-height:148px!important;margin-top:4px!important;padding:22px 32px!important}.filters{border:1px solid #e2eaf2!important;border-radius:11px!important}.filters>div:first-child{padding-top:16px!important}.filters h3{font-size:21px!important;color:#142b52!important}.filters-head{display:flex;align-items:center;justify-content:space-between;gap:16px}.reset-filters{min-height:auto;padding:5px 0;border:0;background:transparent;color:#008b7c;font-size:12px}.toolbar{gap:16px!important;padding-top:14px!important}.toolbar label{font-size:10px!important;color:#55708e!important}.toolbar select,.search input{height:40px!important;border-color:#cbdbea!important;border-radius:7px!important}.search{min-width:330px!important}.type-summary{border-top:1px solid #edf2f7!important;padding-top:12px!important}.type-summary button{border-radius:99px!important}.table-wrap{border:1px solid #e0eaf3!important;border-radius:10px!important}.table-wrap table th{background:#eef5fb!important;color:#1c365a!important}.table-wrap table td{border-color:#e4edf5!important}.name{color:#19335b!important}.pill{border-radius:99px!important}.url a{font-weight:600!important}.pager{color:#536b85!important}@media(max-width:920px){#media-insights>div:nth-child(2){grid-template-columns:repeat(2,minmax(0,1fr))!important}.search{min-width:260px!important}}@media(max-width:620px){#media-insights>div:nth-child(2){grid-template-columns:1fr!important}.hero{padding:18px!important}.actions{max-width:none!important}.search{min-width:100%!important}}", i.append(e);
}, I = (i) => {
  const t = i.querySelector("#media-insights>div:nth-child(2)")?.lastElementChild;
  t && (t.style.gridColumn = "1 / -1");
}, j = (i) => {
  const e = i.querySelector(".table-wrap table");
  if (!e || e.querySelector("th.url-heading-removed")) return;
  const t = [...e.querySelectorAll("thead th")].find((o) => o.textContent?.trim() === "URL");
  t && (t.classList.add("url-heading-removed"), t.remove()), e.querySelectorAll("tbody > tr").forEach((o) => {
    const s = o.querySelector(".name"), a = o.querySelector(".url"), n = a?.querySelector("a");
    if (!s || !a || !n) return;
    const p = n.href, d = s.textContent ?? "media item";
    s.innerHTML = "";
    const r = document.createElement("a");
    r.href = p, r.target = "_blank", r.rel = "noopener", r.textContent = d, r.style.cssText = "display:block;color:#19335b;font-weight:700;text-decoration:none";
    const c = document.createElement("span");
    c.textContent = n.textContent ?? p, c.style.cssText = "display:block;max-width:260px;margin-top:4px;overflow:hidden;color:#71859b;font-size:11px;font-weight:400;text-overflow:ellipsis;white-space:nowrap", s.append(r, c), a.remove();
  }), i.querySelectorAll(".refs").forEach((o) => o.colSpan = 7);
}, H = (i) => {
  const e = i.querySelector("#sort");
  !e || e.querySelector("option[value='createdDate:desc']") || e.insertAdjacentHTML("beforeend", '<option value="createdDate:desc">Newest uploads</option><option value="createdDate:asc">Oldest uploads</option>');
};
class N extends w(HTMLElement) {
  constructor() {
    super(...arguments), this.page = 1, this.size = 50, this.search = "", this.type = "", this.refs = "", this.sort = "name", this.direction = "asc";
  }
  connectedCallback() {
    this.innerHTML = `<style>${this.css()}</style><section class="inventory" aria-busy="true"><header class="hero"><div class="hero-icon">${l("media")}</div><div class="intro"><small>MEDIA MANAGEMENT</small><h2>Media inventory</h2><p>Explore your library, see where files are used and keep things tidy.</p></div><div class="actions"><button id="export" class="quiet">${l("download")} Export CSV</button><button id="refresh" class="primary">${l("refresh")} Refresh inventory</button></div></header><div id="status" class="status" role="status">${l("refresh")} Loading media inventory…</div><div class="filters"><div><h3>Find media</h3><span>Filter the inventory</span></div><div class="toolbar"><label class="search">${l("search")}<input id="search" type="search" placeholder="Search by name or ID" aria-label="Search by name or ID"></label><label>Media type<select id="type"><option value="">All media types</option><option>Image</option><option>File</option><option>Folder</option><option>Video</option><option>Audio</option></select></label><label>References<select id="refs"><option value="">All items</option><option value="true">In use</option><option value="false">Not in use</option></select></label><label>Sort by<select id="sort"><option value="name:asc">Name, A–Z</option><option value="name:desc">Name, Z–A</option><option value="type:asc">Type</option><option value="references:desc">Most references</option><option value="references:asc">Fewest references</option></select></label></div><div id="type-summary" class="type-summary" aria-live="polite"></div></div><main id="content" class="content"><p class="loading">${l("refresh")} Loading inventory…</p></main></section>`, this.bind(), this.load();
  }
  css() {
    return ":host{display:block;color:#263a42;font-family:var(--uui-font-family,inherit)}*{box-sizing:border-box}.inventory{max-width:1520px;margin:auto;padding:24px}.hero{display:flex;align-items:center;gap:18px;padding:26px 30px;border:1px solid #d7ebe7;border-radius:16px;background:linear-gradient(120deg,#fff,#edf9f7);box-shadow:0 5px 18px #17434212}.hero-icon{display:grid;place-items:center;width:54px;height:54px;border-radius:14px;background:#007c72;color:white;box-shadow:0 5px 12px #007c723d}.hero-icon .i{width:29px;height:29px}.intro small{color:#007c72;font-size:11px;font-weight:800;letter-spacing:.1em}.intro h2{margin:3px 0 0;font-size:28px;letter-spacing:-.035em}.intro p{margin:6px 0 0;color:#5d6d74;font-size:14px}.actions{display:flex;gap:9px;margin-left:auto;flex-wrap:wrap}button{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:38px;padding:0 13px;border:1px solid #bdcccf;border-radius:7px;background:#fff;color:#30434a;font:600 13px inherit;cursor:pointer;transition:.16s}.primary{background:#007c72;border-color:#007c72;color:#fff}.primary:hover{background:#006b63}.quiet:hover,button:not(:disabled):hover{border-color:#007c72;color:#007c72}.primary:hover{color:#fff}button:disabled{opacity:.45;cursor:not-allowed}.i{width:17px;height:17px;flex:none}.status{display:inline-flex;align-items:center;gap:7px;margin:17px 0;padding:8px 12px;border:1px solid #c5e6d5;border-radius:999px;background:#effaf4;color:#196c45;font-size:12px;font-weight:600}.filters,.table-wrap{border:1px solid #e0e8ea;border-radius:12px;background:#fff;box-shadow:0 3px 12px #17373f0c}.filters>div:first-child{display:flex;align-items:baseline;gap:9px;padding:15px 18px 0}.filters h3{margin:0;font-size:15px}.filters span{color:#74848a;font-size:12px}.toolbar{display:flex;align-items:end;gap:12px;flex-wrap:wrap;padding:14px 18px 18px}.toolbar label{display:grid;gap:5px;color:#53656d;font-size:11px;font-weight:700;letter-spacing:.025em;text-transform:uppercase}.toolbar select,.search input{height:38px;border:1px solid #cbd8db;border-radius:7px;background:#fff;color:#24373e;font:400 13px inherit}.toolbar select{min-width:142px;padding:0 10px}.search{position:relative;min-width:280px}.search .i{position:absolute;top:29px;left:11px;color:#6c7d82}.search input{width:100%;padding:0 10px 0 34px}.content{margin-top:16px}.summary{margin:0 0 9px;color:#64757c;font-size:13px}.summary strong{color:#273c44}.table-wrap{overflow:auto}table{width:100%;min-width:770px;border-collapse:collapse}th{padding:12px 14px;background:#f5f8f8;color:#66787e;font-size:10px;font-weight:800;letter-spacing:.085em;text-align:left;text-transform:uppercase}td{padding:13px 14px;border-top:1px solid #edf1f2;font-size:13px;vertical-align:middle}tbody tr:hover{background:#f6fbfa}.expand,.icon-button{display:grid;place-items:center;width:30px;height:30px;padding:0;border:0;border-radius:6px;background:transparent;color:#547077;cursor:pointer}.expand:hover,.icon-button:hover{background:#e7f4f2;color:#007c72}.expand.open .i{transform:rotate(90deg)}.name{font-weight:700}.pill{display:inline-flex;align-items:center;gap:5px;padding:5px 9px;border-radius:999px;background:#eef3f4;color:#536c73;font-size:11px;font-weight:700;white-space:nowrap}.pill.use{background:#edf8f2;color:#237147}.pill.empty{background:#f4f5f5;color:#78868a}.pill .i{width:13px;height:13px}.url{max-width:340px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.url a,.reference-list a{color:#007c72;text-decoration:none}.url a:hover,.reference-list a:hover{text-decoration:underline}.actions-cell{width:58px;text-align:center}.danger:hover{background:#fff0ef;color:#b23732}.refs{padding:0 18px 16px 54px!important;background:#f6fbfa}.reference-list{padding:13px 15px;border-left:3px solid #74c8be;background:#fff;border-radius:0 8px 8px 0;color:#52656d}.reference-list p{margin:0;padding:7px 0;border-bottom:1px solid #edf1f1;font-size:12px}.reference-list p:last-child{border:0}.pager{display:flex;align-items:center;justify-content:flex-end;gap:10px;padding:13px 2px;color:#61737a;font-size:12px}.pager select,.pager button{height:33px;padding:0 10px;border:1px solid #cbd8db;border-radius:6px;background:#fff;color:#30434a;font:600 12px inherit}.empty,.loading,.error{display:flex;align-items:center;gap:9px;margin:0;padding:28px;border:1px dashed #ccd9dc;border-radius:12px;background:#fff;color:#62767c}.error{border-style:solid;border-color:#f0c4c0;background:#fff6f5;color:#a33a32}@media(max-width:720px){.inventory{padding:16px}.hero{align-items:flex-start;flex-wrap:wrap;padding:20px}.actions{width:100%;margin:0}.actions button{flex:1}.toolbar label,.search{width:100%}.search input,.toolbar select{width:100%}.pager{justify-content:center;flex-wrap:wrap}.refs{padding-left:18px!important}}";
  }
  q(e) {
    return this.querySelector(e);
  }
  bind() {
    A(this), U(this), R(this), $(this), H(this);
    const e = this.q("#search"), t = () => {
      this.search = e.value.trim(), this.page = 1, this.load();
    };
    e.oninput = t, e.addEventListener("search", t), this.q("#type").onchange = (o) => {
      this.type = o.target.value, this.page = 1, this.load();
    }, this.q("#refs").onchange = (o) => {
      this.refs = o.target.value, this.page = 1, this.load();
    }, this.q("#sort").onchange = (o) => {
      [this.sort, this.direction] = o.target.value.split(":"), this.page = 1, this.load();
    }, this.q("#refresh").onclick = () => {
      this.refresh();
    }, this.q("#export").onclick = () => {
      this.export();
    };
  }
  async load() {
    const e = new URLSearchParams({ page: String(this.page), pageSize: String(this.size), sortBy: this.sort, sortDirection: this.direction });
    this.search && e.set("search", this.search), this.type && e.set("mediaType", this.type), this.refs && e.set("hasReferences", this.refs), this.q("section").setAttribute("aria-busy", "true");
    try {
      const t = await m.get({ url: `${g}?${e}`, security: [{ scheme: "bearer", type: "http" }] });
      if (!t.response?.ok || !t.data) throw Error();
      const o = t.data;
      q(this, o), E(this), C(this, o), I(this), T(this), this.show(o), M(this, o), L(this, o), j(this), k(this), this.renderTypeSummary(o);
    } catch {
      this.q("#content").innerHTML = `<p class="error">${l("warning")} Unable to load the media inventory.</p>`;
    } finally {
      this.q("section").setAttribute("aria-busy", "false");
    }
  }
  show(e) {
    const t = (r) => r.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]), o = e.total ? (e.page - 1) * e.pageSize + 1 : 0, s = Math.min(e.page * e.pageSize, e.total), a = e.cache.status === "valid";
    this.q("#status").innerHTML = `${l(a ? "check" : "warning")} ${a ? "Up to date" : "Refresh required"} · Last generated ${new Date(e.cache.generatedAt).toLocaleString()}`, this.q("#content").innerHTML = e.items.length ? `<p class="summary">Showing <strong>${o.toLocaleString()}–${s.toLocaleString()}</strong> of <strong>${e.total.toLocaleString()}</strong> media items</p><div class="table-wrap"><table><thead><tr><th></th><th>Name</th><th>Type</th><th>URL</th><th>References</th><th>Actions</th></tr></thead><tbody>${e.items.map((r) => `<tr><td><button class="expand ${this.expanded === r.id ? "open" : ""}" data-expand="${r.id}" aria-label="Show references for ${t(r.name)}">${l("chevron")}</button></td><td class="name">${t(r.name)}</td><td><span class="pill">${t(r.type)}</span></td><td class="url"><a href="${t(r.url)}" target="_blank" rel="noopener">${t(r.url)}</a></td><td><span class="pill ${r.hasReferences ? "use" : "empty"}">${l(r.hasReferences ? "link" : "media")}${r.hasReferences ? `${r.referenceCount} in use` : "Not in use"}</span></td><td class="actions-cell"><button class="icon-button danger" data-trash="${r.id}" data-name="${t(r.name)}" title="Move to trash" aria-label="Move ${t(r.name)} to trash">${l("trash")}</button></td></tr>${this.expanded === r.id ? `<tr><td colspan="6" class="refs" id="refs-${r.id}"><div class="reference-list">Loading references…</div></td></tr>` : ""}`).join("")}</tbody></table></div><div class="pager"><button id="prev" ${this.page === 1 ? "disabled" : ""}>Previous</button><span>Page ${this.page}</span><button id="next" ${s >= e.total ? "disabled" : ""}>Next</button><label>Rows <select id="size">${[25, 50, 100, 250].map((r) => `<option ${r === this.size ? "selected" : ""}>${r}</option>`).join("")}</select></label></div>` : `<p class="empty">${l("media")} No media items match the selected filters.</p>`, this.querySelectorAll("[data-expand]").forEach((r) => r.onclick = () => {
      this.toggle(Number(r.dataset.expand));
    }), this.querySelectorAll("[data-trash]").forEach((r) => r.onclick = () => {
      this.trash(Number(r.dataset.trash), r.dataset.name || "media item");
    });
    const n = this.querySelector("#prev"), p = this.querySelector("#next"), d = this.querySelector("#size");
    n && (n.onclick = () => {
      --this.page, this.load();
    }), p && (p.onclick = () => {
      ++this.page, this.load();
    }), d && (d.onchange = () => {
      this.size = Number(d.value), this.page = 1, this.load();
    }), this.expanded && this.references(this.expanded);
  }
  async toggle(e) {
    this.expanded = this.expanded === e ? void 0 : e, await this.load();
  }
  async references(e) {
    const t = this.querySelector(`#refs-${e} .reference-list`);
    try {
      const o = await m.get({ url: `${g}/${e}/references`, security: [{ scheme: "bearer", type: "http" }] });
      if (!o.response?.ok) throw Error();
      const s = o.data ?? [];
      t && (t.innerHTML = s.length ? s.map((a) => `<p><strong>${a.name}</strong> · ${a.nodeType} · ${a.path} <a href="${a.url}">Open →</a></p>`).join("") : "No references found.");
    } catch {
      t && (t.textContent = "Unable to load references.");
    }
  }
  async refresh() {
    if (!confirm("Refresh Media Inventory in the background?")) return;
    if (!(await m.post({ url: `${g}/refresh`, security: [{ scheme: "bearer", type: "http" }] })).response?.ok) {
      alert("Unable to start the inventory refresh.");
      return;
    }
    this.q("#refresh").disabled = !0, this.pollRefreshStatus();
  }
  async pollRefreshStatus() {
    try {
      const e = await m.get({ url: `${g}/refresh/status`, security: [{ scheme: "bearer", type: "http" }] });
      if (!e.response?.ok || !e.data) throw Error();
      const t = e.data;
      if (this.q("#status").innerHTML = `${l(t.isRunning ? "refresh" : t.status === "completed" ? "check" : "warning")} ${t.isRunning ? `Refreshing inventory · ${t.percentage}% · ${t.processed.toLocaleString()} / ${t.total.toLocaleString()} items` : t.message}`, t.isRunning) {
        this.refreshTimer = window.setTimeout(() => {
          this.pollRefreshStatus();
        }, 1e3);
        return;
      }
      this.q("#refresh").disabled = !1, await this.load();
    } catch {
      this.q("#status").innerHTML = `${l("warning")} Unable to retrieve refresh progress.`, this.q("#refresh").disabled = !1;
    }
  }
  async export() {
    const e = await m.post({ url: `${g}/export`, security: [{ scheme: "bearer", type: "http" }], headers: { "Content-Type": "application/json" }, bodySerializer: S.bodySerializer, body: { search: this.search, mediaType: this.type, hasReferences: this.refs === "" ? null : this.refs === "true", sortBy: this.sort, sortDirection: this.direction }, parseAs: "blob" });
    if (!e.response?.ok || !e.data) {
      alert("Unable to export the inventory.");
      return;
    }
    const t = document.createElement("a");
    t.href = URL.createObjectURL(e.data), t.download = "media-inventory.csv", t.click(), URL.revokeObjectURL(t.href);
  }
  async trash(e, t) {
    if (!confirm(`Move “${t}” to the recycle bin? This may affect references.`)) return;
    (await m.post({ url: `${g}/${e}/trash`, security: [{ scheme: "bearer", type: "http" }] })).response?.ok ? (alert(`“${t}” was moved to the recycle bin.`), this.load()) : alert("Unable to move media to the recycle bin.");
  }
  renderTypeSummary(e) {
    const t = this.q("#type-summary"), o = (a) => a.replace(/[&<>"']/g, (n) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[n]), s = e.typeCounts?.map((a) => `<button data-summary-type="${o(a.type)}" style="display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid ${this.type === a.type ? "#72beb6" : "#dbe8e7"};border-radius:8px;background:${this.type === a.type ? "#e9f7f4" : "#f7fbfa"};color:${this.type === a.type ? "#007c72" : "#466169"};font:600 12px inherit;cursor:pointer"><strong style="display:grid;place-items:center;min-width:22px;height:22px;padding:0 6px;border-radius:6px;background:${this.type === a.type ? "#007c72" : "#dff1ed"};color:${this.type === a.type ? "#fff" : "#007c72"};font-size:12px">${a.count}</strong>${o(a.type)}</button>`).join("") ?? "";
    t.innerHTML = s ? `<span style="align-self:center;margin-right:2px;color:#718188;font-size:11px;font-weight:700;letter-spacing:.06em">BY TYPE</span>${s}` : "", t.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;padding:0 18px 18px", this.querySelectorAll("[data-summary-type]").forEach((a) => a.onclick = () => {
      this.type = a.dataset.summaryType || "", this.q("#type").value = this.type, this.page = 1, this.load();
    });
  }
}
customElements.get("media-inventory-report") || customElements.define("media-inventory-report", N);
export {
  N as default
};
//# sourceMappingURL=media-inventory-page-BN6G5ofG.js.map
