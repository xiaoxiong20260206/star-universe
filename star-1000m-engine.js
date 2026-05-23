// ============================================================
//  star-1000m-engine.js  — 1000 M☉ 恒星 + 4光年行星双场景引擎
//  含 PISN 爆炸特效 + PPISN 脉冲特效 + 行星状态演化
// ============================================================

"use strict";

const MAX_PROGRESS_1K = 1000;

// ---------- 工具函数 ----------
function lerp1K(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

function formatAge1K(myr) {
  if (myr < 0.01)  return `${(myr * 10000).toFixed(0)} 年`;
  if (myr < 1)     return `${(myr * 100).toFixed(0)} 万年`;
  if (myr < 10000) return `${myr.toFixed(2)} 百万年`;
  return `${(myr / 1000).toFixed(2)} 十亿年`;
}

function formatLum1K(l) {
  if (l >= 1e11) return `${(l / 1e11).toFixed(1)} ×10¹¹`;
  if (l >= 1e9)  return `${(l / 1e9).toFixed(1)} ×10⁹`;
  if (l >= 1e6)  return `${(l / 1e6).toFixed(1)} ×10⁶`;
  if (l >= 1e3)  return `${(l / 1e3).toFixed(1)} ×10³`;
  return l.toFixed(2);
}

function formatRadius1K(r) {
  if (r >= 1e8)  return `${(r / 1e8).toFixed(1)} ×10⁸ R☉`;
  if (r >= 1e6)  return `${(r / 1e6).toFixed(1)}M R☉`;
  if (r >= 1000) return `${(r / 1000).toFixed(1)}K R☉`;
  if (r >= 10)   return `${r.toFixed(0)} R☉`;
  return `${r.toFixed(2)} R☉`;
}

// 可见尺寸映射
const PHASE_VISUAL_SIZE_1K = {
  "cloud":       55,
  "protostar":   65,
  "zams":        100,
  "hypergiant":  110,
  "lbv":         140,
  "wolf-rayet":   75,
  "ppisn":        88,
  "pisn":        220,   // 动态扩大
  "pisn-nebula": 180,
};

// 构建等宽进度区间
function buildRanges1K(phases) {
  const total   = phases.length;
  const minSpan = Math.floor(MAX_PROGRESS_1K * 0.06);
  const reserved = minSpan * total;
  const remaining = MAX_PROGRESS_1K - reserved;
  const ageSpans = phases.map(p => Math.max(p.ageEndMyr - p.ageStartMyr, 0.0001));
  const totalAge = ageSpans.reduce((a, b) => a + b, 0);
  let cur = 0;
  return phases.map((p, i) => {
    const span = minSpan + Math.round((ageSpans[i] / totalAge) * remaining);
    const start = cur;
    const end   = cur + span;
    cur = end;
    return { start, end };
  });
}

function getPhaseIdx1K(ranges, progress) {
  for (let i = ranges.length - 1; i >= 0; i--) {
    if (progress >= ranges[i].start) return i;
  }
  return 0;
}

// ============================================================
// StarWidget1K — 恒星渲染
// ============================================================
class StarWidget1K {
  constructor(container) {
    this.data   = STAR_1000M;
    this.ranges = buildRanges1K(this.data.phases);
    this._currentPhase = this.data.phases[0];
    this._currentIdx   = 0;
    this._buildDOM(container);
  }

  _buildDOM(container) {
    this.slot = container;
    this.slot.innerHTML = `
      <div class="sw-visual" style="position:relative;display:flex;align-items:center;justify-content:center;min-height:280px;width:100%;">
        <div class="sw1k-space"></div>
        <div class="sw1k-halo"  data-ref="halo"></div>
        <div class="sw1k-halo2" data-ref="halo2"></div>
        <div class="sw1k-core"  data-ref="core">
          <div class="sw1k-corona" data-ref="corona"></div>
          <div class="sw1k-surface" data-ref="surface"></div>
          <div class="sw1k-flare1" data-ref="flare1"></div>
          <div class="sw1k-flare2" data-ref="flare2"></div>
          <div class="sw1k-sn" data-ref="sn" style="display:none">
            <div class="pisn-ring1"></div>
            <div class="pisn-ring2"></div>
            <div class="pisn-ring3"></div>
            <div class="pisn-boom">💥</div>
          </div>
        </div>
        <div class="sw1k-age" data-ref="age">0</div>
        <div class="sw1k-phase-badge" data-ref="phaseBadge"></div>
      </div>
      <div class="sw1k-info">
        <div class="sw1k-pname" data-ref="pname">分子云</div>
        <div class="sw1k-meta-row">
          <div class="sw1k-meta-item"><span class="sw1k-meta-label">时间跨度</span><span data-ref="pspan" class="sw1k-meta-val">—</span></div>
          <div class="sw1k-meta-item"><span class="sw1k-meta-label">表面温度</span><span data-ref="temp" class="sw1k-meta-val">—</span></div>
          <div class="sw1k-meta-item"><span class="sw1k-meta-label">光度</span><span data-ref="lum" class="sw1k-meta-val">—</span></div>
          <div class="sw1k-meta-item"><span class="sw1k-meta-label">半径</span><span data-ref="radius" class="sw1k-meta-val">—</span></div>
        </div>
        <div class="sw1k-note" data-ref="note"></div>
      </div>
    `;
    const get = k => this.slot.querySelector(`[data-ref="${k}"]`);
    this.$ = {
      halo:       get("halo"),
      halo2:      get("halo2"),
      core:       get("core"),
      corona:     get("corona"),
      surface:    get("surface"),
      flare1:     get("flare1"),
      flare2:     get("flare2"),
      sn:         get("sn"),
      age:        get("age"),
      phaseBadge: get("phaseBadge"),
      pname:      get("pname"),
      pspan:      get("pspan"),
      temp:       get("temp"),
      lum:        get("lum"),
      radius:     get("radius"),
      note:       get("note")
    };
  }

  render(progress) {
    const phases = this.data.phases;
    const ranges = this.ranges;
    const idx    = getPhaseIdx1K(ranges, progress);
    const phase  = phases[idx];
    const next   = phases[Math.min(idx + 1, phases.length - 1)];
    const range  = ranges[idx];
    const t      = range.end === range.start ? 0 : (progress - range.start) / (range.end - range.start);

    const age    = lerp1K(phase.ageStartMyr, phase.ageEndMyr, t);
    const lum    = lerp1K(phase.lumLsun,     next.lumLsun,    t * 0.4);
    const temp   = lerp1K(phase.tempK,       next.tempK,      t * 0.3);
    const radius = lerp1K(phase.radiusRsun,  next.radiusRsun, t * 0.3);

    const isSN      = phase.special === "pisn";
    const isPPISN   = phase.special === "pre-pisn";
    const isNebula  = phase.special === "pisn-nebula";
    const isLBV     = phase.key === "lbv";
    const isWR      = phase.key === "wolf-rayet";
    const isHyper   = phase.key === "hypergiant";

    let baseSize = PHASE_VISUAL_SIZE_1K[phase.key] || 80;
    if (isSN) baseSize = Math.min(260, baseSize + t * 180);

    const size      = baseSize;
    const haloSize  = size * (isNebula ? 4.0 : isSN ? 4.5 : isLBV ? 3.4 : 2.5);
    const halo2Size = size * (isNebula ? 6.0 : isSN ? 7.0 : 1.7);

    const color = phase.color;
    const now   = Date.now();

    // ---- Size ----
    this.$.core.style.width   = `${size}px`;
    this.$.core.style.height  = `${size}px`;
    this.$.core.style.borderRadius = "50%";
    this.$.core.style.position     = "relative";
    this.$.core.style.zIndex       = "10";
    this.$.core.style.flexShrink   = "0";

    // 清除动画类
    this.$.core.classList.remove("sw1k-danger", "sw1k-lbv-pulse", "sw1k-wr-glow", "sw1k-nebula-float");

    if (isSN) {
      // ---- PISN 爆炸 ----
      const blast = Math.min(1, t * 1.5);
      this.$.core.style.background = `radial-gradient(circle at 50% 50%,
        #ffffff 0%, #fffff0 6%, #ffff88 16%, #ffdd44 30%, #ff8822 50%,
        ${color} 70%, rgba(220,60,20,0.5) 86%, transparent 100%)`;
      this.$.core.style.boxShadow = `
        0 0 ${Math.round(size * 1.0)}px rgba(255,255,200,0.95),
        0 0 ${Math.round(size * 2.5)}px rgba(255,200,60,0.7),
        0 0 ${Math.round(size * 5)}px rgba(255,120,20,0.4),
        0 0 ${Math.round(size * 9)}px rgba(255,60,0,0.15)`;
      this.$.sn.style.display = "";
      const rings = this.$.sn.querySelectorAll(".pisn-ring1,.pisn-ring2,.pisn-ring3");
      rings.forEach((r, i) => {
        const rScale = 1 + (blast + i * 0.3) * 4.0;
        r.style.transform = `translate(-50%,-50%) scale(${rScale})`;
        r.style.opacity   = String(Math.max(0, 1 - blast - i * 0.25));
      });
      const boom = this.$.sn.querySelector(".pisn-boom");
      if (boom) boom.style.fontSize = `${Math.round(size * 0.6)}px`;

      this.$.halo.style.background = `radial-gradient(circle,
        rgba(255,255,200,${0.6 + blast * 0.35}) 0%, rgba(255,200,80,0.4) 30%,
        rgba(255,120,20,0.15) 60%, transparent 80%)`;
      this.$.halo2.style.background = `radial-gradient(circle,
        rgba(255,200,100,0.25) 0%, rgba(255,100,20,0.1) 45%, transparent 70%)`;
      this.$.surface.style.display = "none";
      this.$.corona.style.display  = "none";
      this.$.flare1.style.display  = "none";
      this.$.flare2.style.display  = "none";

    } else if (isPPISN) {
      // ---- PPISN 脉冲：危险闪烁 ----
      const pulse = 0.5 + 0.5 * Math.sin(now / 120);
      const pulse2 = 0.5 + 0.5 * Math.sin(now / 200 + 1.2);
      this.$.core.style.background = `radial-gradient(circle at 38% 32%,
        #ffffff 0%, #ffff66 8%, #ffcc22 24%, #ff6600 50%, ${color} 78%, #220000 100%)`;
      this.$.core.style.boxShadow = `
        0 0 ${Math.round(size * (0.7 + pulse * 0.7))}px rgba(255,${Math.round(80 + pulse * 100)},20,${0.7 + pulse * 0.3}),
        0 0 ${Math.round(size * (1.5 + pulse2 * 1.2))}px rgba(255,60,0,${0.4 + pulse2 * 0.35}),
        inset 0 0 ${Math.round(size * 0.3)}px rgba(255,255,100,0.5)`;
      this.$.core.classList.add("sw1k-danger");
      this.$.sn.style.display = "none";
      this.$.surface.style.display = "";
      this.$.corona.style.display  = "";
      this.$.flare1.style.display  = "";
      this.$.flare2.style.display  = "";

      this.$.halo.style.background = `radial-gradient(circle,
        rgba(255,${Math.round(100 + pulse * 100)},20,${0.5 + pulse * 0.3}) 0%,
        rgba(255,50,0,0.22) 40%, rgba(200,15,0,0.06) 65%, transparent 80%)`;
      this.$.halo2.style.background = `radial-gradient(circle,
        rgba(255,70,0,0.18) 0%, rgba(200,15,0,0.06) 50%, transparent 70%)`;

    } else if (isNebula) {
      // ---- 遗迹星云 ----
      this.$.core.style.background = `radial-gradient(circle at 50% 50%,
        rgba(255,220,100,0.18) 0%, rgba(255,140,40,0.35) 20%, ${color} 45%,
        rgba(200,80,20,0.4) 65%, rgba(100,30,10,0.12) 80%, transparent 100%)`;
      this.$.core.style.boxShadow = `
        0 0 ${Math.round(size * 1.4)}px rgba(255,140,40,0.55),
        0 0 ${Math.round(size * 2.5)}px rgba(200,80,20,0.28)`;
      this.$.core.classList.add("sw1k-nebula-float");
      this.$.sn.style.display = "none";
      this.$.surface.style.display = "";
      this.$.corona.style.display  = "none";
      this.$.flare1.style.display  = "none";
      this.$.flare2.style.display  = "none";

      this.$.halo.style.background = `radial-gradient(circle,
        rgba(255,140,60,0.4) 0%, rgba(220,100,30,0.2) 35%,
        rgba(150,50,10,0.08) 60%, transparent 80%)`;
      this.$.halo2.style.background = `radial-gradient(circle,
        rgba(200,80,20,0.15) 0%, rgba(150,40,10,0.06) 50%, transparent 75%)`;

    } else if (isLBV) {
      const ejPulse = 0.5 + 0.5 * Math.sin(now / 600);
      this.$.core.style.background = `radial-gradient(circle at 36% 30%,
        #ffffff 0%, #ffeeff 8%, #ff99cc 28%, ${color} 58%, #330010 100%)`;
      this.$.core.style.boxShadow = `
        0 0 ${Math.round(size * 0.8)}px rgba(255,100,180,0.85),
        0 0 ${Math.round(size * (1.8 + ejPulse))}px rgba(220,60,140,${0.45 + ejPulse * 0.3}),
        0 0 ${Math.round(size * 3.5)}px rgba(180,30,100,0.18)`;
      this.$.core.classList.add("sw1k-lbv-pulse");
      this.$.sn.style.display = "none";
      this.$.surface.style.display = "";
      this.$.corona.style.display  = "";
      this.$.flare1.style.display  = "";
      this.$.flare2.style.display  = "";

      this.$.halo.style.background = `radial-gradient(circle,
        rgba(255,100,180,${0.35 + ejPulse * 0.3}) 0%,
        rgba(200,60,130,0.18) 40%, rgba(150,20,80,0.06) 65%, transparent 80%)`;
      this.$.halo2.style.background = `radial-gradient(circle,
        rgba(220,80,150,0.12) 0%, transparent 55%)`;

    } else if (isWR) {
      this.$.core.style.background = `radial-gradient(circle at 35% 28%,
        #ffffff 0%, #eeeeff 6%, #aaccff 18%, ${color} 48%, #330033 82%, #110011 100%)`;
      this.$.core.style.boxShadow = `
        0 0 ${Math.round(size * 0.7)}px rgba(180,200,255,0.95),
        0 0 ${Math.round(size * 1.8)}px rgba(120,160,255,0.55),
        0 0 ${Math.round(size * 3.5)}px rgba(80,100,255,0.22),
        inset 0 0 ${Math.round(size * 0.25)}px rgba(255,255,255,0.6)`;
      this.$.core.classList.add("sw1k-wr-glow");
      this.$.sn.style.display = "none";
      this.$.surface.style.display = "";
      this.$.corona.style.display  = "";
      this.$.flare1.style.display  = "none";
      this.$.flare2.style.display  = "none";

      this.$.halo.style.background = `radial-gradient(circle,
        rgba(150,180,255,0.4) 0%, rgba(100,130,255,0.18) 38%,
        rgba(60,80,200,0.07) 62%, transparent 80%)`;
      this.$.halo2.style.background = `radial-gradient(circle,
        rgba(100,140,255,0.12) 0%, transparent 55%)`;

    } else {
      // ---- 普通阶段 ----
      let innerColor = "#ffffff";
      let midColor   = color;
      let outerColor = "#110022";
      if (temp > 50000) {
        innerColor = "#ffffff"; midColor = "#88ccff"; outerColor = "#000044";
      } else if (temp > 20000) {
        innerColor = "#ffffff"; midColor = "#aaddff"; outerColor = "#001133";
      } else if (temp > 8000) {
        innerColor = "#fffff0"; midColor = color; outerColor = "#110000";
      } else {
        innerColor = "#ffeecc"; midColor = color; outerColor = "#220000";
      }
      this.$.core.style.background = `radial-gradient(circle at 32% 28%,
        ${innerColor} 0%, ${innerColor} 10%, ${midColor} 48%, ${outerColor} 100%)`;

      const glowStrength = Math.min(1, lum / 20000000);
      const glowR = temp > 40000 ? 80 : temp > 15000 ? 140 : 200;
      const glowG = temp > 40000 ? 120 : temp > 15000 ? 170 : 130;
      const glowB = temp > 40000 ? 255 : 180;
      this.$.core.style.boxShadow = `
        0 0 ${Math.round(size * 0.5)}px rgba(${glowR},${glowG},${glowB},0.95),
        0 0 ${Math.round(size * 1.2)}px rgba(${glowR},${glowG},${glowB},${0.4 + glowStrength * 0.4}),
        0 0 ${Math.round(size * 2.8)}px rgba(${glowR},${glowG},${glowB},${0.15 + glowStrength * 0.2}),
        inset 0 0 ${Math.round(size * 0.3)}px rgba(255,255,255,0.35)`;

      this.$.sn.style.display = "none";
      this.$.surface.style.display = "";
      this.$.corona.style.display  = "";
      this.$.flare1.style.display  = "";
      this.$.flare2.style.display  = "none";

      this.$.halo.style.background = `radial-gradient(circle,
        rgba(${glowR},${glowG},${glowB},${0.3 + glowStrength * 0.25}) 0%,
        rgba(${glowR},${glowG},${glowB},0.12) 40%,
        rgba(${glowR},${glowG},${glowB},0.04) 65%, transparent 80%)`;
      this.$.halo2.style.background = `radial-gradient(circle,
        rgba(${glowR},${glowG},${glowB},0.1) 0%, transparent 60%)`;
    }

    // ---- halo 尺寸 ----
    this.$.halo.style.width    = `${haloSize}px`;
    this.$.halo.style.height   = `${haloSize}px`;
    this.$.halo2.style.width   = `${halo2Size}px`;
    this.$.halo2.style.height  = `${halo2Size}px`;

    // ---- 阶段徽章 ----
    const badgeColors = {
      "cloud": "#ff6688", "protostar": "#ff4477", "zams": "#dd2244",
      "hypergiant": "#cc1840", "lbv": "#bb2266", "wolf-rayet": "#aa2855",
      "ppisn": "#ffcc22", "pisn": "#ffee00", "pisn-nebula": "#ff8844",
    };
    this.$.phaseBadge.textContent = phase.name;
    this.$.phaseBadge.style.background = "rgba(0,0,0,0.55)";
    this.$.phaseBadge.style.borderColor = (badgeColors[phase.key] || "#ff3366") + "66";
    this.$.phaseBadge.style.color = badgeColors[phase.key] || "#ffaacc";

    // ---- info ----
    this.$.age.textContent    = formatAge1K(age);
    this.$.pname.textContent  = phase.name;
    this.$.pspan.textContent  = phase.spanLabel;
    this.$.temp.textContent   = `${Math.round(temp).toLocaleString()} K`;
    this.$.lum.textContent    = `${formatLum1K(lum)} L☉`;
    this.$.radius.textContent = formatRadius1K(radius);
    this.$.note.textContent   = phase.note;

    this._currentPhase = phase;
    this._currentIdx   = idx;
    return { phase, age, lum, temp, radius, idx };
  }

  getCurrentPhase() { return this._currentPhase; }
  getCurrentIdx()   { return this._currentIdx; }
}

// ============================================================
// PlanetWidget1K — 行星渲染
// ============================================================
class PlanetWidget1K {
  constructor(container) {
    this.data = PLANET_4LY;
    this.starData = STAR_1000M;
    this.starRanges = buildRanges1K(this.starData.phases);
    this._currentState = this.data.planetStates[0];
    this._buildDOM(container);
  }

  _buildDOM(container) {
    this.slot = container;
    this.slot.innerHTML = `
      <div class="planet-visual" style="position:relative;display:flex;align-items:center;justify-content:center;min-height:200px;width:100%;">
        <div class="planet-space-bg"></div>
        <div class="planet-atmo-ring" data-ref="atmoRing"></div>
        <div class="planet-body" data-ref="planetBody">
          <div class="planet-surface-glow" data-ref="surfaceGlow"></div>
        </div>
        <div class="planet-shockwave" data-ref="shockwave" style="display:none"></div>
        <div class="planet-illumination" data-ref="illumination" style="display:none"></div>
        <div class="planet-age-tag" data-ref="ageTag">🪐 行星状态</div>
      </div>
      <div class="planet-info">
        <div class="planet-state-name" data-ref="stateName">原行星盘中的尘埃</div>
        <div class="planet-meta-row">
          <div class="planet-meta-item"><span class="planet-meta-label">大气层</span><span data-ref="atmoState" class="planet-meta-val">无</span></div>
          <div class="planet-meta-item"><span class="planet-meta-label">表面</span><span data-ref="surfaceState" class="planet-meta-val">尘埃颗粒</span></div>
          <div class="planet-meta-item"><span class="planet-meta-label">距恒星</span><span data-ref="distance" class="planet-meta-val">4 光年</span></div>
          <div class="planet-meta-item"><span class="planet-meta-label">冲击波</span><span data-ref="shockState" class="planet-meta-val">未到达</span></div>
        </div>
        <div class="planet-note" data-ref="note"></div>
      </div>
    `;
    const get = k => this.slot.querySelector(`[data-ref="${k}"]`);
    this.$ = {
      atmoRing: get("atmoRing"),
      planetBody: get("planetBody"),
      surfaceGlow: get("surfaceGlow"),
      shockwave: get("shockwave"),
      illumination: get("illumination"),
      ageTag: get("ageTag"),
      stateName: get("stateName"),
      atmoState: get("atmoState"),
      surfaceState: get("surfaceState"),
      distance: get("distance"),
      shockState: get("shockState"),
      note: get("note"),
    };
  }

  render(starProgress) {
    const starIdx = getPhaseIdx1K(this.starRanges, starProgress);
    const starPhase = this.starData.phases[starIdx];

    // 找到对应的行星状态
    const planetState = this.data.planetStates.find(ps => ps.starPhase === starPhase.key) || this.data.planetStates[0];
    this._currentState = planetState;

    const isPISN  = starPhase.special === "pisn";
    const isPPISN = starPhase.special === "pre-pisn";
    const isNebula = starPhase.special === "pisn-nebula";
    const isLBV   = starPhase.key === "lbv";
    const isWR    = starPhase.key === "wolf-rayet";

    const now = Date.now();
    const planetSize = 38;
    const atmoSize = planetSize * 2.2;

    // ---- Planet body ----
    this.$.planetBody.style.width = `${planetSize}px`;
    this.$.planetBody.style.height = `${planetSize}px`;
    this.$.planetBody.style.borderRadius = "50%";
    this.$.planetBody.style.position = "relative";
    this.$.planetBody.style.zIndex = "10";

    // ---- Planet surface color based on state ----
    let bodyBg, bodyShadow, atmoBg;
    if (planetState.starPhase === "cloud" || planetState.starPhase === "protostar") {
      bodyBg = `radial-gradient(circle at 36% 30%, ${planetState.color} 0%, #554433 70%, #221100 100%)`;
      bodyShadow = `0 0 8px rgba(120,90,60,0.3)`;
      atmoBg = `radial-gradient(circle, rgba(120,90,60,0.15) 0%, transparent 70%)`;
    } else if (isPISN) {
      bodyBg = `radial-gradient(circle at 50% 45%, #ffffcc 0%, #ffee88 25%, ${planetState.color} 60%, #443322 100%)`;
      bodyShadow = `0 0 ${Math.round(planetSize * 2)}px rgba(255,255,200,0.9), 0 0 ${Math.round(planetSize * 4)}px rgba(255,200,80,0.6), 0 0 ${Math.round(planetSize * 8)}px rgba(255,150,40,0.3)`;
      atmoBg = `radial-gradient(circle, rgba(255,255,200,0.8) 0%, rgba(255,200,80,0.4) 30%, transparent 70%)`;
      this.$.illumination.style.display = "";
      const illumPulse = 0.5 + 0.5 * Math.sin(now / 100);
      this.$.illumination.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,220,${0.7 + illumPulse * 0.3}) 0%, rgba(255,200,100,0.3) 40%, transparent 70%)`;
      this.$.illumination.style.opacity = String(0.8 + illumPulse * 0.2);
    } else if (isPPISN) {
      const pulse = 0.5 + 0.5 * Math.sin(now / 300);
      bodyBg = `radial-gradient(circle at 36% 30%, ${planetState.color} 0%, #886644 55%, #332211 100%)`;
      bodyShadow = `0 0 ${Math.round(planetSize * (1 + pulse))}px rgba(255,${Math.round(120 + pulse * 60)},60,${0.3 + pulse * 0.2})`;
      atmoBg = `radial-gradient(circle, rgba(255,140,60,${0.2 + pulse * 0.15}) 0%, rgba(200,80,40,0.08) 40%, transparent 70%)`;
      this.$.illumination.style.display = "none";
    } else if (isNebula) {
      bodyBg = `radial-gradient(circle at 38% 35%, #6a7a90 0%, #556678 55%, #333344 100%)`;
      bodyShadow = `0 0 ${Math.round(planetSize * 0.8)}px rgba(80,100,140,0.35)`;
      atmoBg = `radial-gradient(circle, rgba(80,100,140,0.1) 0%, rgba(60,80,120,0.04) 40%, transparent 70%)`;
      this.$.illumination.style.display = "none";
    } else if (isLBV || isWR) {
      bodyBg = `radial-gradient(circle at 38% 34%, #7a8a99 0%, ${planetState.color} 55%, #334455 100%)`;
      bodyShadow = `0 0 ${Math.round(planetSize * 1)}px rgba(100,150,200,0.4)`;
      atmoBg = `radial-gradient(circle, rgba(100,150,200,0.2) 0%, rgba(80,120,180,0.08) 40%, transparent 70%)`;
      this.$.illumination.style.display = "none";
    } else {
      // Normal illuminated state
      bodyBg = `radial-gradient(circle at 38% 34%, #aaccee 0%, ${planetState.color} 55%, #334455 100%)`;
      const starLum = lerp1K(starPhase.lumLsun, this.starData.phases[Math.min(starIdx + 1, this.starData.phases.length - 1)].lumLsun, 0.3);
      const illumFactor = Math.min(1, starLum / 5000000);
      bodyShadow = `0 0 ${Math.round(planetSize * (0.5 + illumFactor * 1))}px rgba(100,150,200,${0.3 + illumFactor * 0.3})`;
      atmoBg = `radial-gradient(circle, rgba(100,150,200,${0.15 + illumFactor * 0.2}) 0%, rgba(80,120,180,0.06) 40%, transparent 70%)`;
      this.$.illumination.style.display = "none";
    }

    this.$.planetBody.style.background = bodyBg;
    this.$.planetBody.style.boxShadow = bodyShadow;
    this.$.surfaceGlow.style.background = `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.08) 0%, transparent 50%)`;

    // ---- Atmosphere ring ----
    this.$.atmoRing.style.width = `${atmoSize}px`;
    this.$.atmoRing.style.height = `${atmoSize}px`;
    this.$.atmoRing.style.background = atmoBg;
    // Hide atmo for PISN/nebula (atmosphere destroyed)
    if (isPISN || isNebula) {
      this.$.atmoRing.style.opacity = isPISN ? "0.15" : "0.05";
    } else if (isPPISN) {
      this.$.atmoRing.style.opacity = "0.35";
    } else {
      this.$.atmoRing.style.opacity = "0.6";
    }

    // ---- Shockwave effect ----
    if (isPPISN || isPISN) {
      this.$.shockwave.style.display = "";
      const pulse2 = 0.5 + 0.5 * Math.sin(now / 400);
      this.$.shockwave.style.opacity = String(isPISN ? 0.8 : 0.3 + pulse2 * 0.2);
    } else {
      this.$.shockwave.style.display = "none";
    }

    // ---- Status tag ----
    this.$.ageTag.textContent = `${planetState.icon} ${planetState.state}`;

    // ---- Info ----
    this.$.stateName.textContent = planetState.state;
    this.$.atmoState.textContent = planetState.atmosphere;
    this.$.surfaceState.textContent = planetState.surface;
    this.$.distance.textContent = "4 光年 (252,000 AU)";

    let shockDesc;
    if (isPISN) shockDesc = "💥 PISN冲击波4年后抵达";
    else if (isPPISN) shockDesc = "⚠️ PPISN脉冲冲击波";
    else if (isNebula) shockDesc = "冲击波已过·行星幸存";
    else if (isLBV) shockDesc = "LBV喷发冲击波（约4年后抵达）";
    else if (isWR) shockDesc = "高速恒星风侵蚀";
    else shockDesc = "未到达";
    this.$.shockState.textContent = shockDesc;
    this.$.note.textContent = planetState.description;

    return { planetState, starPhaseKey: starPhase.key };
  }

  getCurrentState() { return this._currentState; }
}

// ============================================================
// Star1000App — 页面主逻辑
// ============================================================
class Star1000App {
  constructor() {
    this.progress   = 0;
    this.playing    = false;
    this.speed      = 1;
    this.rafId      = null;
    this.teachMode  = true;
    this.starWidget = null;
    this.planetWidget = null;
    this._endingShown    = false;
    this._pisnTriggered  = false;

    this._bindElements();
    this._buildWidgets();
    this._buildMilestones();
    this._bindEvents();
    this._startAnimLoop();
    this._updateProgressBar(0);
    this._updateTeachBar(0);
    this.starWidget.render(0);
    this.planetWidget.render(0);
  }

  _bindElements() {
    this.playBtn       = document.getElementById("playBtn");
    this.resetBtn      = document.getElementById("resetBtn");
    this.speedSel      = document.getElementById("speedSelect");
    this.progressEl    = document.getElementById("progressBar");
    this.teachBar      = document.getElementById("teachBar");
    this.teachEmoji    = document.getElementById("teachEmoji");
    this.teachTitle    = document.getElementById("teachTitle");
    this.teachCapEl    = document.getElementById("teachCaption");
    this.stageLabel    = document.getElementById("stageLabel");
    this.endingOverlay = document.getElementById("endingOverlay");
    this.teachToggle   = document.getElementById("teachToggle");
    this.quizSection   = document.getElementById("quizSection");
    this.pisnFlash     = document.getElementById("pisnFlash");
    this.snFlash       = document.getElementById("snFlash");
  }

  _buildWidgets() {
    const starGrid = document.getElementById("starsGrid");
    const planetGrid = document.getElementById("planetGrid");

    // Star widget
    const starSlot = document.createElement("div");
    starSlot.className = "star-slot";
    starSlot.dataset.slot = "1000m";
    starSlot.innerHTML = `<div class="slot-header" style="--c:#ff2255">
      <span class="slot-mass">1000 M☉</span>
      <span class="slot-name">千倍太阳质量恒星</span>
      <span class="slot-fate" style="color:#ffee88">💥 不稳定对超新星（PISN）</span>
    </div>`;
    const starWidgetEl = document.createElement("div");
    starWidgetEl.className = "sw-container";
    starSlot.appendChild(starWidgetEl);
    starGrid.appendChild(starSlot);
    this.starWidget = new StarWidget1K(starWidgetEl);

    // Planet widget
    const planetSlot = document.createElement("div");
    planetSlot.className = "planet-slot";
    planetSlot.dataset.slot = "planet-4ly";
    planetSlot.innerHTML = `<div class="slot-header" style="--c:#44aaff">
      <span class="slot-mass">🪐</span>
      <span class="slot-name">四光年外行星</span>
      <span class="slot-fate" style="color:#88ccff">✅ 幸存（大气剥蚀）</span>
    </div>`;
    const planetWidgetEl = document.createElement("div");
    planetWidgetEl.className = "planet-container";
    planetSlot.appendChild(planetWidgetEl);
    planetGrid.appendChild(planetSlot);
    this.planetWidget = new PlanetWidget1K(planetWidgetEl);
  }

  _buildMilestones() {
    const milestones = [
      { pct: 0,   label: "☁️" },
      { pct: 15,  label: "原恒星" },
      { pct: 25,  label: "ZAMS" },
      { pct: 42,  label: "极超巨星" },
      { pct: 58,  label: "LBV" },
      { pct: 72,  label: "WR" },
      { pct: 82,  label: "⚠️PPISN" },
      { pct: 92,  label: "💥PISN" },
      { pct: 100, label: "🌈遗迹" }
    ];
    const bar = document.getElementById("milestoneBar");
    bar.innerHTML = milestones.map(m =>
      `<span class="milestone" style="left:${m.pct}%">${m.label}</span>`
    ).join("");
  }

  _startAnimLoop() {
    const loop = () => {
      if (this.starWidget) {
        const sp = this.starWidget.getCurrentPhase().special;
        const k  = this.starWidget.getCurrentPhase().key;
        if (sp === "pre-pisn" || sp === "pisn" || k === "lbv" || k === "wolf-rayet" || k === "hypergiant") {
          this.starWidget.render(this.progress);
          this.planetWidget.render(this.progress);
        }
        if (sp === "pisn") {
          const f = 0.4 + 0.6 * Math.abs(Math.sin(Date.now() / 80));
          this.pisnFlash.style.opacity = String(f);
        } else {
          this.pisnFlash.style.opacity = "0";
        }
        if (sp === "pre-pisn") {
          this.snFlash.style.opacity = String(0.05 + 0.05 * Math.sin(Date.now() / 300));
        } else if (sp !== "pisn") {
          this.snFlash.style.opacity = "0";
        }
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  render(progress) {
    if (!this.starWidget || !this.planetWidget) return;
    const result  = this.starWidget.render(progress);
    this.planetWidget.render(progress);
    const special = result.phase.special;

    this._updateTeachBar(progress);
    this._updateProgressBar(progress);

    if (progress < 850) {
      this._pisnTriggered = false;
      this._endingShown   = false;
      this.endingOverlay.classList.remove("visible");
    }

    if (special === "pisn" && !this._pisnTriggered) {
      this._pisnTriggered = true;
      this._triggerPISNShake();
    }

    if (special === "pisn-nebula" && !this._endingShown && progress > 940) {
      this._endingShown = true;
      this._showEnding();
    }
  }

  _triggerPISNShake() {
    document.body.classList.remove("screen-shake");
    void document.body.offsetWidth;
    document.body.classList.add("screen-shake");
    setTimeout(() => document.body.classList.remove("screen-shake"), 900);

    let count = 0;
    const flash = () => {
      this.pisnFlash.style.opacity = count % 2 === 0 ? "0.95" : "0.05";
      count++;
      if (count < 12) setTimeout(flash, 90);
    };
    flash();
  }

  _updateTeachBar(progress) {
    if (!this.teachMode) return;
    const phases = STAR_1000M.phases;
    const ranges = buildRanges1K(phases);
    const idx    = getPhaseIdx1K(ranges, progress);
    const phase  = phases[idx];
    if (!phase || !phase.teach) return;

    this.teachEmoji.textContent = phase.teach.emoji;
    this.teachTitle.textContent = phase.teach.title;
    this.teachCapEl.textContent = phase.teach.caption;

    const pct = Math.round(progress / MAX_PROGRESS_1K * 100);
    this.stageLabel.textContent = `进度 ${pct}% · ${phase.name}`;
  }

  _updateProgressBar(progress) {
    const pct   = (progress / MAX_PROGRESS_1K) * 100;
    const thumb = document.getElementById("progressThumb");
    const fill  = document.getElementById("progressFill");
    if (thumb) thumb.style.left = `${pct}%`;
    if (fill)  fill.style.width = `${pct}%`;
  }

  _showEnding() {
    const star    = STAR_1000M;
    const overlay = this.endingOverlay;
    overlay.querySelector(".ending-title").textContent = star.endingTitle;
    overlay.querySelector(".ending-desc").textContent  = star.endingDesc;
    overlay.querySelector(".ending-badge").textContent = star.endingBadge;
    overlay.querySelector(".ending-badge").style.color = star.fateColor || "#ffee88";
    const noteEl = document.getElementById("endingNote");
    if (noteEl && star.endingNote) {
      noteEl.textContent = star.endingNote;
      noteEl.classList.remove("hidden");
    }
    overlay.classList.add("visible");
  }

  _tick() {
    if (!this.playing) return;
    this.progress = Math.min(MAX_PROGRESS_1K, this.progress + this.speed * 1.2);
    if (this.progress >= MAX_PROGRESS_1K) {
      this.progress = MAX_PROGRESS_1K;
      this.playing  = false;
      this.playBtn.textContent = "▶ 播放";
    }
    this.progressEl.value = String(this.progress);
    this.render(this.progress);
    if (this.playing) this.rafId = requestAnimationFrame(() => this._tick());
  }

  _setPlaying(v) {
    this.playing = v;
    this.playBtn.textContent = v ? "⏸ 暂停" : "▶ 播放";
    cancelAnimationFrame(this.rafId);
    if (v) this.rafId = requestAnimationFrame(() => this._tick());
  }

  _bindEvents() {
    this.playBtn.addEventListener("click",  () => this._setPlaying(!this.playing));
    this.resetBtn.addEventListener("click", () => {
      this.progress = 0;
      this.progressEl.value = "0";
      this._setPlaying(false);
      this._endingShown   = false;
      this._pisnTriggered = false;
      this.endingOverlay.classList.remove("visible");
      this.pisnFlash.style.opacity = "0";
      this.snFlash.style.opacity   = "0";
      this._updateProgressBar(0);
      this.render(0);
    });

    this.speedSel.addEventListener("change", e => { this.speed = Number(e.target.value); });

    this.progressEl.addEventListener("input", e => {
      this.progress = Number(e.target.value);
      this._updateProgressBar(this.progress);
      this.render(this.progress);
    });

    this.teachToggle.addEventListener("click", () => {
      this.teachMode = !this.teachMode;
      this.teachToggle.classList.toggle("active", this.teachMode);
      this.teachBar.classList.toggle("hidden", !this.teachMode);
    });

    document.getElementById("endingClose").addEventListener("click", () => {
      this.endingOverlay.classList.remove("visible");
    });

    document.getElementById("quizToggle").addEventListener("click", () => {
      this._buildQuiz();
      document.getElementById("quizPanel").classList.toggle("hidden");
    });

    this._bindProgressDrag();
  }

  _bindProgressDrag() {
    const track = document.getElementById("progressTrack");
    if (!track) return;
    const calc = (clientX) => {
      const rect = track.getBoundingClientRect();
      return Math.round(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * MAX_PROGRESS_1K);
    };
    const onMove = (clientX) => {
      this.progress = calc(clientX);
      this.progressEl.value = String(this.progress);
      this._updateProgressBar(this.progress);
      this.render(this.progress);
    };
    track.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      track.classList.add("dragging");
      onMove(e.clientX);
      const mm = (ev) => onMove(ev.clientX);
      const mu = () => { track.classList.remove("dragging"); document.removeEventListener("mousemove", mm); document.removeEventListener("mouseup", mu); };
      document.addEventListener("mousemove", mm);
      document.addEventListener("mouseup",   mu);
    });
    track.addEventListener("touchstart", (e) => {
      e.preventDefault();
      track.classList.add("dragging");
      onMove(e.touches[0].clientX);
      const tm = (ev) => { ev.preventDefault(); onMove(ev.touches[0].clientX); };
      const te = () => { track.classList.remove("dragging"); document.removeEventListener("touchmove", tm); document.removeEventListener("touchend", te); };
      document.addEventListener("touchmove", tm, { passive: false });
      document.addEventListener("touchend",  te);
    }, { passive: false });
  }

  _buildQuiz() {
    this.quizSection.innerHTML = `
      <h3 class="quiz-title">🧩 趣味问答 · 1000 M☉ 恒星 & PISN</h3>
      ${STAR_1000M.quiz.map((item, i) => `
        <div class="quiz-item" id="qi-${i}">
          <div class="qi-q">${item.icon} ${item.q}</div>
          <button class="qi-btn" data-idx="${i}">揭晓答案</button>
          <div class="qi-a hidden">${item.a}</div>
        </div>
      `).join("")}
    `;
    this.quizSection.querySelectorAll(".qi-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = document.getElementById(`qi-${btn.dataset.idx}`);
        item.querySelector(".qi-a").classList.remove("hidden");
        btn.style.display = "none";
        item.classList.add("answered");
      });
    });
  }
}

// ============================================================
// 启动
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  window.star1kApp = new Star1000App();
});