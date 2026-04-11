// ============================================================
//  star-250m-engine.js
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

// 构建等宽进度区间（每阶段至少 5% 进度）
function buildRanges250(phases) {
  const total = phases.length;
  const minSpan = Math.floor(MAX_PROGRESS_250 * 0.05);
  const reserved = minSpan * total;
  const remaining = MAX_PROGRESS_250 - reserved;
  const ageSpans = phases.map(p => Math.max(p.ageEndMyr - p.ageStartMyr, 0.0001));
  const totalAge = ageSpans.reduce((a, b) => a + b, 0);
  let cur = 0;
  return phases.map((p, i) => {
    const span = minSpan + Math.round((ageSpans[i] / totalAge) * remaining);
    const start = cur;
    const end = cur + span;
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
// StarWidget250 — 单颗星渲染
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
      <div class="sw-visual">
        <div class="sw-halo"  data-ref="halo"></div>
        <div class="sw-core"  data-ref="core">
          <div class="sw-sn"   data-ref="sn"   style="display:none">💥</div>
          <div class="sw-beam" data-ref="beam" style="display:none"></div>
          <div class="pisn-particles" data-ref="particles"></div>
        </div>
        <div class="sw-age" data-ref="age">0</div>
      </div>
      <div class="sw-info">
        <div class="sw-pname" data-ref="pname">分子云</div>
        <div class="sw-meta">
          <span data-ref="pspan"></span>
          <span data-ref="temp"></span>
          <span data-ref="lum"></span>
          <span data-ref="radius"></span>
        </div>
        <div class="sw-note" data-ref="note"></div>
      </div>
    `;
    const get = k => this.slot.querySelector(`[data-ref="${k}"]`);
    this.$ = {
      halo:      get("halo"),
      core:      get("core"),
      sn:        get("sn"),
      beam:      get("beam"),
      particles: get("particles"),
      age:       get("age"),
      pname:     get("pname"),
      pspan:     get("pspan"),
      temp:      get("temp"),
      lum:       get("lum"),
      radius:    get("radius"),
      note:      get("note")
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
    const lum    = lerp250(phase.lumLsun,     next.lumLsun,    t * 0.3);
    const temp   = lerp250(phase.tempK,       next.tempK,      t * 0.3);
    const radius = lerp250(phase.radiusRsun,  next.radiusRsun, t * 0.3);

    const isSN       = phase.special === "pisn";
    const isPrePISN  = phase.special === "pre-pisn";
    const isNebula   = phase.special === "pisn-nebula";

    // ---- sizing ----
    let size = Math.max(24, Math.min(200, 30 + radius * 0.0004 * 200));
    // 对某些大半径阶段做对数缩放
    if (radius > 100) size = Math.max(30, Math.min(180, 30 + Math.log10(radius) * 36));
    if (isSN) size = Math.min(200, size * (1 + t * 4));

    const haloSize = size * (isNebula ? 4.5 : isSN ? 3.5 : 2.6);
    const color = phase.color;

    // ---- core style ----
    if (isSN) {
      this.$.core.style.background = `radial-gradient(circle, #ffffff 0%, #ffffcc 20%, #ffee88 45%, ${color} 70%, transparent 100%)`;
      this.$.core.style.boxShadow  = `0 0 ${Math.round(size * 2)}px rgba(255,240,100,${0.6+t*0.4}), 0 0 ${Math.round(size * 4)}px rgba(255,180,50,0.3)`;
      this.$.core.classList.remove("star-danger", "star-nebula");
    } else if (isPrePISN) {
      const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 200);
      this.$.core.style.background = `radial-gradient(circle at 35% 30%, #ffff88 0%, #ffaa22 45%, ${color} 80%)`;
      this.$.core.style.boxShadow  = `0 0 ${Math.round(size * pulse * 1.5)}px rgba(255,150,50,${pulse})`;
      this.$.core.classList.add("star-danger");
      this.$.core.classList.remove("star-nebula");
    } else if (isNebula) {
      this.$.core.style.background = `radial-gradient(circle at 50% 50%, transparent 0%, rgba(255,120,60,0.2) 30%, ${color} 60%, rgba(255,80,40,0.4) 80%, transparent 100%)`;
      this.$.core.style.boxShadow  = `0 0 ${Math.round(size * 1.5)}px rgba(255,130,60,0.4)`;
      this.$.core.classList.add("star-nebula");
      this.$.core.classList.remove("star-danger");
    } else {
      // 普通阶段：高亮蓝白色
      this.$.core.style.background = `radial-gradient(circle at 32% 28%, #ffffff 0%, ${color} 50%, #180010 100%)`;
      this.$.core.style.boxShadow  = `0 0 ${Math.round(size * 0.5)}px ${phase.halo}`;
      this.$.core.classList.remove("star-danger", "star-nebula");
    }

    this.$.core.style.width   = `${size}px`;
    this.$.core.style.height  = `${size}px`;

    // ---- halo ----
    this.$.halo.style.width  = `${haloSize}px`;
    this.$.halo.style.height = `${haloSize}px`;
    if (isSN) {
      this.$.halo.style.background = `radial-gradient(circle, rgba(255,240,160,${0.7+t*0.3}) 0%, rgba(255,160,60,0.2) 45%, transparent 75%)`;
    } else if (isNebula) {
      this.$.halo.style.background = `radial-gradient(circle, rgba(255,120,60,0.4) 0%, rgba(200,80,40,0.15) 40%, rgba(100,40,20,0.05) 65%, transparent 80%)`;
    } else {
      this.$.halo.style.background = `radial-gradient(circle, ${phase.halo} 0%, rgba(255,50,100,0.06) 55%, transparent 80%)`;
    }

    // ---- overlays ----
    this.$.sn.style.display = isSN ? "" : "none";
    if (isSN) {
      this.$.sn.style.fontSize = `${Math.round(size * 0.6)}px`;
    }

    // ---- info ----
    this.$.age.textContent    = formatAge250(age);
    this.$.pname.textContent  = phase.name;
    this.$.pspan.textContent  = phase.spanLabel;
    this.$.temp.textContent   = `🌡 ${Math.round(temp).toLocaleString()} K`;
    this.$.lum.textContent    = `☀ ${formatLum250(lum)}`;
    this.$.radius.textContent = `⊙ ${radius >= 1000 ? (radius/1000).toFixed(0)+'K' : radius >= 10 ? radius.toFixed(0) : radius.toFixed(3)} R☉`;
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
    this._updateProgressBar(0);
    this._updateTeachBar(0);
  }

  _bindElements() {
    this.playBtn      = document.getElementById("playBtn");
    this.resetBtn     = document.getElementById("resetBtn");
    this.speedSel     = document.getElementById("speedSelect");
    this.progressEl   = document.getElementById("progressBar");
    this.teachBar     = document.getElementById("teachBar");
    this.teachEmoji   = document.getElementById("teachEmoji");
    this.teachTitle   = document.getElementById("teachTitle");
    this.teachCapEl   = document.getElementById("teachCaption");
    this.stageLabel   = document.getElementById("stageLabel");
    this.endingOverlay= document.getElementById("endingOverlay");
    this.teachToggle  = document.getElementById("teachToggle");
    this.quizSection  = document.getElementById("quizSection");
    this.pisnFlash    = document.getElementById("pisnFlash");
    this.snFlash      = document.getElementById("snFlash");
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
      <span class="slot-fate" style="color:#ffdd88">💥 不稳定对超新星</span>
    </div>`;
    const widgetEl = document.createElement("div");
    widgetEl.className = "sw-container";
    slot.appendChild(widgetEl);
    grid.appendChild(slot);
    this.widget = new StarWidget250(widgetEl);
  }

  _buildMilestones() {
    const milestones = [
      { pct: 0,   label: "0" },
      { pct: 20,  label: "分子云" },
      { pct: 45,  label: "蓝超巨星" },
      { pct: 65,  label: "LBV" },
      { pct: 82,  label: "沃夫-拉叶" },
      { pct: 93,  label: "⚠️PISN前" },
      { pct: 100, label: "💥PISN" }
    ];
    const bar = document.getElementById("milestoneBar");
    bar.innerHTML = milestones.map(m =>
      `<span class="milestone" style="left:${m.pct}%">${m.label}</span>`
    ).join("");
  }

  render(progress) {
    if (!this.widget) return;
    const result = this.widget.render(progress);
    const special = result.phase.special;

    // 更新教学栏
    this._updateTeachBar(progress);
    this._updateProgressBar(progress);

    // PISN 特效
    if (special === "pisn") {
      this.pisnFlash.style.opacity = String(0.3 + result.phase && 0.7);
      if (!this._pisnTriggered) {
        this._pisnTriggered = true;
        this._triggerPISN();
      }
      // 持续闪光
      this.pisnFlash.style.opacity = String(0.5 + 0.5 * Math.sin(Date.now() / 80));
    } else {
      this.pisnFlash.style.opacity = "0";
    }

    if (special === "pre-pisn") {
      this.snFlash.style.opacity = String(0.05 + 0.05 * Math.sin(Date.now() / 300));
    } else if (special !== "pisn") {
      this.snFlash.style.opacity = "0";
    }

    // 重置触发标志
    if (progress < 800) {
      this._pisnTriggered = false;
      this._endingShown   = false;
      this.endingOverlay.classList.remove("visible");
    }

    // 遗迹阶段显示结局弹窗
    if (special === "pisn-nebula" && !this._endingShown && progress > 900) {
      this._endingShown = true;
      this._showEnding();
    }
  }

  _triggerPISN() {
    // 屏幕剧烈抖动
    document.body.classList.remove("screen-shake");
    requestAnimationFrame(() => document.body.classList.add("screen-shake"));
    setTimeout(() => document.body.classList.remove("screen-shake"), 600);

    // 多次闪光
    let count = 0;
    const flash = () => {
      this.pisnFlash.style.opacity = count % 2 === 0 ? "0.9" : "0.1";
      count++;
      if (count < 8) setTimeout(flash, 120);
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
    const pct = (progress / MAX_PROGRESS_250) * 100;
    const thumb = document.getElementById("progressThumb");
    const fill  = document.getElementById("progressFill");
    if (thumb) thumb.style.left = `${pct}%`;
    if (fill)  fill.style.width  = `${pct}%`;
  }

  _showEnding() {
    const star = STAR_250M;
    const overlay = this.endingOverlay;
    overlay.querySelector(".ending-title").textContent = star.endingTitle;
    overlay.querySelector(".ending-desc").textContent  = star.endingDesc;
    overlay.querySelector(".ending-badge").textContent = star.endingBadge;
    overlay.querySelector(".ending-badge").style.color = star.fateColor;
    const noteEl = document.getElementById("endingNote");
    if (noteEl && star.endingNote) {
      noteEl.textContent = star.endingNote;
      noteEl.classList.remove("hidden");
    }
    overlay.classList.add("visible");
  }

  _tick() {
    if (!this.playing) return;
    this.progress = Math.min(MAX_PROGRESS_250, this.progress + this.speed * 1.1);
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
    this.playBtn.addEventListener("click", () => this._setPlaying(!this.playing));

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

    this.speedSel.addEventListener("change", e => {
      this.speed = Number(e.target.value);
    });

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

    // 拖拽进度条（鼠标 + 触屏）
    this._bindProgressDrag();

    // pre-pisn 危险脉冲刷新
    setInterval(() => {
      const sp = this.widget && this.widget.getCurrentPhase().special;
      if (sp === "pre-pisn" || sp === "pisn") {
        this.widget.render(this.progress);
      }
      if (sp === "pisn") {
        this.pisnFlash.style.opacity = String(0.4 + 0.6 * Math.abs(Math.sin(Date.now() / 80)));
      }
    }, 40);
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
          <button class="qi-btn" data-idx="${i}">我知道答案！</button>
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
