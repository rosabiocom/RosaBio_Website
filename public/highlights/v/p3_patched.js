/* Part 3 · inside the cross-study models.
   A port of Part 4 of the reference cell-class page (sections 18 explorer, 18b fan, 19 gene close-up, 20 gene track,
   20b length bins, footer limits/sources/provenance, and its tooltip/svg helpers) onto the cross-study cell-type grids.
   The render code is that page's; what changed is the data adapter (models = datasets of three grids, pairs = our cross
   pairs) and what multiclass forces (macro one-vs-rest AUC from a softmax over the shared cell types, per-cell-type
   option, per-cell-type colours instead of a two-way sign).
   Data: window.P3I (p3index.js, loaded up front) plus window.P3D.<GRID> (p3data_<GRID>.js) and
   window.P3BR.<GRID> (p3browser_<GRID>.js), each injected as a <script> tag the first time that grid's tab is
   opened / its genome browser is drawn. No fetch(): script tags only, so nothing depends on cross-origin rules.
   Everything lives inside this one function: no top-level names (a top-level `const top` once made this page a
   SyntaxError because window.top exists). */
(function () {
  'use strict';
  const IDX = window.P3I, MK = window.P3M || { sources: {} };
  const $ = id => document.getElementById(id);
  if (!IDX || !$('p3x')) return;

  /* ---- live aggregate. The index carries every grid, every dataset and every scored pair's headline score, so
     the tab bar and both menus render before any grid file is loaded. A grid's payload fills in the rest. */
  const D = { meta: IDX.meta, grids: {}, pairs: {} };
  IDX.grids.forEach(g => {
    D.grids[g.key] = { key: g.key, blob: g.blob, blob_key: g.blob_key, title: g.title, page_title: g.page_title,
      short: g.short, cite: g.cite, species: g.species, xspecies: g.xspecies, datasets: g.datasets,
      pairs: g.pairs.map(x => x.pair), ge_k: g.ge_k, pk_k: g.pk_k, blank: g.blank || [],
      n_pairs_ordered: g.n_pairs_ordered, acceptance: g.acceptance, loaded: false };
    g.pairs.forEach(x => { D.pairs[x.pair] = { grid: g.key, train: x.train, test: x.test,
      train_label: x.train_label, test_label: x.test_label, stub: true }; });
  });
  const dataOf = gk => (window.P3D || {})[gk] || null;
  const BRG = gk => (window.P3BR || {})[gk] || null;
  const GD = gk => dataOf(gk) || {};
  /* range of the share of each model's sequence weight that alignment alone names, over the grid's models */
  function covRange(gk) {
    const inpair = new Set((D.grids[gk].pairs || []).map(t => D.pairs[t]).filter(Boolean)
      .reduce((a, p) => a.concat([p.train, p.test]), []));
    const v = (GD(gk).gene_map_coverage || []).filter(r => inpair.has(r.model))
      .map(r => r.value_weight_mapped_pct_aligned).filter(x => x !== null && x !== undefined);
    if (!v.length) return 'most';
    const lo = Math.min.apply(null, v), hi = Math.max.apply(null, v);
    return lo.toFixed(0) === hi.toFixed(0) ? `${lo.toFixed(0)}%` : `${lo.toFixed(0)} to ${hi.toFixed(0)}%`;
  }
  /* B is the CURRENT grid's browser payload. Kept per grid on purpose: two pools are both named
     "human value features only (wv>0)", so merging every grid's species_summary would cross them. */
  const B = { models: {}, gene_models: {}, species_summary: {}, notes: {} };
  function useBrowser(gk) {
    const x = BRG(gk);
    B.models = x ? x.models : {}; B.gene_models = x ? x.gene_models : {};
    B.species_summary = x ? x.species_summary : {}; B.notes = x ? x.notes : {};
  }
  function mergeGrid(gk) {
    const x = dataOf(gk);
    if (!x || D.grids[gk].loaded) return;
    Object.assign(D.grids[gk], x.grid);
    D.grids[gk].pairs = x.grid.pairs;
    Object.keys(x.pairs).forEach(t => { D.pairs[t] = x.pairs[t]; });
    D.grids[gk].loaded = true;
  }

  /* ---- script-tag loader. Returns true when the payload was already there (so the caller stays synchronous). */
  const pending = {};
  function ensure(url, has, cb) {
    if (has()) { cb(null); return true; }
    if (pending[url]) { pending[url].push(cb); return false; }
    pending[url] = [cb];
    const el = document.createElement('script');
    el.src = url;
    el.async = true;
    el.onload = () => { const q = pending[url]; pending[url] = null;
      q.forEach(f => { try { f(has() ? null : new Error(url + ' loaded but defined nothing')); } catch (e) { if (window.console) console.error('Part 3 load', e); } }); };
    el.onerror = () => { const q = pending[url]; pending[url] = null;
      q.forEach(f => { try { f(new Error('could not load ' + url)); } catch (e) { if (window.console) console.error('Part 3 load', e); } }); };
    (document.head || document.body || document.documentElement).appendChild(el);
    return false;
  }
  const ensureData = (gk, cb) => ensure(IDX.files[gk].data, () => !!dataOf(gk), e => { if (!e) mergeGrid(gk); cb(e); });
  const ensureBrowser = (gk, cb) => ensure(IDX.files[gk].browser, () => !!BRG(gk), cb);
  /* 2026-09-23: the isoform and BLAST payloads travel with the gene track, not the tab, because
     only 3.3 uses them. Both are optional — an older build has neither and the track still draws. */
  const ISOG = gk => (window.P3ISO || {})[gk] || null;
  const BLG = gk => (window.P3BL || {})[gk] || null;
  const UNG = gk => (window.P3UN || {})[gk] || null;
  /* which genome each species is placed on, and how many of its selected sequences place, from the data (2026-10-29 audit) */
  const GENOMESAY = () => {
    const U = UNG(CUR) || {}, by = {};
    Object.keys(U).forEach(k => { const mm = modelBy[k]; if (!mm) return; const sp = mm.species === 'macaque' ? 'macaque' : 'human';
      by[sp] = by[sp] || [0, 0]; by[sp][0] += U[k].placed || 0; by[sp][1] += U[k].sel || 0; });
    const NAME = { human: 'Human donors', macaque: 'Macaque donors (rhesus and pig-tailed)' };
    return '<b>Each donor is placed on its own species genome.</b> ' + ['human', 'macaque'].filter(sp => by[sp]).map(sp =>
      `${NAME[sp]}: ${SPMETA[sp].asm} (${SPMETA[sp].annot}); ${pct0(by[sp][0], by[sp][1])}% of their selected sequences place (${int(by[sp][0])} of ${int(by[sp][1])}).`).join(' ');
  };
  function ensureTrackExtras(gk, cb) {
    const f = IDX.files[gk] || {};
    let left = 0, done = () => { if (--left <= 0) cb(); };
    if (f.iso && !ISOG(gk)) left++;
    if (f.blast && !BLG(gk)) left++;
    if (f.unpl && !UNG(gk)) left++;
    if (!left) { cb(); return; }
    if (f.iso && !ISOG(gk)) ensure(f.iso, () => !!ISOG(gk), done);
    if (f.blast && !BLG(gk)) ensure(f.blast, () => !!BLG(gk), done);
    if (f.unpl && !UNG(gk)) ensure(f.unpl, () => !!UNG(gk), done);
  }
  /* plain loading / error lines: never a blank panel */
  function msgInto(ids, cls, html) {
    ids.forEach(id => { const e = $(id); if (e) e.innerHTML = `<p class="${cls}">${html}</p>`; });
  }
  const LOADBOXES = ['ex-sum', 'ex-chart', 'ex-note', 'ex-fan', 'gc-sum', 'gc-list', 'gc-chart', 'gc-note',
    'br-sum', 'br-list', 'br-tracks', 'br-note'];

  /* ================= helpers (reference page _js1) ================= */
  const fmt = (v, n = 3) => (v === null || v === undefined || Number.isNaN(v)) ? 'not recorded' : Number(v).toFixed(n);
  const int = v => (v === null || v === undefined) ? 'not recorded' : Number(v).toLocaleString('en-US');
  const esc = s => String(s === null || s === undefined ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const pct0 = (a, b) => (100 * a / Math.max(1, b)).toFixed(0);
  /* structured text: label/value rows, and short bullets. Empty values are skipped. */
  const dl = rows => '<dl class="p3dl">' + rows.filter(r => r && r[1]).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('') + '</dl>';
  const bul = items => '<ul class="p3bl">' + items.filter(Boolean).map(t => `<li>${t}</li>`).join('') + '</ul>';

  const tip = $('tip');
  function bindTip(node, html) {
    node.addEventListener('mouseenter', e => { tip.innerHTML = html; tip.classList.add('on'); move(e); });
    node.addEventListener('mousemove', move);
    node.addEventListener('mouseleave', () => tip.classList.remove('on'));
    function move(e) {
      const r = tip.getBoundingClientRect();
      let x = e.clientX + 14, y = e.clientY + 14;
      if (x + r.width > window.innerWidth - 10) x = e.clientX - r.width - 14;
      if (y + r.height > window.innerHeight - 10) y = e.clientY - r.height - 14;
      tip.style.left = x + 'px'; tip.style.top = y + 'px';
    }
  }
  const NS = 'http://www.w3.org/2000/svg';
  function svg(w, h, extra) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', `0 0 ${w} ${h}`);
    s.setAttribute('width', w); s.setAttribute('height', h);
    if (extra) for (const k in extra) s.setAttribute(k, extra[k]);
    return s;
  }
  function E(tag, attrs, text) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    return e;
  }
  /* Mann-Whitney AUC with ties (the reference page's auc()), for one score column against a 0/1 truth */
  function auc(score, y) {
    const n = score.length;
    const idx = Array.from({ length: n }, (_, i) => i).sort((a, b) => score[a] - score[b]);
    const rank = new Float64Array(n);
    let i = 0;
    while (i < n) {
      let j = i;
      while (j < n && score[idx[j]] === score[idx[i]]) j++;
      const r = (i + j - 1) / 2 + 1;
      for (let k = i; k < j; k++) rank[idx[k]] = r;
      i = j;
    }
    let n1 = 0, n0 = 0, s = 0;
    for (let k = 0; k < n; k++) { if (y[k] === 1) { n1++; s += rank[k]; } else n0++; }
    if (!n1 || !n0) return NaN;
    return (s - n1 * (n1 + 1) / 2) / (n1 * n0);
  }
  /* multiclass: softmax over the class scores z (row-major n x K), one-vs-rest AUC per class;
     cls < 0 -> macro over the classes that have both positives and negatives (the pipeline's rule) */
  function scoreZ(z, y, n, K, cls) {
    const prob = new Float64Array(n * K);
    for (let i = 0; i < n; i++) {
      let m = -Infinity;
      for (let c = 0; c < K; c++) m = Math.max(m, z[i * K + c]);
      let s = 0;
      for (let c = 0; c < K; c++) s += Math.exp(z[i * K + c] - m);
      for (let c = 0; c < K; c++) prob[i * K + c] = Math.exp(z[i * K + c] - m) / s;
    }
    const one = c => {
      const col = new Float64Array(n), yy = new Array(n);
      for (let i = 0; i < n; i++) { col[i] = prob[i * K + c]; yy[i] = y[i] === c ? 1 : 0; }
      return auc(col, yy);
    };
    if (cls >= 0) return one(cls);
    const a = [];
    for (let c = 0; c < K; c++) { const v = one(c); if (!Number.isNaN(v)) a.push(v); }
    return a.length ? a.reduce((p, q) => p + q, 0) / a.length : NaN;
  }

  /* ================= data adapter ================= */
  const GRIDS = IDX.grids.map(g => g.key);
  const GRIDNAME = {}, GRIDSHORT = {};
  IDX.grids.forEach(g => { GRIDNAME[g.key] = g.page_title; GRIDSHORT[g.key] = g.short; });
  const SPMETA = {
    human: { asm: 'GRCh38', annot: 'GENCODE v50', genome: 'These are human datasets on the human genome, so a placement means what it says.' },
    macaque: { asm: 'Macaca fascicularis 6.0', annot: 'Ensembl 112', genome: 'These are rhesus and pig-tailed macaque datasets aligned to the M. fascicularis genome; only a minority of selected sequences place, so most are in the BLAST panel below.' }
  };
  let _brSp = 'human';                       /* set per rendered donor from its genes' ref */
  const gASM = () => (SPMETA[_brSp] || SPMETA.human).asm;
  const gANNOT = () => (SPMETA[_brSp] || SPMETA.human).annot;
  const gGENOME = () => (SPMETA[_brSp] || SPMETA.human).genome;
  const hasChem = gk => (D.grids[gk].datasets || []).every(d => d.chem);
  const isXsp = gk => !!D.grids[gk].xspecies;
  const SP = { human: 'hum', mouse: 'mus' };
  const CHEM = { '3pv1': '3′ v1', '5pv2': '5′ v2' };
  const ARM = { '10x': '10x', ss2: 'Smart-seq2' };
  const MODELS = [];
  GRIDS.forEach(gk => D.grids[gk].datasets.forEach(ds => MODELS.push({
    id: gk + ':' + ds.id, grid: gk, ds: ds.id, label: ds.label, chem: ds.chem, tissue: ds.tissue, arm: ds.arm,
    species: ds.species || D.grids[gk].species })));
  const modelBy = Object.fromEntries(MODELS.map(m => [m.id, m]));
  const ORDER = MODELS.map(m => m.id);
  const TAG = {};
  MODELS.forEach(m => {
    let t = m.label;
    if (m.grid === 'PBMC') {
      const x = /^pbmc_(.*)_(3pv1|5pv2)$/.exec(m.ds);
      t = x ? `${x[1].replace(/^bc_(\d+)_(\d+)$/, 'bc $1:$2')} · ${CHEM[x[2]]}` : m.ds;
    } else if (m.arm) t = `${m.tissue} · ${ARM[m.arm] || m.arm}`;
    else if (m.grid === 'PANC') t = m.ds === 'seg' ? 'Segerstolpe' : m.ds === 'xin' ? 'Xin' : m.label;
    TAG[m.id] = t;
  });
  const label = d => `${TAG[d]}, ${GRIDSHORT[modelBy[d].grid]} (${modelBy[d].species})`;
  const pairOf = (m, t) => {
    const a = modelBy[m], b = modelBy[t];
    return a && b && a.grid === b.grid ? (D.pairs[a.ds + '__' + b.ds] || null) : null;
  };
  const testsOf = m => {
    const a = modelBy[m];
    return a ? D.grids[a.grid].pairs.map(k => D.pairs[k]).filter(p => p && p.train === a.ds).map(p => a.grid + ':' + p.test) : [];
  };
  const TRAINS = ORDER.filter(d => testsOf(d).length);
  /* the tab bar picks which cross-study grouping all three tools show (PBMC / Tabula Muris / Pancreas) */
  let CUR = GRIDS[0];
  /* first offer of each grid: its strongest scored pair, so a tab always opens on something worth looking at */
  const bestPair = gk => (IDX.grids.find(g => g.key === gk).pairs.slice()
    .sort((a, b) => (b.macro_auc || 0) - (a.macro_auc || 0))[0]) || null;
  const defTrain = gk => { const p = bestPair(gk); return p ? gk + ':' + p.train : (inGridOf(gk, TRAINS)[0] || ''); };
  const defTest = gk => { const p = bestPair(gk); return p ? gk + ':' + p.test : ''; };
  const inGridOf = (gk, ids) => ids.filter(d => modelBy[d].grid === gk);
  const inGrid = ids => ids.filter(d => modelBy[d].grid === CUR);
  const pickIn = (ids, pref) => (ids.indexOf(pref) >= 0 ? pref : ids[0]);
  const optsModels = ids => GRIDS.map(gk => {
    const xs = ids.filter(d => modelBy[d].grid === gk);
    return xs.length ? `<optgroup label="${esc(GRIDNAME[gk])}">` +
      xs.map(d => `<option value="${d}">${esc(label(d))}</option>`).join('') + '</optgroup>' : '';
  }).join('');
  const testLabel = (m, t) => {
    const a = modelBy[m], b = modelBy[t];
    return label(t) + (hasChem(a.grid) ? (a.chem === b.chem ? ' · same chemistry' : ' · other chemistry') : '');
  };
  function kindOf(m, t) {
    const a = modelBy[m], b = modelBy[t];
    if (m === t) return 'the same dataset';
    if (hasChem(a.grid)) return a.chem === b.chem ? `same chemistry, ${CHEM[a.chem]}` : `${CHEM[a.chem]} → ${CHEM[b.chem]}, a chemistry change`;
    if (a.arm && b.arm) return a.arm === b.arm
      ? `${a.tissue} → ${b.tissue}, two tissues on ${ARM[a.arm]}`
      : `same tissue, ${ARM[a.arm]} → ${ARM[b.arm]}`;
    if (a.grid === 'MCX') return `${TAG[m]} → ${TAG[t]}, two tissue atlases`;
    if (a.grid === 'PANC') return `${TAG[m]} → ${TAG[t]}, two independent islet studies`;
    return `${TAG[m]} → ${TAG[t]}, a donor model tested on another donor`;
  }
  const clsName = c => String(c).replace(/_/g, ' ');
  const clsShort = c => {
    const w = String(c).split('_').filter(x => !/^(cell|of|the|gland|tree)$/i.test(x));
    const s = (w.length ? w : [String(c)]).slice(0, 2).join(' ');
    return s.length > 15 ? s.slice(0, 14) + '…' : s;
  };
  const clsCol = i => (i === null || i === undefined || i < 0) ? 'var(--ink-3)' : `var(--c${i % 12})`;
  const argTop = w => {
    let bi = -1, bv = 0;
    (w || []).forEach((v, i) => { if (v > bv) { bv = v; bi = i; } });
    return bi;
  };
  function fillCls(sel, P) {
    const prev = sel.value === '' || sel.value === undefined ? '-1' : sel.value;
    const prevName = +prev >= 0 && sel.dataset.names ? JSON.parse(sel.dataset.names)[+prev] : null;
    sel.innerHTML = `<option value="-1">macro AUC, all ${P.shared.length} shared cell types</option>` +
      P.shared.map((c, i) => `<option value="${i}">${esc(clsName(c))}, one-vs-rest AUC</option>`).join('');
    sel.dataset.names = JSON.stringify(P.shared);
    const keep = prevName !== null ? P.shared.indexOf(prevName) : -1;
    sel.value = String(keep);
  }

  /* ---------- marker genes: read from markers/markers.json (p3markers.js), never assembled here ----------
     shape: {GRID: {cell_type: [{gene, source_id, direction '+'|'-', tissue? (TM only)}]}, sources: {...},
     unsourced: [{grid, cell_type, tissue, reason}]}. Symbols are matched case-insensitively (TM entries are mouse
     symbols; TM gene names on this page are the human symbols of the GRCh38 placement). */
  const MKIDX = {};
  GRIDS.forEach(gk => {
    const G = MK[gk];
    if (!G || typeof G !== 'object' || Array.isArray(G)) return;
    const idx = {};
    Object.keys(G).forEach(ct => {
      if (!Array.isArray(G[ct])) return;
      G[ct].forEach(e => {
        if (!e || !e.gene) return;
        const k = String(e.gene).toUpperCase();
        (idx[k] = idx[k] || []).push({ ct, tissue: e.tissue || null, dir: e.direction === '-' ? '-' : '+', src: e.source_id });
      });
    });
    MKIDX[gk] = idx;
  });
  const tissueOk = (e, tissue) => !e.tissue || !tissue || e.tissue === tissue;
  const entriesFor = (grid, tissue, ct) => ((MK[grid] || {})[ct] || []).filter(e => e && tissueOk(e, tissue));
  function markerFor(grid, tissue, gene, classes) {
    const hits = ((MKIDX[grid] || {})[String(gene).toUpperCase()] || [])
      .filter(h => classes.indexOf(h.ct) >= 0 && tissueOk(h, tissue));
    if (!hits.length) return null;
    return hits.find(h => h.dir === '+') || hits[0];
  }
  const unsourcedFor = (grid, tissue, classes) => (Array.isArray(MK.unsourced) ? MK.unsourced : [])
    .filter(u => u && u.grid === grid && classes.indexOf(u.cell_type) >= 0 && tissueOk(u, tissue));
  function markerBlock(grid, tissue, classes) {
    if (MK._status) return MK._status;
    const g = MK[grid];
    if (!g || typeof g !== 'object' || !Object.keys(g).length) return `the cited marker table has no entry for ${GRIDSHORT[grid]}`;
    if (!classes.some(c => entriesFor(grid, tissue, c).length)) {
      const un = unsourcedFor(grid, tissue, classes);
      return 'the cited marker table lists no genes for these cell types' +
        (un.length ? ` (${un.map(u => `${clsName(u.cell_type)}: ${u.reason}`).join(' · ')})` : '');
    }
    return '';
  }
  function linksOf(s) {
    const raw = String(s || '');
    const urls = (raw.match(/https?:\/\/[^\s;]+/g) || []).map(u => u.replace(/[),.]+$/, ''));
    const rest = raw.replace(/https?:\/\/[^\s;]+/g, '').replace(/^[\s;]+|[\s;]+$/g, '').replace(/\s*;\s*;\s*/g, '; ');
    return urls.map(u => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a>`).join(' · ') +
      (rest ? ` <span class="dim">${esc(rest)}</span>` : '');
  }
  function markerSources(grid, tissue, classes) {
    const S = MK.sources || {};
    const used = new Set();
    classes.forEach(c => entriesFor(grid, tissue, c).forEach(e => e.source_id && used.add(e.source_id)));
    const ids = Object.keys(S).filter(id => used.has(id));
    const un = unsourcedFor(grid, tissue, classes);
    const where = tissue ? `${GRIDSHORT[grid]}, ${tissue}` : GRIDSHORT[grid];
    if (!ids.length && !un.length) return '';
    return `<b>Marker genes: sources</b> (${esc(where)}; the cited table, one source per gene).<br>` + ids.map(id => {
      const s = S[id] || {};
      return `<span class="mono">[${esc(id)}]</span> ${esc(String(s.citation || id).replace(/\s*\u2014\s*/g, ': '))}` +
        (s.doi_or_url ? ` · ${linksOf(s.doi_or_url)}` : '') +
        (s.what_it_is || s.where_in_it ? ` <span class="dim">(${esc([s.what_it_is, s.where_in_it].filter(Boolean).join(' '))})</span>` : '');
    }).join('<br>') +
      (un.length ? `<br>No cited marker for ${un.map(u => `<b>${esc(clsName(u.cell_type))}</b>${u.tissue ? ' (' + esc(u.tissue) + ')' : ''}: ${esc(u.reason)}`).join('; ')}` : '');
  }
  const pillOf = (hit, classes) => !hit ? '' :
    ` <span class="pill" style="color:${clsCol(classes.indexOf(hit.ct))}" title="${hit.dir === '-' ? 'cited as NOT expressed by' : 'cited marker gene of'} ${esc(clsName(hit.ct))} [${esc(hit.src || '')}]">${esc(clsShort(hit.ct))}${hit.dir === '-' ? ' −' : ''}</span>`;

  /* ================= 3.1 the cross-study explorer (reference _js11) ================= */
  function renderExplore() {
    const trainSel = $('ex-train'), testSel = $('ex-test'), famSel = $('ex-fam'), kSel = $('ex-k'),
      cmpBtn = $('ex-cmp'), clsSel = $('ex-cls'), kWrap = $('ex-k-wrap');
    const grid = () => modelBy[trainSel.value].grid;
    const KS = () => ({ present: D.grids[grid()].ge_k || [], picked: D.grids[grid()].pk_k || [] });
    const XS = () => D.grids[grid()].explore_stats || {};

    trainSel.innerHTML = optsModels(inGrid(TRAINS));
    trainSel.value = pickIn(inGrid(TRAINS), defTrain(CUR));
    function fillTests(keep) {
      const ts = testsOf(trainSel.value);
      testSel.innerHTML = ts.map(t => `<option value="${t}">${esc(testLabel(trainSel.value, t))}</option>`).join('');
      testSel.value = ts.indexOf(keep) >= 0 ? keep : ts[0];
    }
    fillTests(defTest(CUR));

    function fillFam() {
      /* the overlay is on by default (user, 2026-09-19), and it only means something for a family
         that has cut-offs, so the first load starts on B rather than "no restriction" */
      const isP = hasChem(grid()), v = famSel.value || 'present';
      famSel.innerHTML =
        `<option value="all">no restriction: use the whole model</option>` +
        `<option value="present">B: the sequence APPEARS in the grid's datasets</option>` +
        `<option value="picked">A: the sequence was PICKED by the grid's models</option>` +
        `<option value="test">C: the sequence APPEARS in the tested dataset</option>` +
        (isP ? `<option value="other">D: the sequence APPEARS in the other chemistry</option>` : '');
      famSel.value = (v === 'other' && !isP) ? 'all' : v;
    }
    function fillK() {
      if (!famSel.value) famSel.value = 'present';
      if (famSel.value === 'present' && !((KS().present || []).length)) famSel.value = 'all';
      const fam = famSel.value;
      if (fam !== 'present' && fam !== 'picked') {
        kWrap.style.display = 'none';
      } else {
        kWrap.style.display = '';
        const prev = +kSel.value, ks = KS()[fam] || [];
        const N = fam === 'present' ? XS().n_datasets : XS().n_models, unit = fam === 'present' ? 'dataset' : 'model';
        kSel.innerHTML = ks.map(k =>
          `<option value="${k}">${k} ${unit}${k > 1 ? 's' : ''}${k === N ? ' (all of them)' : ''}</option>`).join('');
        kSel.value = String(ks.indexOf(prev) >= 0 ? prev : ks[0]);
      }
    }
    const fid = () => {
      const f = famSel.value || 'all';
      if (f === 'all') return 'all';
      if (f === 'test') return 'test';
      if (f === 'other') return 'other_chem';
      return (f === 'present' ? 'ge' : 'pk') + (kSel.value || (KS()[f] || [2])[0]);
    };
    const famLabel = f => f === 'all' ? 'whole model'
      : f.indexOf('ge') === 0 ? `appears in ≥${f.slice(2)} datasets`
      : f.indexOf('pk') === 0 ? `picked by ≥${f.slice(2)} models`
      : f === 'test' ? `appears in ${TAG[testSel.value]}` : 'appears in the other chemistry';

    function howto() {
      const fam = famSel.value, S = XS(), gs = GRIDSHORT[grid()];
      const opts = {
        present: `<b>B</b> · the sequence appears in at least K of the ${int(S.n_datasets)} ${esc(gs)} datasets (${int(S.present_ge2)} features at K = 2)`,
        picked: `<b>A</b> · at least K of the ${int(S.n_models)} ${esc(gs)} models picked it (${int(S.picked_ge2)} of ${int(S.n_features)} features at K = 2; ${(100 * S.frac_private).toFixed(0)}% are picked by one model only)`,
        test: `<b>C</b> · the sequence appears in the tested dataset; anything else can never fire there`,
        other: `<b>D</b> · the sequence appears in the other chemistry (PBMC only)`,
      };
      $('ex-howto').innerHTML = '';
    }

    function curve(m, t, f) {
      const P = pairOf(m, t);
      const c = P && P.curves[f];
      if (!c) return null;
      const cls = +clsSel.value;
      return {
        K: c.K, fired: c.fired, wshare: c.wshare,
        points: c.points.map(p => ({ k: p[0], auc: cls < 0 ? p[1] : (p[3] || [])[cls], f: p[4], f1: p[2] }))
          .filter(p => p.auc !== null && p.auc !== undefined)
      };
    }

    function draw() {
      const m = trainSel.value, t = testSel.value, self = (m === t), P = pairOf(m, t);
      const cls = +clsSel.value, clsTxt = cls < 0 ? 'macro AUC' : `${clsName(P.shared[cls])} AUC`;
      const overlay = cmpBtn.getAttribute('aria-pressed') === 'true';
      const fam = famSel.value;
      const fids = overlay && (fam === 'present' || fam === 'picked')
        ? ['all'].concat((KS()[fam] || []).map(k => (fam === 'present' ? 'ge' : 'pk') + k))
        : [fid()];
      const W = 900, H = 430, ML = 60, MR = 120, MT = 20, MB = 52;
      const s = svg(W, H); s.style.width = '100%';
      const shown = fids.map(f => [f, curve(m, t, f)]).filter(([f, c]) => c && c.points.length);
      if (!shown.length) {
        const box = $('ex-chart'); box.innerHTML = '';
        const sv = svg(W, 160); sv.style.width = '100%';
        sv.appendChild(E('text', { x: W / 2, y: 80, class: 'axtitle', 'text-anchor': 'middle',
          fill: 'var(--warn)' }, 'No features survive this restriction for this model. Try a lower K.'));
        box.appendChild(sv);
        $('ex-leg').innerHTML = '';
        $('ex-sum').innerHTML = '';
        $('ex-note').innerHTML =
          `<b>${esc(TAG[m])}</b>'s model has no feature meeting this rule, so there is nothing to
           plot. That is itself the finding at high K on the <i>picked-by</i> definition — agreement
           between models is rare.`;
        drawFan(m, t);
        return;
      }
      const maxK = Math.max(...shown.map(([f, c]) => c.points[c.points.length - 1].k));
      const vmin = Math.min(...shown.map(([f, c]) => Math.min(...c.points.map(p => p.auc))));
      const ylo = Math.min(0.4, Math.floor(vmin * 10) / 10), yhi = 1.0;
      const X = k => ML + (W - ML - MR) * Math.log10(Math.max(1, k)) / (Math.log10(Math.max(2, maxK)) || 1);
      const Y = v => MT + (H - MT - MB) * (1 - (v - ylo) / (yhi - ylo));
      for (let v = ylo; v <= 1.0001; v += 0.1) {
        s.appendChild(E('line', { x1: ML, x2: W - MR, y1: Y(v), y2: Y(v), class: 'gridline' }));
        s.appendChild(E('text', { x: ML - 9, y: Y(v) + 4, class: 'axlab', 'text-anchor': 'end' }, v.toFixed(1)));
      }
      s.appendChild(E('line', { x1: ML, x2: W - MR, y1: Y(0.5), y2: Y(0.5), stroke: 'var(--ink-3)',
        'stroke-width': 1, 'stroke-dasharray': '5 4' }));
      s.appendChild(E('text', { x: W - MR - 4, y: Y(0.5) - 6, class: 'axlab', 'text-anchor': 'end' }, 'chance'));
      [1, 3, 10, 30, 100, 300, 1000, 3000, 10000].filter(v => v <= maxK).forEach(v => {
        s.appendChild(E('line', { x1: X(v), x2: X(v), y1: MT, y2: H - MB, class: 'gridline' }));
        s.appendChild(E('text', { x: X(v), y: H - MB + 16, class: 'axlab', 'text-anchor': 'middle' }, int(v)));
      });
      const pal = ['--ink', '--seq-600', '--coef-pos', '--don-4', '--don-3', '--coef-neg', '--don-2', '--don-6'];
      const legend = [];
      shown.forEach(([f, c], i) => {
        const col = shown.length === 1 ? `var(--${SP[modelBy[t].species]})` : `var(${pal[i % pal.length]})`;
        const pts = c.points.map(p => `${X(p.k)},${Y(p.auc)}`).join(' ');
        const pl = E('polyline', { points: pts, fill: 'none', stroke: col,
          'stroke-width': shown.length === 1 ? 2.8 : 2,
          'stroke-dasharray': self ? '7 4' : 'none' });
        s.appendChild(pl);
        const last = c.points[c.points.length - 1];
        s.appendChild(E('circle', { cx: X(last.k), cy: Y(last.auc), r: 4.5, fill: col }));
        s.appendChild(E('text', { x: X(last.k) + 8, y: Y(last.auc) + 4, class: 'axlab', fill: col },
          `${fmt(last.auc, 3)}`));
        const fl = famLabel(f);
        bindTip(pl, `<b>${esc(TAG[m])} → ${esc(TAG[t])}</b>${self ? ' <span style="color:var(--warn)">(in-sample)</span>' : ''}<br>
          ${esc(fl)}<br>${int(c.K)} features in the model, ${int(c.fired)} of them fire in ${esc(TAG[t])}<br>
          final ${esc(clsTxt)} <b>${fmt(last.auc, 4)}</b>`);
        c.points.forEach(p => {
          const dot = E('circle', { cx: X(p.k), cy: Y(p.auc), r: 6, fill: 'transparent' });
          s.appendChild(dot);
          bindTip(dot, `k = <b>${int(p.k)}</b> of ${int(c.K)}<br>${esc(clsTxt)} <b>${fmt(p.auc, 4)}</b>
            ${cls < 0 ? `<br>macro F1 ${fmt(p.f1, 4)}` : ''}<br>
            ${int(p.f)} of the first ${int(p.k)} fire in ${esc(TAG[t])}<br>${esc(fl)}`);
        });
        legend.push(`<span><span class="sw" style="background:${col}"></span>${esc(fl)} · ${int(c.K)} features · ${fmt(last.auc, 3)}</span>`);
      });
      s.appendChild(E('line', { x1: ML, x2: W - MR, y1: H - MB, y2: H - MB, class: 'ax' }));
      s.appendChild(E('text', { x: (ML + W - MR) / 2, y: H - 10, class: 'axtitle', 'text-anchor': 'middle' },
        'k: features used, largest weight first  (log scale)'));
      s.appendChild(E('text', { x: 14, y: (MT + H - MB) / 2, class: 'axtitle', 'text-anchor': 'middle',
        transform: `rotate(-90 14 ${(MT + H - MB) / 2})` }, `${clsTxt} on ${TAG[t]}'s cells`));
      if (self) s.appendChild(E('text', { x: ML + 8, y: MT + 14, class: 'axlab', fill: 'var(--warn)' },
        'dashed = in-sample (trained and tested on the same dataset)'));
      const box = $('ex-chart'); box.innerHTML = ''; box.appendChild(s);
      $('ex-leg').innerHTML = legend.join('');

      const c0 = curve(m, t, fid());
      const full = c0 && c0.points.length ? c0.points[c0.points.length - 1] : null;
      let k90 = null;
      if (c0) for (const p of c0.points) { if (p.auc >= 0.9) { k90 = p.k; break; } }
      $('ex-sum').innerHTML = [
        [esc(TAG[m]), 'trained dataset'], [esc(TAG[t]), 'tested dataset'],
        [c0 ? int(c0.K) : 'none', 'features in the model'],
        [c0 ? int(c0.fired) : 'none', `fire in ${esc(TAG[t])}`],
        [full ? fmt(full.auc, 4) : 'none', self ? 'in-sample AUC' : (cls < 0 ? 'transfer AUC' : `${esc(clsShort(P.shared[cls]))} AUC`)],
        [k90 ? int(k90) : 'never', 'features to reach 0.90'],
      ].map(([v, k]) => `<div><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');

      const endAll = P.curves.all.points[P.curves.all.points.length - 1];
      const shared = P.shared.map((c, i) => `${clsName(c)} (${int(P.class_n[i])})`).join(', ');
      $('ex-note').innerHTML = c0 ? dl([
        ['pair', `<b>${esc(label(m))}</b> → <b>${esc(label(t))}</b> · ${esc(kindOf(m, t))}`],
        ['cell types scored', `${P.shared.length}: ${esc(shared)} cells`],
        ['features that fire', self ? '' : `<b>${int(P.curves.all.fired)}</b> of ${int(P.curves.all.K)} (${pct0(P.curves.all.fired, P.curves.all.K)}%); the rest never appear in ${esc(TAG[t])}, so they cannot help`],
        ['whole-model score', `<b>${fmt(endAll[1], 4)}</b> macro AUC · macro F1 ${fmt(endAll[2], 4)}, the whole-model score for this pair`],
        ['reaches 0.90 at', k90 ? `<b>${int(k90)}</b> features (${esc(clsTxt)})` : 'never'],
        ['filter on', famSel.value !== 'all' ? `only features that ${esc(famLabel(fid()))}: ${int(c0.K)} of ${int(P.curves.all.K)}, ${(100 * (c0.wshare || 0)).toFixed(0)}% of the model's weight` : ''],
        ['note', self ? 'in-sample: the model is scoring its own training cells, so this is a ceiling, not a result' : ''],
      ]) : '';
      drawFan(m, t);
    }

    /* 3.1b — same model, every dataset it was tested on */
    function drawFan(m, t) {
      const f = fid();
      const rows = testsOf(m).map(tt => {
        const c = curve(m, tt, f);
        return c && c.points.length ? { t: tt, auc: c.points[c.points.length - 1].auc,
          K: c.K, fired: c.fired } : null;
      }).filter(Boolean).sort((a, b) => b.auc - a.auc);
      const W = 880, rowH = 24, MT = 22, ML = 150, MR = 150;
      const H = MT + Math.max(1, rows.length) * rowH + 12;
      const s = svg(W, H); s.style.width = '100%';
      const bw = W - ML - MR;
      const lo = Math.min(0.4, Math.floor(Math.min(1, ...rows.map(r => r.auc)) * 10) / 10);
      const X = v => ML + bw * Math.max(0, (v - lo)) / (1 - lo);
      const ticks = [];
      for (let v = lo; v <= 1.0001; v += 0.1) ticks.push(v);
      ticks.forEach(v => {
        s.appendChild(E('line', { x1: X(v), x2: X(v), y1: MT - 4, y2: H - 8, class: 'gridline' }));
        s.appendChild(E('text', { x: X(v), y: MT - 8, class: 'axlab', 'text-anchor': 'middle' }, v.toFixed(1)));
      });
      rows.forEach((r, i) => {
        const y = MT + i * rowH + 6, sel = r.t === t, isSelf = r.t === m;
        const col = `var(--${SP[modelBy[r.t].species]})`;
        s.appendChild(E('text', { x: ML - 9, y: y + 12, class: 'axlab', 'text-anchor': 'end',
          fill: sel ? 'var(--ink)' : 'var(--ink-3)' }, TAG[r.t] + (isSelf ? ' (self)' : '')));
        const bar = E('rect', { x: ML, y: y + 3, width: Math.max(1, X(r.auc) - ML), height: 13,
          rx: 2, fill: col, opacity: sel ? 1 : .42,
          stroke: sel ? 'var(--ink)' : 'none', 'stroke-width': sel ? 1.5 : 0 });
        s.appendChild(bar);
        bindTip(bar, `<b>${esc(TAG[m])} → ${esc(TAG[r.t])}</b><br>${esc(famLabel(f))}<br>final AUC <b>${fmt(r.auc, 4)}</b><br>
          ${int(r.fired)} of ${int(r.K)} features fire`);
        s.appendChild(E('text', { x: X(r.auc) + 8, y: y + 14, class: 'axlab',
          fill: sel ? 'var(--ink)' : 'var(--ink-3)' },
          `${fmt(r.auc, 3)} · ${int(r.fired)}/${int(r.K)} fire`));
      });
      const box = $('ex-fan'); box.innerHTML = ''; box.appendChild(s);
      if (rows.length === 1) {
        const p = document.createElement('p'); p.className = 'note';
        p.innerHTML = modelBy[m].grid === 'TM'
          ? 'Tabula Muris models are only scored on the same tissue in the other technique, so this model has one bar.'
          : `This model has one scored partner in ${esc(GRIDNAME[modelBy[m].grid])}, so the fan has one bar.`;
        box.appendChild(p);
      }
    }

    function onPair() { fillCls(clsSel, pairOf(trainSel.value, testSel.value)); fillFam(); fillK(); howto(); draw(); }
    fillCls(clsSel, pairOf(trainSel.value, testSel.value));
    famSel.value = 'all'; fillFam(); fillK(); howto();
    trainSel.onchange = () => { fillTests(testSel.value); onPair(); };
    testSel.onchange = onPair;
    famSel.onchange = () => { fillK(); howto(); draw(); };
    kSel.onchange = draw;
    clsSel.onchange = draw;
    cmpBtn.onclick = () => {
      const on = cmpBtn.getAttribute('aria-pressed') !== 'true';
      /* the overlay only means something for the two families that have K values. From the default
         "all" it used to do nothing at all, and the button itself was hidden inside the K controls
         (user, 2026-09-19: "I did not see the overlay AUCs"). Turning it on now selects a K family. */
      if (on && famSel.value !== 'present' && famSel.value !== 'picked') {
        const ks = KS();
        famSel.value = (ks.present && ks.present.length) ? 'present'
                     : (ks.picked && ks.picked.length) ? 'picked' : famSel.value;
        fillK();
      }
      cmpBtn.setAttribute('aria-pressed', String(on)); draw();
    };
    draw();
  }

  /* ================= 3.2 gene close-up (reference _js12; train x test, checkbox multi-select) ================= */
  const BUCKET = { __other_genes__: 'genes past #', __unmapped_seq__: 'sequences with no gene name',
    __unmapped_anchor__: 'anchor terms with no gene name' };
  function geneRows(P) {
    const L = P.live, all = P.genes.all || [];
    const NV = L.order.filter(g => g.indexOf('__') !== 0).length;
    const rows = all.map((r, i) => ({ key: 'g:' + r[0], gene: r[0], ord: i + 1, rank: i + 1, norm: r[1], nfeat: r[2],
      fired: r[3], wv: r[4], vec: Object.prototype.hasOwnProperty.call(L.vectors, r[0]) ? L.vectors[r[0]] : undefined }));
    const ol = L.other_live;
    if (ol && ol.nfeat) rows.push({ key: 'b:__other_genes__', bucket: true, short: `genes #${NV + 1}+`,
      gene: `genes #${NV + 1} to ${int(all.length)}, together`, ord: NV + 0.5, rank: '·', norm: ol.norm,
      nfeat: ol.nfeat, fired: ol.fired, wv: ol.w, vec: L.vectors.__other_genes__ });
    [['__unmapped_seq__', 'no gene name'], ['__unmapped_anchor__', 'anchor, no name']].forEach(([s, short], j) => {
      const c = (P.genes.special || {})[s];
      if (c && c.nfeat) rows.push({ key: 'b:' + s, bucket: true, short, gene: BUCKET[s], ord: 1e7 + j, rank: '·',
        norm: c.norm, nfeat: c.nfeat, fired: c.fired, wv: c.w, vec: L.vectors[s] });
    });
    return { rows, NV, n_genes: all.length };
  }
  function addVec(z, v, K, sc) {
    if (!v) return;
    if (v.d) { for (let j = 0; j < v.d.length; j++) z[j] += v.d[j] / sc; }
    else if (v.s) {
      for (let j = 0; j < v.s.length; j += K + 1) {
        const cell = v.s[j];
        for (let c = 0; c < K; c++) z[cell * K + c] += v.s[j + 1 + c] / sc;
      }
    }
  }

  function renderGeneCloseup() {
    const trSel = $('gc-train'), teSel = $('gc-test'), soSel = $('gc-sort'), hd = $('gc-hidedead'),
      clsSel = $('gc-cls'), mkBtn = $('gc-mk');
    trSel.innerHTML = optsModels(inGrid(TRAINS));
    trSel.value = pickIn(inGrid(TRAINS), defTrain(CUR));
    function fillTests(keep) {
      const ts = testsOf(trSel.value);
      teSel.innerHTML = ts.map(t => `<option value="${t}">${esc(testLabel(trSel.value, t))}</option>`).join('');
      teSel.value = ts.indexOf(keep) >= 0 ? keep : ts[0];
    }
    fillTests(defTest(CUR));
    const pair = () => pairOf(trSel.value, teSel.value);

    $('gc-howto').innerHTML = '';

  let checked = new Set();

    function draw() {
      const m = trSel.value, t = teSel.value, self = (m === t), P = pair();
      const grid = modelBy[m].grid;
      if (!P || !P.live || !P.genes.all) {
        $('gc-list').innerHTML = '<div class="gitem dim">no live data for this pair yet</div>';
        $('gc-chart').innerHTML = '';
        $('gc-sum').innerHTML = '';
        $('gc-note').innerHTML = '';
        return;
      }
      const L = P.live, K = L.K, cls = +clsSel.value;
      const GR = geneRows(P), rowsAll = GR.rows, NV = GR.NV;
      const valid = new Set(rowsAll.map(r => r.key));
      checked = new Set([...checked].filter(k => valid.has(k)));
      const genesOnly = rowsAll.filter(r => !r.bucket);
      const nFire = genesOnly.filter(r => r.fired > 0).length;
      const wOf = r => cls < 0 ? r.norm : (r.wv || [])[cls];
      const colOf = r => cls < 0 ? clsCol(argTop(r.wv)) : (wOf(r) >= 0 ? 'var(--coef-pos)' : 'var(--coef-neg)');

      /* marker button state */
      const tissue = modelBy[m].tissue || null;
      const why = markerBlock(grid, tissue, P.shared);
      mkBtn.disabled = !!why;
      mkBtn.title = why ? 'no cited marker list for these cell types' : `check the genes the cited table lists for this pair's ${P.shared.length} cell types`;
      $('gc-mk-why').textContent = '';
      $('gc-mksrc').innerHTML = markerSources(grid, tissue, P.shared);

      /* ---- left: the full gene list, checkboxes ---- */
      let rows = rowsAll.map(r => Object.assign({}, r, { marker: r.bucket ? null : markerFor(grid, tissue, r.gene, P.shared) }));
      if (hd.getAttribute('aria-pressed') === 'true') rows = rows.filter(r => r.fired > 0);
      const so = soSel.value;
      rows.sort((a, b) => so === 'w' ? a.ord - b.ord
        : so === 'fired' ? b.fired - a.fired || a.ord - b.ord
        : so === 'nfeat' ? b.nfeat - a.nfeat || a.ord - b.ord
        : a.gene.localeCompare(b.gene));
      const maxW = Math.max(...genesOnly.map(r => Math.abs(wOf(r))), 1e-6);
      $('gc-list').innerHTML = rows.map(r => {
        const dead = r.fired === 0;
        const hasVec = r.vec !== undefined;
        const w = Math.min(46, Math.max(3, 46 * Math.abs(wOf(r)) / maxW));
        const wv = wOf(r);
        return `<label class="gitem" data-g="${esc(r.key)}"
            style="${dead ? 'opacity:.5' : ''}${hasVec ? '' : ';border-left:2px dashed var(--ink-3)'}${r.bucket ? ';font-style:italic' : ''}"
            title="${hasVec ? (r.bucket ? `${int(r.nfeat)} features counted together` : '') : `no live data: outside the top ${NV} genes by weight; checking this changes nothing on the curve (its contribution is inside the “genes #${NV + 1}+” row)`}">
          <input type="checkbox" data-g="${esc(r.key)}" ${checked.has(r.key) ? 'checked' : ''}
            ${hasVec ? '' : 'style="opacity:.35"'}>
          <span class="dim" style="width:30px;text-align:right">${r.rank}</span>
          <span class="bar" style="width:${w}px;background:${colOf(r)}"></span>
          <span class="gn">${esc(r.gene)}${pillOf(r.marker, P.shared)}${hasVec ? '' : ' <span class="dim" style="font-size:10px">·no live data</span>'}</span>
          <span class="gv">${cls >= 0 && wv >= 0 ? '+' : ''}${fmt(wv, 3)}</span>
          <span class="gv dim" style="width:62px;text-align:right">${r.fired}/${r.nfeat}</span>
        </label>`;
      }).join('');
      $('gc-list').querySelectorAll('input[type=checkbox]').forEach(cb => {
        cb.onchange = () => { cb.checked ? checked.add(cb.dataset.g) : checked.delete(cb.dataset.g); update(); };
      });
      update();

      function update() {
        const picked = rowsAll.filter(r => checked.has(r.key)).sort((a, b) => a.ord - b.ord);   // strongest first
        const pickedLive = picked.filter(r => r.vec !== undefined);
        const pickedCapped = picked.length - pickedLive.length;
        const pickedGenes = picked.filter(r => !r.bucket).length;
        const curve = [];
        const z = new Float64Array(L.n * K);
        for (let i = 0; i < L.n; i++) for (let c = 0; c < K; c++) z[i * K + c] = L.inter[c];
        pickedLive.forEach(r => {
          addVec(z, r.vec, K, L.scale);
          curve.push({ gene: r.gene, short: r.short || r.gene, w: wOf(r), nfeat: r.nfeat, fired: r.fired,
            auc: scoreZ(z, L.y, L.n, K, cls) });
        });
        const finalAuc = curve.length ? curve[curve.length - 1].auc : null;
        const ref = cls < 0 ? P.full.macro_auc : P.full.per_class_auc[cls];
        const clsTxt = cls < 0 ? 'macro AUC' : `${clsName(P.shared[cls])} AUC`;

        $('gc-sum').innerHTML = [
          [`${pickedGenes} / ${int(GR.n_genes)}`, 'genes checked'],
          [`${int(nFire)}`, `fire in ${esc(TAG[t])}`],
          [int(L.n), 'cells sampled (live curve)'],
          [pickedCapped ? `${pickedCapped} of ${picked.length}` : '0', 'checked but no live data'],
          [finalAuc === null ? 'none' : fmt(finalAuc, 3), cls < 0 ? 'macro AUC, checked rows' : `${esc(clsShort(P.shared[cls]))} AUC, checked`],
          [ref === null || ref === undefined ? 'not recorded' : fmt(ref, 3), 'full model (ref. line)'],
        ].map(([v, k]) => `<div><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');

        /* ---- right: LIVE cumulative AUC over exactly the checked rows ---- */
        const W = 700, H = 380, ML = 56, MR = 20, MT = 18, MB = 54;
        const s2 = svg(W, H); s2.style.width = '100%';
        const vals = curve.map(c => c.auc).concat(ref === null || ref === undefined ? [] : [ref]).filter(v => !Number.isNaN(v));
        const ylo = Math.min(0.4, Math.floor(Math.min(1, ...vals) * 10) / 10), yhi = 1.0;
        const Y = v => MT + (H - MT - MB) * (1 - (v - ylo) / (yhi - ylo));
        const n = curve.length;
        const X = i => ML + (W - ML - MR) * (n <= 1 ? .5 : i / (n - 1));
        for (let v = ylo; v <= 1.0001; v += 0.1) {
          s2.appendChild(E('line', { x1: ML, x2: W - MR, y1: Y(v), y2: Y(v), class: 'gridline' }));
          s2.appendChild(E('text', { x: ML - 8, y: Y(v) + 4, class: 'axlab', 'text-anchor': 'end' }, v.toFixed(1)));
        }
        s2.appendChild(E('line', { x1: ML, x2: W - MR, y1: Y(.5), y2: Y(.5), stroke: 'var(--ink-3)',
          'stroke-width': 1, 'stroke-dasharray': '5 4' }));
        if (ref !== null && ref !== undefined) {
          s2.appendChild(E('line', { x1: ML, x2: W - MR, y1: Y(ref), y2: Y(ref),
            stroke: 'var(--warn)', 'stroke-width': 1.4, 'stroke-dasharray': '3 3' }));
          s2.appendChild(E('text', { x: W - MR - 3, y: Y(ref) - 6, class: 'axlab',
            'text-anchor': 'end', fill: 'var(--warn)' },
            `full model, every test cell = ${fmt(ref, 3)}`));
        }
        if (n) {
          s2.appendChild(E('polyline', { points: curve.map((c, i) => `${X(i)},${Y(c.auc)}`).join(' '),
            fill: 'none', stroke: 'var(--seq-500)', 'stroke-width': 2.4,
            'stroke-dasharray': self ? '7 4' : 'none' }));
          curve.forEach((c, i) => {
            const cc = E('circle', { cx: X(i), cy: Y(c.auc), r: 4, fill: 'var(--seq-600)' });
            s2.appendChild(cc);
            bindTip(cc, `+ <b>${esc(c.gene)}</b><br>
              weight ${cls >= 0 && c.w >= 0 ? '+' : ''}${fmt(c.w, 4)} · ${int(c.nfeat)} feature${c.nfeat > 1 ? 's' : ''},
              ${int(c.fired)} firing in ${esc(TAG[t])}<br>running ${esc(clsTxt)} <b>${fmt(c.auc, 4)}</b><br>
              row ${i + 1} of ${n} checked with live data`);
            if (n <= 26) {
              s2.appendChild(E('text', { x: X(i), y: H - MB + 14, class: 'axlab', 'text-anchor': 'end',
                transform: `rotate(-52 ${X(i)} ${H - MB + 14})` }, c.short));
            }
          });
        } else {
          s2.appendChild(E('text', { x: (ML + W - MR) / 2, y: (MT + H - MB) / 2, class: 'axtitle',
            'text-anchor': 'middle' }, 'check a gene on the left'));
        }
        s2.appendChild(E('line', { x1: ML, x2: W - MR, y1: H - MB, y2: H - MB, class: 'ax' }));
        s2.appendChild(E('text', { x: (ML + W - MR) / 2, y: H - 10, class: 'axtitle', 'text-anchor': 'middle' },
          `checked rows with live data, largest weight first  (${n} of ${picked.length} checked)`));
        s2.appendChild(E('text', { x: 13, y: (MT + H - MB) / 2, class: 'axtitle', 'text-anchor': 'middle',
          transform: `rotate(-90 13 ${(MT + H - MB) / 2})` }, `${clsTxt} on ${TAG[t]}'s cells`));
        if (self) s2.appendChild(E('text', { x: ML + 8, y: MT + 12, class: 'axlab', fill: 'var(--warn)' },
          'dashed = in-sample (same dataset trained and tested)'));
        const box = $('gc-chart'); box.innerHTML = ''; box.appendChild(s2);
        $('gc-leg').innerHTML = (cls < 0
          ? P.shared.map((c, i) => `<span><span class="sw" style="background:${clsCol(i)}"></span>${esc(clsName(c))}</span>`).join('') +
            `<span class="dim">bar = size of the gene's weight; colour = the cell type its weight is most toward</span>`
          : `<span><span class="sw" style="background:var(--coef-pos)"></span>weight &gt; 0 → toward ${esc(clsName(P.shared[cls]))}</span>
             <span><span class="sw" style="background:var(--coef-neg)"></span>weight &lt; 0 → away from it</span>`) +
          `<span style="opacity:.5"><span class="sw" style="background:var(--ink-3)"></span>greyed = fires nothing in ${esc(TAG[t])}</span>
           <span class="dim">curve recomputed live from ${int(L.n)} sampled cells</span>`;

        const un = (P.genes.special || {}).__unmapped_seq__ || {}, ua = (P.genes.special || {}).__unmapped_anchor__ || {};
        const counts = Array.isArray(P.class_n) ? P.shared.map((c, i) => `${int(P.class_n[i])} ${clsName(c)}`).join(', ') : '';
        const subCounts = P.shared.map((c, i) => L.y.filter(v => v === i).length);
        $('gc-note').innerHTML = dl([
          ['pair', `<b>${esc(label(m))}</b> → <b>${esc(label(t))}</b> · ${esc(kindOf(m, t))}`],
          ['features', `${int(P.n_units)}: ${int(P.n_value_units)} sequences + ${int(P.n_anchor_units)} anchor terms`],
          ['genes', `<b>${int(GR.n_genes)}</b> named genes, plus ${int(un.nfeat || 0)} sequences and ${int(ua.nfeat || 0)} anchor terms with no gene name`],
          ['genes that fire', `<b>${int(nFire)}</b> of ${int(GR.n_genes)} have a feature present in ${esc(TAG[t])}; the other ${int(GR.n_genes - nFire)} are greyed`],
          ['everything ticked', `<b>${fmt(L.auc_sub_exact, 4)}</b> macro AUC on the sample; each feature counts toward one gene only, so the rows add up to the whole model`],
          ['sample', `${int(L.n)} of ${int(P.n_cells)} test cells, each cell type kept in proportion (${Array.isArray(P.class_n) ? `full: ${esc(counts)}; ` : ''}sample: ${subCounts.join(' / ')})`],
          ['live data', `the top <b>${int(NV)}</b> genes each; genes #${int(NV + 1)} to ${int(GR.n_genes)} share one row (to keep the page small)`],
          ['note', self ? 'in-sample: the model is scoring its own training cells, so this is a ceiling, not a result' : ''],
        ]);

        const fs = D.grids[grid].f_sign || {};
        $('gc-caveat').innerHTML = bul([
          `<b>Weight = f × coef</b>, one value per cell type.` + (typeof fs.pct_f_negative === 'number' && typeof fs.n_value_features === 'number' ? ` f is negative for ${fmt(fs.pct_f_negative, 1)}% of the ${int(fs.n_value_features)} sequences in the ${esc(GRIDSHORT[grid])} models, so the sign of coef alone gives the wrong direction for about half of them.` : ''),
          `<b>One gene per feature.</b> Each feature is credited to one named gene only (the one with the largest weight), so the rows add up exactly to the model.`,
          `<b>Sample vs all cells.</b> The chart uses a sample (fast to redraw); the reference line uses every test cell. With every row ticked: ${fmt(L.auc_sub_exact, 4)} on the sample, ${fmt(P.full.macro_auc, 4)} on all cells.`,
        ]);
      }
    }

    function selectTop(nWant) {
      const P = pair();
      if (!P || !P.genes.all) { checked = new Set(); draw(); return; }
      checked = new Set(P.genes.all.slice(0, nWant).map(r => 'g:' + r[0]));
      draw();
    }
    trSel.onchange = () => { fillTests(teSel.value); fillCls(clsSel, pair()); selectTop(10); };
    teSel.onchange = () => { fillCls(clsSel, pair()); selectTop(10); };
    soSel.onchange = draw;
    clsSel.onchange = draw;
    hd.onclick = () => { hd.setAttribute('aria-pressed', String(hd.getAttribute('aria-pressed') !== 'true')); draw(); };
    $('gc-top10').onclick = () => selectTop(10);
    $('gc-top20').onclick = () => selectTop(20);
    $('gc-all').onclick = () => {
      const P = pair();
      checked = P ? new Set(geneRows(P).rows.map(r => r.key)) : new Set(); draw();
    };
    $('gc-none').onclick = () => { checked = new Set(); draw(); };
    mkBtn.onclick = () => {
      const P = pair();
      if (!P || mkBtn.disabled) return;
      const grid = modelBy[trSel.value].grid;
      const tissue = modelBy[trSel.value].tissue || null;
      checked = new Set(geneRows(P).rows.filter(r => !r.bucket && markerFor(grid, tissue, r.gene, P.shared) !== null).map(r => r.key));
      draw();
    };
    fillCls(clsSel, pair());
    selectTop(10);
  }

  /* ================= 3.3 gene track: where the sequences sit (reference _js13) ================= */
  const trackCache = {};
  const trackCacheReset = () => { Object.keys(trackCache).forEach(k => { delete trackCache[k]; }); };
  /* flag totals for a whole model, so the key can say "0 here, 904 in this model" and a gene with
     no marks still tells the reader whether the flag fires at all (user, 2026-09-19). Cached: it walks
     every drawn feature of every gene in the model. */
  const flagTotCache = {};
  function modelFlagTotals(d) {
    if (flagTotCache[d]) return flagTotCache[d];
    const t = { spliced: 0, softclip: 0, mismatch: 0, clean: 0 };
    trackGenes(d).forEach(G => G.feats.forEach(f => { t[alnFlag(f)]++; }));
    return (flagTotCache[d] = t);
  }

  function trackGenes(d) {
    if (trackCache[d]) return trackCache[d];
    const X = BRG(modelBy[d].grid);
    if (!X) return [];                      /* that grid's browser file is not loaded yet -- do not cache the miss */
    const M = X.models[d];
    const out = !M ? [] : M.genes.map(g => {
      const gm = X.gene_models[g.ref + ':' + g.gene];
      if (!gm) return null;
      /* row positions are fixed by build/browser.py (its docstring lists all 19); 11-18 are the annotation
         appended on 2026-09-19. Trailing nulls are trimmed off in the JSON, so a short row reads undefined
         here -- which every use below already treats as 'absent'. */
      const feats = g.f.filter(r => r[7] === 'aligned' && r[2] !== null && r[2] !== undefined).map(r => ({
        a: r[0], t: r[1], p: r[2], L: 39, ex: r[3] === 1, frac: r[4], w: r[5], wa: r[6], al: r[8], ed: r[9],
        top: r[10], in: r[2] >= gm.gstart && r[2] <= gm.gend,
        rank: r[11], cig: r[12], snp: r[13], snpc: r[14], cvs: r[15], cvi: r[16], cos: r[17], eed: r[18],
        sj: r[19], cs: r[20] }));
      if (!feats.length) return null;
      return { gene: g.gene, ref: g.ref, w: g.w, top: g.top, n: feats.length, exonic: feats.filter(f => f.ex).length,
        blast: g.blast || 0, feats, M: gm };
    }).filter(Boolean);
    trackCache[d] = out;
    return out;
  }
  /* ---- alignment flag of one placed sequence.
     The lab head's ask: a reader must SEE which sequences are not a clean 39M without clicking each one, so every
     placed sequence gets a mark BELOW the axis. The order is fixed and the first match wins:
       spliced   star_junction present   filled dot
       soft-clip CIGAR contains S        half-filled dot
       mismatch  edit distance > 0       hollow dot
       clean     39M and edit 0          nothing below the line
     Splicing is read from star_junction, NOT from the CIGAR: no CIGAR in any of these stage-3 tables contains an N,
     so minimap/bowtie were never going to answer 'is it spliced?'. The PBMC tables have no star_junction column at
     all (models[...].sj_col = false); there the question is UNANSWERED, not answered 'no', so the key and the panel
     both say 'not recorded' and those sequences fall through to the soft-clip / mismatch / clean test.
     The mark keeps the sequence's own colour (its cell type); the SHAPE carries the flag, never a new colour.
     Both the CIGAR and the edit distance come from the aligner that gave the position (build/browser.py picks one). */
  const edNum = f => {
    if (f.ed === null || f.ed === undefined) return null;
    const t = String(f.ed).trim();
    if (t === '' || t === '*' || t === 'NA' || t === '.') return null;
    const v = Number(t);
    return isFinite(v) ? v : null;
  };
  const FLAGLAB = { spliced: 'spliced', softclip: 'soft-clipped', mismatch: 'mismatch', clean: 'exact match' };
  function alnFlag(f) {
    if (f.sj) return 'spliced';                 /* null whenever the column is absent OR the cell says nothing */
    if ((f.cig || '').indexOf('S') >= 0) return 'softclip';
    const e = edNum(f);
    return (e !== null && e > 0) ? 'mismatch' : 'clean';
  }
  /* draws one flag mark; used by the track and by the key under it, so the two can never drift apart */
  function flagMark(parent, x, y, flag, col, r) {
    r = r || 4;
    if (flag === 'clean') return;
    if (flag === 'spliced') {
      parent.appendChild(E('circle', { cx: x, cy: y, r, fill: col, stroke: col, 'stroke-width': 1.2, class: 'lp-flag' }));
    } else if (flag === 'softclip') {
      parent.appendChild(E('circle', { cx: x, cy: y, r, fill: 'var(--surface)', stroke: col, 'stroke-width': 1.6, class: 'lp-flag' }));
      parent.appendChild(E('path', { d: `M ${x} ${y - r} A ${r} ${r} 0 0 0 ${x} ${y + r} Z`, fill: col, stroke: 'none', class: 'lp-flag' }));
    } else {
      parent.appendChild(E('circle', { cx: x, cy: y, r, fill: 'var(--surface)', stroke: col, 'stroke-width': 1.6, class: 'lp-flag' }));
    }
  }
  /* ---- cs: WHICH base differs, not only how many (row position 20 of build/browser.py).
     minimap2's short cs is the per-base difference list the CIGAR does not carry:
       :N     N bases equal to the genome        *ab   one base substituted
       -seq   bases the GENOME has and ours lacks (deletion)   +seq  bases OURS has and the genome lacks (insertion)
     DIRECTION, the one thing that must not be wrong: in '*ab' the FIRST letter is the REFERENCE (genome) base and
     the SECOND is the QUERY -- our 39-mer. Verified on the data, not taken from the manual: over three stage-3
     tables read in full (PANC/seg, MCX/uterus, PBMC/pbmc_1k_5pv2) every one of the 1,195 rows carrying a
     substitution has our own base equal to the SECOND letter in one of the two reading frames below, and not one
     row matches the first letter without also matching the second.
     FRAME: the cs offsets are the ALIGNED query's, and stage 3 records no strand, so a minus-strand hit describes
     the reverse complement of the stored 39-mer. The frame is therefore resolved against the printed 39-mer
     itself -- the reading whose query letters ARE our letters wins. A single swap is often self-complementary, so
     both frames can fit; then the row says so and prints the other reading rather than picking one silently. */
  const CSTOK = /:\d+|\*[a-z]{2}|[-+][a-z]+|~[a-z]{2}\d+[a-z]{2}/gi;
  const COMP = { A: 'T', C: 'G', G: 'C', T: 'A', N: 'N' };
  const comp = c => COMP[c] || c;
  const rcs = s2 => s2.split('').reverse().map(comp).join('');
  const clipS = cig => { const m = /^(\d+)S/.exec(cig || ''); return m ? +m[1] : 0; };
  const clipTot = cig => (String(cig || '').match(/(\d+)S/g) || []).reduce((a, x) => a + parseInt(x, 10), 0);
  /* raw events in the ALIGNED query's coordinates; q is 0-based, a deletion sits before base q */
  function csRaw(cs, cig) {
    const out = [];
    let q = clipS(cig), any = false;
    const toks = String(cs).match(CSTOK) || [];
    if (!toks.length || toks.join('').length !== String(cs).length) return null;   /* unknown syntax: say nothing */
    toks.forEach(t => {
      const h = t[0];
      if (h === ':') q += parseInt(t.slice(1), 10);
      else if (h === '*') { out.push({ k: 'sub', q, ref: t[1].toUpperCase(), our: t[2].toUpperCase() }); q += 1; any = true; }
      else if (h === '+') { const b = t.slice(1).toUpperCase(); out.push({ k: 'ins', q, b }); q += b.length; any = true; }
      else if (h === '-') { out.push({ k: 'del', q, b: t.slice(1).toUpperCase() }); any = true; }
      else if (h === '~') { q += 0; }                                              /* intron: no query base consumed */
    });
    return { ev: out, any };
  }
  /* events placed on the PRINTED 39-mer, 1-based. frame: 'fwd' | 'rev' | 'both' (either reading fits) |
     'none' (neither fits -- never seen in these six grids, but it is said rather than guessed) */
  function csEvents(cs, cig, seq) {
    if (!cs) return null;
    const raw = csRaw(cs, cig);
    if (!raw) return null;
    const N = seq.length;
    const fits = rev => raw.ev.every(e => {
      if (e.k === 'del') return true;                                    /* deleted bases are the genome's, not ours */
      if (e.k === 'sub') { const p = rev ? N - 1 - e.q : e.q; return p >= 0 && p < N && seq[p] === (rev ? comp(e.our) : e.our); }
      const p0 = rev ? N - e.q - e.b.length : e.q;
      return p0 >= 0 && p0 + e.b.length <= N && seq.substr(p0, e.b.length) === (rev ? rcs(e.b) : e.b);
    });
    const f = fits(false), r = fits(true);
    const frame = f && r ? 'both' : f ? 'fwd' : r ? 'rev' : 'none';
    const place = rev => raw.ev.map(e => {
      if (e.k === 'sub') return { k: 'sub', pos: rev ? N - e.q : e.q + 1, ref: rev ? comp(e.ref) : e.ref, our: rev ? comp(e.our) : e.our };
      if (e.k === 'ins') return { k: 'ins', from: rev ? N - e.q - e.b.length + 1 : e.q + 1, to: rev ? N - e.q : e.q + e.b.length, b: rev ? rcs(e.b) : e.b };
      return { k: 'del', after: rev ? N - e.q : e.q, b: rev ? rcs(e.b) : e.b };     /* sits BETWEEN two of our bases */
    }).sort((x, y) => (x.pos || x.from || x.after + .5) - (y.pos || y.from || y.after + .5));
    return { frame, any: raw.any, ev: place(frame === 'rev'), alt: frame === 'both' ? place(true) : null };
  }
  const evText = e => e.k === 'sub' ? `base ${e.pos}: genome ${e.ref} -> our ${e.our}`
    : e.k === 'del' ? `between bases ${e.after} and ${e.after + 1}: genome has ${e.b}, ours has nothing`
    : `base${e.from === e.to ? ' ' + e.from : 's ' + e.from + ' to ' + e.to}: ours has ${e.b}, the genome has nothing`;
  /* the 'mismatch' row, under 'alignment'. It NEVER implies 'no mismatch' from a missing cs: a row whose edit
     distance is > 0 but whose stage-3 cell carries no cs says the per-base detail is not recorded. */
  function csText(f) {
    const seq = String(f.a || '') + String(f.t || ''), e = edNum(f), c = csEvents(f.cs, f.cig, seq);
    if (!f.cs) return (e !== null && e > 0)
      ? `<span style="color:var(--warn)">not recorded</span>: the sequence file gives no per-base detail for this alignment, so its ${e} mismatch${e === 1 ? '' : 'es'} cannot be placed on a base`
      : '';
    if (!c) return `<span style="color:var(--warn)">not readable</span>: the sequence file gives <span class="mono">${esc(f.cs)}</span>, which is not a cs string`;
    if (!c.any) {
      if (e === null || e <= 0) return '';
      const cl = clipTot(f.cig);
      return cl === e
        ? `none inside the aligned block: the ${e} of the edit distance ${e === 1 ? 'is the soft-clipped base' : 'are the ' + e + ' soft-clipped bases'}, which the aligner never matched`
        : `none recorded inside the aligned block, though the edit distance is ${e}`;
    }
    if (c.frame === 'none') return `<span style="color:var(--warn)">cannot be placed</span>: neither reading of <span class="mono">${esc(f.cs)}</span> matches the sequence`;
    return c.ev.map(evText).join(' · ')
      + (c.frame === 'both'
        ? ` · <span style="color:var(--warn)">strand not recorded</span>, so the same cs reads equally as ${c.alt.map(evText).join(' · ')}`
        : '');
  }
  /* the 39-mer with the differing bases coloured in place. A deletion has no base of ours to colour, so it is
     drawn as a mark BETWEEN two bases; an insertion is our own bases, so those are coloured. */
  function seq39html(f) {
    const a = String(f.a || ''), t = String(f.t || ''), seq = a + t;
    const c = csEvents(f.cs, f.cig, seq), mk = {}, gap = {};
    if (c && c.frame !== 'none') c.ev.forEach(e => {
      if (e.k === 'sub') mk[e.pos] = ['mm', `base ${e.pos}: genome ${e.ref}, ours ${e.our}`];
      else if (e.k === 'ins') {
        const w = e.from === e.to ? `base ${e.from}` : `bases ${e.from} to ${e.to}`;
        for (let i = e.from; i <= e.to; i++) mk[i] = ['ii', `${w}: ours only, the genome has nothing here`];
      }
      else gap[e.after] = `genome has ${e.b} between bases ${e.after} and ${e.after + 1}; ours does not`;
    });
    /* both frames fit (a single swap is often self-complementary and stage 3 records no strand): the OTHER
       reading's base is marked too, faintly, so the panel's two positions are both visible in the 39-mer */
    if (c && c.frame === 'both') c.alt.forEach(e => {
      const q = e.k === 'sub' ? [e.pos] : e.k === 'ins' ? Array.from({ length: e.to - e.from + 1 }, (_, i) => e.from + i) : [];
      q.forEach(i => { if (!mk[i]) mk[i] = ['mq', e.k === 'sub'
        ? `the other reading of the same cs: base ${i}, genome ${e.ref}, ours ${e.our}; strand not recorded`
        : `the other reading of the same cs: base ${i} is ours only; strand not recorded`]; });
      if (e.k === 'del' && !gap[e.after]) gap[e.after] = `the other reading of the same cs: genome has ${e.b} between bases ${e.after} and ${e.after + 1}; strand not recorded`;
    });
    const gm = i => gap[i] ? `<i class="gapm" title="${esc(gap[i])}">▾</i>` : '';
    let out = gm(0) + '<b class="an">';
    for (let i = 1; i <= seq.length; i++) {
      if (i === a.length + 1) out += '</b><span class="tg">';
      out += mk[i] ? `<span class="${mk[i][0]}" title="${esc(mk[i][1])}">${esc(seq[i - 1])}</span>` : esc(seq[i - 1]);
      out += gm(i);
    }
    return out + '</span>';
  }

  /* the BLAST row of the selected-sequence panel. Pass 1 searched the GENCODE transcriptomes of
     BOTH species for every sequence that had no confident alignment (39M with edit distance <= 1);
     the rescue bar is >= 30 of the 39 bases at >= 97% identity, the same bar the page's existing
     BLAST parser uses. Three outcomes, all explicit:
       not searched  -- the sequence already had a confident alignment
       no hit        -- searched, nothing cleared the bar; the reason is printed
       a hit         -- gene, species, identity, coverage, orientation, and the tie set if the top
                        bit score is shared by more than one GENE (then the gene is NOT asserted) */
  /* one line for a genome-only placement. The class comes first because it is the claim being
     made; the gene, where there is one, is the span the position falls in, never an identity. */
  function locText(L) {
    const where = L.cls === 'intronic' ? `<b>intron of ${esc(L.gene)}</b>`
      : L.cls === 'exonic' ? `<b>exon of ${esc(L.gene)}</b>`
      : `<b>intergenic</b>`;
    return `${where} · ${esc(L.gen)} genome · ` +
      `<span class="mono">${esc(L.chr)}:${Number(L.pos).toLocaleString('en-US')}</span>` +
      (L.cls === 'exonic' ? ' · an exon the transcript search missed' : '') +
      (L.gtype && L.gene && L.gtype !== 'protein_coding' ? ` · ${esc(String(L.gtype).replace(/_/g, ' '))}` : '');
  }

  function blastRow(f) {
    const D = BLG(CUR);
    if (!D) return '';
    const e = D[String(f.a || '') + String(f.t || '')];
    if (!e) return '<span class="dim">not searched: this sequence already aligns full length</span>';
    const how = `${esc(String(e.f || '').replace('softclip', 'soft-clipped').replace('other_cigar', 'partial alignment'))}`;
    /* A GENOME hit is a locus, not a gene. "intron of Ets1" says the sequence lies inside that
       gene's span as DNA or pre-mRNA; printing it the way a transcript hit is printed would
       assert it is that gene's mRNA, which is a different and usually false claim -- 990 of the
       1,340 genome hits are intronic. So it reads as a position and never fills the gene slot. */
    if (!e.r && e.loc) return locText(e.loc) + ` · searched because it is ${how}` +
      ` · <span class="dim">no transcript of either species matched it</span>`;
    if (!e.r) return `<span style="color:var(--warn)">no confident hit</span>: searched because it is ${how}` +
      (e.why ? ` · ${esc(e.why)}` : '');
    const amb = e.ng > 1;
    return (amb
        ? `<span style="color:var(--warn)">ambiguous</span>: the best hit is shared by <b>${int(e.ng)}</b> genes, so no gene is assigned`
        : `<b>${esc(e.g)}</b>`) +
      ` \u00b7 ${esc(e.sp)} transcript \u00b7 ${fmt(e.id, 1)}% identity over ${fmt(e.cov, 0)}% of the sequence` +
      ` \u00b7 ${e.o === 'minus' ? 'reverse complement of the transcript' : 'same sense as the transcript'}` +
      ` \u00b7 searched because it is ${how}`;
  }

  /* the 'alignment' row of the selected-sequence panel: '39M, 0 mismatches, spliced (chr1:1000-2000)' /
     '31M8S, soft-clipped' / '39M, 0 mismatches, splicing not recorded for this dataset'. Every absent value is
     SAID; it never prints a value that could be read as a real one, and never implies 'not spliced' from a
     column the experiment does not have. sjCol = does this model's stage-3 table carry star_junction at all. */
  function cigDesc(c) { c = String(c || ''); if (!c) return 'not recorded'; if (/N/.test(c)) return 'split across an intron'; if (/S/.test(c)) return 'partly aligned'; if (/[ID]/.test(c)) return 'full length with an insertion or deletion'; if (/^\d+M$/.test(c)) return 'full length'; return 'aligned'; }
  function alnText(f, sjCol) {
    if (!f.cig) return 'not recorded: the sequence file gives no CIGAR for this alignment';
    const e = edNum(f), sc = (f.cig || '').indexOf('S') >= 0, bits = [];
    if (sc) bits.push('soft-clipped');
    if (e === null) bits.push('mismatches not recorded');
    else if (e > 0 || !bits.length) bits.push(`${e} mismatch${e === 1 ? '' : 'es'}`);
    if (!sjCol) bits.push('splicing not recorded for this dataset');
    else if (f.sj) bits.push(`<b>spliced</b> (<span class="mono">${esc(String(f.sj))}</span>)`);
    return `${cigDesc(f.cig)}, ${bits.join(', ')}`;
  }

  /* the unplaced panel. Counts first (always a share, never a bare number), then the heaviest
     sequences as a table whose rows open the same kind of card a track mark opens. Nothing here is
     drawn at a coordinate, because none of these sequences has one. */
  let unplOpen = false, unplPick = null;
  function renderUnplaced(model) {
    const box = $('br-unpl');
    if (!box) return;
    const U = (UNG(CUR) || {})[model];
    if (!U) { box.innerHTML = ''; return; }
    if (!U.unpl) {
      box.innerHTML = '<p class="note dim">Every selected sequence of this model placed on the genome. Nothing to show here.</p>';
      return;
    }
    const gloc = U.loc || 0;                               /* placed on the genome only */
    const other = Math.max(0, U.unpl - U.res - U.nohit - gloc);  /* in the pool, never searched */
    const bar = (n, cls, lab) => !n ? '' :
      `<div class="ub-row"><span class="ub-bar ${cls}" style="width:${Math.max(2, Math.round(240 * n / U.unpl))}px"></span>` +
      `<span class="ub-n">${int(n)}</span><span class="ub-l">${lab}</span></div>`;
    box.innerHTML =
      `<div class="ub-hd">Sequences the aligner could not place` +
      `<span class="ub-sub">${esc(label(model))} · none of these is on a track above</span></div>` +
      `<div class="ub-stats">` +
      `<div><div class="k">selected by the model</div><div class="v">${int(U.sel)}</div></div>` +
      `<div><div class="k">placed on the genome</div><div class="v">${int(U.placed)} <span class="dim">${pct0(U.placed, U.sel)}%</span></div></div>` +
      `<div><div class="k">never placed</div><div class="v">${int(U.unpl)} <span class="dim">${pct0(U.unpl, U.sel)}%</span></div></div>` +
      `<div><div class="k">of those, BLAST resolved</div><div class="v">${int(U.res)} <span class="dim">${pct0(U.res, U.unpl)}%</span></div></div>` +
      `</div>` +
      `<div class="ub-bars">` + bar(U.mouse, 'ub-m', 'matched a mouse transcript') +
        bar(U.human, 'ub-h', 'matched a human transcript') +
        bar(gloc, 'ub-g', 'matched the genome only (a locus, not a transcript)') +
        bar(U.nohit, 'ub-n0', 'searched, no confident hit') + bar(other, 'ub-n0', 'not searched') + `</div>` +
      `<button class="tab" type="button" id="ub-more" aria-pressed="${unplOpen}">` +
        `${unplOpen ? 'hide the list' : 'list the ' + int(Math.min(U.cap, U.unpl)) + ' heaviest'}</button>` +
      (U.unpl > U.cap ? `<span class="ub-cap">ranked by model weight · the counts above cover all ${int(U.unpl)}</span>` : '') +
      (unplOpen ? `<p class="ub-how">Click any row of the table to open that sequence's full BLAST result; it opens directly below the table.</p>` : '') +
      `<div id="ub-tbl"></div>`;
    $('ub-more').onclick = () => { unplOpen = !unplOpen; renderUnplaced(model); };
    if (!unplOpen) return;

    const B0 = BLG(CUR) || {};
    $('ub-tbl').innerHTML = '<div class="scroll"><table><thead><tr>' +
      '<th></th><th>weight</th><th>gene (BLAST)</th><th>species</th><th>identity</th><th>covered</th>' +
      '</tr></thead><tbody>' +
      U.rows.map(([a, t, w], i) => {
        const e = B0[a + t] || null;
        const g = !e ? '<span class="dim">not searched</span>'
          : (!e.r && e.loc) ? (e.loc.cls === 'intergenic' ? '<span class="ub-loc">intergenic</span>'
              : `<span class="ub-loc">${esc(e.loc.cls === 'intronic' ? 'intron of' : 'exon of')} ${esc(e.loc.gene)}</span>`)
          : !e.r ? '<span style="color:var(--warn)">no confident hit</span>'
          : (e.ng > 1 ? `<span style="color:var(--warn)">ambiguous (${int(e.ng)} genes)</span>` : `<b>${esc(e.g)}</b>`);
        return `<tr class="ub-tr${unplPick === i ? ' on' : ''}" data-i="${i}" tabindex="0" role="button"` +
          ` aria-expanded="${unplPick === i}" title="open this sequence's BLAST result">` +
          `<td class="ub-ar">${unplPick === i ? '▾' : '›'}</td>` +
          `<td>${fmt(w, 4)}</td><td>${g}</td>` +
          `<td>${e && e.r ? esc(e.sp) : (e && e.loc ? esc(e.loc.gen) + ' genome' : 'none')}</td>` +
          `<td>${e && e.r ? fmt(e.id, 1) + '%' : (e && e.loc ? fmt(e.loc.id, 1) + '%' : 'none')}</td>` +
          `<td>${e && e.r ? fmt(e.cov, 0) + '%' : (e && e.loc ? fmt(e.loc.cov, 0) + '%' : 'none')}</td>` +
          `</tr>`;
      }).join('') + '</tbody></table></div><div id="ub-card"></div>';
    $('ub-tbl').querySelectorAll('.ub-tr').forEach(tr => {
      /* a row IS the control: pointer and keyboard both open it, and clicking the open row closes
         it again. The marker in the first column is what makes that legible before the click. */
      const go = () => {
        unplPick = unplPick === Number(tr.dataset.i) ? null : Number(tr.dataset.i);
        renderUnplaced(model);
        const c = $('ub-card');
        if (c && c.firstChild && c.scrollIntoView) c.scrollIntoView({ block: 'nearest' });
      };
      tr.onclick = go;
      tr.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
    });
    if (unplPick === null || !U.rows[unplPick]) return;
    const [a, t, w] = U.rows[unplPick];
    /* the card states only what is known. A sequence that never placed has no position, no
       exon/intron call and no transcript, so those rows are absent rather than blank. */
    $('ub-card').innerHTML = `<div class="brseq"><span class="rk">selected sequence · row ${unplPick + 1} of ${int(U.rows.length)} above</span>` + dl([
      ['model', esc(label(model))],
      ['weight', `<b>${fmt(w, 4)}</b>, summed across this model's classes`],
      ['position', '<span style="color:var(--warn)">none: no aligner placed this sequence</span>'],
      ['BLAST', blastRow({ a: a, t: t })],
    ]) + '</div>';
    const card = $('ub-card');
    card.onclick = ev => {
      let n = ev.target;
      while (n && n !== card && !(n.dataset && n.dataset.seq)) n = n.parentNode;
      if (!n || !n.dataset || !n.dataset.seq) return;
      const done = () => { n.textContent = 'copied'; setTimeout(() => { n.textContent = 'copy'; }, 1200); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(n.dataset.seq).then(done, () => {});
    };
  }

  function renderBrowser() {
    const dSel = $('br-donor'), soSel = $('br-sort'), mk = $('br-mk');
    const sec = $('s-browser');
    if (sec) sec.style.display = '';
    /* the genome browser is the only tool that needs the (large) per-model gene track file, so it is fetched the
       first time the browser is drawn for this grid, not when the tab opens */
    if (!BRG(CUR)) {
      msgInto(['br-sum', 'br-list', 'br-tracks', 'br-note'], 'note',
        `loading the gene tracks for ${esc(GRIDNAME[CUR])}\u2026`);
      const want = CUR;
      ensureBrowser(want, err => {
        if (want !== CUR) return;
        if (err) {
          msgInto(['br-sum', 'br-list', 'br-tracks', 'br-note'], 'note warnbox',
            `The gene tracks for ${esc(GRIDNAME[want])} could not be loaded (${esc(err.message)}). The explorer and the gene close-up above are unaffected.`);
          return;
        }
        /* the isoform and BLAST payloads must be in hand BEFORE the first draw, or the track
           renders once without them and never comes back */
        ensureTrackExtras(want, () => {
          if (want !== CUR) return;
          useBrowser(want);
          try { renderBrowser(); } catch (e) { if (window.console) console.error('Part 3: renderBrowser', e); }
        });
      });
      return;
    }
    /* the browser file is already here but the extras may not be (a tab revisited before they
       landed, or an older cached index): fetch them, then come back */
    if (!ISOG(CUR) && (IDX.files[CUR] || {}).iso) {
      const want2 = CUR;
      ensureTrackExtras(want2, () => { if (want2 === CUR) { try { renderBrowser(); } catch (e) {} } });
    }
    useBrowser(CUR);
    const have = ORDER.filter(d => trackGenes(d).length);
    if (!inGrid(have).length) {
      msgInto(['br-sum', 'br-list', 'br-tracks', 'br-note'], 'note',
        `No model of ${esc(GRIDNAME[CUR])} has a placed sequence to draw.`);
      return;
    }
    dSel.innerHTML = optsModels(inGrid(have));
    dSel.value = pickIn(inGrid(have), defTrain(CUR));
    if (!soSel.value) soSel.value = 'w';
    let pick = null;

    $('br-howto').innerHTML = '';

    function draw() {
      const d = dSel.value, genes = trackGenes(d), MD = B.models[d], grid = modelBy[d].grid, classes = MD.classes || []; _brSp = (modelBy[d] && modelBy[d].species === 'macaque') ? 'macaque' : ((genes[0] && genes[0].ref === 'macaque') ? 'macaque' : 'human');
      const tissue = modelBy[d].tissue || null;
      const why = markerBlock(grid, tissue, classes);
      mk.disabled = !!why;
      if (why) mk.setAttribute('aria-pressed', 'false');
      mk.title = why ? 'no cited marker list for these cell types' : 'show only the genes the cited table lists for this model\'s cell types';
      $('br-mk-why').textContent = '';
      $('br-mksrc').innerHTML = markerSources(grid, tissue, classes);
      let rows = genes.map(g => Object.assign({}, g, { marker: markerFor(grid, tissue, g.gene, classes) }));
      if (mk.getAttribute('aria-pressed') === 'true') rows = rows.filter(r => r.marker !== null);
      const so = soSel.value;
      rows.sort((a, b) => so === 'w' ? Math.abs(b.w) - Math.abs(a.w)
        : so === 'n' ? b.n - a.n
        : so === 'ex' ? (b.exonic / b.n) - (a.exonic / a.n)
        : a.gene.localeCompare(b.gene));
      if (!pick || !rows.some(r => r.gene === pick)) pick = rows.length ? rows[0].gene : null;

      const nf = genes.reduce((a, g) => a + g.n, 0);
      const ex = genes.reduce((a, g) => a + g.exonic, 0);
      $('br-sum').innerHTML = [
        [int(genes.length), 'named genes with a position'],
        [int(nf), 'sequences placed on a gene'],
        [`${pct0(ex, nf)}%`, 'inside an exon'],
        [`${pct0(nf - ex, nf)}%`, 'intronic'],
        [int(MD.n_selected), 'selected sequences in the model'],
        [`${pct0(nf, MD.n_selected)}%`, 'of them drawn here'],
      ].map(([v, k]) => `<div><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');

      /* ---- the sequences with no genome coordinate ---------------------------------------
         A mark is drawn at a genome position, so a sequence that never placed has no mark and no
         click can reach it. On the mouse grids that is most of the model (66,791 of TM's 82,671),
         because gene annotation aligns to GRCh38. Their BLAST verdicts were already in the page's
         payload and unreachable; this panel is the only route to them. It is per MODEL, like the
         rest of 3.3, and its counts are the model's real denominators, not the grid's. */
      renderUnplaced(d);

      const maxW = Math.max(...rows.map(r => Math.abs(r.w)), 1e-9);
      $('br-list').innerHTML = rows.length ? rows.map(r => {
        const col = clsCol(r.top);
        return `<div class="gitem${r.gene === pick ? ' on' : ''}" data-g="${esc(r.gene)}"
            style="${r.gene === pick ? 'background:var(--surface-2)' : ''}">
          <span class="bar" style="width:${Math.max(3, 40 * Math.abs(r.w) / maxW)}px;background:${col}"></span>
          <span class="gn">${esc(r.gene)}${pillOf(r.marker, classes)}</span>
          <span class="gv">${fmt(r.w, 3)}</span>
          <span class="gv dim" style="width:70px;text-align:right">${r.n} seq · ${r.exonic}ex</span>
        </div>`;
      }).join('') : '<div class="gitem dim">no gene passes this filter for this model</div>';
      $('br-list').querySelectorAll('.gitem').forEach(el => {
        if (el.dataset.g) el.onclick = () => { pick = el.dataset.g; draw(); };
      });
      /* the legend names EVERY mark on the figure. Colour = the cell type the feature's weight
         vector points hardest toward -- NOT the sequence type, NOT an annotation. */
      $('br-leg').innerHTML =
        `<span style="width:100%;color:var(--ink-2)">each filled dot is one sequence; its colour is the cell type its weight is most toward</span>` +
        classes.map((c, i) => `<span><span class="sw" style="background:${clsCol(i)}"></span>${esc(clsName(c))}</span>`).join('') +
        `<span><span class="sw" style="background:var(--ink-3)"></span>pushes toward no cell type</span>` +
        `<span><span class="sw" style="background:transparent;border:2px solid var(--warn)"></span>amber ring: the sequence is in an intron of the top transcript</span>` +
        `<span><span class="sw" style="background:var(--seq-400);border:1px solid var(--seq-600)"></span>boxes are exons (tall = coding, short = UTR); the thin line is intron</span>` +
        `<span><span class="sw" style="background:var(--coef-neg);border-radius:2px;transform:rotate(45deg)"></span>diamond on an isoform row: that isoform annotates the sequence differently</span>`;
      drawTrack(rows.find(r => r.gene === pick), d);
      drawBins(d);
    }

    let isoMore = true;                  /* all informative isoforms are drawn by default; the button collapses to 3 */
    function drawTrack(G, d) {
      const box = $('br-tracks');
      if (drawTrack._g !== (G && G.gene)) { isoMore = true; drawTrack._g = G && G.gene; }
      box.innerHTML = '';
      $('br-note').innerHTML = '';
      if (!G) {
        box.innerHTML = '<p class="note dim">No gene selected.</p>';
        if ($('br-mk').getAttribute('aria-pressed') === 'true') $('br-note').innerHTML = `None of the placed genes of <b>${esc(label(d))}</b> is in the cited marker table for its cell types. ` +
          'Switch &ldquo;marker genes only&rdquo; off to see every gene.';
        return;
      }
      const M = G.M, MD = B.models[d], classes = MD.classes || [];
      const gLo = M.gstart ?? M.start, gHi = M.gend ?? M.end, gLen = gHi - gLo;

      /* an outlier is a sequence whose alignment sits far outside the gene body — almost always a
         weak/ambiguous alignment that happens to carry this gene's name. It must never be allowed
         to set the axis and crush everything else, but it must not be silently dropped either. */
      const OUT_THR = Math.max(100000, gLen);
      const within = f => (f.p + f.L >= gLo - OUT_THR) && (f.p <= gHi + OUT_THR);
      const core = G.feats.filter(within);
      const outliers = G.feats.filter(f => !within(f));

      /* zoom window: tightly around where OUR sequences actually are (padded), never smaller than
         a legible minimum, never larger than the gene body itself. */
      const cps = core.length ? core.map(f => f.p) : [gLo, gHi];
      let lo = Math.min(...cps), hi = Math.max(...core.map(f => f.p + f.L), ...(core.length ? [] : [gHi]));
      const pad = Math.max(2000, Math.round((hi - lo) * 0.18));
      lo = Math.max(gLo, lo - pad); hi = Math.min(gHi, hi + pad);
      if (hi - lo < 3000) { const mid = (hi + lo) / 2; lo = mid - 1500; hi = mid + 1500; }
      const zoomFrac = (hi - lo) / gLen;

      const W = 760, ML = 16, MR = 16;
      /* 2026-09-23 isoform rows. The MAIN row is unchanged -- it is still the one transcript every
         number on this page was computed against. The rows beneath it are the isoforms that would
         CHANGE a sequence's call (intron<->exon, CDS<->UTR), drawn as context, so nothing here
         restates a statistic. `isoMore` is the expand toggle. */
      const ISOD = (ISOG(CUR) || {})[(G.ref?G.ref+':':'')+G.gene] || (ISOG(CUR) || {})[G.gene] || null;
      const isoAll = ISOD ? ISOD.tx.filter(t => t.role === 'informative') : [];
      const isoShown = isoMore ? isoAll : isoAll.slice(0, 3);
      /* each isoform gets its own LANE: a label line, then the transcript beneath it, so a label
         can never sit on top of the data. ISO_HDR is the separator + section title. */
      const nIso = isoShown.length;
      const ISO_HDR = 28, ISO_LANE = nIso > 6 ? 24 : 30;   /* tighter lanes once there are many */
      const AX = 168, LMAX = 88;
      const ISO_Y0 = 236;
      const rY = nIso ? ISO_Y0 + ISO_HDR + nIso * ISO_LANE + 10 : 290;
      const H = rY + 50;
      const s = svg(W, H); s.style.width = '100%';
      const X = p => ML + (W - ML - MR) * (Math.max(lo, Math.min(hi, p)) - lo) / Math.max(1, hi - lo);

      const fmtBp = (p, step) => {
        if (step >= 1e6) return Math.round(p / 1e6) + ' Mb';
        if (p >= 1e6) return (p / 1e6).toFixed(Math.min(3, Math.max(0, Math.ceil(-Math.log10(step / 1e6))))) + ' Mb';
        if (step >= 1e3) return (p / 1e3).toFixed(Math.min(3, Math.max(0, Math.ceil(-Math.log10(step / 1e3))))) + ' kb';
        return Math.round(p).toLocaleString('en-US');
      };
      function niceStep(span, target) {
        const raw = span / target, mag = Math.pow(10, Math.floor(Math.log10(raw)));
        for (const mm of [1, 2, 5, 10]) if (mm * mag >= raw) return mm * mag;
        return 10 * mag;
      }

      const col0 = clsCol(G.top), topName = G.top !== null && G.top !== undefined ? clsName(classes[G.top]) : 'no cell type';
      s.appendChild(E('text', { x: ML, y: 18, class: 'axtitle', fill: 'var(--ink)' },
        `${G.gene}  ${M.chr}:${gLo.toLocaleString('en-US')} to ${gHi.toLocaleString('en-US')}  (${M.strand} strand)`));
      s.appendChild(E('text', { x: W - MR, y: 18, class: 'axtitle', 'text-anchor': 'end', fill: col0 },
        `${fmt(G.w, 3)} → ${topName}`));
      s.appendChild(E('text', { x: ML, y: 35, class: 'axlab' },
        `${M.exons.length} exons · ${ISOD ? `${ISOD.tx[0].tname} ${ISOD.tx[0].tx} · ${ISOD.has_mane ? 'MANE Select' : 'Ensembl canonical'}` : `${M.pick} transcript`} · ` +
        (zoomFrac < 0.98
          ? `showing ${((hi - lo) / 1000).toFixed((hi - lo) < 20000 ? 1 : 0)} kb of ${(gLen / 1000).toFixed(gLen < 10000 ? 1 : 0)} kb (${(zoomFrac * 100).toFixed(0)}% of the gene, zoomed to the selected sequences)`
          : `showing the full ${(gLen / 1000).toFixed(gLen < 10000 ? 1 : 0)} kb`)));

      /* intron line + strand chevrons, spanning the full zoom window */
      s.appendChild(E('line', { x1: X(lo), x2: X(hi), y1: AX, y2: AX, stroke: 'var(--ink-3)', 'stroke-width': 1.6 }));
      const nch = Math.max(2, Math.floor((X(hi) - X(lo)) / 50));
      for (let i = 1; i < nch; i++) {
        const x = X(lo) + (X(hi) - X(lo)) * i / nch, dir = M.strand === '+' ? 1 : -1;
        s.appendChild(E('path', { d: `M ${x - 3.5 * dir} ${AX - 4.5} L ${x + 3.5 * dir} ${AX} L ${x - 3.5 * dir} ${AX + 4.5}`,
          fill: 'none', stroke: 'var(--ink-3)', 'stroke-width': 1.3 }));
      }
      /* exon blocks (CDS taller than UTR), minimum width so a small exon is never invisible */
      M.exons.forEach(([es, ee]) => {
        if (ee < lo || es > hi) return;
        const isC = M.cds && ee >= M.cds[0] && es <= M.cds[1];
        const h = isC ? 22 : 13;
        const x0 = X(Math.max(es, lo)), x1 = X(Math.min(ee, hi));
        const r = E('rect', { x: x0, y: AX - h / 2, width: Math.max(3, x1 - x0), height: h,
          rx: 2, fill: 'var(--seq-400)', stroke: 'var(--seq-600)', 'stroke-width': .8 });
        s.appendChild(r);
        bindTip(r, `exon ${es.toLocaleString('en-US')} to ${ee.toLocaleString('en-US')}<br>
          ${(ee - es + 1).toLocaleString('en-US')} bp · ${isC ? 'coding' : 'UTR / non-coding'}`);
      });

      /* lollipops — only sequences inside the zoom window; off-window (incl. outliers) counted
         in a note beneath, never silently dropped */
      const shown = G.feats.filter(f => f.p >= lo && f.p <= hi);
      const offWindow = G.feats.length - shown.length;
      const maxA = Math.max(...shown.map(f => Math.abs(f.w)), 1e-9);
      let lpOn = null;   /* the currently selected mark */
      const yF = AX + 22;          /* baseline of the flag marks, clear of the 22 px exon blocks */
      const flagged = {};          /* how many of the drawn sequences carry each flag, for the key below */
      /* does THIS model's stage-3 table carry star_junction? false (PBMC) means splicing is unanswered here,
         not answered 'no'. Written per model by build/browser.py because schemas differ inside a grid. */
      const sjCol = MD.sj_col !== false, MTOT = modelFlagTotals(d);
      shown.forEach(f => {
        const x = X(f.p + f.L / 2);
        const len = 16 + LMAX * Math.sqrt(Math.abs(f.w) / maxA);
        const y2 = AX - len;
        const col = clsCol(f.top);
        const g = E('g', { class: 'lp', tabindex: 0, role: 'button', 'aria-label': `sequence at ${M.chr}:${f.p.toLocaleString('en-US')}` });
        /* heads overlap wherever two sequences sit at a similar position AND a similar weight, and the
           last one drawn swallowed the clicks (user, 2026-09-19). Three fixes, none of which move a mark:
           a ring in the surface colour so touching heads stay countable, a smaller head, and a hit
           circle on the head itself so the nearest head takes the click rather than a neighbour's stem. */
        g.appendChild(E('line', { x1: x, x2: x, y1: AX - 12, y2, stroke: col, 'stroke-width': 1.6, opacity: .9, class: 'lp-stem' }));
        g.appendChild(E('circle', { cx: x, cy: y2, r: 4.2, fill: col,
          stroke: f.ex ? 'var(--surface)' : 'var(--warn)', 'stroke-width': f.ex ? 1.8 : 2,
          'paint-order': 'stroke fill', class: 'lp-head' }));
        g.appendChild(E('circle', { cx: x, cy: y2, r: 9, fill: 'transparent', class: 'lp-hit' }));
        /* raising the group puts the head the pointer is over on top of its neighbours, so a click
           always lands on the one under the cursor */
        const raise = () => s.appendChild(g);
        g.addEventListener('pointerenter', raise);
        g.addEventListener('focus', raise);
        s.appendChild(g);
        bindTip(g, `<b>${esc(M.chr)}:${f.p.toLocaleString('en-US')}</b><br>click for details`);
        const open = () => {
          if (lpOn) lpOn.classList.remove('on');
          g.classList.add('on');
          lpOn = g;
          const out = $('br-seq');
          if (!out) return;
          out.hidden = false;
          out.innerHTML = '<span class="rk">selected sequence</span>' + dl([
            ['gene', `<b>${esc(G.gene)}</b> · model ${esc(label(d))}`],
            ['position', `${esc(M.chr)}:${f.p.toLocaleString('en-US')} (${esc(M.asm||'GRCh38')})`],
            ['where', (f.ex ? '<b>in an exon</b>' : '<b style="color:var(--warn)">in an intron</b>') +
              (f.in ? '' : ' · <span style="color:var(--warn)">outside the gene’s full bounds</span>')],
            ['along transcript', f.ex && f.frac !== null && f.frac !== undefined ? `${fmt(f.frac, 2)} (0 = 5′ end, 1 = 3′ end)` : ''],
            /* the four rows the lab head asked for, right after the sequence rows. An absent value is SAID
               ('none', 'not in ClinVar'), never left blank and never filled with a stand-in that reads as real. */
            ['rank', f.rank === null || f.rank === undefined || f.rank === '' ? 'not recorded'
              : `<b>${esc(String(f.rank))}</b> · the rank this target was taken at`],
            ['alignment', alnText(f, sjCol)],
            ['mismatch', csText(f)],
            ['known SNP', f.snp ? `<span class="mono">${esc(String(f.snp))}</span>${f.snpc ? ` (${esc(String(f.snpc))})` : ''}` : 'none'],
            ['ClinVar', (f.cvs ? `<b>${esc(String(f.cvs))}</b>${f.cvi ? ` (VCV ${esc(String(f.cvi))})` : ''}`
              : f.cvi ? `listed, no significance given (VCV ${esc(String(f.cvi))})` : 'not in ClinVar')
              + (f.cos ? ` · COSMIC <span class="mono">${esc(String(f.cos))}</span>` : '')],
            ['weight', `<b style="color:${col}">${fmt(f.w, 4)}</b> · most toward ${f.top !== null && f.top !== undefined ? esc(clsName(classes[f.top])) : 'no cell type'}`],
            ['anchor-term weight', f.wa > 0 ? fmt(f.wa, 4) : ''],
            ['aligned by', `${esc(f.al || '')}${f.ed && f.ed !== '0' && f.ed !== '*' ? ` · <span style="color:var(--warn)">${esc(f.ed)} mismatch</span>` : ' · exact'}`],
            /* BLAST (2026-09-23). Only sequences WITHOUT a confident alignment were searched, so
               an absent entry means "not searched", which is a different statement from "no hit"
               and is said as such. A hit is never presented as a gene assignment when the top
               bit-score ties across more than one gene. */
            ['BLAST', blastRow(f)],
          ]);
          out.onclick = e => {
            let n = e.target;
            while (n && n !== out && !(n.dataset && n.dataset.seq)) n = n.parentNode;
            if (!n || !n.dataset || !n.dataset.seq) return;
            const btn = n;
            const done = () => { btn.textContent = 'copied'; setTimeout(() => { btn.textContent = 'copy'; }, 1200); };
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(btn.dataset.seq).then(done, () => {});
          };
        };
        g.addEventListener('click', open);
        g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });

        /* the mark below the axis — same colour as the sequence, shape carries the flag */
        const fl = alnFlag(f);
        flagged[fl] = (flagged[fl] || 0) + 1;
        if (fl !== 'clean') {
          const gf = E('g', { class: 'lpf', tabindex: 0, role: 'button',
            'aria-label': `${FLAGLAB[fl]} sequence at ${M.chr}:${f.p.toLocaleString('en-US')}` });
          gf.appendChild(E('rect', { x: x - 7, y: AX + 10, width: 14, height: 22, fill: 'transparent' }));
          gf.appendChild(E('line', { x1: x, x2: x, y1: AX + 12, y2: yF - 4, stroke: col, 'stroke-width': 1, opacity: .45 }));
          flagMark(gf, x, yF, fl, col);
          s.appendChild(gf);
          const e0 = edNum(f);
          bindTip(gf, `<b>${FLAGLAB[fl]}</b>${fl === 'spliced' ? ` · <span class="mono">${esc(String(f.sj))}</span>` : ''}` +
            `<br>${esc(cigDesc(f.cig))} · ` +
            (e0 === null ? 'edit distance not recorded' : `edit distance ${e0}`) +
            (sjCol ? '' : '<br>splicing not recorded for this dataset') +
            `<br>click for details`);
          gf.addEventListener('click', open);
          gf.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        }
      });

      /* ---- splice isoforms ------------------------------------------------------------
         One LANE per isoform: its name on its own line, the transcript drawn beneath it on the
         SAME x scale as the main track, and a ring on every sequence whose call this isoform
         changes. Without those rings the row is decoration; with them it shows the finding. */
      if (nIso) {
        const hy = ISO_Y0 + 8;
        s.appendChild(E('line', { x1: ML, x2: W - MR, y1: ISO_Y0, y2: ISO_Y0,
          stroke: 'var(--hairline)', 'stroke-width': 1 }));
        s.appendChild(E('text', { x: ML, y: hy + 6, class: 'axtitle', fill: 'var(--ink-2)' },
          `splice isoforms: ${nIso === isoAll.length ? 'all ' : `${nIso} of `}${isoAll.length}` +
          ` that read one of this gene's ${ISOD.positions.length} sequences differently,` +
          ` out of ${ISOD.n_total} transcripts`));
        s.appendChild(E('text', { x: W - MR, y: hy + 6, class: 'axlab', 'text-anchor': 'end',
          fill: 'var(--warn)' }, '\u25cb marks a sequence this isoform reads differently'));
        isoShown.forEach((t, i) => {
          const yL = ISO_Y0 + ISO_HDR + i * ISO_LANE + 9;      /* label line   */
          const yR = yL + 13;                                  /* transcript   */
          s.appendChild(E('text', { x: ML, y: yL, class: 'axlab', fill: 'var(--ink-2)' },
            `${t.tname}  \u00b7  ${t.tx}  \u00b7  ${t.ttype.replace(/_/g, ' ')}` +
            (t.stands_for > 1 ? `  \u00b7  ${t.stands_for} isoforms annotate it this way` : '') +
            `  \u00b7  ${t.changes != null ? t.changes : (t.chg || []).length} of ${ISOD.positions.length} sequences annotated differently`));
          s.appendChild(E('line', { x1: X(Math.max(t.start, lo)), x2: X(Math.min(t.end, hi)),
            y1: yR, y2: yR, stroke: 'var(--ink-3)', 'stroke-width': 1.2 }));
          t.exons.forEach(([es, ee]) => {
            if (ee < lo || es > hi) return;
            const isC = (t.cds || []).some(([cs, ce]) => ee >= cs && es <= ce);
            const h = isC ? 13 : 8;
            const x0 = X(Math.max(es, lo)), x1 = X(Math.min(ee, hi));
            const r = E('rect', { x: x0, y: yR - h / 2, width: Math.max(2.5, x1 - x0), height: h,
              rx: 2, fill: 'var(--seq-400)', stroke: 'var(--seq-600)', 'stroke-width': .8 });
            s.appendChild(r);
            bindTip(r, `<b>${esc(t.tname || t.tx)}</b><br>exon ${es.toLocaleString('en-US')} to ${ee.toLocaleString('en-US')}` +
              `<br>${(ee - es + 1).toLocaleString('en-US')} bp \u00b7 ${isC ? 'coding' : 'UTR / non-coding'}`);
          });
          /* a filled diamond, deliberately NOT an amber ring: amber already means "intronic on the
             top transcript" on the main track, and one colour+shape meaning two things misleads. */
          (t.chg || []).forEach(c => {
            if (c.p < lo || c.p > hi) return;
            const x = X(c.p), g2 = E('g', {});
            g2.appendChild(E('path', { d: `M ${x} ${yR - 5.5} L ${x + 4.5} ${yR} L ${x} ${yR + 5.5} L ${x - 4.5} ${yR} Z`,
              fill: 'var(--coef-neg)', stroke: 'var(--surface)', 'stroke-width': 1, 'paint-order': 'stroke fill' }));
            s.appendChild(g2);
            bindTip(g2, `<b>${esc(t.tname)}</b> annotates this sequence differently<br>` +
              `on ${ISOD.has_mane ? 'MANE Select' : 'the canonical transcript'}: <b>${esc(c.a)}</b><br>` +
              `on this isoform: <b style="color:var(--coef-neg)">${esc(c.b)}</b>`);
          });
        });
      }

      /* coordinate ruler */
      const step = niceStep(hi - lo, 6), start = Math.ceil(lo / step) * step;
      s.appendChild(E('line', { x1: ML, x2: W - MR, y1: rY, y2: rY, class: 'ax' }));
      for (let tt = start; tt <= hi; tt += step) {
        const x = X(tt);
        s.appendChild(E('line', { x1: x, x2: x, y1: rY, y2: rY + 5, stroke: 'var(--ink-3)', 'stroke-width': 1 }));
        s.appendChild(E('text', { x, y: rY + 17, class: 'axlab', 'text-anchor': 'middle' }, fmtBp(tt, step)));
      }
      s.appendChild(E('text', { x: (ML + W - MR) / 2, y: rY + 33, class: 'axtitle', 'text-anchor': 'middle' },
        M.chr + ' position (' + (M.asm||'GRCh38') + ')'));

      box.appendChild(s);
      /* the isoform control. It says what is DRAWN, what was SHIPPED and what EXISTS, because the
         payload caps at 12 transcripts a gene and some genes have hundreds -- "show all" must not
         imply we are showing all of them. */
      if (ISOD) {
        const p2 = document.createElement('p');
        p2.className = 'note dim'; p2.style.margin = '4px 0 0';
        const nInf = isoAll.length;
        if (nInf > 3) {
          const b = document.createElement('button');
          b.className = 'tab'; b.type = 'button';
          b.style.cssText = 'font-size:12px;padding:4px 12px;margin-right:10px;font-weight:600';
          b.textContent = isoMore ? `show only the 3 that change the most` : `show all ${nInf} isoforms that change a call`;
          b.onclick = () => { isoMore = !isoMore; drawTrack(G, d); };
          p2.appendChild(b);
        }
        const t = document.createElement('span');
        /* the caption: what the figure is, then the rule that decided which transcripts are on it,
           then the source. A reader must be able to tell why these rows and not the other forty.
           MOST gene tracks have no isoform row at all (9,041 of 13,144), and for those the lead
           must not announce a figure of changing transcripts that is not there. The three reasons a
           transcript is not its own row are kept apart, because "not shipped" used to mean all
           three at once and read as truncation even when nothing had been dropped:
             agrees with a drawn row  -> collapsed into it, and that row stands for it
             differs only by stopping short of a sequence -> a shorter transcript, not a new reading
             lost the 11-row cut      -> genuinely not on the page (95 genes) */
        const REFNAME = ISOD.has_mane ? 'MANE Select' : 'the Ensembl canonical transcript';
        const NPOS    = int(ISOD.positions.length);
        const SEQS    = ISOD.positions.length === 1 ? 'selected sequence' : 'selected sequences';
        const STRAND  = esc(M.strand === '+' ? 'positive' : 'negative');
        const NTOT    = int(ISOD.n_total);
        const RULE =
          `<br><span style="color:var(--ink-3)">A transcript earns a row when at least one selected ` +
          `sequence falls in a different exon, intron, or UTR than it does on ${REFNAME}. A transcript ` +
          `that merely stops short of a sequence is a shorter transcript, not a different reading, and ` +
          `does not earn one; transcripts that read every sequence alike share a single row. ` +
          `Annotation: ${gANNOT()} (${gASM()}), comprehensive set.`;
        /* every transcript of the gene lands in exactly one of three buckets, and the caption
           accounts for all of them: represented by a drawn row, past the row limit, or differing
           only by stopping short. n_informative counts READINGS (collapsed groups), n_represented
           and n_shortonly count TRANSCRIPTS -- do not mix the two units in one sentence. */
        const nAvail  = nInf;                                        /* readings on the page      */
        const nTrue   = ISOD.n_informative == null ? nInf : ISOD.n_informative;   /* readings that exist */
        const nCutRow = ISOD.n_cut || Math.max(0, nTrue - nAvail);   /* readings past the limit   */
        const nRepr   = ISOD.n_represented || ISOD.n_shipped;        /* transcripts on the page   */
        const nShort  = ISOD.n_shortonly == null ? 0 : ISOD.n_shortonly;
        const nCutTx  = Math.max(0, ISOD.n_total - nRepr - nShort);
        if (!nInf) {
          t.innerHTML = (ISOD.n_distinct === 1
            ? `<b>All ${NTOT} transcripts of this gene read its sequences the same way.</b> ` +
              `<b>${esc(G.gene)}</b> is shown on the ${STRAND} strand of ${M.asm||'GRCh38'}, as ${REFNAME}. ` +
              `Its ${NPOS} ${SEQS} all fall where every annotated transcript agrees, so the single ` +
              `track above stands for all ${NTOT}; there is no alternative reading to draw. `
            : `<b>No alternative transcript reannotates this gene's sequences.</b> ` +
              `<b>${esc(G.gene)}</b> is shown on the ${STRAND} strand of ${M.asm||'GRCh38'}, as ${REFNAME}. ` +
              `Of its ${NTOT} annotated transcripts, every other one either reads all ${NPOS} ` +
              `${SEQS} exactly as ${REFNAME} does or stops short of them, so there is no ` +
              `alternative reading to draw. `) + RULE + `</span>`;
        } else {
          t.innerHTML =
            `<b>Alternative transcripts that change a sequence's annotation.</b> ` +
            `<b>${esc(G.gene)}</b> is shown on the ${STRAND} strand of ${M.asm||'GRCh38'}. ` +
            `The top track is ${REFNAME}. Of <b>${NTOT}</b> annotated transcripts, ` +
            `<b>${int(nTrue)}</b> distinct alternative reading${nTrue === 1 ? '' : 's'} change${nTrue === 1 ? 's' : ''} the ` +
            `annotation of at least one of this gene's <b>${NPOS}</b> ${SEQS} relative to ${REFNAME}` +
            (nAvail < nTrue ? `, and the ${int(nAvail)} that change the most are on the page` : '') +
            (nIso < nAvail ? `, of which ${int(nIso)} ${nIso === 1 ? 'is' : 'are'} drawn` : '') + `. ` +
            RULE +
            ` The rows above stand for ${int(nRepr)} of the ${NTOT} transcripts.` +
            (nCutRow ? ` ${int(nCutRow)} further reading${nCutRow === 1 ? '' : 's'}, covering ` +
                       `${int(nCutTx)} transcript${nCutTx === 1 ? '' : 's'}, ${nCutRow === 1 ? 'is' : 'are'} ` +
                       `past the ${int(nAvail)}-row limit and not on the page.` : '') +
            (nShort ? ` The remaining ${int(nShort)} differ from ${REFNAME} only by stopping short of a sequence.` : '') +
            `</span>`;
        }
        p2.appendChild(t);
        box.appendChild(p2);
      }

      /* one-line key for the marks below the axis. The glyphs are drawn by the same flagMark() as the track,
         so the key can never drift from what is on the chart; it wraps as plain text on a narrow screen. */
      const kb = document.createElement('p');
      kb.className = 'note dim';
      kb.style.margin = '4px 0 0';
      const kt = t => { const n = document.createElement('span'); n.textContent = t; kb.appendChild(n); };
      kt('below the line: ');
      [['spliced', sjCol ? 'spliced (STAR junction)' : 'spliced: not recorded for this dataset'],
       ['softclip', 'soft-clipped (CIGAR S)'], ['mismatch', 'mismatch (edit distance > 0)']]
        .forEach(([fk, lab], i) => {
          if (i) kt(' \u00b7 ');
          const gl = svg(12, 12); gl.style.width = '12px'; gl.style.height = '12px';
          /* the page stylesheet sets svg{display:block}, which put every glyph on its own line and
             broke the key apart (user, 2026-09-19) */
          gl.style.display = 'inline-block';
          gl.style.verticalAlign = 'middle'; gl.style.margin = '0 3px';
          flagMark(gl, 6, 6, fk, 'var(--ink-2)', 4);
          kb.appendChild(gl);
          /* the count is the marks actually drawn in this window. With no star_junction column there is no
             count to give, so the key says the question is unanswered rather than printing a 0, which would
             read as 'nothing here is spliced'. */
          /* two numbers: this gene's window, then the whole model, so a gene with none still
             tells you whether the flag fires at all in this dataset (user, 2026-09-19) */
          const tot = MTOT[fk] || 0;
          kt(fk === 'spliced' && !sjCol ? lab
             : `${lab}: ${flagged[fk] || 0} here, ${tot.toLocaleString()} in this model`);
        });
      kt(`; nothing below the line = exact match: ${flagged.clean || 0} here, `
         + `${(MTOT.clean || 0).toLocaleString()} in this model. Hover a mark for its alignment and edit distance.`);
      box.appendChild(kb);

      if (offWindow > 0) {
        const note = document.createElement('p'); note.className = 'note'; note.style.margin = '8px 0 0';
        note.innerHTML = `<span style="color:var(--warn)">⚠</span> ${offWindow} of ${G.feats.length}
          selected sequence${offWindow > 1 ? 's' : ''} for this gene ${offWindow > 1 ? 'are' : 'is'}
          outside the zoomed window shown` +
          (outliers.length ? `, including <b>${outliers.length}</b> whose alignment lands
            <b>${Math.round(Math.min(...outliers.map(f => Math.min(Math.abs(f.p - gLo), Math.abs(f.p - gHi)))) / 1000).toLocaleString('en-US')}+ kb</b>
            outside ${esc(G.gene)}'s own body. These are almost certainly weak or ambiguous alignments` : '') + '.';
        box.appendChild(note);
      }

      const xs = isXsp(modelBy[d].grid);
      /* how the gene's own sequences align, in the header rather than only in the key under the plot
         (user, 2026-09-19). Counts every placed sequence of this gene, not just the zoom window. */
      const gf = { spliced: 0, softclip: 0, mismatch: 0, clean: 0 };
      G.feats.forEach(f => { gf[alnFlag(f)]++; });
      const alnBits = [`<b>${int(gf.clean)} match the genome exactly</b>`];
      if (gf.mismatch) alnBits.push(`<b>${int(gf.mismatch)} mismatch</b> at one or more bases`);
      if (gf.softclip) alnBits.push(`${int(gf.softclip)} only partly align (soft-clipped)`);
      if (gf.spliced) alnBits.push(`${int(gf.spliced)} cross an exon junction (spliced)`);
      $('br-note').innerHTML = dl([
        ['gene', `<b>${esc(G.gene)}</b> in <b>${esc(label(d))}</b>`],
        ['sequences', `${int(G.n)} placed: <b>${int(G.exonic)}</b> in exons, ${int(G.n - G.exonic)} in introns`],
        ['match / mismatch', `<span class="mmrow">` + alnBits.join(' \u00b7 ')
          + (sjCol ? '' : ' \u00b7 splicing not recorded for this dataset') + `</span>`],
        ['weight', `<b style="color:${col0}">${fmt(G.w, 4)}</b>, favouring ${esc(topName)}`],
        ['locus', `${(gLen / 1000).toFixed(1)} kb on ${esc(M.chr)}, ${esc(M.strand)} strand, ${M.exons.length} exons (${esc(M.pick)} transcript ${esc(M.tx || '')})`],
        ['BLAST only', G.blast ? `${int(G.blast)} more sequences, placed on a RefSeq transcript with no genome position; counted, not drawn` : ''],
        ['species', xs ? 'mouse sequences placed on the human gene (cross-species)' : ''],
      ]);
    }

    /* 3.3b — exonic vs intronic by locus length, pooled over the models of the selected model's species */
    function drawBins(d) {
      const mouse = isXsp(modelBy[d].grid);
      const key = Object.keys(B.species_summary || {}).find(k => k.indexOf(mouse ? 'mouse (' : 'human (') === 0);
      const S = key ? B.species_summary[key] : null;
      const binWrap = $('br-bins') && $('br-bins').parentNode && $('br-bins').parentNode.parentNode;
      if (binWrap) binWrap.style.display = (S && S.length_bins && S.length_bins.length) ? '' : 'none';
      if (!S || !S.length_bins || !S.length_bins.length) { $('br-bins').innerHTML = ''; $('br-bins-note').innerHTML = ''; return; }
      const LB = S.length_bins;
      $('br-bins').innerHTML =
        `<thead><tr><th>locus length</th><th>genes</th><th>sequences placed</th><th>in an exon</th>
          <th>% exonic</th><th>exon share of the locus</th><th>enrichment over uniform</th>
          </tr></thead><tbody>` +
        LB.map(r => `<tr>
          <td><b>${r.lo} to ${r.hi === null ? '∞' : r.hi} kb</b></td>
          <td class="dim">${int(r.genes)}</td><td>${int(r.kmers)}</td><td>${int(r.exonic)}</td>
          <td><b>${r.pct_exonic.toFixed(1)}%</b></td>
          <td class="dim">${r.exon_share.toFixed(1)}%</td>
          <td class="pos"><b>${r.enrich.toFixed(1)}×</b></td></tr>`).join('') + '</tbody>';
      const first = LB[0], last = LB[LB.length - 1];
      const EXS = (S.examples || {});
      const exl = xs => (xs || []).map(g => `<span class="mono">${esc(g.gene)}</span> (${g.kb < 10 ? g.kb.toFixed(1) : int(Math.round(g.kb))} kb, ${int(g.n)} sequences)`).join(', ');
      $('br-bins-note').innerHTML = dl([
        ['pool', `<b>${esc(key)}</b>`],
        ['in exons overall', `<b>${S.pct_exonic_of_placed}%</b> of placed sequences`],
        ['by gene length', `${first.pct_exonic.toFixed(0)}% for genes under ${first.hi} kb → ${last.pct_exonic.toFixed(0)}% for genes over ${last.lo} kb`],
        ['but', `a ${last.lo} kb+ gene is only ${last.exon_share.toFixed(1)}% exon, so chance alone would put ${last.exon_share.toFixed(1)}% of sequences there; we see ${last.pct_exonic.toFixed(1)}%, <b>${last.enrich.toFixed(0)}×</b> more`],
        ['so', `exons are enriched at every length (${Math.min(...LB.map(r => r.enrich)).toFixed(1)} to ${Math.max(...LB.map(r => r.enrich)).toFixed(1)}×); long genes look intronic because they are mostly intron. The intronic share is unspliced pre-mRNA, which single-cell RNA-seq also captures`],
        ['examples', EXS.all_exonic && EXS.all_exonic.length && EXS.all_intronic && EXS.all_intronic.length
          ? `all in exons: ${exl(EXS.all_exonic)} · all in introns: ${exl(EXS.all_intronic)}` : ''],
        ['note', mouse ? `mouse sequences placed on the human genome; only the ${S.pct_aligned}% that align are counted` : ''],
      ]);
    }

    const pk = Object.keys(B.species_summary || {}).find(k => k.indexOf(' value features only') < 0) || '';
    const S0 = pk ? B.species_summary[pk] : {};
    const cav = D.grids[CUR].caveat || {};
    const bc = cav.build_check || {};
    const bl = (GD(CUR).blast || {});
    const mouse = isXsp(CUR);
    $('br-caveat').innerHTML = bul([
        GENOMESAY(),
        mouse
          ? `<b>${esc(GRIDSHORT[CUR])} is mouse, aligned to human.</b> ${bc.pct_in_GRCh38_gene_of_named}% of its placed, named sequences fall inside the human gene against ${bc.pct_in_GRCm39_gene_of_mouse_symbol}% inside the same-named mouse gene, and ${int(bc.on_human_only_contig)} are on human-only contigs, so every track here is cross-species.`
          : '',
        cav.blast_rescue === false
          ? `<b>No BLAST rescue in this experiment.</b> The unaligned sequences of the ${esc(GRIDSHORT[CUR])} models were not sent to NCBI BLAST, so nothing here has a lower-confidence transcript placement. Alignment alone already names ${esc(covRange(CUR))} of each model's sequence weight.`
          : '',
        `<b>One transcript per gene</b> (MANE Select, else canonical, else longest). A sequence shown in an intron may be in an exon of another isoform${typeof S0.pct_inside_of_placed === 'number' ? `; ${S0.pct_inside_of_placed}% fall inside the gene's full bounds, and the rest are marked` : '. Sequences outside the gene\'s full bounds are marked'} <span style="color:var(--warn)">outside gene bounds</span>.`,
      ]);

    dSel.onchange = () => { pick = null; const o = $('br-seq'); if (o) { o.hidden = true; o.innerHTML = ''; } draw(); };
    soSel.onchange = draw;
    mk.onclick = () => {
      if (mk.disabled) return;
      mk.setAttribute('aria-pressed', String(mk.getAttribute('aria-pressed') !== 'true')); draw();
    };
    draw();
  }

  /* ================= footer: limitations, sources, provenance (reference _js7 renderFooter) ================= */
  function renderFooter() {
    if (!$('limits')) return;
    const m = D.meta, P3 = GD(CUR), acc = P3.acceptance || [];
    const cov = (P3.gene_map_coverage || []).filter(r => r.value_weight_mapped_pct_with_blast !== null);
    const covMin = cov.length ? cov.reduce((a, b) => (a.value_weight_mapped_pct_with_blast <= b.value_weight_mapped_pct_with_blast ? a : b)) : null;
    const pairs = (D.grids[CUR].pairs || []).map(t => D.pairs[t]).filter(p => p && !p.stub);
    if (!pairs.length) return;
    const minCls = pairs.reduce((a, p) => Math.min(a, ...p.class_n), Infinity);
    const pk = Object.keys(B.species_summary || {}).find(k => k.indexOf(' value features only') < 0) || '';
    const M0 = pk ? B.species_summary[pk] : {};
    const cav = D.grids[CUR].caveat || {};
    const nPass = acc.filter(r => r.PASS).length;
    const maxDiff = acc.reduce((a, r) => Math.max(a, Math.abs(r.diff_auc)), 0);
    $('limits').innerHTML = [
      `<b>No in-sample pairs.</b> Every curve is a model scored on the cells of a different dataset.`,
      `<b>K counts the model itself.</b> “Picked by K models” and “appears in K datasets” include the model on screen and its own dataset.`,
      cav.mouse_on_human_genome
        ? `<b>${esc(GRIDSHORT[CUR])} is cross-species.</b> Its mouse sequences were aligned to the human genome: only ${M0.pct_aligned}% align, and gene names are human.`
        : `<b>Gene names are labels, not inputs.</b> They were attached after the model was fitted` + (typeof M0.pct_aligned === 'number' ? `; ${M0.pct_aligned}% of the selected sequences align to ${gASM()}.` : '.'),
      `<b>One gene per feature.</b> A gene sharing features with a stronger neighbour can look weaker than it is.`,
      covMin ? `<b>Gene names are incomplete.</b> The least-covered model (${esc(covMin.grid)} ${esc(covMin.model)}) has names for ${covMin.value_weight_mapped_pct_with_blast}% of its sequence weight.` : '',
      cav.blast_rescue === false
        ? `<b>No BLAST rescue here.</b> Unaligned ${esc(GRIDSHORT[CUR])} sequences were not sent to NCBI BLAST, so an unplaced sequence stays unnamed.`
        : '',
      `<b>The gene chart uses a sample</b> of ${int(Math.min(...pairs.map(p => p.live.n)))} to ${int(Math.max(...pairs.map(p => p.live.n)))} cells per pair; the explorer and the reference line use every test cell.`,
      `<b>Small cell types are noisy.</b> The smallest shared cell type in any pair has ${int(minCls)} cells.`,
      `<b>One transcript per gene</b> in the tracks. A sequence shown in an intron may be exonic in another isoform.`,
      `<b>Marker genes only label.</b> They come from the cited marker table; no score depends on them.`,
    ].filter(Boolean).map(t => `<li>${t}</li>`).join('');
    $('cites').innerHTML = [
      `<b>${esc(GRIDNAME[CUR])}</b>: ${esc(String(D.grids[CUR].cite || '').replace(/\s*\u2014\s*/g, ', '))}`,
      `<b>Gene models</b>: ${esc((B.notes || {}).reference || 'GENCODE v50 basic (GRCh38)')}; one representative transcript per gene.`,
      `<b>Marker genes</b>: the cited table's own sources, listed under the gene close-up and the gene track.`,
    ].filter(Boolean).map(t => `<li>${t}</li>`).join('');
    if ($('prov')) $('prov').innerHTML = '';
    if (false) Object.entries(m.sources || {}).map(([k, v]) =>
      `${esc(k)}<br>&nbsp;&nbsp;${esc(v)}`).join('<br><br>') +
      `<br><br>${esc(GRIDNAME[CUR])}: ${int(pairs.length)} scored pairs of ${int(D.grids[CUR].n_pairs_ordered)} ordered.
       Every scored pair's whole-model endpoint reproduces the results-page score:
       ${int(nPass)} of ${int(acc.length)} pass, largest |macro AUC difference| ${fmt(maxDiff, 5)}.
       Curves, presence, gene rows and live vectors were built by <span class="mono">${esc(m.workdir)}/build/</span>
       (run_all.sh). Data built ${esc(m.built)}.`;
  }

  /* ================= the kept top block: where along a transcript the PBMC sequences sit ================= */
  function renderPosition() {
    const T = IDX.pbmc_position_test && IDX.pbmc_position_test.value_features;
    const f3 = v => fmt(v, 3);
    if (!T || !$('p3-pos')) return;
    const C = T.by_category, rows = [['3p_only', 'found only in 3′ data'], ['5p_only', 'found only in 5′ data'], ['both', 'found in both']];
    const W = 900, L = 210, R = 20, T0 = 22, RH = 64, H = T0 + rows.length * RH + 34;
    let g = '';
    for (let b = 0; b <= 10; b += 2) {
      const xx = L + (b / 10) * (W - L - R);
      g += `<line class="gl" x1="${xx}" x2="${xx}" y1="${T0 - 6}" y2="${T0 + rows.length * RH - 8}"/>` +
        `<text class="axl" x="${xx}" y="${T0 + rows.length * RH + 6}" text-anchor="middle">${(b / 10).toFixed(1)}</text>`;
    }
    g += `<text class="axl" x="${L}" y="${H - 4}">5′ end</text><text class="axl" x="${W - R}" y="${H - 4}" text-anchor="end">3′ end</text>` +
      `<text class="axl" x="${(L + W - R) / 2}" y="${H - 4}" text-anchor="middle">position along the transcript</text>`;
    rows.forEach(([k, lab], i) => {
      const c = C[k], hist = c.hist10, mx = Math.max.apply(null, hist), y0 = T0 + i * RH, bw = (W - L - R) / 10;
      g += `<text class="plab" x="${L - 12}" y="${y0 + 20}" text-anchor="end">${esc(lab)}</text>` +
        `<text class="axl" x="${L - 12}" y="${y0 + 34}" text-anchor="end">${c.n_exonic_placed.toLocaleString()} placed · median ${f3(c.median_frac)}</text>`;
      hist.forEach((h, b) => {
        const hh = (h / mx) * 44;
        g += `<rect class="p3h p3h-${k}" x="${L + b * bw + 1}" y="${y0 + 48 - hh}" width="${bw - 2}" height="${hh}"><title>${h} sequences</title></rect>`;
      });
      const mxp = L + c.median_frac * (W - L - R);
      g += `<line class="p3med" x1="${mxp}" x2="${mxp}" y1="${y0 - 2}" y2="${y0 + 50}"/>`;
    });
    $('p3-pos').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="where the sequences sit along their transcripts">${g}</svg>`;
    $('p3-pos-read').innerHTML =
      `<li><b>Found only in 3′ data:</b> median position ${f3(C['3p_only'].median_frac)}, ${C['3p_only'].pct_last20}% in the last fifth of the transcript.</li>` +
      `<li><b>Found only in 5′ data:</b> median position ${f3(C['5p_only'].median_frac)}, ${C['5p_only'].pct_first20}% in the first fifth.</li>` +
      `<li><b>Found in both:</b> ${C.both.n.toLocaleString()} of ${T.n_unique.toLocaleString()} sequences (${(100 * C.both.n / T.n_unique).toFixed(0)}%).</li>`;
  }

  /* ================= the six tabs ================= */
  function renderGridTabs() {
    const bar = $('p3-gridtabs');
    if (!bar) return;
    bar.innerHTML = GRIDS.map((g, gi) => {
      const G = D.grids[g], on = g === CUR;
      return `<button type="button" role="tab" class="p3gt${on ? ' on' : ''}"
        aria-selected="${on}" data-grid="${g}"><span class="p3gtn"><span class="p3gtno">${gi + 1}</span>
        ${esc(GRIDNAME[g])}</span>
        <span class="p3gtc">${int(G.pairs.length)} / ${int(G.n_pairs_ordered)} pairs scored${
          on ? ' \u00b7 showing' : ''}</span></button>`;
    }).join('');
    bar.onclick = e => {
      let n = e.target;
      while (n && n !== bar && !(n.dataset && n.dataset.grid)) n = n.parentNode;
      if (n && n.dataset && n.dataset.grid) switchGrid(n.dataset.grid);
    };
    const note = $('p3-gridnote');
    if (note) {
      const G = D.grids[CUR], nb = (G.blank || []).length;
      const reasons = [];
      (G.blank || []).forEach(b => { if (reasons.indexOf(b.reason) < 0) reasons.push(b.reason); });
      note.innerHTML = nb
        ? `<b>${int(G.pairs.length)} of ${int(G.n_pairs_ordered)} ordered pairs are scored.</b> The other
           ${int(nb)} are recorded as \u201c${esc(reasons.join('; '))}\u201d: they share fewer than two cell
           types with at least 20 test cells, so there is no score to show and they are not offered in the menus.`
        : `All ${int(G.n_pairs_ordered)} ordered pairs of this experiment are scored.`;
    }
  }

  /* ================= per-grid caveat box (was the Tabula Muris warning) ================= */
  function renderGridCaveat() {
    const el = $('p3-tmwarn');
    if (!el) return;
    const G = D.grids[CUR], cav = G.caveat || {}, bc = cav.build_check || {};
    const lines = [];
    if (cav.mouse_on_human_genome && isXsp(CUR)) {
      lines.push(`<b>${esc(GRIDSHORT[CUR])} is mouse, annotated against the human genome.</b> Its mouse sequences
        were aligned to GRCh38, so the gene names and positions in the gene close-up and the gene track are
        cross-species: ${bc.pct_in_GRCh38_gene_of_named}% of its placed, named sequences sit inside their human
        gene, against ${bc.pct_in_GRCm39_gene_of_mouse_symbol}% inside the same-named mouse gene, and
        ${int(bc.on_human_only_contig)} sit on human-only contigs. The explorer's scores do not depend on any of this.`);
    }
    if (cav.blast_rescue === false) {
      lines.push(`<b>No BLAST rescue in this experiment.</b> Unaligned sequences of the ${esc(GRIDSHORT[CUR])} models were
        not sent to NCBI BLAST, so a sequence the aligners could not place stays unnamed here. Alignment alone
        already names ${esc(covRange(CUR))} of each model's sequence weight.`);
    }
    el.hidden = !lines.length;
    el.innerHTML = lines.join('<br><br>');
  }

  /* ================= switching grid: load that grid's payload, then redraw the three tools ================= */
  let loadSeq = 0;
  function applyGrid(g) {
    CUR = g;
    useBrowser(g);
    trackCacheReset();
    [renderGridTabs, renderGridCaveat, renderExplore, renderGeneCloseup, renderBrowser, renderFooter].forEach(f => {
      try { f(); } catch (e) { if (window.console) console.error('Part 3:', f.name, e); }
    });
  }
  function switchGrid(g) {
    if (!D.grids[g] || (g === CUR && D.grids[g].loaded)) return;
    if (dataOf(g)) { mergeGrid(g); applyGrid(g); return; }
    CUR = g;
    const seq = ++loadSeq;
    renderGridTabs();
    renderGridCaveat();
    msgInto(LOADBOXES, 'note', `loading ${esc(GRIDNAME[g])}\u2026`);
    ensureData(g, err => {
      if (seq !== loadSeq) return;                       /* a later tab click won */
      if (err) {
        msgInto(LOADBOXES, 'note warnbox',
          `${esc(GRIDNAME[g])} could not be loaded (${esc(err.message)}). Pick another tab, or reload the page.`);
        return;
      }
      applyGrid(g);
    });
  }
  window.__p3switch = switchGrid;   /* lets a test drive the tabs */

  /* ================= boot: the index is already here, the first grid is fetched like any other ================= */
  try { renderPosition(); } catch (e) { if (window.console) console.error('Part 3: renderPosition', e); }
  renderGridTabs();
  (function boot() {
    const g = CUR;
    if (dataOf(g)) { mergeGrid(g); applyGrid(g); return; }
    msgInto(LOADBOXES, 'note', `loading ${esc(GRIDNAME[g])}\u2026`);
    ensureData(g, err => {
      if (err) {
        msgInto(LOADBOXES, 'note warnbox',
          `${esc(GRIDNAME[g])} could not be loaded (${esc(err.message)}). Reload the page, or pick another tab.`);
        return;
      }
      applyGrid(g);
    });
  })();
})();
