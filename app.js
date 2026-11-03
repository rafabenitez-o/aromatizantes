// ---- Datos (editá acá para agregar blends, esencias o cambiar fórmulas) ----
var PRODUCTS = {
  "Difusor":    {ml:125, lote:100, es:.10, dpg:.05, agua:0},
  "Textil":     {ml:250, lote:210, es:.05, dpg:.03, agua:.30},
  "Home Spray": {ml:250, lote:200, es:.10, dpg:.02, agua:0}
};
var ESENCIAS = ["Verbena","Lemon grass","Flores blancas","Magnolia","Jazmín azahares","Gardenia","Coco vainilla","Mango maracuyá","Wanama","Frutos rojos"];
var BLENDS = [
  ["1. Cítrico herbal",{"Verbena":75,"Lemon grass":25}],
  ["2. Jardín blanco",{"Flores blancas":60,"Magnolia":40}],
  ["3. Azahar y flores",{"Jazmín azahares":50,"Flores blancas":50}],
  ["4. Floral cremoso",{"Gardenia":80,"Coco vainilla":20}],
  ["5. Frutal tropical",{"Mango maracuyá":60,"Wanama":40}],
  ["6. Frutos rojos cremosos",{"Frutos rojos":75,"Coco vainilla":25}],
  ["7. Fresco floral",{"Verbena":50,"Flores blancas":30,"Magnolia":20}],
  ["8. Floral nocturno",{"Gardenia":55,"Jazmín azahares":30,"Coco vainilla":15}],
  ["9. Frutal con flor",{"Wanama":50,"Magnolia":20,"Mango maracuyá":30}],
  ["10. Tropical suave",{"Mango maracuyá":55,"Coco vainilla":20,"Verbena":25}]
];

// Densidad (g por ml) para pasar de gramos a ml. Ajustá si tu alcohol es distinto.
var DENS = {esencia: .95, dpg: 1.03, alcohol: .81, agua: 1};
// ---- Estado ----
var prod = "Difusor", mode = "blend", idx = 0, checked = {}, qty = 1;
var $ = function (id) { return document.getElementById(id); };
function fmt(x) { return (Math.round(x * 10) / 10).toFixed(1).replace(".", ","); }

function recipe() {
  var p = PRODUCTS[prod], d = {};
  if (mode === "blend") d = BLENDS[idx][1]; else d[ESENCIAS[idx]] = 100;
  var L = p.lote * qty, total = L * p.es, items = [];
  for (var k in d) items.push([k, total * d[k] / 100 / DENS.esencia]);
  items.push(["DPG", L * p.dpg / DENS.dpg]);
  items.push(["Alcohol", L * (1 - p.es - p.dpg - p.agua) / DENS.alcohol]);
  if (p.agua > 0) items.push(["Agua destilada", L * p.agua / DENS.agua]);
  return {items: items, p: p, d: d};
}

function render() {
  var r = recipe(), sum = 0, h = "";
  r.items.forEach(function (it, i) {
    sum += it[1];
    h += '<div class="row' + (checked[it[0]] ? " done" : "") + '"><input type="checkbox" data-k="' + it[0] + '"' + (checked[it[0]] ? " checked" : "") + '><span class="n">' + it[0] + '</span><span class="g">' + fmt(it[1]) + '</span><button class="cp" data-c="' + i + '">Copiar</button></div>';
  });
  h += '<div class="tot"><span>Total lote</span><span>' + fmt(sum) + " ml</span></div>";
  $("list").innerHTML = h;
  var alc = Math.round((1 - r.p.es - r.p.dpg - r.p.agua) * 100);
  $("formula").textContent = "Esencia " + Math.round(r.p.es * 100) + " % · DPG " + Math.round(r.p.dpg * 100) + " % · Alcohol " + alc + " %" + (r.p.agua > 0 ? " · Agua " + Math.round(r.p.agua * 100) + " %" : "");
  $("envase").textContent = qty + " × envase " + r.p.ml + " ml · Total " + fmt(sum) + " ml";
  $("nn").textContent = qty;
  $("iteminfo").textContent = mode === "blend" ? Object.keys(r.d).map(function (k) { return k + " " + r.d[k] + " %"; }).join(" + ") : "Esencia pura, sin mezclar";
}

function fillSelect() {
  var s = $("item"), list = mode === "blend" ? BLENDS.map(function (b) { return b[0]; }) : ESENCIAS;
  s.innerHTML = "";
  list.forEach(function (n, i) { var o = document.createElement("option"); o.value = i; o.textContent = n; s.appendChild(o); });
  idx = 0;
}

function toast(t) { var m = $("msg"); m.textContent = t; m.className = "msg show"; setTimeout(function () { m.className = "msg"; }, 1500); }
function copy(text) {
  function fb() {
    var a = document.createElement("textarea"); a.value = text; a.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(a); a.select();
    try { document.execCommand("copy"); toast("Copiado"); } catch (e) { toast("No se pudo copiar"); }
    document.body.removeChild(a);
  }
  try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast("Copiado"); }, fb); else fb(); } catch (e) { fb(); }
}

function init() {
  var pb = $("prod");
  Object.keys(PRODUCTS).forEach(function (n) {
    var b = document.createElement("button"); b.textContent = n; b.className = n === prod ? "on" : "";
    b.onclick = function () { prod = n; checked = {}; [].forEach.call(pb.children, function (x) { x.className = x.textContent === n ? "on" : ""; }); render(); };
    pb.appendChild(b);
  });
  [].forEach.call($("mode").children, function (b) {
    b.onclick = function () { mode = b.dataset.m; checked = {}; [].forEach.call($("mode").children, function (x) { x.className = x === b ? "on" : ""; }); fillSelect(); render(); };
  });
  $("item").onchange = function () { idx = +this.value; checked = {}; render(); };
  $("list").onclick = function (e) {
    var t = e.target;
    if (t.dataset.k !== undefined) { checked[t.dataset.k] = t.checked; render(); }
    if (t.dataset.c !== undefined) copy(fmt(recipe().items[+t.dataset.c][1]));
  };
    $("copyall").onclick = function () {
    var r = recipe(), name = mode === "blend" ? BLENDS[idx][0] : ESENCIAS[idx];
    copy(name + " - " + prod + " x" + qty + " (" + r.p.ml + " ml)\n" + r.items.map(function (i) { return i[0] + ": " + fmt(i[1]) + " ml"; }).join("\n"));
  };
  $("mm").onclick = function () { if (qty > 1) { qty--; render(); } };
  $("mp").onclick = function () { if (qty < 99) { qty++; render(); } };
  fillSelect(); render();
}
init();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});
