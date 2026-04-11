// ============================================================
//  star-250m-engine.js  v2 — 全面优化视觉渲染
//  250 M☉ 单星展示引擎（含 PISN 爆炸特效）
// ============================================================

"use strict";

const MAX_PROGRESS_250 = 1000;

// ---------- 工具函数 ----------
function lerp250(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

function formatAge250(myr) {
  if (myr < 0.01)  return `${(myr * 10000).toFixed(0)} 年`;
  if (myr < 1)     return `${(myr * 100).toFixed(0)} 万年`;
  if (myr < 10000) return `${myr.toFixed(1)} 百万年`;
  return `${(myr / 1000).toFixed(2)} 十亿年`;
}

function formatLum250(l) {
  if (l >= 1e9)  return `${(l / 1e9).toFixed(1)} ×10⁹`;
  if (l >= 1e6)  return `${(l / 1e6).toFixed(1)} ×10⁶`;
  if (l >= 1e3)  return `${(l / 1e3).toFixed(1)} ×10³`;
  return l.toFixed(2);
}

// 可见尺寸映射：每个阶段手动指定视觉大小（px），不依赖真实半径比例
// 这样每个阶段都能清晰可见
const PHASE_VISUAL_SIZE = {
  "cloud":       52,
  "protostar":   60,
  "zams":        90,
  "o-supergiant":100,
  "lbv":         130,
  "wolf-rayet":   72,
  "pre-pisn":     80,
  "pisn":        200,   // 会动态扩大
  "pisn-nebula": 170,
};

// 构建等宽进度区间（每阶段至少 6% 进度）
function buildRanges250(phases) {
  const total   = phases.length;
  const minSpan = Math.floor(MAX_PROGRESS_250 * 0.06);
  const reserved = minSpan * total;
  const remaining = MAX_PROGRESS_250 - reserved;
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

function getPhaseIdx250(ranges, progress) {
  for (let i = ranges.length - 1; i >= 0; i--) {
    if (progress >= ranges[i].start) return i;
  }
  return 0;
}

// ============================================================
// StarWidget250 — 单颗星渲染（全面视觉优化版）
// ============================================================
class StarWidget250 {
  constructor(container) {
    this.data   = STAR_250M;
    this.ranges = buildRanges250(this.data.phases);
    this._currentPhase = this.data.phases[0];
    this._currentIdx   = 0;
    this._buildDOM(container);
  }

  _buildDOM(container) {
    this.slot = container;
    this.slot.innerHTML = `
      <div class="sw-visual" style="position:relative;display:flex;align-items:center;justify-content:center;min-height:260px;width:100%;">
        <div class="sw250-space"></div>
        <div class="sw250-halo"  data-ref="halo"></div>
        <div class="sw250-halo2" data-ref="halo2"></div>
        <div class="sw250-core"  data-ref="core">
          <div class="sw250-corona" data-ref="corona"></div>
          <div class="sw250-surface" data-ref="surface"></div>
          <div class="sw250-flare1" data-ref="flare1"></div>
          <div class="sw250-flare2" data-ref="flare2"></div>
          <div class="sw250-sn" data-ref="sn" style="display:none">
            <div class="pisn-ring1"></div>
            <div class="pisn-ring2"></div>
            <div class="pisn-ring3"></div>
            <div class="pisn-boom">💥</div>
          </div>
        </div>
        <div class="sw250-age" data-ref="age">0</div>
        <div class="sw250-phase-badge" data-ref="phaseBadge"></div>
      </div>
      <div class="sw250-info">
        <div class="sw250-pname" data-ref="pname">分子云</div>
        <div class="sw250-meta-row">
          <div class="sw250-meta-item"><span class="sw250-meta-label">时间跨度</span><span data-ref="pspan" class="sw250-meta-val">—</span></div>
          <div class="sw250-meta-item"><span class="sw250-meta-label">表面温度</span><span data-ref="temp" class="sw250-meta-val">—</span></div>
          <div class="sw250-meta-item"><span class="sw250-meta-label">光度</span><span data-ref="lum" class="sw250-meta-val">—</span></div>
          <div class="sw250-meta-item"><span class="sw250-meta-label">半径</span><span data-ref="radius" class="sw250-meta-val">—</span></div>
        </div>
        <div class="sw250-note" data-ref="note"></div>
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
    const idx    = getPhaseIdx250(ranges, progress);
    const phase  = phases[idx];
    const next   = phases[Math.min(idx + 1, phases.length - 1)];
    const range  = ranges[idx];
    const t      = range.end === range.start ? 0 : (progress - range.start) / (range.end - range.start);

    const age    = lerp250(phase.ageStartMyr, phase.ageEndMyr, t);
    const lum    = lerp250(phase.lumLsun,     next.lumLsun,    t * 0.4);
    const temp   = lerp250(phase.tempK,       next.tempK,      t * 0.3);
    const radius = lerp250(phase.radiusRsun,  next.radiusRsun, t * 0.3);

    const isSN      = phase.special === "pisn";
    const isPrePISN = phase.special === "pre-pisn";
    const isNebula  = phase.special === "pisn-nebula";
    const isLBV     = phase.key === "lbv";
    const isWR      = phase.key === "wolf-rayet";

    // ---- 视觉尺寸（使用手动映射保证每个阶段清晰可见）----
    let baseSize = PHASE_VISUAL_SIZE[phase.key] || 80;
    if (isSN) baseSize = Math.min(220, baseSize + t * 160);

    const size      = baseSize;
    const haloSize  = size * (isNebula ? 3.8 : isSN ? 4.0 : isLBV ? 3.2 : 2.4);
    const halo2Size = size * (isNebula ? 5.5 : isSN ? 6.0 : 1.6);

    // ---- 颜色系统 ----
    const color = phase.color;
    const now   = Date.now();

    // ============================================================
    // 各阶段专属视觉
    // ============================================================
    this.$.core.style.width   = `${size}px`;
    this.$.core.style.height  = `${size}px`;
    this.$.core.style.borderRadius = "50%";
    this.$.core.style.position     = "relative";
    this.$.core.style.zIndex       = "10";
    this.$.core.style.flexShrink   = "0";

    // 清除所有动画类
    this.$.core.classList.remove("sw250-danger", "sw250-lbv-pulse", "sw250-wr-glow", "sw250-nebula-float");

    if (isSN) {
      // ---- PISN 爆炸 ----
      const blast = Math.min(1, t * 1.5);
      this.$.core.style.background = `radial-gradient(circle at 50% 50%,
        #ffffff 0%,
        #fffff0 8%,
        #ffff88 18%,
        #ffdd44 32%,
        #ff8822 52%,
        ${color} 72%,
        rgba(200,60,20,0.5) 88%,
        transparent 100%)`;
      this.$.core.style.boxShadow = `
        0 0 ${Math.round(size * 0.8)}px rgba(255,255,200,0.95),
        0 0 ${Math.round(size * 2)}px rgba(255,200,60,0.7),
        0 0 ${Math.round(size * 4)}px rgba(255,120,20,0.4),
        0 0 ${Math.round(size * 7)}px rgba(255,60,0,0.15)`;

      // 爆炸环
      this.$.sn.style.display = "";
      const rings = this.$.sn.querySelectorAll(".pisn-ring1,.pisn-ring2,.pisn-ring3");
      rings.forEach((r, i) => {
        const rScale = 1 + (blast + i * 0.3) * 3.5;
        r.style.transform = `translate(-50%,-50%) scale(${rScale})`;
        r.style.opacity   = String(Math.max(0, 1 - blast - i * 0.25));
      });
      const boom = this.$.sn.querySelector(".pisn-boom");
      if (boom) { boom.style.fontSize = `${Math.round(size * 0.55)}px`; }

      // halo
      this.$.halo.style.background = `radial-gradient(circle,
        rgba(255,255,200,${0.6 + blast * 0.35}) 0%,
        rgba(255,200,80,0.4) 30%,
        rgba(255,120,20,0.15) 60%,
        transparent 80%)`;

      this.$.halo2.style.background = `radial-gradient(circle,
        rgba(255,200,100,0.2) 0%,
        rgba(255,100,20,0.08) 45%,
        transparent 70%)`;

      // surface 和 corona 隐藏
      this.$.surface.style.display = "none";
      this.$.corona.style.display  = "none";
      this.$.flare1.style.display  = "none";
      this.$.flare2.style.display  = "none";

    } else if (isPrePISN) {
      // ---- 对不稳定前夕：危险脉冲 ----
      const pulse = 0.5 + 0.5 * Math.sin(now / 180);
      const pulse2= 0.5 + 0.5 * Math.sin(now / 280 + 1.2);
      this.$.core.style.background = `radial-gradient(circle at 38% 32%,
        #ffffff 0%,
        #ffff66 10%,
        #ffcc22 28%,
        #ff6600 55%,
        ${color} 80%,
        #220000 100%)`;
      this.$.core.style.boxShadow = `
        0 0 ${Math.round(size * (0.6 + pulse * 0.6))}px rgba(255,${Math.round(100 + pulse * 80)},20,${0.7 + pulse * 0.3}),
        0 0 ${Math.round(size * (1.2 + pulse2))}px rgba(255,80,0,${0.4 + pulse2 * 0.3}),
        inset 0 0 ${Math.round(size * 0.3)}px rgba(255,255,100,0.4)`;
      this.$.core.classList.add("sw250-danger");
      this.$.sn.style.display = "none";
      this.$.surface.style.display = "";
      this.$.corona.style.display  = "";
      this.$.flare1.style.display  = "";
      this.$.flare2.style.display  = "";

      // 危险晕圈
      this.$.halo.style.background = `radial-gradient(circle,
        rgba(255,${Math.round(120 + pulse * 80)},20,${0.45 + pulse * 0.3}) 0%,
        rgba(255,60,0,0.2) 40%,
        rgba(200,20,0,0.05) 65%,
        transparent 80%)`;
      this.$.halo2.style.background = `radial-gradient(circle,
        rgba(255,80,0,0.15) 0%,
        rgba(200,20,0,0.06) 50%,
        transparent 70%)`;

    } else if (isNebula) {
      // ---- 超新星遗迹星云 ----
      this.$.core.style.background = `radial-gradient(circle at 50% 50%,
        rgba(255,220,100,0.15) 0%,
        rgba(255,140,40,0.3) 20%,
        ${color} 45%,
        rgba(200,80,20,0.35) 65%,
        rgba(100,30,10,0.1) 80%,
        transparent 100%)`;
      this.$.core.style.boxShadow = `
        0 0 ${Math.round(size * 1.2)}px rgba(255,140,40,0.5),
        0 0 ${Math.round(size * 2.2)}px rgba(200,80,20,0.25)`;
      this.$.core.classList.add("sw250-nebula-float");
      this.$.sn.style.display = "none";
      this.$.surface.style.display = "";
      this.$.corona.style.display  = "none";
      this.$.flare1.style.display  = "none";
      this.$.flare2.style.display  = "none";

      this.$.halo.style.background = `radial-gradient(circle,
        rgba(255,140,60,0.35) 0%,
        rgba(220,100,30,0.18) 35%,
        rgba(150,50,10,0.08) 60%,
        transparent 80%)`;
      this.$.halo2.style.background = `radial-gradient(circle,
        rgba(200,80,20,0.12) 0%,
        rgba(150,40,10,0.05) 50%,
        transparent 75%)`;

    } else if (isLBV) {
      // ---- 亮蓝变星：不稳定脉动 ----
      const ejPulse = 0.5 + 0.5 * Math.sin(now / 700);
      this.$.core.style.background = `radial-gradient(circle at 36% 30%,
        #ffffff 0%,
        #ffeeff 10%,
        #ff99cc 30%,
        ${color} 60%,
        #330010 100%)`;
      this.$.core.style.boxShadow = `
        0 0 ${Math.round(size * 0.7)}px rgba(255,100,180,0.8),
        0 0 ${Math.round(size * (1.5 + ejPulse))}px rgba(220,60,140,${0.4 + ejPulse * 0.25}),
        0 0 ${Math.round(size * 3)}px rgba(180,30,100,0.15)`;
      this.$.core.classList.add("sw250-lbv-pulse");
      this.$.sn.style.display = "none";
      this.$.surface.style.display = "";
      this.$.corona.style.display  = "";
      this.$.flare1.style.display  = "";
      this.$.flare2.style.display  = "";

      this.$.halo.style.background = `radial-gradient(circle,
        rgba(255,100,180,${0.3 + ejPulse * 0.25}) 0%,
        rgba(200,60,130,0.15) 40%,
        rgba(150,20,80,0.05) 65%,
        transparent 80%)`;
      this.$.halo2.style.background = `radial-gradient(circle,
        rgba(220,80,150,0.1) 0%,
        transparent 55%)`;

    } else if (isWR) {
      // ---- 沃夫-拉叶：极热裸核 ----
      this.$.core.style.background = `radial-gradient(circle at 35% 28%,
        #ffffff 0%,
        #eeeeff 8%,
        #aaccff 22%,
        ${color} 50%,
        #330033 85%,
        #110011 100%)`;
      this.$.core.style.boxShadow = `
        0 0 ${Math.round(size * 0.6)}px rgba(180,200,255,0.9),
        0 0 ${Math.round(size * 1.5)}px rgba(120,160,255,0.5),
        0 0 ${Math.round(size * 3)}px rgba(80,100,255,0.2),
        inset 0 0 ${Math.round(size * 0.2)}px rgba(255,255,255,0.5)`;
      this.$.core.classList.add("sw250-wr-glow");
      this.$.sn.style.display = "none";
      this.$.surface.style.display = "";
      this.$.corona.style.display  = "";
      this.$.flare1.style.display  = "none";
      this.$.flare2.style.display  = "none";

      this.$.halo.style.background = `radial-gradient(circle,
        rgba(150,180,255,0.35) 0%,
        rgba(100,130,255,0.15) 38%,
        rgba(60,80,200,0.06) 62%,
        transparent 80%)`;
      this.$.halo2.style.background = `radial-gradient(circle,
        rgba(100,140,255,0.1) 0%,
        transparent 55%)`;

    } else {
      // ---- 普通阶段（分子云、原恒星、ZAMS、O型超巨星）----
      // 根据温度选渐变色调
      let innerColor = "#ffffff";
      let midColor   = color;
      let outerColor = "#110022";

      if (temp > 40000) {
        innerColor = "#ffffff"; midColor = "#99ccff"; outerColor = "#000033";
      } else if (temp > 20000) {
        innerColor = "#ffffff"; midColor = "#aaddff"; outerColor = "#001133";
      } else if (temp > 8000) {
        innerColor = "#fffff0"; midColor = color; outerColor = "#110000";
      } else {
        innerColor = "#ffeecc"; midColor = color; outerColor = "#220000";
      }

      this.$.core.style.background = `radial-gradient(circle at 32% 28%,
        ${innerColor} 0%,
        ${innerColor} 12%,
        ${midColor} 50%,
        ${outerColor} 100%)`;

      // 光晕强度随温度/亮度变化
      const glowStrength = Math.min(1, lum / 3000000);
      const glowR = temp > 30000 ? 100 : temp > 15000 ? 140 : 200;
      const glowG = temp > 30000 ? 140 : temp > 15000 ? 170 : 130;
      const glowB = temp > 30000 ? 255 : 180;

      this.$.core.style.boxShadow = `
        0 0 ${Math.round(size * 0.4)}px rgba(${glowR},${glowG},${glowB},0.9),
        0 0 ${Math.round(size * 1.0)}px rgba(${glowR},${glowG},${glowB},${0.35 + glowStrength * 0.35}),
        0 0 ${Math.round(size * 2.2)}px rgba(${glowR},${glowG},${glowB},${0.12 + glowStrength * 0.15}),
        inset 0 0 ${Math.round(size * 0.25)}px rgba(255,255,255,0.3)`;

      this.$.sn.style.display = "none";
      this.$.surface.style.display = "";
      this.$.corona.style.display  = "";
      this.$.flare1.style.display  = "";
      this.$.flare2.style.display  = "none";

      this.$.halo.style.background = `radial-gradient(circle,
        rgba(${glowR},${glowG},${glowB},${0.25 + glowStrength * 0.2}) 0%,
        rgba(${glowR},${glowG},${glowB},0.1) 40%,
        rgba(${glowR},${glowG},${glowB},0.03) 65%,
        transparent 80%)`;

      this.$.halo2.style.background = `radial-gradient(circle,
        rgba(${glowR},${glowG},${glowB},0.08) 0%,
        transparent 60%)`;
    }

    // ---- halo 尺寸 ----
    this.$.halo.style.width    = `${haloSize}px`;
    this.$.halo.style.height   = `${haloSize}px`;
    this.$.halo2.style.width   = `${halo2Size}px`;
    this.$.halo2.style.height  = `${halo2Size}px`;

    // ---- 阶段徽章 ----
    const badgeColors = {
      "cloud":        "#9988ff",
      "protostar":    "#ff88bb",
      "zams":         "#4499ff",
      "o-supergiant": "#2266ff",
      "lbv":          "#ff66cc",
      "wolf-rayet":   "#88aaff",
      "pre-pisn":     "#ff6600",
      "pisn":         "#ffdd00",
      "pisn-nebula":  "#ff8833",
    };
    this.$.phaseBadge.textContent = phase.name;
    this.$.phaseBadge.style.background = `rgba(0,0,0,0.5)`;
    this.$.phaseBadge.style.borderColor = (badgeColors[phase.key] || "#6688cc") + "66";
    this.$.phaseBadge.style.color = badgeColors[phase.key] || "#aaccff";

    // ---- info ----
    this.$.age.textContent    = formatAge250(age);
    this.$.pname.textContent  = phase.name;
    this.$.pspan.textContent  = phase.spanLabel;
    this.$.temp.textContent   = `${Math.round(temp).toLocaleString()} K`;
    this.$.lum.textContent    = `${formatLum250(lum)} L☉`;
    this.$.radius.textContent = radius >= 1000000 ? `${(radius/1000000).toFixed(1)}M R☉` :
                                 radius >= 1000    ? `${(radius/1000).toFixed(1)}K R☉` :
                                 radius >= 10      ? `${radius.toFixed(0)} R☉` :
                                                     `${radius.toFixed(3)} R☉`;
    this.$.note.textContent   = phase.note;

    this._currentPhase = phase;
    this._currentIdx   = idx;
    return { phase, age, lum, temp, radius, idx };
  }

  getCurrentPhase() { return this._currentPhase; }
  getCurrentIdx()   { return this._currentIdx; }
}

// ============================================================
// Star250App — 页面主逻辑
// ============================================================
class Star250App {
  constructor() {
    this.progress   = 0;
    this.playing    = false;
    this.speed      = 1;
    this.rafId      = null;
    this.teachMode  = true;
    this.widget     = null;
    this._endingShown    = false;
    this._pisnTriggered  = false;

    this._bindElements();
    this._buildWidget();
    this._buildMilestones();
    this._bindEvents();
    this._startAnimLoop();
    this._updateProgressBar(0);
    this._updateTeachBar(0);
    // 初始渲染
    this.widget.render(0);
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

  _buildWidget() {
    const grid = document.getElementById("starsGrid");
    grid.style.gridTemplateColumns = "1fr";
    const slot = document.createElement("div");
    slot.className = "star-slot";
    slot.dataset.slot = "extreme";
    slot.innerHTML = `<div class="slot-header" style="--c:#ff3366">
      <span class="slot-mass">250 M☉</span>
      <span class="slot-name">极端大质量恒星</span>
      <span class="slot-fate" style="color:#ffdd88">💥 不稳定对超新星（PISN）</span>
    </div>`;
    const widgetEl = document.createElement("div");
    widgetEl.className = "sw-container";
    slot.appendChild(widgetEl);
    grid.appendChild(slot);
    this.widget = new StarWidget250(widgetEl);
  }

  _buildMilestones() {
    const milestones = [
      { pct: 0,   label: "☁️" },
      { pct: 18,  label: "原恒星" },
      { pct: 30,  label: "O型" },
      { pct: 50,  label: "LBV" },
      { pct: 68,  label: "WR星" },
      { pct: 84,  label: "⚠️前夕" },
      { pct: 94,  label: "💥PISN" },
      { pct: 100, label: "🌈遗迹" }
    ];
    const bar = document.getElementById("milestoneBar");
    bar.innerHTML = milestones.map(m =>
      `<span class="milestone" style="left:${m.pct}%">${m.label}</span>`
    ).join("");
  }

  // 独立动画循环：处理持续动画阶段（pre-pisn、lbv、pisn）
  _startAnimLoop() {
    const loop = () => {
      if (this.widget) {
        const sp = this.widget.getCurrentPhase().special;
        const k  = this.widget.getCurrentPhase().key;
        if (sp === "pre-pisn" || sp === "pisn" || k === "lbv" || k === "wolf-rayet") {
          this.widget.render(this.progress);
        }
        // PISN 持续闪光
        if (sp === "pisn") {
          const f = 0.4 + 0.6 * Math.abs(Math.sin(Date.now() / 80));
          this.pisnFlash.style.opacity = String(f);
        } else {
          this.pisnFlash.style.opacity = "0";
        }
        if (sp === "pre-pisn") {
          this.snFlash.style.opacity = String(0.04 + 0.04 * Math.sin(Date.now() / 300));
        } else if (sp !== "pisn") {
          this.snFlash.style.opacity = "0";
        }
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  render(progress) {
    if (!this.widget) return;
    const result  = this.widget.render(progress);
    const special = result.phase.special;

    this._updateTeachBar(progress);
    this._updateProgressBar(progress);

    // 重置触发标志
    if (progress < 850) {
      this._pisnTriggered = false;
      this._endingShown   = false;
      this.endingOverlay.classList.remove("visible");
    }

    // 第一次进入 PISN 时触发震动
    if (special === "pisn" && !this._pisnTriggered) {
      this._pisnTriggered = true;
      this._triggerPISNShake();
    }

    // 遗迹阶段显示结局弹窗
    if (special === "pisn-nebula" && !this._endingShown && progress > 940) {
      this._endingShown = true;
      this._showEnding();
    }
  }

  _triggerPISNShake() {
    document.body.classList.remove("screen-shake");
    void document.body.offsetWidth;
    document.body.classList.add("screen-shake");
    setTimeout(() => document.body.classList.remove("screen-shake"), 800);

    // 多次闪光
    let count = 0;
    const flash = () => {
      this.pisnFlash.style.opacity = count % 2 === 0 ? "0.92" : "0.05";
      count++;
      if (count < 10) setTimeout(flash, 100);
    };
    flash();
  }

  _updateTeachBar(progress) {
    if (!this.teachMode) return;
    const phases = STAR_250M.phases;
    const ranges = buildRanges250(phases);
    const idx    = getPhaseIdx250(ranges, progress);
    const phase  = phases[idx];
    if (!phase || !phase.teach) return;

    this.teachEmoji.textContent = phase.teach.emoji;
    this.teachTitle.textContent = phase.teach.title;
    this.teachCapEl.textContent = phase.teach.caption;

    const pct = Math.round(progress / MAX_PROGRESS_250 * 100);
    this.stageLabel.textContent = `进度 ${pct}% · ${phase.name}`;
  }

  _updateProgressBar(progress) {
    const pct   = (progress / MAX_PROGRESS_250) * 100;
    const thumb = document.getElementById("progressThumb");
    const fill  = document.getElementById("progressFill");
    if (thumb) thumb.style.left = `${pct}%`;
    if (fill)  fill.style.width = `${pct}%`;
  }

  _showEnding() {
    const star    = STAR_250M;
    const overlay = this.endingOverlay;
    overlay.querySelector(".ending-title").textContent = star.endingTitle;
    overlay.querySelector(".ending-desc").textContent  = star.endingDesc;
    overlay.querySelector(".ending-badge").textContent = star.endingBadge;
    overlay.querySelector(".ending-badge").style.color = star.fateColor || "#ffdd88";
    const noteEl = document.getElementById("endingNote");
    if (noteEl && star.endingNote) {
      noteEl.textContent = star.endingNote;
      noteEl.classList.remove("hidden");
    }
    overlay.classList.add("visible");
  }

  _tick() {
    if (!this.playing) return;
    this.progress = Math.min(MAX_PROGRESS_250, this.progress + this.speed * 1.2);
    if (this.progress >= MAX_PROGRESS_250) {
      this.progress = MAX_PROGRESS_250;
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
      return Math.round(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * MAX_PROGRESS_250);
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
      <h3 class="quiz-title">🧩 趣味问答 · 不稳定对超新星</h3>
      ${STAR_250M.quiz.map((item, i) => `
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
  window.star250App = new Star250App();
});
