// ============================================================
// star-engine.js — 多星种对比引擎
// ============================================================

// ===== 全局常量 =====
const MAX_PROGRESS = 1000;

// ===== 工具函数 =====
function lerp(a, b, t) { return a + (b - a) * t; }

function hexToRgb(hex) {
  const v = hex.replace("#", "");
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16)
  };
}

function mixColor(c1, c2, t) {
  const a = hexToRgb(c1), b = hexToRgb(c2);
  return `rgb(${Math.round(lerp(a.r,b.r,t))},${Math.round(lerp(a.g,b.g,t))},${Math.round(lerp(a.b,b.b,t))})`;
}

function formatAge(myr) {
  if (myr < 1)      return `${(myr * 1000).toFixed(0)} 千年`;
  if (myr < 1000)   return `${myr.toFixed(1)} Myr`;
  const gyr = myr / 1000;
  if (gyr < 1000)   return `${gyr.toFixed(2)} Gyr`;
  const tyr = gyr / 1000;
  return `${tyr.toFixed(2)} Tyr（万亿年）`;
}

function formatLum(lsun) {
  if (lsun < 0.0001) return `${(lsun * 1e7).toFixed(1)} × 10⁻⁷ L☉`;
  if (lsun < 0.01)   return `${lsun.toFixed(5)} L☉`;
  if (lsun < 10)     return `${lsun.toFixed(3)} L☉`;
  if (lsun > 1e9)    return `${(lsun / 1e9).toFixed(1)} × 10⁹ L☉`;
  if (lsun > 1e6)    return `${(lsun / 1e6).toFixed(1)} × 10⁶ L☉`;
  return `${lsun.toFixed(0)} L☉`;
}

// 构建进度-阶段映射，保证每阶段至少有 MIN 个进度单位
function buildRanges(phases) {
  const globalEnd = phases[phases.length - 1].ageEndMyr;
  const MIN = Math.ceil(MAX_PROGRESS / phases.length / 2);
  let cursor = 0;
  return phases.map((ph, idx) => {
    const rawEnd = Math.round((ph.ageEndMyr / globalEnd) * MAX_PROGRESS);
    const start = cursor;
    const end = Math.min(MAX_PROGRESS,
      idx === phases.length - 1 ? MAX_PROGRESS : Math.max(cursor + MIN, rawEnd));
    cursor = end;
    return { start, end };
  });
}

function getPhaseIdx(ranges, value) {
  return ranges.findIndex((r, i) =>
    i === ranges.length - 1
      ? value >= r.start && value <= r.end
      : value >= r.start && value < r.end
  );
}

// ============================================================
// StarWidget — 单颗星的可视化组件（绑定到某个 DOM slot）
// ============================================================
class StarWidget {
  constructor(slotEl, starData) {
    this.slot = slotEl;
    this.data = starData;
    this.ranges = buildRanges(starData.phases);
    this._buildDOM();
    this.render(0);
  }

  _buildDOM() {
    this.slot.innerHTML = `
      <div class="sw-scene" style="--theme:${this.data.themeColor}">
        <div class="sw-star-halo" data-ref="halo"></div>
        <div class="sw-star-core" data-ref="core"></div>
        <div class="sw-age-badge" data-ref="age"></div>
        <!-- supernova overlay -->
        <div class="sw-supernova" data-ref="sn" style="display:none">
          <div class="sn-ring sn-ring1"></div>
          <div class="sn-ring sn-ring2"></div>
          <div class="sn-flash"></div>
          <div class="sn-label">💥 超新星爆炸！</div>
        </div>
        <!-- pulsar overlay -->
        <div class="sw-pulsar-beam" data-ref="beam" style="display:none"></div>
      </div>
      <div class="sw-info">
        <div class="sw-phase-name" data-ref="pname"></div>
        <div class="sw-phase-span" data-ref="pspan"></div>
        <div class="sw-metrics">
          <span data-ref="temp"></span>
          <span data-ref="lum"></span>
          <span data-ref="radius"></span>
        </div>
        <div class="sw-note" data-ref="note"></div>
      </div>
    `;
    const get = k => this.slot.querySelector(`[data-ref="${k}"]`);
    this.$ = {
      halo:  get("halo"),  core:  get("core"),
      age:   get("age"),   sn:    get("sn"),
      beam:  get("beam"),  pname: get("pname"),
      pspan: get("pspan"), temp:  get("temp"),
      lum:   get("lum"),   radius:get("radius"),
      note:  get("note")
    };
  }

  render(progress) {
    const phases = this.data.phases;
    const ranges = this.ranges;
    const idx    = getPhaseIdx(ranges, progress);
    const phase  = phases[idx];
    const next   = phases[Math.min(idx + 1, phases.length - 1)];
    const range  = ranges[idx];
    const t      = range.end === range.start ? 0 : (progress - range.start) / (range.end - range.start);

    const age    = lerp(phase.ageStartMyr, phase.ageEndMyr, t);
    const lum    = lerp(phase.lumLsun,    next.lumLsun,    t * 0.3);
    const temp   = lerp(phase.tempK,      next.tempK,      t * 0.3);
    const radius = lerp(phase.radiusRsun, next.radiusRsun, t * 0.3);
    const color  = mixColor(phase.color, next.color, t * 0.4);

    const isBlackDwarf = phase.special === "blackdwarf";
    const isSN         = phase.special === "supernova";
    const isPulsar     = phase.special === "pulsar";
    const isUltraWD    = phase.special === "ultra-wd";

    // ---- visual sizing ----
    let size = Math.max(22, Math.min(190, 28 + radius * 180));
    if (isSN) size = Math.min(190, size * (1 + t * 3));
    if (isUltraWD) size = Math.max(18, size); // 超大质量白矮星，极小但有蓝白光芒

    const haloSize = size * 2.6;
    const opacity  = isBlackDwarf ? Math.max(0.04, 1 - t * 0.94) : 1;

    // ---- star core ----
    if (isSN) {
      this.$.core.style.background = `radial-gradient(circle, #ffffff 0%, #ffffcc 30%, ${color} 65%, transparent 100%)`;
      this.$.core.style.boxShadow  = `0 0 ${Math.round(size * 1.5)}px rgba(255,240,180,${0.5 + t * 0.5})`;
    } else if (isPulsar) {
      this.$.core.style.background = `radial-gradient(circle at 40% 35%, #ddffff 0%, ${color} 45%, #002244 100%)`;
      this.$.core.style.boxShadow  = `0 0 ${Math.round(size * 0.5)}px rgba(100,200,255,0.7)`;
    } else if (isUltraWD) {
      // 超大质量白矮星：强烈蓝白色，带危险的脉动光芒
      const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 600);
      this.$.core.style.background = `radial-gradient(circle at 35% 30%, #ffffff 0%, #aaccff 30%, #5588ff 70%, #002060 100%)`;
      this.$.core.style.boxShadow  = `0 0 ${Math.round(size * 1.2 * pulse)}px rgba(100,160,255,${0.7 * pulse}), 0 0 ${Math.round(size * 2.5)}px rgba(80,120,255,0.3)`;
    } else if (isBlackDwarf) {
      this.$.core.style.background = `radial-gradient(circle at 38% 30%, #2a2a4a 0%, ${color} 60%, #0a0a18 100%)`;
      this.$.core.style.boxShadow  = `0 0 ${Math.round(size * 0.2)}px rgba(60,60,120,0.15)`;
    } else {
      this.$.core.style.background = `radial-gradient(circle at 32% 28%, #fff7df 0%, ${color} 55%, #1a0800 100%)`;
      this.$.core.style.boxShadow  = `0 0 ${Math.round(size * 0.45)}px ${phase.halo}`;
    }

    this.$.core.style.width   = `${size}px`;
    this.$.core.style.height  = `${size}px`;
    this.$.core.style.opacity = String(opacity);

    // ---- halo ----
    this.$.halo.style.width  = `${haloSize}px`;
    this.$.halo.style.height = `${haloSize}px`;
    this.$.halo.style.opacity = String(isSN ? 1 : opacity);
    if (isSN) {
      this.$.halo.style.background = `radial-gradient(circle, rgba(255,240,160,${0.6+t*0.4}) 0%, rgba(255,200,80,0.15) 50%, transparent 75%)`;
    } else {
      this.$.halo.style.background = `radial-gradient(circle, ${phase.halo} 0%, rgba(100,120,255,0.06) 50%, transparent 75%)`;
    }

    // ---- special overlays ----
    this.$.sn.style.display   = isSN     ? "" : "none";
    this.$.beam.style.display = isPulsar ? "" : "none";
    // ultra-wd 不需要 overlay，脉动效果已内嵌在 core 里
    if (isPulsar) {
      const angle = (Date.now() / 8) % 360;
      this.$.beam.style.transform = `rotate(${angle}deg)`;
    }

    // ---- age badge ----
    this.$.age.textContent = formatAge(age);

    // ---- info panel ----
    this.$.pname.textContent  = phase.name;
    this.$.pspan.textContent  = phase.spanLabel;
    this.$.temp.textContent   = `🌡 ${Math.round(temp).toLocaleString()} K`;
    this.$.lum.textContent    = `☀ ${formatLum(lum)}`;
    this.$.radius.textContent = `⊙ ${radius < 0.001 ? radius.toExponential(2) : radius.toFixed(3)} R☉`;
    this.$.note.textContent   = phase.note;

    this._currentPhase = phase;
    this._currentIdx   = idx;
    return { phase, age, lum, temp, radius, idx };
  }

  getCurrentPhase() { return this._currentPhase; }
  getCurrentIdx()   { return this._currentIdx; }
}

// ============================================================
// App — 页面主逻辑
// ============================================================
class StarApp {
  constructor() {
    // 状态
    this.activeStars  = new Set(["red-dwarf"]); // 当前展示的星种key
    this.progress     = 0;
    this.playing      = false;
    this.speed        = 1;
    this.rafId        = null;
    this.teachMode    = true;
    this.widgets      = {};  // key -> StarWidget
    this.quizAnswered = {};

    this._bindElements();
    this._buildStarCards();
    this._buildCompareBar();
    this._renderActiveStars();
    this._bindEvents();
    this._updateTeachBar(0);
    this._updateProgressBar(0);
  }

  // ---------- DOM refs ----------
  _bindElements() {
    this.playBtn    = document.getElementById("playBtn");
    this.resetBtn   = document.getElementById("resetBtn");
    this.speedSel   = document.getElementById("speedSelect");
    this.progressEl = document.getElementById("progressBar");
    this.teachBar   = document.getElementById("teachBar");
    this.teachEmoji = document.getElementById("teachEmoji");
    this.teachTitle = document.getElementById("teachTitle");
    this.teachCapEl = document.getElementById("teachCaption");
    this.stageLabel = document.getElementById("stageLabel");
    this.starsGrid  = document.getElementById("starsGrid");
    this.endingOverlay = document.getElementById("endingOverlay");
    this.teachToggle   = document.getElementById("teachToggle");
    this.quizSection   = document.getElementById("quizSection");
  }

  // ---------- 星种选择卡片 ----------
  _buildStarCards() {
    const container = document.getElementById("starSelector");
    container.innerHTML = STAR_CATALOG.map(star => `
      <button class="star-card ${this.activeStars.has(star.key) ? "active" : ""}"
              data-key="${star.key}" style="--c:${star.themeColor}">
        <div class="sc-mass">${star.massLabel}</div>
        <div class="sc-name">${star.name}</div>
        <div class="sc-fate" style="color:${star.fateColor}">${star.fate}</div>
        <div class="sc-summary">${star.summary}</div>
      </button>
    `).join("");

    container.querySelectorAll(".star-card").forEach(btn => {
      btn.addEventListener("click", () => this._toggleStar(btn.dataset.key));
    });
  }

  _toggleStar(key) {
    if (this.activeStars.has(key)) {
      if (this.activeStars.size === 1) return; // 至少保留一颗
      this.activeStars.delete(key);
    } else {
      this.activeStars.add(key);
    }
    // 更新按钮状态
    document.querySelectorAll(".star-card").forEach(btn => {
      btn.classList.toggle("active", this.activeStars.has(btn.dataset.key));
    });
    this._renderActiveStars();
    this.render(this.progress);
  }

  // ---------- 构建对比进度条 ----------
  _buildCompareBar() {
    // 时间轴里程碑
    const milestones = [
      { pct: 0,   label: "0" },
      { pct: 15,  label: "1 Gyr" },
      { pct: 38,  label: "10 Gyr" },
      { pct: 77,  label: "100 Gyr" },
      { pct: 100, label: "~3 Tyr" }
    ];
    const bar = document.getElementById("milestoneBar");
    bar.innerHTML = milestones.map(m =>
      `<span class="milestone" style="left:${m.pct}%">${m.label}</span>`
    ).join("");
  }

  // ---------- 渲染星体区域 ----------
  _renderActiveStars() {
    const grid = this.starsGrid;
    // 清理不需要的 widget
    Object.keys(this.widgets).forEach(k => {
      if (!this.activeStars.has(k)) {
        const el = grid.querySelector(`[data-slot="${k}"]`);
        if (el) el.remove();
        delete this.widgets[k];
      }
    });
    // 添加新增的 widget
    this.activeStars.forEach(k => {
      if (!this.widgets[k]) {
        const star = STAR_CATALOG.find(s => s.key === k);
        const slot = document.createElement("div");
        slot.className = "star-slot";
        slot.dataset.slot = k;
        slot.innerHTML = `<div class="slot-header" style="--c:${star.themeColor}">
          <span class="slot-mass">${star.massLabel}</span>
          <span class="slot-name">${star.name}</span>
          <span class="slot-fate" style="color:${star.fateColor}">${star.fate}</span>
        </div>`;
        const widgetEl = document.createElement("div");
        widgetEl.className = "sw-container";
        slot.appendChild(widgetEl);
        grid.appendChild(slot);
        this.widgets[k] = new StarWidget(widgetEl, star);
      }
    });
    // 更新 grid 列数
    const n = this.activeStars.size;
    grid.style.gridTemplateColumns = n === 1 ? "1fr" : n === 2 ? "1fr 1fr" : "1fr 1fr 1fr";
  }

  // ---------- 渲染所有活跃星体 ----------
  render(progress) {
    let anySupernova = false, anyPulsar = false, anyBlackDwarf = false;
    let primaryKey = [...this.activeStars][0];
    let primaryResult = null;

    this.activeStars.forEach(k => {
      const w = this.widgets[k];
      if (!w) return;
      const result = w.render(progress);
      if (k === primaryKey) primaryResult = result;
      if (result.phase.special === "supernova") anySupernova = true;
      if (result.phase.special === "pulsar")    anyPulsar = true;
      if (result.phase.special === "blackdwarf" && progress > 980) anyBlackDwarf = true;
      if (result.phase.special === "ultra-wd"   && progress > 980) anyBlackDwarf = true; // ultra-wd 也触发结局
    });

    // 教学栏（基于第一颗活跃星）
    if (primaryResult) this._updateTeachBar(progress);

    // 特殊效果
    this._handleSpecialOverlays(anySupernova, anyPulsar, anyBlackDwarf, progress);

    // 更新进度条位置
    this._updateProgressBar(progress);

    // 超新星时震动屏幕
    if (anySupernova) this._screenShake();
  }

  _updateTeachBar(progress) {
    if (!this.teachMode) return;
    const primaryKey = [...this.activeStars][0];
    const star = STAR_CATALOG.find(s => s.key === primaryKey);
    if (!star) return;
    const ranges = buildRanges(star.phases);
    const idx    = getPhaseIdx(ranges, progress);
    const phase  = star.phases[idx];
    if (!phase || !phase.teach) return;

    this.teachEmoji.textContent = phase.teach.emoji;
    this.teachTitle.textContent = phase.teach.title;
    this.teachCapEl.textContent = phase.teach.caption;

    // 更新阶段标签
    const pct = Math.round(progress / MAX_PROGRESS * 100);
    this.stageLabel.textContent = `进度 ${pct}% · ${phase.name}`;

    // 章节徽章检查
    this._checkBadge(primaryKey, idx);
  }

  _updateProgressBar(progress) {
    const pct = (progress / MAX_PROGRESS) * 100;
    const thumb = document.getElementById("progressThumb");
    const fill  = document.getElementById("progressFill");
    if (thumb) thumb.style.left = `${pct}%`;
    if (fill)  fill.style.width  = `${pct}%`;
  }

  _handleSpecialOverlays(sn, pulsar, black, progress) {
    const snOverlay = document.getElementById("snFlash");
    if (snOverlay) snOverlay.style.opacity = sn ? "1" : "0";

    // 结局弹窗
    if (black && !this._endingShown) {
      this._endingShown = true;
      this._showEnding();
    }
    if (!black && progress < 950) {
      this._endingShown = false;
      this.endingOverlay.classList.remove("visible");
    }
    // 超新星结局也弹
    if (sn) {
      const pct = 0;
      const primaryKey = [...this.activeStars].find(k => {
        const w = this.widgets[k];
        return w && w.getCurrentPhase().special === "supernova";
      });
      if (primaryKey && progress > 970 && !this._snEndingShown) {
        this._snEndingShown = true;
        this._showEnding();
      }
    }
    if (progress < 900) this._snEndingShown = false;
  }

  _showEnding() {
    // 找到当前活跃的、处于特殊结局阶段的星
    let star = null;
    this.activeStars.forEach(k => {
      const w = this.widgets[k];
      if (!w) return;
      const sp = w.getCurrentPhase().special;
      if (sp === "blackdwarf" || sp === "pulsar" || sp === "ultra-wd") {
        star = STAR_CATALOG.find(s => s.key === k);
      }
    });
    if (!star) star = STAR_CATALOG.find(s => this.activeStars.has(s.key));
    if (!star) return;

    const overlay = this.endingOverlay;
    overlay.querySelector(".ending-title").textContent = star.endingTitle;
    overlay.querySelector(".ending-desc").textContent  = star.endingDesc;
    overlay.querySelector(".ending-badge").textContent = star.endingBadge;
    overlay.querySelector(".ending-badge").style.color = star.fateColor;
    // endingNote（可选）
    const noteEl = document.getElementById("endingNote");
    if (noteEl) {
      if (star.endingNote) {
        noteEl.textContent = star.endingNote;
        noteEl.classList.remove("hidden");
      } else {
        noteEl.textContent = "";
        noteEl.classList.add("hidden");
      }
    }
    overlay.classList.add("visible");
  }

  _screenShake() {
    document.body.classList.remove("screen-shake");
    requestAnimationFrame(() => document.body.classList.add("screen-shake"));
    setTimeout(() => document.body.classList.remove("screen-shake"), 500);
  }

  // ---------- 章节徽章 ----------
  _checkBadge(starKey, phaseIdx) {
    const badge = document.getElementById(`badge-${starKey}-${phaseIdx}`);
    if (badge && !badge.classList.contains("unlocked")) {
      badge.classList.add("unlocked");
    }
  }

  // ---------- 问答模块 ----------
  _buildQuiz(starKey) {
    const star = STAR_CATALOG.find(s => s.key === starKey);
    if (!star) return;
    const container = this.quizSection;
    container.innerHTML = `
      <h3 class="quiz-title">🧩 趣味问答 · ${star.name}</h3>
      ${star.quiz.map((item, i) => `
        <div class="quiz-item" id="qi-${starKey}-${i}">
          <div class="qi-q">${item.icon} ${item.q}</div>
          <button class="qi-btn" data-star="${starKey}" data-idx="${i}">我知道答案！</button>
          <div class="qi-a hidden">${item.a}</div>
        </div>
      `).join("")}
    `;
    container.querySelectorAll(".qi-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const { star: sk, idx } = btn.dataset;
        const item = document.getElementById(`qi-${sk}-${idx}`);
        item.querySelector(".qi-a").classList.remove("hidden");
        item.querySelector(".qi-btn").style.display = "none";
        item.classList.add("answered");
      });
    });
  }

  // ---------- 播放控制 ----------
  _tick() {
    if (!this.playing) return;
    this.progress = Math.min(MAX_PROGRESS, this.progress + this.speed * 1.1);
    if (this.progress >= MAX_PROGRESS) {
      this.progress = MAX_PROGRESS;
      this.playing  = false;
      this.playBtn.textContent = "▶ 播放";
    }
    this.progressEl.value = String(this.progress);
    this._updateProgressBar(this.progress);
    this.render(this.progress);
    if (this.playing) this.rafId = requestAnimationFrame(() => this._tick());
  }

  _setPlaying(v) {
    this.playing = v;
    this.playBtn.textContent = v ? "⏸ 暂停" : "▶ 播放";
    cancelAnimationFrame(this.rafId);
    if (v) this.rafId = requestAnimationFrame(() => this._tick());
  }

  // ---------- 事件绑定 ----------
  _bindEvents() {
    this.playBtn.addEventListener("click", () => this._setPlaying(!this.playing));

    this.resetBtn.addEventListener("click", () => {
      this.progress = 0;
      this.progressEl.value = "0";
      this._setPlaying(false);
      this._endingShown = false;
      this._snEndingShown = false;
      this.endingOverlay.classList.remove("visible");
      this._updateProgressBar(0);
      this.render(0);
    });

    this.speedSel.addEventListener("change", e => {
      this.speed = Number(e.target.value);
    });

    // 备用：原生 range input 同步
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

    // 问答切换
    document.getElementById("quizToggle").addEventListener("click", () => {
      const primaryKey = [...this.activeStars][0];
      this._buildQuiz(primaryKey);
      document.getElementById("quizPanel").classList.toggle("hidden");
    });

    // ===== 拖拽进度条（鼠标 + 触屏） =====
    this._bindProgressDrag();

    // 脉冲星 & 超大质量白矮星动画需要持续刷新
    setInterval(() => {
      this.activeStars.forEach(k => {
        const w = this.widgets[k];
        const sp = w && w.getCurrentPhase && w.getCurrentPhase()?.special;
        if (sp === "pulsar" || sp === "ultra-wd") {
          w.render(this.progress);
        }
      });
    }, 50);
  }

  // ---------- 拖拽进度条 ----------
  _bindProgressDrag() {
    const track = document.getElementById("progressTrack");
    if (!track) return;

    const calcProgress = (clientX) => {
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(ratio * MAX_PROGRESS);
    };

    const onMove = (clientX) => {
      this.progress = calcProgress(clientX);
      this.progressEl.value = String(this.progress);
      this._updateProgressBar(this.progress);
      this.render(this.progress);
    };

    // 鼠标事件
    track.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      track.classList.add("dragging");
      onMove(e.clientX);
      const onMouseMove = (ev) => onMove(ev.clientX);
      const onMouseUp   = () => {
        track.classList.remove("dragging");
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup",   onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup",   onMouseUp);
    });

    // 触屏事件
    track.addEventListener("touchstart", (e) => {
      e.preventDefault();
      track.classList.add("dragging");
      onMove(e.touches[0].clientX);
      const onTouchMove = (ev) => { ev.preventDefault(); onMove(ev.touches[0].clientX); };
      const onTouchEnd  = () => {
        track.classList.remove("dragging");
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend",  onTouchEnd);
      };
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("touchend",  onTouchEnd);
    }, { passive: false });
  }
}

// ============================================================
// 启动
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  window.starApp = new StarApp();
});
