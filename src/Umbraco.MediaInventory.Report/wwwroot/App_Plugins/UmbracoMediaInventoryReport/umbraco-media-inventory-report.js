import { UMB_AUTH_CONTEXT as X } from "@umbraco-cms/backoffice/auth";
import { UmbElementMixin as ee } from "@umbraco-cms/backoffice/element-api";
const te = [
  {
    name: "Media Inventory Report Entrypoint",
    alias: "Umbraco.MediaInventory.Report.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => Promise.resolve().then(() => ve)
  },
  {
    type: "dashboard",
    alias: "Umbraco.MediaInventory.Report.MediaInventoryDashboard",
    name: "Media Inventory Dashboard",
    weight: 100,
    meta: {
      label: "Media Inventory",
      icon: "icon-picture",
      pathname: "media-inventory"
    },
    conditions: [{ alias: "Umb.Condition.SectionAlias", match: "Umb.Section.Media" }],
    element: () => Promise.resolve().then(() => Ue)
  }
], Be = [
  ...te
], H = {
  bodySerializer: (r) => JSON.stringify(r, (e, t) => typeof t == "bigint" ? t.toString() : t)
};
function re({
  onRequest: r,
  onSseError: e,
  onSseEvent: t,
  responseTransformer: i,
  responseValidator: n,
  sseDefaultRetryDelay: a,
  sseMaxRetryAttempts: o,
  sseMaxRetryDelay: l,
  sseSleepFn: d,
  url: s,
  ...c
}) {
  let p;
  const m = d ?? ((h) => new Promise((u) => setTimeout(u, h)));
  return { stream: async function* () {
    let h = a ?? 3e3, u = 0;
    const v = c.signal ?? new AbortController().signal;
    for (; !v.aborted; ) {
      u++;
      const T = c.headers instanceof Headers ? c.headers : new Headers(c.headers);
      p !== void 0 && T.set("Last-Event-ID", p);
      try {
        const k = {
          redirect: "follow",
          ...c,
          body: c.serializedBody,
          headers: T,
          signal: v
        };
        let $ = new Request(s, k);
        r && ($ = await r(s, k));
        const x = await (c.fetch ?? globalThis.fetch)($);
        if (!x.ok) throw new Error(`SSE failed: ${x.status} ${x.statusText}`);
        if (!x.body) throw new Error("No body in SSE response");
        const w = x.body.pipeThrough(new TextDecoderStream()).getReader();
        let y = "";
        const I = () => {
          try {
            w.cancel();
          } catch {
          }
        };
        v.addEventListener("abort", I);
        try {
          for (; ; ) {
            const { done: G, value: Z } = await w.read();
            if (G) break;
            y += Z, y = y.replace(/\r\n?/g, `
`);
            const L = y.split(`

`);
            y = L.pop() ?? "";
            for (const Q of L) {
              const K = Q.split(`
`), C = [];
              let R;
              for (const S of K)
                if (S.startsWith("data:"))
                  C.push(S.replace(/^data:\s*/, ""));
                else if (S.startsWith("event:"))
                  R = S.replace(/^event:\s*/, "");
                else if (S.startsWith("id:"))
                  p = S.replace(/^id:\s*/, "");
                else if (S.startsWith("retry:")) {
                  const O = Number.parseInt(S.replace(/^retry:\s*/, ""), 10);
                  Number.isNaN(O) || (h = O);
                }
              let q, U = !1;
              if (C.length) {
                const S = C.join(`
`);
                try {
                  q = JSON.parse(S), U = !0;
                } catch {
                  q = S;
                }
              }
              U && (n && await n(q), i && (q = await i(q))), t?.({
                data: q,
                event: R,
                id: p,
                retry: h
              }), C.length && (yield q);
            }
          }
        } finally {
          v.removeEventListener("abort", I), w.releaseLock();
        }
        break;
      } catch (k) {
        if (e?.(k), o !== void 0 && u >= o)
          break;
        const $ = Math.min(h * 2 ** (u - 1), l ?? 3e4);
        await m($);
      }
    }
  }() };
}
const ie = (r) => {
  switch (r) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, oe = (r) => {
  switch (r) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, ne = (r) => {
  switch (r) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, P = ({
  allowReserved: r,
  explode: e,
  name: t,
  style: i,
  value: n
}) => {
  if (!e) {
    const l = (r ? n : n.map((d) => encodeURIComponent(d))).join(oe(i));
    switch (i) {
      case "label":
        return `.${l}`;
      case "matrix":
        return `;${t}=${l}`;
      case "simple":
        return l;
      default:
        return `${t}=${l}`;
    }
  }
  const a = ie(i), o = n.map((l) => i === "label" || i === "simple" ? r ? l : encodeURIComponent(l) : M({
    allowReserved: r,
    name: t,
    value: l
  })).join(a);
  return i === "label" || i === "matrix" ? a + o : o;
}, M = ({
  allowReserved: r,
  name: e,
  value: t
}) => {
  if (t == null)
    return "";
  if (typeof t == "object")
    throw new Error(
      "Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these."
    );
  return `${e}=${r ? t : encodeURIComponent(t)}`;
}, _ = ({
  allowReserved: r,
  explode: e,
  name: t,
  style: i,
  value: n,
  valueOnly: a
}) => {
  if (n instanceof Date)
    return a ? n.toISOString() : `${t}=${n.toISOString()}`;
  if (i !== "deepObject" && !e) {
    let d = [];
    Object.entries(n).forEach(([c, p]) => {
      d = [...d, c, r ? p : encodeURIComponent(p)];
    });
    const s = d.join(",");
    switch (i) {
      case "form":
        return `${t}=${s}`;
      case "label":
        return `.${s}`;
      case "matrix":
        return `;${t}=${s}`;
      default:
        return s;
    }
  }
  const o = ne(i), l = Object.entries(n).map(
    ([d, s]) => M({
      allowReserved: r,
      name: i === "deepObject" ? `${t}[${d}]` : d,
      value: s
    })
  ).join(o);
  return i === "label" || i === "matrix" ? o + l : l;
}, ae = /\{[^{}]+\}/g, se = ({ path: r, url: e }) => {
  let t = e;
  const i = e.match(ae);
  if (i)
    for (const n of i) {
      let a = !1, o = n.substring(1, n.length - 1), l = "simple";
      o.endsWith("*") && (a = !0, o = o.substring(0, o.length - 1)), o.startsWith(".") ? (o = o.substring(1), l = "label") : o.startsWith(";") && (o = o.substring(1), l = "matrix");
      const d = r[o];
      if (d == null)
        continue;
      if (Array.isArray(d)) {
        t = t.replace(n, P({ explode: a, name: o, style: l, value: d }));
        continue;
      }
      if (typeof d == "object") {
        t = t.replace(
          n,
          _({
            explode: a,
            name: o,
            style: l,
            value: d,
            valueOnly: !0
          })
        );
        continue;
      }
      if (l === "matrix") {
        t = t.replace(
          n,
          `;${M({
            name: o,
            value: d
          })}`
        );
        continue;
      }
      const s = encodeURIComponent(
        l === "label" ? `.${d}` : d
      );
      t = t.replace(n, s);
    }
  return t;
}, le = ({
  baseUrl: r,
  path: e,
  query: t,
  querySerializer: i,
  url: n
}) => {
  const a = n.startsWith("/") ? n : `/${n}`;
  let o = (r ?? "") + a;
  e && (o = se({ path: e, url: o }));
  let l = t ? i(t) : "";
  return l.startsWith("?") && (l = l.substring(1)), l && (o += `?${l}`), o;
};
function N(r) {
  const e = r.body !== void 0;
  if (e && r.bodySerializer)
    return "serializedBody" in r ? r.serializedBody !== void 0 && r.serializedBody !== "" ? r.serializedBody : null : r.body !== "" ? r.body : null;
  if (e)
    return r.body;
}
const de = async (r, e) => {
  const t = typeof e == "function" ? await e(r) : e;
  if (t)
    return r.scheme === "bearer" ? `Bearer ${t}` : r.scheme === "basic" ? `Basic ${btoa(t)}` : t;
}, F = ({
  parameters: r = {},
  ...e
} = {}) => (i) => {
  const n = [];
  if (i && typeof i == "object")
    for (const a in i) {
      const o = i[a];
      if (o == null)
        continue;
      const l = r[a] || e;
      if (Array.isArray(o)) {
        const d = P({
          allowReserved: l.allowReserved,
          explode: !0,
          name: a,
          style: "form",
          value: o,
          ...l.array
        });
        d && n.push(d);
      } else if (typeof o == "object") {
        const d = _({
          allowReserved: l.allowReserved,
          explode: !0,
          name: a,
          style: "deepObject",
          value: o,
          ...l.object
        });
        d && n.push(d);
      } else {
        const d = M({
          allowReserved: l.allowReserved,
          name: a,
          value: o
        });
        d && n.push(d);
      }
    }
  return n.join("&");
}, ce = (r) => {
  if (!r)
    return "stream";
  const e = r.split(";")[0]?.trim();
  if (e) {
    if (e.startsWith("application/json") || e.endsWith("+json"))
      return "json";
    if (e === "multipart/form-data")
      return "formData";
    if (["application/", "audio/", "image/", "video/"].some((t) => e.startsWith(t)))
      return "blob";
    if (e.startsWith("text/"))
      return "text";
  }
}, pe = (r, e) => e ? !!(r.headers.has(e) || r.query?.[e] || r.headers.get("Cookie")?.includes(`${e}=`)) : !1;
async function he(r) {
  for (const e of r.security ?? []) {
    if (pe(r, e.name))
      continue;
    const t = await de(e, r.auth);
    if (!t)
      continue;
    const i = e.name ?? "Authorization";
    switch (e.in) {
      case "query":
        r.query || (r.query = {}), r.query[i] = t;
        break;
      case "cookie":
        r.headers.append("Cookie", `${i}=${t}`);
        break;
      default:
        r.headers.set(i, t);
        break;
    }
  }
}
const B = (r) => le({
  baseUrl: r.baseUrl,
  path: r.path,
  query: r.query,
  querySerializer: typeof r.querySerializer == "function" ? r.querySerializer : F(r.querySerializer),
  url: r.url
}), D = (r, e) => {
  const t = { ...r, ...e };
  return t.baseUrl?.endsWith("/") && (t.baseUrl = t.baseUrl.substring(0, t.baseUrl.length - 1)), t.headers = W(r.headers, e.headers), t;
}, fe = (r) => {
  const e = [];
  return r.forEach((t, i) => {
    e.push([i, t]);
  }), e;
}, W = (...r) => {
  const e = new Headers();
  for (const t of r) {
    if (!t)
      continue;
    const i = t instanceof Headers ? fe(t) : Object.entries(t);
    for (const [n, a] of i)
      if (a === null)
        e.delete(n);
      else if (Array.isArray(a))
        for (const o of a)
          e.append(n, o);
      else a !== void 0 && e.set(
        n,
        typeof a == "object" ? JSON.stringify(a) : a
      );
  }
  return e;
};
class A {
  constructor() {
    this.fns = [];
  }
  clear() {
    this.fns = [];
  }
  eject(e) {
    const t = this.getInterceptorIndex(e);
    this.fns[t] && (this.fns[t] = null);
  }
  exists(e) {
    const t = this.getInterceptorIndex(e);
    return !!this.fns[t];
  }
  getInterceptorIndex(e) {
    return typeof e == "number" ? this.fns[e] ? e : -1 : this.fns.indexOf(e);
  }
  update(e, t) {
    const i = this.getInterceptorIndex(e);
    return this.fns[i] ? (this.fns[i] = t, e) : !1;
  }
  use(e) {
    return this.fns.push(e), this.fns.length - 1;
  }
}
const ue = () => ({
  error: new A(),
  request: new A(),
  response: new A()
}), me = F({
  allowReserved: !1,
  array: {
    explode: !0,
    style: "form"
  },
  object: {
    explode: !0,
    style: "deepObject"
  }
}), ge = {
  "Content-Type": "application/json"
}, V = (r = {}) => ({
  ...H,
  headers: ge,
  parseAs: "auto",
  querySerializer: me,
  ...r
}), xe = (r = {}) => {
  let e = D(V(), r);
  const t = () => ({ ...e }), i = (c) => (e = D(e, c), t()), n = ue(), a = async (c) => {
    const p = {
      ...e,
      ...c,
      fetch: c.fetch ?? e.fetch ?? globalThis.fetch,
      headers: W(e.headers, c.headers),
      serializedBody: void 0
    };
    p.security && await he(p), p.requestValidator && await p.requestValidator(p), p.body !== void 0 && p.bodySerializer && (p.serializedBody = p.bodySerializer(p.body)), (p.body === void 0 || p.serializedBody === "") && p.headers.delete("Content-Type");
    const m = p, g = B(m);
    return { opts: m, url: g };
  }, o = async (c) => {
    const p = c.throwOnError ?? e.throwOnError, m = c.responseStyle ?? e.responseStyle;
    let g, f;
    try {
      const { opts: h, url: u } = await a(c), v = {
        redirect: "follow",
        ...h,
        body: N(h)
      };
      g = new Request(u, v);
      for (const x of n.request.fns)
        x && (g = await x(g, h));
      const T = h.fetch;
      f = await T(g);
      for (const x of n.response.fns)
        x && (f = await x(f, g, h));
      const k = {
        request: g,
        response: f
      };
      if (f.ok) {
        const x = (h.parseAs === "auto" ? ce(f.headers.get("Content-Type")) : h.parseAs) ?? "json";
        if (f.status === 204 || f.headers.get("Content-Length") === "0") {
          let y;
          switch (x) {
            case "arrayBuffer":
            case "blob":
            case "text":
              y = await f[x]();
              break;
            case "formData":
              y = new FormData();
              break;
            case "stream":
              y = f.body;
              break;
            default:
              y = {};
              break;
          }
          return h.responseStyle === "data" ? y : {
            data: y,
            ...k
          };
        }
        let w;
        switch (x) {
          case "arrayBuffer":
          case "blob":
          case "formData":
          case "text":
            w = await f[x]();
            break;
          case "json": {
            const y = await f.text();
            w = y ? JSON.parse(y) : {};
            break;
          }
          case "stream":
            return h.responseStyle === "data" ? f.body : {
              data: f.body,
              ...k
            };
        }
        return x === "json" && (h.responseValidator && await h.responseValidator(w), h.responseTransformer && (w = await h.responseTransformer(w))), h.responseStyle === "data" ? w : {
          data: w,
          ...k
        };
      }
      const $ = await f.text();
      let j;
      try {
        j = JSON.parse($);
      } catch {
      }
      throw j ?? $;
    } catch (h) {
      let u = h;
      for (const v of n.error.fns)
        v && (u = await v(u, f, g, c));
      if (u = u || {}, p)
        throw u;
      return m === "data" ? void 0 : {
        error: u,
        request: g,
        response: f
      };
    }
  }, l = (c) => (p) => o({ ...p, method: c }), d = (c) => async (p) => {
    const { opts: m, url: g } = await a(p);
    return re({
      ...m,
      body: m.body,
      method: c,
      onRequest: async (f, h) => {
        let u = new Request(f, h);
        for (const v of n.request.fns)
          v && (u = await v(u, m));
        return u;
      },
      serializedBody: N(m),
      url: g
    });
  };
  return {
    buildUrl: (c) => B({ ...e, ...c }),
    connect: l("CONNECT"),
    delete: l("DELETE"),
    get: l("GET"),
    getConfig: t,
    head: l("HEAD"),
    interceptors: n,
    options: l("OPTIONS"),
    patch: l("PATCH"),
    post: l("POST"),
    put: l("PUT"),
    request: o,
    setConfig: i,
    sse: {
      connect: d("CONNECT"),
      delete: d("DELETE"),
      get: d("GET"),
      head: d("HEAD"),
      options: d("OPTIONS"),
      patch: d("PATCH"),
      post: d("POST"),
      put: d("PUT"),
      trace: d("TRACE")
    },
    trace: l("TRACE")
  };
}, z = xe(V({ baseUrl: "https://localhost:5000/" })), be = async (r, e) => {
  (await r.getContext(X))?.configureClient(z);
}, ye = (r, e) => {
}, ve = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  onInit: be,
  onUnload: ye
}, Symbol.toStringTag, { value: "Module" })), E = "/umbraco/umbracomediainventoryreport/api/v1/media-inventory", b = (r) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${{ refresh: '<path d="M20 11a8 8 0 0 0-15-3L3 10m0-6v6h6M4 13a8 8 0 0 0 15 3l2-2m0 6v-6h-6"/>', download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19v2h16v-2"/>', search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>', chevron: '<path d="m9 18 6-6-6-6"/>', trash: '<path d="M4 7h16M10 11v6m4-6v6M9 7l1-3h4l1 3m-9 0 1 14h10l1-14"/>', link: '<path d="M10 13a5 5 0 0 0 7 .1l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7-.1l-2 2A5 5 0 0 0 12 20l1-1"/>', media: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 18 5.5-5 3.5 3 2.5-2 4.5 4"/>', check: '<path d="m5 12 4 4L19 6"/>', warning: '<path d="M12 3 3 19h18L12 3Zm0 6v4m0 3h.01"/>' }[r]}</svg>`, we = (r) => r.querySelectorAll("[data-trash]").forEach((e) => {
  e.closest("tr")?.querySelector(".pill.use") && e.remove();
}), Se = (r) => {
  const e = r.querySelector(".search .i");
  e && (e.style.cssText = "position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#6c7d82;pointer-events:none");
}, ke = (r, e) => {
  let t = r.querySelector("#media-insights");
  t || (t = document.createElement("section"), t.id = "media-insights", r.querySelector(".filters")?.before(t));
  const i = Math.max(1, e.typeCounts.reduce((s, c) => s + c.count, 0)), n = ["#007c72", "#635bff", "#ed8b37", "#d9577a", "#3b82c4"];
  let a = 0;
  const o = e.typeCounts.map((s, c) => {
    const p = a + s.count / i * 100, m = `${n[c % n.length]} ${a}% ${p}%`;
    return a = p, m;
  }).join(","), l = e.inUseTotal + e.unusedTotal || 1, d = Math.round(e.inUseTotal / l * 100);
  t.innerHTML = `<div style="display:flex;align-items:baseline;justify-content:space-between;margin:20px 0 10px"><div><p style="margin:0;color:#007c72;font-size:11px;font-weight:800;letter-spacing:.1em">MEDIA HEALTH</p><h3 style="margin:3px 0 0;font-size:18px;color:#263a42">Library at a glance</h3></div><span style="color:#718188;font-size:12px">Matches your active filters</span></div><div style="display:grid;grid-template-columns:repeat(3,minmax(130px,1fr)) minmax(300px,2fr);gap:12px"><div style="padding:16px;border:1px solid #dce8e7;border-radius:12px;background:#fff"><span style="color:#718188;font-size:11px;font-weight:700;letter-spacing:.06em">MEDIA ITEMS</span><strong style="display:block;margin-top:7px;color:#263a42;font-size:26px">${i.toLocaleString()}</strong></div><div style="padding:16px;border:1px solid #c8e8d8;border-radius:12px;background:#f3fbf7"><span style="color:#28734c;font-size:11px;font-weight:700;letter-spacing:.06em">IN USE</span><strong style="display:block;margin-top:7px;color:#176a43;font-size:26px">${e.inUseTotal.toLocaleString()}</strong></div><div style="padding:16px;border:1px solid #f0d8b6;border-radius:12px;background:#fff9ef"><span style="color:#9a681a;font-size:11px;font-weight:700;letter-spacing:.06em">UNUSED</span><strong style="display:block;margin-top:7px;color:#8b5c15;font-size:26px">${e.unusedTotal.toLocaleString()}</strong></div><div style="display:flex;align-items:center;gap:16px;padding:14px 18px;border:1px solid #dce8e7;border-radius:12px;background:#fff"><div style="flex:0 0 76px;width:76px;height:76px;border-radius:50%;background:conic-gradient(${o || "#e5eeee 0 100%"});position:relative"><span style="position:absolute;inset:11px;display:grid;place-items:center;border-radius:50%;background:#fff;color:#52666c;font-size:11px;font-weight:700">Types</span></div><div style="min-width:0;flex:1"><strong style="font-size:13px;color:#30464c">Media by type</strong><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${e.typeCounts.map((s, c) => `<span style="display:inline-flex;align-items:center;gap:4px;color:#5d7076;font-size:11px"><i style="display:block;width:8px;height:8px;border-radius:50%;background:${n[c % n.length]}"></i>${s.type} ${s.count}</span>`).join("")}</div><div style="margin-top:11px;height:7px;overflow:hidden;border-radius:99px;background:#edf2f1"><span style="display:block;width:${d}%;height:100%;border-radius:inherit;background:#007c72"></span></div><span style="display:block;margin-top:5px;color:#60737a;font-size:11px">${d}% of media is in use</span></div></div></div>`, t.style.cssText = "max-width:100%;overflow:auto";
}, $e = (r) => {
  if (!r.querySelector("#media-health-polish")) {
    const o = document.createElement("style");
    o.id = "media-health-polish", o.textContent = "#media-insights{position:relative}#media-insights>div:first-child h3{font-size:24px!important;letter-spacing:-.035em}#media-insights>div:first-child p{font-size:11px!important}#media-insights>div:nth-child(2)>div{transition:transform .18s ease,box-shadow .18s ease;background:linear-gradient(135deg,#fff,#fbfdff)!important}#media-insights>div:nth-child(2)>div:not(:last-child):hover{transform:translateY(-2px);box-shadow:0 10px 24px rgb(20 55 72 / 12%)!important}#media-insights strong{letter-spacing:-.035em}#media-insights .insight-icon{box-shadow:inset 0 1px 0 rgb(255 255 255 / 85%),0 4px 10px rgb(30 80 120 / 8%)}#media-insights .insight-chevron{transition:transform .18s ease}#media-insights>div:nth-child(2)>div:not(:last-child):hover .insight-chevron{transform:translate(3px,-50%)}#media-insights>div:nth-child(2)>div:last-child{background:linear-gradient(110deg,#fff,#fcfefe)!important;box-shadow:0 7px 22px rgb(20 55 72 / 7%)!important}#media-insights>div:nth-child(2)>div:last-child>div:first-child{box-shadow:0 7px 18px rgb(0 124 114 / 10%)}@media(prefers-reduced-motion:reduce){#media-insights>div:nth-child(2)>div,#media-insights .insight-chevron{transition:none!important}}", r.append(o);
  }
  if (!r.querySelector("#inventory-action-polish")) {
    const o = document.createElement("style");
    o.id = "inventory-action-polish", o.textContent = ".hero .actions button{transition:transform .18s ease,box-shadow .18s ease,background .18s ease,border-color .18s ease}.hero .actions button:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 18px rgb(20 55 72 / 16%)}.hero .actions .primary:hover:not(:disabled){box-shadow:0 9px 20px rgb(0 124 114 / 28%)}.hero .actions button:active:not(:disabled){transform:translateY(0);box-shadow:0 3px 8px rgb(20 55 72 / 12%)}@media(prefers-reduced-motion:reduce){.hero .actions button{transition:none!important}.hero .actions button:hover:not(:disabled){transform:none!important}}", r.append(o);
  }
  if (!r.querySelector("#inventory-action-accessibility")) {
    const o = document.createElement("style");
    o.id = "inventory-action-accessibility", o.textContent = ".hero .actions{position:relative;z-index:2}.hero .actions button{position:relative;z-index:1}.hero .actions button:hover:not(:disabled){transform:none!important}.hero .actions button:focus-visible{outline:3px solid #78b8ff;outline-offset:3px;z-index:3}", r.append(o);
  }
  if (!r.querySelector("#inventory-primary-hover-colour")) {
    const o = document.createElement("style");
    o.id = "inventory-primary-hover-colour", o.textContent = ".hero .actions button.primary:hover:not(:disabled),.hero .actions button.primary:focus-visible{color:#fff!important}", r.append(o);
  }
  const e = r.querySelector("#media-insights"), t = e?.querySelector(":scope > div:nth-child(2)");
  if (!e || !t) return;
  const i = [...t.children].slice(0, 4), n = ["media", "check", "warning", "media"];
  i.forEach((o, l) => {
    o.style.cssText += ";position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:4px;padding:15px 22px 15px 84px;min-height:96px", l === 3 && o.querySelector("span[style*='position:absolute']")?.remove();
    const d = o.querySelector(".insight-icon");
    if (d)
      d.style.cssText += ";left:16px;right:auto;top:50%;transform:translateY(-50%);width:48px;height:48px;border-radius:50%";
    else {
      const s = document.createElement("span");
      s.className = "insight-icon", s.innerHTML = b(n[l]), s.style.cssText = `position:absolute;left:16px;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:${l === 0 ? "#e8f3ff" : l === 1 ? "#dff6ed" : l === 2 ? "#fff0d8" : "#e8f0ff"};color:${l === 0 ? "#2475c5" : l === 1 ? "#009476" : l === 2 ? "#b66b04" : "#2464d7"}`, o.append(s);
    }
    if (l === 3) {
      const s = o.querySelector(".insight-icon");
      s && (s.innerHTML = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"/></svg>');
    }
    o.querySelector(".insight-chevron")?.remove();
  });
  const a = t.lastElementChild;
  if (a) {
    a.style.cssText += ";display:flex;align-items:center;gap:34px;padding:22px 32px";
    const o = a.querySelector("div"), l = i[0]?.querySelector("strong")?.textContent?.trim() || "0", d = o?.querySelector("span");
    d && (d.innerHTML = `<strong style="font-size:17px;color:#17325b">${l}</strong><small style="display:block;margin-top:1px;font-size:9px;font-weight:700;color:#647895;text-transform:uppercase;letter-spacing:.06em">items</small>`), o && (o.style.cssText += ";flex:0 0 114px;width:114px;height:114px;box-shadow:0 8px 20px rgb(23 72 110 / 12%)");
    const c = o?.nextElementSibling?.querySelector("strong");
    c && (c.textContent = "Media by type", c.style.cssText += ";font-size:18px;color:#17325b");
    const p = c?.nextElementSibling;
    p && (p.style.cssText += ";display:flex;gap:9px;flex-wrap:wrap;margin-top:10px", p.querySelectorAll("span").forEach((f) => {
      f.style.cssText += ";padding:5px 8px;border:1px solid #e5edf4;border-radius:999px;background:#fbfdff;font-size:11px;font-weight:600";
    }));
    const m = p?.nextElementSibling;
    if (m && o) {
      const f = o.style.background.replace("conic-gradient(", "linear-gradient(90deg,");
      m.style.cssText = `position:relative;margin-top:14px;height:10px;overflow:hidden;border-radius:99px;background:${f};box-shadow:inset 0 1px 2px rgb(11 42 74 / 12%),0 2px 5px rgb(34 77 123 / 9%)`;
      const h = m.firstElementChild;
      h && (h.style.display = "none");
      const u = document.createElement("span");
      u.style.cssText = "position:absolute;inset:0;background:linear-gradient(180deg,rgb(255 255 255 / 28%),transparent 55%);pointer-events:none", m.append(u);
    }
    const g = m?.nextElementSibling;
    if (g) {
      g.style.cssText += ";margin-top:8px;color:#637b99;font-size:12px;font-weight:600";
      const f = p?.children.length ?? 0;
      g.textContent = `${g.textContent} · ${f} media types`;
    }
  }
}, qe = (r) => {
  $e(r);
  const e = r.querySelector("#media-insights");
  e && (e.style.marginBottom = "24px");
}, ze = (r) => {
  const e = r.querySelectorAll("#media-insights div[style*='grid-template-columns'] > div");
  ["media", "check", "warning"].forEach((t, i) => {
    const n = e[i];
    if (!n || n.querySelector(".insight-icon")) return;
    n.style.position = "relative";
    const a = document.createElement("span");
    a.className = "insight-icon", a.innerHTML = b(t), a.style.cssText = `position:absolute;right:14px;top:14px;display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:${i === 0 ? "#e7f4f2" : i === 1 ? "#dff3e7" : "#fff0d8"};color:${i === 0 ? "#007c72" : i === 1 ? "#217147" : "#a46c15"}`, n.append(a);
  });
}, Y = (r) => r < 1024 ? `${r} B` : r < 1048576 ? `${(r / 1024).toFixed(1)} KB` : r < 1073741824 ? `${(r / 1048576).toFixed(1)} MB` : `${(r / 1073741824).toFixed(2)} GB`, Ee = (r, e) => {
  const t = r.querySelector(".table-wrap table");
  if (!t || t.querySelector("th.size-heading")) return;
  const i = document.createElement("th");
  i.className = "size-heading", i.textContent = "File size", t.querySelector("thead tr")?.children[3].after(i), t.querySelectorAll("tbody > tr").forEach((n, a) => {
    if (!n.querySelector(".url")) return;
    const o = document.createElement("td");
    o.style.cssText = "color:#60737a;font-variant-numeric:tabular-nums;white-space:nowrap", o.textContent = Y(e.items[a]?.fileSizeBytes ?? 0), n.querySelector(".url")?.after(o);
  }), r.querySelectorAll(".refs").forEach((n) => n.colSpan = 7);
}, Te = (r, e) => {
  const t = r.querySelector(".table-wrap table"), i = t?.querySelector("th.size-heading");
  if (!t || !i || t.querySelector("th.uploaded-heading")) return;
  const n = document.createElement("th");
  n.className = "uploaded-heading", n.textContent = "Uploaded", i.after(n);
  let a = 0;
  t.querySelectorAll("tbody > tr").forEach((o) => {
    const l = o.querySelector(".url");
    if (!l) return;
    const d = document.createElement("td"), s = e.items[a++]?.createdDate;
    d.style.cssText = "color:#60737a;white-space:nowrap;font-variant-numeric:tabular-nums", d.textContent = s ? new Intl.DateTimeFormat(void 0, { day: "2-digit", month: "short", year: "numeric" }).format(new Date(s)) : "—", l.nextElementSibling?.after(d);
  }), r.querySelectorAll(".refs").forEach((o) => o.colSpan = 8);
}, Ce = (r, e) => {
  const t = r.querySelector("#media-insights div[style*='grid-template-columns']");
  if (!t || t.querySelector(".storage-card")) return;
  t.style.setProperty("grid-template-columns", "repeat(4,minmax(130px,1fr))", "important");
  const i = document.createElement("div");
  i.className = "storage-card", i.style.cssText = "position:relative;padding:16px;border:1px solid #cbdcf5;border-radius:12px;background:#f4f8ff;box-shadow:0 3px 12px rgb(23 55 63 / 5%)", i.innerHTML = `<span style="color:#416eac;font-size:11px;font-weight:700;letter-spacing:.06em">LIBRARY STORAGE</span><strong style="display:block;margin-top:7px;color:#295a9b;font-size:26px">${Y(e.totalFileSizeBytes)}</strong><span style="position:absolute;right:14px;top:14px;display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:#dceaff;color:#356eae">${b("media")}</span>`, t.insertBefore(i, t.lastElementChild);
  const n = t.lastElementChild;
  n && (n.style.gridColumn = "span 2");
}, Me = (r) => {
  if (r.querySelector("#inventory-modern-theme")) return;
  const e = document.createElement("style");
  e.id = "inventory-modern-theme", e.textContent = ":host{background:#f6f8f9}.inventory{padding:32px 28px 44px!important}.hero{border:0!important;border-radius:18px!important;box-shadow:0 10px 30px rgb(24 67 65 / 9%)!important}.filters,.table-wrap{border:0!important;border-radius:14px!important;box-shadow:0 5px 20px rgb(23 55 63 / 7%)!important}.filters{overflow:hidden}.filters>div:first-child{padding:18px 20px 0!important}.toolbar{padding:16px 20px 20px!important;background:linear-gradient(180deg,#fff,#fbfdfd)}.toolbar label{color:#5c7076!important}.toolbar select,.search input{border-color:#d8e3e5!important;background:#fff!important;box-shadow:0 1px 2px rgb(23 55 63 / 3%)}.toolbar select:hover,.search input:hover{border-color:#90bdb8!important}.status{box-shadow:0 2px 5px rgb(25 108 69 / 7%)}#media-insights>div:first-child{margin-top:26px!important}#media-insights>div:nth-child(2){grid-template-columns:repeat(3,minmax(145px,1fr)) minmax(330px,2fr)!important}#media-insights>div:nth-child(2)>div{box-shadow:0 3px 12px rgb(23 55 63 / 5%)}.content{margin-top:20px!important}.summary{padding-left:2px}.table-wrap table th{background:#f1f6f6!important}.table-wrap table td{padding-top:15px!important;padding-bottom:15px!important}.table-wrap tbody tr:hover{background:#f2faf8!important}.pager{padding:16px 3px!important}.pager button,.pager select{box-shadow:0 1px 2px rgb(23 55 63 / 4%)}@media(max-width:1050px){#media-insights>div:nth-child(2){grid-template-columns:repeat(3,1fr)!important}#media-insights>div:nth-child(2)>div:last-child{grid-column:1/-1}}@media(max-width:700px){.inventory{padding:18px 14px 32px!important}.hero{padding:20px!important}.hero-icon{width:46px!important;height:46px!important}.intro h2{font-size:24px!important}#media-insights>div:first-child{align-items:flex-start!important;gap:8px;flex-direction:column}#media-insights>div:nth-child(2){grid-template-columns:1fr!important}#media-insights>div:nth-child(2)>div:last-child{grid-column:auto}.filters>div:first-child{padding-left:16px!important}.toolbar{padding:14px 16px 18px!important}.hero-actions{width:100%}.actions button{min-height:42px}}", r.append(e);
}, je = (r) => {
  const e = r.querySelector("#status"), t = r.querySelector(".hero .actions");
  !e || !t || (t.append(e), e.style.cssText = "width:100%;justify-content:center;margin:2px 0 0;white-space:nowrap");
}, Ae = (r) => {
  if (r.querySelector("#inventory-screenshot-theme")) return;
  const e = document.createElement("style");
  e.id = "inventory-screenshot-theme", e.textContent = ":host{background:radial-gradient(circle at 55% 0,#f1fbfb 0,#f7f9fc 36%,#f4f7fb 100%)}.inventory{max-width:1480px!important}.hero{min-height:110px!important;padding:20px 28px!important;background:linear-gradient(105deg,#fff 0%,#fbfefe 65%,#f1fbfa 100%)!important}.hero-icon{border-radius:15px!important}.intro h2{font-size:27px!important}.actions{max-width:405px!important;justify-content:flex-end}.status{font-size:12px!important;background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important}.status .i{color:#009b86!important}#media-insights{margin-top:24px!important}#media-insights>div:first-child{margin:0 0 10px!important}#media-insights>div:nth-child(2){display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:16px!important}#media-insights>div:nth-child(2)>div{min-height:93px!important;border-radius:10px!important;box-shadow:0 4px 14px rgb(20 55 72 / 6%)!important}#media-insights>div:nth-child(2)>div:nth-child(1){border-color:#d7e2ec!important}#media-insights>div:nth-child(2)>div:nth-child(2){border-color:#18ab8d!important}#media-insights>div:nth-child(2)>div:nth-child(3){border-color:#f0b644!important}#media-insights>div:nth-child(2)>div:nth-child(4){border-color:#a8c8ff!important}#media-insights>div:nth-child(2)>div:last-child{grid-column:1 / -1!important;min-height:148px!important;margin-top:4px!important;padding:22px 32px!important}.filters{border:1px solid #e2eaf2!important;border-radius:11px!important}.filters>div:first-child{padding-top:16px!important}.filters h3{font-size:21px!important;color:#142b52!important}.filters-head{display:flex;align-items:center;justify-content:space-between;gap:16px}.reset-filters{min-height:auto;padding:5px 0;border:0;background:transparent;color:#008b7c;font-size:12px}.toolbar{gap:16px!important;padding-top:14px!important}.toolbar label{font-size:10px!important;color:#55708e!important}.toolbar select,.search input{height:40px!important;border-color:#cbdbea!important;border-radius:7px!important}.search{min-width:330px!important}.type-summary{border-top:1px solid #edf2f7!important;padding-top:12px!important}.type-summary button{border-radius:99px!important}.table-wrap{border:1px solid #e0eaf3!important;border-radius:10px!important}.table-wrap table th{background:#eef5fb!important;color:#1c365a!important}.table-wrap table td{border-color:#e4edf5!important}.name{color:#19335b!important}.pill{border-radius:99px!important}.url a{font-weight:600!important}.pager{color:#536b85!important}@media(max-width:920px){#media-insights>div:nth-child(2){grid-template-columns:repeat(2,minmax(0,1fr))!important}.search{min-width:260px!important}}@media(max-width:620px){#media-insights>div:nth-child(2){grid-template-columns:1fr!important}.hero{padding:18px!important}.actions{max-width:none!important}.search{min-width:100%!important}}", r.append(e);
}, Ie = (r) => {
  const t = r.querySelector("#media-insights>div:nth-child(2)")?.lastElementChild;
  t && (t.style.gridColumn = "1 / -1");
}, Le = (r) => {
  const e = r.querySelector(".table-wrap table");
  if (!e || e.querySelector("th.url-heading-removed")) return;
  const t = [...e.querySelectorAll("thead th")].find((i) => i.textContent?.trim() === "URL");
  t && (t.classList.add("url-heading-removed"), t.remove()), e.querySelectorAll("tbody > tr").forEach((i) => {
    const n = i.querySelector(".name"), a = i.querySelector(".url"), o = a?.querySelector("a");
    if (!n || !a || !o) return;
    const l = o.href, d = n.textContent ?? "media item";
    n.innerHTML = "";
    const s = document.createElement("a");
    s.href = l, s.target = "_blank", s.rel = "noopener", s.textContent = d, s.style.cssText = "display:block;color:#19335b;font-weight:700;text-decoration:none";
    const c = document.createElement("span");
    c.textContent = o.textContent ?? l, c.style.cssText = "display:block;max-width:260px;margin-top:4px;overflow:hidden;color:#71859b;font-size:11px;font-weight:400;text-overflow:ellipsis;white-space:nowrap", n.append(s, c), a.remove();
  }), r.querySelectorAll(".refs").forEach((i) => i.colSpan = 7);
}, Re = (r) => {
  const e = r.querySelector("#sort");
  !e || e.querySelector("option[value='createdDate:desc']") || e.insertAdjacentHTML("beforeend", '<option value="createdDate:desc">Newest uploads</option><option value="createdDate:asc">Oldest uploads</option>');
};
class J extends ee(HTMLElement) {
  constructor() {
    super(...arguments), this.page = 1, this.size = 50, this.search = "", this.type = "", this.refs = "", this.sort = "name", this.direction = "asc";
  }
  connectedCallback() {
    this.innerHTML = `<style>${this.css()}</style><section class="inventory" aria-busy="true"><header class="hero"><div class="hero-icon">${b("media")}</div><div class="intro"><small>MEDIA MANAGEMENT</small><h2>Media inventory</h2><p>Explore your library, see where files are used and keep things tidy.</p></div><div class="actions"><button id="export" class="quiet">${b("download")} Export CSV</button><button id="refresh" class="primary">${b("refresh")} Refresh inventory</button></div></header><div id="status" class="status" role="status">${b("refresh")} Loading media inventory…</div><div class="filters"><div><h3>Find media</h3><span>Filter the inventory</span></div><div class="toolbar"><label class="search">${b("search")}<input id="search" type="search" placeholder="Search by name or ID" aria-label="Search by name or ID"></label><label>Media type<select id="type"><option value="">All media types</option><option>Image</option><option>File</option><option>Folder</option><option>Video</option><option>Audio</option></select></label><label>References<select id="refs"><option value="">All items</option><option value="true">In use</option><option value="false">Not in use</option></select></label><label>Sort by<select id="sort"><option value="name:asc">Name, A–Z</option><option value="name:desc">Name, Z–A</option><option value="type:asc">Type</option><option value="references:desc">Most references</option><option value="references:asc">Fewest references</option></select></label></div><div id="type-summary" class="type-summary" aria-live="polite"></div></div><main id="content" class="content"><p class="loading">${b("refresh")} Loading inventory…</p></main></section>`, this.bind(), this.load();
  }
  css() {
    return ":host{display:block;color:#263a42;font-family:var(--uui-font-family,inherit)}*{box-sizing:border-box}.inventory{max-width:1520px;margin:auto;padding:24px}.hero{display:flex;align-items:center;gap:18px;padding:26px 30px;border:1px solid #d7ebe7;border-radius:16px;background:linear-gradient(120deg,#fff,#edf9f7);box-shadow:0 5px 18px #17434212}.hero-icon{display:grid;place-items:center;width:54px;height:54px;border-radius:14px;background:#007c72;color:white;box-shadow:0 5px 12px #007c723d}.hero-icon .i{width:29px;height:29px}.intro small{color:#007c72;font-size:11px;font-weight:800;letter-spacing:.1em}.intro h2{margin:3px 0 0;font-size:28px;letter-spacing:-.035em}.intro p{margin:6px 0 0;color:#5d6d74;font-size:14px}.actions{display:flex;gap:9px;margin-left:auto;flex-wrap:wrap}button{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:38px;padding:0 13px;border:1px solid #bdcccf;border-radius:7px;background:#fff;color:#30434a;font:600 13px inherit;cursor:pointer;transition:.16s}.primary{background:#007c72;border-color:#007c72;color:#fff}.primary:hover{background:#006b63}.quiet:hover,button:not(:disabled):hover{border-color:#007c72;color:#007c72}.primary:hover{color:#fff}button:disabled{opacity:.45;cursor:not-allowed}.i{width:17px;height:17px;flex:none}.status{display:inline-flex;align-items:center;gap:7px;margin:17px 0;padding:8px 12px;border:1px solid #c5e6d5;border-radius:999px;background:#effaf4;color:#196c45;font-size:12px;font-weight:600}.filters,.table-wrap{border:1px solid #e0e8ea;border-radius:12px;background:#fff;box-shadow:0 3px 12px #17373f0c}.filters>div:first-child{display:flex;align-items:baseline;gap:9px;padding:15px 18px 0}.filters h3{margin:0;font-size:15px}.filters span{color:#74848a;font-size:12px}.toolbar{display:flex;align-items:end;gap:12px;flex-wrap:wrap;padding:14px 18px 18px}.toolbar label{display:grid;gap:5px;color:#53656d;font-size:11px;font-weight:700;letter-spacing:.025em;text-transform:uppercase}.toolbar select,.search input{height:38px;border:1px solid #cbd8db;border-radius:7px;background:#fff;color:#24373e;font:400 13px inherit}.toolbar select{min-width:142px;padding:0 10px}.search{position:relative;min-width:280px}.search .i{position:absolute;top:29px;left:11px;color:#6c7d82}.search input{width:100%;padding:0 10px 0 34px}.content{margin-top:16px}.summary{margin:0 0 9px;color:#64757c;font-size:13px}.summary strong{color:#273c44}.table-wrap{overflow:auto}table{width:100%;min-width:770px;border-collapse:collapse}th{padding:12px 14px;background:#f5f8f8;color:#66787e;font-size:10px;font-weight:800;letter-spacing:.085em;text-align:left;text-transform:uppercase}td{padding:13px 14px;border-top:1px solid #edf1f2;font-size:13px;vertical-align:middle}tbody tr:hover{background:#f6fbfa}.expand,.icon-button{display:grid;place-items:center;width:30px;height:30px;padding:0;border:0;border-radius:6px;background:transparent;color:#547077;cursor:pointer}.expand:hover,.icon-button:hover{background:#e7f4f2;color:#007c72}.expand.open .i{transform:rotate(90deg)}.name{font-weight:700}.pill{display:inline-flex;align-items:center;gap:5px;padding:5px 9px;border-radius:999px;background:#eef3f4;color:#536c73;font-size:11px;font-weight:700;white-space:nowrap}.pill.use{background:#edf8f2;color:#237147}.pill.empty{background:#f4f5f5;color:#78868a}.pill .i{width:13px;height:13px}.url{max-width:340px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.url a,.reference-list a{color:#007c72;text-decoration:none}.url a:hover,.reference-list a:hover{text-decoration:underline}.actions-cell{width:58px;text-align:center}.danger:hover{background:#fff0ef;color:#b23732}.refs{padding:0 18px 16px 54px!important;background:#f6fbfa}.reference-list{padding:13px 15px;border-left:3px solid #74c8be;background:#fff;border-radius:0 8px 8px 0;color:#52656d}.reference-list p{margin:0;padding:7px 0;border-bottom:1px solid #edf1f1;font-size:12px}.reference-list p:last-child{border:0}.pager{display:flex;align-items:center;justify-content:flex-end;gap:10px;padding:13px 2px;color:#61737a;font-size:12px}.pager select,.pager button{height:33px;padding:0 10px;border:1px solid #cbd8db;border-radius:6px;background:#fff;color:#30434a;font:600 12px inherit}.empty,.loading,.error{display:flex;align-items:center;gap:9px;margin:0;padding:28px;border:1px dashed #ccd9dc;border-radius:12px;background:#fff;color:#62767c}.error{border-style:solid;border-color:#f0c4c0;background:#fff6f5;color:#a33a32}@media(max-width:720px){.inventory{padding:16px}.hero{align-items:flex-start;flex-wrap:wrap;padding:20px}.actions{width:100%;margin:0}.actions button{flex:1}.toolbar label,.search{width:100%}.search input,.toolbar select{width:100%}.pager{justify-content:center;flex-wrap:wrap}.refs{padding-left:18px!important}}";
  }
  q(e) {
    return this.querySelector(e);
  }
  bind() {
    Me(this), Ae(this), je(this), Se(this), Re(this);
    const e = this.q("#search"), t = () => {
      this.search = e.value.trim(), this.page = 1, this.load();
    };
    e.oninput = t, e.addEventListener("search", t), this.q("#type").onchange = (i) => {
      this.type = i.target.value, this.page = 1, this.load();
    }, this.q("#refs").onchange = (i) => {
      this.refs = i.target.value, this.page = 1, this.load();
    }, this.q("#sort").onchange = (i) => {
      [this.sort, this.direction] = i.target.value.split(":"), this.page = 1, this.load();
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
      const t = await z.get({ url: `${E}?${e}`, security: [{ scheme: "bearer", type: "http" }] });
      if (!t.response?.ok || !t.data) throw Error();
      const i = t.data;
      ke(this, i), ze(this), Ce(this, i), Ie(this), qe(this), this.show(i), Ee(this, i), Te(this, i), Le(this), we(this), this.renderTypeSummary(i), i.cache.status === "refreshing" && !this.refreshTimer && this.pollRefreshStatus();
    } catch {
      this.q("#content").innerHTML = `<p class="error">${b("warning")} Unable to load the media inventory.</p>`;
    } finally {
      this.q("section").setAttribute("aria-busy", "false");
    }
  }
  show(e) {
    const t = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]), i = e.total ? (e.page - 1) * e.pageSize + 1 : 0, n = Math.min(e.page * e.pageSize, e.total), a = e.cache.status === "valid";
    this.q("#status").innerHTML = `${b(a ? "check" : "warning")} ${a ? "Up to date" : "Refresh required"} · Last generated ${new Date(e.cache.generatedAt).toLocaleString()}`, this.q("#content").innerHTML = e.items.length ? `<p class="summary">Showing <strong>${i.toLocaleString()}–${n.toLocaleString()}</strong> of <strong>${e.total.toLocaleString()}</strong> media items</p><div class="table-wrap"><table><thead><tr><th></th><th>Name</th><th>Type</th><th>URL</th><th>References</th><th>Actions</th></tr></thead><tbody>${e.items.map((s) => `<tr><td><button class="expand ${this.expanded === s.id ? "open" : ""}" data-expand="${s.id}" aria-label="Show references for ${t(s.name)}">${b("chevron")}</button></td><td class="name">${t(s.name)}</td><td><span class="pill">${t(s.type)}</span></td><td class="url"><a href="${t(s.url)}" target="_blank" rel="noopener">${t(s.url)}</a></td><td><span class="pill ${s.hasReferences ? "use" : "empty"}">${b(s.hasReferences ? "link" : "media")}${s.hasReferences ? `${s.referenceCount} in use` : "Not in use"}</span></td><td class="actions-cell"><button class="icon-button danger" data-trash="${s.id}" data-name="${t(s.name)}" title="Move to trash" aria-label="Move ${t(s.name)} to trash">${b("trash")}</button></td></tr>${this.expanded === s.id ? `<tr><td colspan="6" class="refs" id="refs-${s.id}"><div class="reference-list">Loading references…</div></td></tr>` : ""}`).join("")}</tbody></table></div><div class="pager"><button id="prev" ${this.page === 1 ? "disabled" : ""}>Previous</button><span>Page ${this.page}</span><button id="next" ${n >= e.total ? "disabled" : ""}>Next</button><label>Rows <select id="size">${[25, 50, 100, 250].map((s) => `<option ${s === this.size ? "selected" : ""}>${s}</option>`).join("")}</select></label></div>` : `<p class="empty">${b("media")} No media items match the selected filters.</p>`, this.querySelectorAll("[data-expand]").forEach((s) => s.onclick = () => {
      this.toggle(Number(s.dataset.expand));
    }), this.querySelectorAll("[data-trash]").forEach((s) => s.onclick = () => {
      this.trash(Number(s.dataset.trash), s.dataset.name || "media item");
    });
    const o = this.querySelector("#prev"), l = this.querySelector("#next"), d = this.querySelector("#size");
    o && (o.onclick = () => {
      --this.page, this.load();
    }), l && (l.onclick = () => {
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
      const i = await z.get({ url: `${E}/${e}/references`, security: [{ scheme: "bearer", type: "http" }] });
      if (!i.response?.ok) throw Error();
      const n = i.data ?? [];
      t && (t.innerHTML = n.length ? n.map((a) => `<p><strong>${a.name}</strong> · ${a.nodeType} · ${a.path} <a href="${a.url}">Open →</a></p>`).join("") : "No references found.");
    } catch {
      t && (t.textContent = "Unable to load references.");
    }
  }
  async refresh() {
    if (!confirm("Refresh Media Inventory in the background?")) return;
    if (!(await z.post({ url: `${E}/refresh`, security: [{ scheme: "bearer", type: "http" }] })).response?.ok) {
      alert("Unable to start the inventory refresh.");
      return;
    }
    this.q("#refresh").disabled = !0, this.pollRefreshStatus();
  }
  async pollRefreshStatus() {
    try {
      const e = await z.get({ url: `${E}/refresh/status`, security: [{ scheme: "bearer", type: "http" }] });
      if (!e.response?.ok || !e.data) throw Error();
      const t = e.data, i = t.total > 0 ? `Refreshing inventory · ${t.percentage}% · ${t.processed.toLocaleString()} / ${t.total.toLocaleString()} items` : t.message;
      if (this.q("#status").innerHTML = `${b(t.isRunning ? "refresh" : t.status === "completed" ? "check" : "warning")} ${t.isRunning ? i : t.message}`, t.isRunning) {
        this.refreshTimer = window.setTimeout(() => {
          this.pollRefreshStatus();
        }, 1e3);
        return;
      }
      this.q("#refresh").disabled = !1, await this.load();
    } catch {
      this.q("#status").innerHTML = `${b("warning")} Unable to retrieve refresh progress.`, this.q("#refresh").disabled = !1;
    }
  }
  async export() {
    const e = await z.post({ url: `${E}/export`, security: [{ scheme: "bearer", type: "http" }], headers: { "Content-Type": "application/json" }, bodySerializer: H.bodySerializer, body: { search: this.search, mediaType: this.type, hasReferences: this.refs === "" ? null : this.refs === "true", sortBy: this.sort, sortDirection: this.direction }, parseAs: "blob" });
    if (!e.response?.ok || !e.data) {
      alert("Unable to export the inventory.");
      return;
    }
    const t = document.createElement("a");
    t.href = URL.createObjectURL(e.data), t.download = "media-inventory.csv", t.click(), URL.revokeObjectURL(t.href);
  }
  async trash(e, t) {
    if (!confirm(`Move “${t}” to the recycle bin? This may affect references.`)) return;
    (await z.post({ url: `${E}/${e}/trash`, security: [{ scheme: "bearer", type: "http" }] })).response?.ok ? (alert(`“${t}” was moved to the recycle bin.`), this.load()) : alert("Unable to move media to the recycle bin.");
  }
  renderTypeSummary(e) {
    const t = this.q("#type-summary"), i = (a) => a.replace(/[&<>"']/g, (o) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[o]), n = e.typeCounts?.map((a) => `<button data-summary-type="${i(a.type)}" style="display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid ${this.type === a.type ? "#72beb6" : "#dbe8e7"};border-radius:8px;background:${this.type === a.type ? "#e9f7f4" : "#f7fbfa"};color:${this.type === a.type ? "#007c72" : "#466169"};font:600 12px inherit;cursor:pointer"><strong style="display:grid;place-items:center;min-width:22px;height:22px;padding:0 6px;border-radius:6px;background:${this.type === a.type ? "#007c72" : "#dff1ed"};color:${this.type === a.type ? "#fff" : "#007c72"};font-size:12px">${a.count}</strong>${i(a.type)}</button>`).join("") ?? "";
    t.innerHTML = n ? `<span style="align-self:center;margin-right:2px;color:#718188;font-size:11px;font-weight:700;letter-spacing:.06em">BY TYPE</span>${n}` : "", t.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;padding:0 18px 18px", this.querySelectorAll("[data-summary-type]").forEach((a) => a.onclick = () => {
      this.type = a.dataset.summaryType || "", this.q("#type").value = this.type, this.page = 1, this.load();
    });
  }
}
customElements.get("media-inventory-report") || customElements.define("media-inventory-report", J);
const Ue = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: J
}, Symbol.toStringTag, { value: "Module" }));
export {
  Be as manifests
};
//# sourceMappingURL=umbraco-media-inventory-report.js.map
