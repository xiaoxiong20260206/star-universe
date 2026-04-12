const MAX_PROGRESS = 1000;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function mixColor(c1, c2, t) {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  return `rgb(${Math.round(lerp(a.r, b.r, t))}, ${Math.round(lerp(a.g, b.g, t))}, ${Math.round(lerp(a.b, b.b, t))})`;
}

function formatAge(myr) {
  if (myr < 1) return `${Math.round(myr * 1000)} 千年`;
  if (myr < 1000) return `${myr.toFixed(1)} Myr`;
  const gyr = myr / 1000;
  if (gyr < 1000) return `${gyr.toFixed(2)} Gyr`;
  return `${(gyr / 1000).toFixed(2)} Tyr`;
}

function formatLum(lsun) {
  if (lsun < 0.001) return `${lsun.toExponential(2)} L☉`;
  if (lsun < 10) return `${lsun.toFixed(3)} L☉`;
  if (lsun < 1e4) return `${lsun.toFixed(0)} L☉`;
  if (lsun < 1e7) return `${(lsun / 1e4).toFixed(1)} × 10⁴ L☉`;
  return `${(lsun / 1e8).toFixed(1)} × 10⁸ L☉`;
}

function formatRadius(radius) {
  if (radius < 0.01) return `${radius.toExponential(2)} R☉`;
  if (radius < 1) return `${radius.toFixed(3)} R☉`;
  if (radius < 1000) return `${radius.toFixed(1)} R☉`;
  return `${radius.toFixed(0)} R☉`;
}

function buildRanges(phases) {
  const globalEnd = phases[phases.length - 1].ageEndMyr;
  const min = Math.ceil(MAX_PROGRESS / phases.length / 2);
  let cursor = 0;

  return phases.map((phase, idx) => {
    const rawEnd = Math.round((phase.ageEndMyr / globalEnd) * MAX_PROGRESS);
    const start = cursor;
    const end = Math.min(
      MAX_PROGRESS,
      idx === phases.length - 1 ? MAX_PROGRESS : Math.max(cursor + min, rawEnd),
    );
    cursor = end;
    return { start, end };
  });
}

function getPhaseIndex(ranges, value) {
  return ranges.findIndex((range, idx) => (
    idx === ranges.length - 1
      ? value >= range.start && value <= range.end
      : value >= range.start && value < range.end
  ));
}

function classifyPhase(phase) {
  const key = `${phase.key} ${phase.name} ${phase.state} ${phase.special || ""}`.toLowerCase();

  if (phase.special === "pisn") return "pisn";
  if (phase.special === "supernova") return "supernova";
  if (phase.special === "pre-pisn") return "critical";
  if (phase.special === "pisn-nebula") return "nebula";
  if (phase.special === "pulsar") return "compact";
  if (phase.special === "ultra-wd") return "white-dwarf";
  if (phase.special === "blackdwarf") return "black-dwarf";
  if (phase.special === "blackhole") return "black-hole";
  if (phase.special === "earth-living") return "earth-living";
  if (phase.special === "earth-relic") return "earth-relic";
  if (key.includes("nebula") || key.includes("星云")) return "nebula";
  if (key.includes("white") || key.includes("白矮星")) return "white-dwarf";
  if (key.includes("black-hole") || key.includes("black hole") || key.includes("黑洞")) return "black-hole";
  if (key.includes("black") || key.includes("黑矮星")) return "black-dwarf";
  if (key.includes("giant") || key.includes("巨星")) return key.includes("super") || key.includes("超巨") ? "supergiant" : "giant";
  if (key.includes("cloud") || key.includes("分子云")) return "cloud";
  if (key.includes("protostar") || key.includes("原恒星")) return "protostar";
  return "main-sequence";
}

function getUnifiedVisualScale(star, phase, selectedCount = 6) {
  // -------------------------------------------------------
  // 统一比例尺 + 自适应放大：
  // 1) 多星同屏(>=5): 严格统一比例，便于比较
  // 2) 少星聚焦(1~2): 显著放大，提升可读性
  // 3) 行星独立处理：气态巨行星需要特殊压缩
  // -------------------------------------------------------

  const phaseClass = classifyPhase(phase);
  const m = Math.max(star.massRatio, 0.000001);

  const BASE = 60;

  const viewZoomFactor = selectedCount >= 5
    ? 1.00
    : selectedCount === 4
      ? 1.12
      : selectedCount === 3
        ? 1.28
        : selectedCount === 2
          ? 1.62
          : 2.20;

  // -------------------------------------------------------
  // 行星尺寸处理（独立逻辑）
  // -------------------------------------------------------
  if (star.category === "planet") {
    const massInEarthMasses = star.massRatio; // 行星的massRatio已经是相对地球的质量
    const isGasGiant = massInEarthMasses > 10; // 木星/土星/天王星/海王星
    const isIceGiant = massInEarthMasses > 10 && massInEarthMasses < 50; // 天王星/海王星
    
    // 行星基础尺寸（地球为参考基准）
    const planetBase = 18;
    
    // 行星尺寸压缩因子（避免气态巨行星撑爆屏幕）
    // 木星质量是地球317倍，但我们只让它显示为约2.5倍直径
    let planetSize;
    if (isGasGiant) {
      // 气态巨行星：强压缩
      const compression = isIceGiant ? 0.15 : 0.08;
      planetSize = planetBase * Math.pow(massInEarthMasses, compression);
    } else {
      // 类地行星：正常比例
      planetSize = planetBase * Math.pow(Math.max(0.05, massInEarthMasses), 0.25);
    }
    
    // 应用视口缩放
    planetSize *= viewZoomFactor;
    
    // 行星尺寸上下限
    const minPlanetSize = 12;
    const maxPlanetSize = selectedCount === 1 ? 45 : selectedCount <= 2 ? 38 : 28;
    
    return Math.round(Math.min(maxPlanetSize, Math.max(minPlanetSize, planetSize)));
  }

  const stageMultiplier = {
    cloud: 0.80,
    protostar: 0.88,
    "main-sequence": 1.00,
    giant: 1.70,
    supergiant: 2.20,
    nebula: 2.80,
    "white-dwarf": 0.20,
    "black-dwarf": 0.15,
    compact: 0.15,
    "black-hole": 0.22,
    critical: 1.05,
    supernova: 2.60,
    pisn: 3.00,
    "earth-living": 0.08,
    "earth-relic": 0.06,
  }[phaseClass] ?? 1.0;

  const isFixed = [
    "white-dwarf", "black-dwarf", "compact", "black-hole",
    "earth-living", "earth-relic",
  ].includes(phaseClass);

  if (isFixed) {
    let fixedSize = BASE * stageMultiplier * viewZoomFactor;

    if (phaseClass === "earth-living" && selectedCount === 1) {
      fixedSize *= 1.45;
    }

    const minSize = phaseClass === "earth-living" ? 8 : 5;

    const maxSize = phaseClass === "earth-living"
      ? (selectedCount === 1 ? 42 : selectedCount <= 2 ? 30 : 18)
      : phaseClass === "earth-relic"
        ? (selectedCount <= 2 ? 22 : 14)
        : (selectedCount <= 2 ? 30 : 20);

    return Math.round(Math.min(maxSize, Math.max(minSize, fixedSize)));
  }

  const massFactor = Math.pow(m, 0.28);
  const raw = BASE * massFactor * stageMultiplier;
  const zoomed = raw * viewZoomFactor;

  const maxSize = selectedCount === 1 ? 320 : selectedCount === 2 ? 260 : 200;

  return Math.round(Math.min(maxSize, Math.max(10, zoomed)));
}

function createBackgroundStars(container) {
  const count = 72;
  let html = "";
  for (let i = 0; i < count; i += 1) {
    const size = (Math.random() * 2.2 + 0.6).toFixed(2);
    const left = (Math.random() * 100).toFixed(2);
    const top = (Math.random() * 100).toFixed(2);
    const opacity = (Math.random() * 0.5 + 0.2).toFixed(2);
    const duration = (Math.random() * 4 + 2.5).toFixed(2);
    html += `<span class="star-pixel" style="width:${size}px;height:${size}px;left:${left}%;top:${top}%;--op:${opacity};--dur:${duration}s"></span>`;
  }
  container.innerHTML = html;
}

class UniverseStageCard {
  constructor(container, star, onFocus) {
    this.star = star;
    this.onFocus = onFocus;
    this.ranges = buildRanges(star.phases);
    this.container = container;
    this._lastPhaseIdx = -1;
    this.container.innerHTML = this.buildTemplate();
    this.bind();
  }

  buildTemplate() {
    return `
      <article class="stage-card" data-key="${this.star.key}" style="--accent-color:${this.star.themeColor}">
        <div class="stage-card-header">
          <div>
            <div class="mass">${this.star.massLabel}</div>
            <div class="name">${this.star.name}</div>
          </div>
          <div class="fate">${this.star.fate}</div>
        </div>
        <div class="stage-visual">
          <div class="star-halo-outer"></div>
          <div class="star-halo"></div>
          <div class="star-core"></div>
          <div class="black-hole-ring"></div>
          <div class="black-hole-disk"></div>
          <div class="supernova-ring"></div>
          <div class="pisn-ring"></div>
          <div class="star-age"></div>
          <div class="stage-badge"></div>
        </div>
        <div class="info-grid">
          <div class="info-item"><label>阶段</label><strong data-ref="phase"></strong></div>
          <div class="info-item"><label>时间跨度</label><strong data-ref="span"></strong></div>
          <div class="info-item"><label>表面温度</label><strong data-ref="temp"></strong></div>
          <div class="info-item"><label>光度</label><strong data-ref="lum"></strong></div>
          <div class="info-item"><label>半径</label><strong data-ref="radius"></strong></div>
          <div class="info-item"><label>终局提示</label><strong data-ref="fate"></strong></div>
          <div class="note-box" data-ref="note"></div>
        </div>
      </article>
    `;
  }

  bind() {
    this.root = this.container.querySelector(".stage-card");
    this.visual = this.container.querySelector(".stage-visual");
    this.haloOuter = this.container.querySelector(".star-halo-outer");
    this.halo = this.container.querySelector(".star-halo");
    this.core = this.container.querySelector(".star-core");
    this.blackHoleRing = this.container.querySelector(".black-hole-ring");
    this.blackHoleDisk = this.container.querySelector(".black-hole-disk");
    this.supernovaRing = this.container.querySelector(".supernova-ring");
    this.pisnRing = this.container.querySelector(".pisn-ring");
    this.age = this.container.querySelector(".star-age");
    this.badge = this.container.querySelector(".stage-badge");
    this.refs = {
      phase: this.container.querySelector('[data-ref="phase"]'),
      span: this.container.querySelector('[data-ref="span"]'),
      temp: this.container.querySelector('[data-ref="temp"]'),
      lum: this.container.querySelector('[data-ref="lum"]'),
      radius: this.container.querySelector('[data-ref="radius"]'),
      fate: this.container.querySelector('[data-ref="fate"]'),
      note: this.container.querySelector('[data-ref="note"]'),
    };

    this.root.addEventListener("click", () => this.onFocus(this.star.key));
  }

  setFocused(focused) {
    this.root.classList.toggle("focused", focused);
  }

  pulseRing(target) {
    target.classList.remove("active");
    void target.offsetWidth;
    target.classList.add("active");
  }

  render(progress) {
    const idx = getPhaseIndex(this.ranges, progress);
    const phase = this.star.phases[idx];
    const next = this.star.phases[Math.min(idx + 1, this.star.phases.length - 1)];
    const range = this.ranges[idx];
    const t = range.end === range.start ? 0 : (progress - range.start) / (range.end - range.start);

    const age = lerp(phase.ageStartMyr, phase.ageEndMyr, t);
    const lum = lerp(phase.lumLsun, next.lumLsun, t * 0.25);
    const temp = lerp(phase.tempK, next.tempK, t * 0.25);
    const radius = lerp(phase.radiusRsun, next.radiusRsun, t * 0.25);
    const color = mixColor(phase.color, next.color, t * 0.35);
    const phaseClass = classifyPhase(phase);

    const selectedCount = window.starUniverseApp?.selected?.size || 6;
    const size = getUnifiedVisualScale(this.star, phase, selectedCount);
    const haloSize = Math.round(size * (phaseClass === "nebula" ? 2.2 : phaseClass === "pisn" ? 2.8 : 2.05));
    const haloOuterSize = Math.round(haloSize * 1.28);

    this.core.style.width = `${size}px`;
    this.core.style.height = `${size}px`;
    this.halo.style.width = `${haloSize}px`;
    this.halo.style.height = `${haloSize}px`;
    this.haloOuter.style.width = `${haloOuterSize}px`;
    this.haloOuter.style.height = `${haloOuterSize}px`;

    this.age.textContent = formatAge(age);
    this.badge.textContent = phase.state;

    this.refs.phase.textContent = phase.name;
    this.refs.span.textContent = phase.spanLabel;
    this.refs.temp.textContent = `${Math.round(temp).toLocaleString()} K`;
    this.refs.lum.textContent = formatLum(lum);
    this.refs.radius.textContent = formatRadius(radius);
    this.refs.fate.textContent = this.star.fate.replace(/^.+?\s/, this.star.fate.startsWith("💥") ? this.star.fate : this.star.fate);
    this.refs.note.textContent = phase.note;

    this.visual.style.background = `radial-gradient(circle at 50% 115%, rgba(74,106,255,0.14), transparent 42%), radial-gradient(circle at 50% 45%, ${phase.halo.replace(/0?\.\d+\)/, "0.16)")}, transparent 58%), #030611`;

    this.core.style.opacity = phaseClass === "black-dwarf" ? "0.42" : phaseClass === "black-hole" ? "1" : phaseClass === "earth-relic" ? "0.75" : "1";
    this.halo.style.opacity = phaseClass === "black-dwarf" ? "0.12" : phaseClass === "white-dwarf" ? "0.65" : phaseClass === "black-hole" ? "0.3" : phaseClass === "pisn" ? "1" : phaseClass === "earth-living" ? "0.5" : phaseClass === "earth-relic" ? "0.08" : "0.78";
    this.haloOuter.style.opacity = phaseClass === "pisn" ? "0.85" : phaseClass === "nebula" ? "0.45" : phaseClass === "black-hole" ? "0.42" : phaseClass === "earth-relic" ? "0.04" : "0.32";

    this.blackHoleRing.style.opacity = phaseClass === "black-hole" ? "1" : "0";
    this.blackHoleDisk.style.opacity = phaseClass === "black-hole" ? "1" : "0";

    if (phaseClass === "white-dwarf") {
      this.core.style.background = `radial-gradient(circle at 35% 32%, #ffffff 0%, #e4f0ff 26%, ${color} 58%, #19345b 100%)`;
      this.core.style.boxShadow = `0 0 ${Math.round(size * 1.2)}px rgba(170,210,255,0.65), 0 0 ${Math.round(size * 2.1)}px rgba(120,160,255,0.18)`;
    } else if (phaseClass === "black-dwarf") {
      this.core.style.background = `radial-gradient(circle at 35% 32%, #33415f 0%, ${color} 42%, #060a16 100%)`;
      this.core.style.boxShadow = `0 0 ${Math.round(size * 0.35)}px rgba(90,120,180,0.22)`;
    } else if (phaseClass === "compact") {
      this.core.style.background = `radial-gradient(circle at 35% 32%, #ffffff 0%, #9ce2ff 30%, #2458b8 64%, #041126 100%)`;
      this.core.style.boxShadow = `0 0 ${Math.round(size * 1.4)}px rgba(100,210,255,0.72)`;
    } else if (phaseClass === "black-hole") {
      this.core.style.background = `radial-gradient(circle at 50% 50%, #000000 0%, #03040a 58%, #090d18 100%)`;
      this.core.style.boxShadow = `0 0 ${Math.round(size * 0.3)}px rgba(160,190,255,0.08), inset 0 0 ${Math.round(size * 0.5)}px rgba(255,255,255,0.02)`;
      this.blackHoleDisk.style.width = `${Math.round(size * 3.5)}px`;
      this.blackHoleDisk.style.height = `${Math.round(size * 1.2)}px`;
      this.blackHoleDisk.style.boxShadow = `0 0 ${Math.round(size * 1.6)}px rgba(140,170,255,0.28)`;
      this.blackHoleRing.style.width = `${Math.round(size * 1.6)}px`;
      this.blackHoleRing.style.height = `${Math.round(size * 1.6)}px`;
    } else if (phaseClass === "pisn") {
      this.core.style.background = `radial-gradient(circle, #ffffff 0%, #fff3b0 22%, #ffb14d 55%, rgba(255,120,40,0.2) 82%, transparent 100%)`;
      this.core.style.boxShadow = `0 0 ${Math.round(size * 1.8)}px rgba(255,220,150,0.95), 0 0 ${Math.round(size * 3.4)}px rgba(255,160,70,0.42)`;
      if (idx !== this._lastPhaseIdx) this.pulseRing(this.pisnRing);
    } else if (phaseClass === "supernova") {
      this.core.style.background = `radial-gradient(circle, #ffffff 0%, #fff3cd 30%, ${color} 65%, transparent 100%)`;
      this.core.style.boxShadow = `0 0 ${Math.round(size * 1.6)}px rgba(255,230,170,0.92)`;
      if (idx !== this._lastPhaseIdx) this.pulseRing(this.supernovaRing);
    } else if (phaseClass === "nebula") {
      this.core.style.background = `radial-gradient(circle, rgba(255,255,255,0.24) 0%, ${color} 28%, rgba(255,170,120,0.18) 55%, transparent 100%)`;
      this.core.style.boxShadow = `0 0 ${Math.round(size * 1.4)}px rgba(255,180,120,0.24)`;
    } else if (phaseClass === "critical") {
      this.core.style.background = `radial-gradient(circle at 35% 32%, #fff7d6 0%, #ffd55c 20%, ${color} 52%, #321415 100%)`;
      this.core.style.boxShadow = `0 0 ${Math.round(size * 1.1)}px rgba(255,210,90,0.8), 0 0 ${Math.round(size * 2.3)}px rgba(255,80,60,0.28)`;
    } else if (phaseClass === "giant" || phaseClass === "supergiant") {
      this.core.style.background = `radial-gradient(circle at 35% 30%, #fff0d6 0%, ${color} 46%, #3a0d02 100%)`;
      this.core.style.boxShadow = `0 0 ${Math.round(size * 0.85)}px ${phase.halo}, 0 0 ${Math.round(size * 1.8)}px rgba(255,120,80,0.14)`;
    } else if (phaseClass === "earth-living") {
      // Blue-green planet with swirling continent shimmer
      const isProto = phase.key === "proto-earth";
      if (isProto) {
        this.core.style.background = `radial-gradient(circle at 42% 38%, #fff0c0 0%, #ff8040 30%, #b03010 65%, #3a0808 100%)`;
        this.core.style.boxShadow = `0 0 ${Math.round(size * 1.1)}px rgba(255,120,50,0.75), 0 0 ${Math.round(size * 2.0)}px rgba(255,70,20,0.22)`;
      } else {
        this.core.style.background = `radial-gradient(circle at 38% 34%, #b0e4ff 0%, #4daaff 28%, #1a6a30 56%, #0a1e50 100%)`;
        this.core.style.boxShadow = `0 0 ${Math.round(size * 0.9)}px rgba(77,170,255,0.7), 0 0 ${Math.round(size * 1.8)}px rgba(34,200,110,0.18)`;
      }
      this.core.classList.add("earth-core");
    } else if (phaseClass === "earth-relic") {
      this.core.style.background = `radial-gradient(circle at 42% 38%, #88775a 0%, #554433 45%, #2a1f18 80%, #0a0806 100%)`;
      this.core.style.boxShadow = `0 0 ${Math.round(size * 0.4)}px rgba(100,80,60,0.35)`;
      this.core.classList.remove("earth-core");
    } else if (phaseClass === "cloud") {
      this.core.style.background = `radial-gradient(circle, rgba(255,255,255,0.18) 0%, ${color} 38%, rgba(255,180,120,0.14) 66%, transparent 100%)`;
      this.core.style.boxShadow = `0 0 ${Math.round(size * 0.95)}px ${phase.halo}`;
    } else {
      this.core.style.background = `radial-gradient(circle at 35% 30%, #fff7dc 0%, ${color} 52%, #1a0904 100%)`;
      this.core.style.boxShadow = `0 0 ${Math.round(size * 0.75)}px ${phase.halo}`;
    }

    this.halo.style.background = `radial-gradient(circle, ${phase.halo} 0%, rgba(120,140,255,0.07) 58%, transparent 76%)`;
    this.haloOuter.style.background = `radial-gradient(circle, rgba(255,255,255,0.06) 0%, ${phase.halo.replace(/0?\.\d+\)/, "0.12)")} 48%, transparent 76%)`;

    if (phaseClass !== "black-hole") {
      this.blackHoleDisk.style.width = "0px";
      this.blackHoleDisk.style.height = "0px";
    }

    this._lastPhaseIdx = idx;

    return { star: this.star, phase, age, idx, phaseClass };
  }
}

class StarUniverseApp {
  constructor() {
    // 在运行时组装 catalog（所有脚本已加载，STAR_100M/STAR_250M 已定义）
    const PLANETS = [PLANET_MERCURY, PLANET_VENUS, EARTH, PLANET_MARS, PLANET_JUPITER, PLANET_SATURN, PLANET_URANUS, PLANET_NEPTUNE];
    const STARS = [STAR_RED_DWARF, STAR_SUN, STAR_MASSIVE, STAR_100M, STAR_250M];
    
    // 为所有对象添加 category 字段
    PLANETS.forEach(p => p.category = "planet");
    STARS.forEach(s => s.category = "star");
    
    // 完整目录：行星在前，恒星在后
    this.catalog = [...PLANETS, ...STARS];
    
    this.selected = new Set(["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"]);
    this.focusKey = "earth";
    this.progress = 0;
    this.speed = 1;
    this.playing = false;
    this.rafId = null;
    this.cards = new Map();
    this.lastFxAt = 0;
    this.endingShown = false;
    this.quizOpen = false;

    this.audioEnabled = true;
    this.speechSupported = typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance !== "undefined";
    this.lastNarratedPhaseKey = null;

    this.bindEls();
    this.updateAudioToggleUI();
    createBackgroundStars(this.starsLayer);
    this.renderSelector();
    this.renderStage();
    this.bindEvents();
    this.render();
  }

  bindEls() {
    this.selectorGrid = document.getElementById("selectorGrid");
    this.stageGrid = document.getElementById("stageGrid");
    this.playBtn = document.getElementById("playBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.quizToggleBtn = document.getElementById("quizToggleBtn");
    this.audioToggleBtn = document.getElementById("audioToggleBtn");
    this.speedSelect = document.getElementById("speedSelect");
    this.progressBar = document.getElementById("progressBar");
    this.selectAllBtn = document.getElementById("selectAllBtn");
    this.showFocusBtn = document.getElementById("showFocusBtn");
    this.focusSummary = document.getElementById("focusSummary");
    this.stageTitle = document.getElementById("stageTitle");
    this.selectionHint = document.getElementById("selectionHint");
    this.progressText = document.getElementById("progressText");
    this.globalFlash = document.getElementById("globalFlash");
    this.teachEmoji = document.getElementById("teachEmoji");
    this.teachTitle = document.getElementById("teachTitle");
    this.teachCaption = document.getElementById("teachCaption");
    this.starsLayer = document.getElementById("starsLayer");

    this.endingOverlay = document.getElementById("endingOverlay");
    this.endingTitle = document.getElementById("endingTitle");
    this.endingDesc = document.getElementById("endingDesc");
    this.endingBadge = document.getElementById("endingBadge");
    this.endingNote = document.getElementById("endingNote");
    this.endingClose = document.getElementById("endingClose");

    this.quizPanel = document.getElementById("quizPanel");
    this.quizSection = document.getElementById("quizSection");
  }

  getStar(key) {
    return this.catalog.find((item) => item.key === key);
  }

  getSelectedStars() {
    return this.catalog
      .filter((item) => this.selected.has(item.key))
      .sort((a, b) => a.massRatio - b.massRatio);
  }

  ensureFocusVisible() {
    if (!this.selected.has(this.focusKey)) {
      this.focusKey = this.getSelectedStars()[0]?.key || this.catalog[0].key;
      this.selected.add(this.focusKey);
    }
  }

  renderSelector() {
    const planets = this.catalog.filter(item => item.category === "planet");
    const stars = this.catalog.filter(item => item.category === "star");
    
    const renderChip = (star) => `
      <button class="selector-chip ${this.selected.has(star.key) ? "active" : ""} ${this.focusKey === star.key ? "focused" : ""}"
              data-key="${star.key}"
              style="--chip-color:${star.themeColor}">
        <div class="mass">${star.massLabel}</div>
        <div class="name">${star.name}</div>
        <div class="fate" style="color:${star.fateColor}">${star.fate}</div>
        <div class="summary">${star.summary}</div>
      </button>
    `;
    
    this.selectorGrid.innerHTML = `
      <div class="selector-group">
        <div class="group-head">
          <span class="group-label">🪐 太阳系行星</span>
          <button class="group-toggle" data-action="toggle-planet">全选</button>
        </div>
        <div class="group-grid">
          ${planets.map(s => renderChip(s)).join("")}
        </div>
      </div>
      <div class="selector-group collapsed">
        <div class="group-head">
          <span class="group-label">⭐ 恒星演化对比</span>
          <button class="group-toggle" data-action="toggle-star">展开</button>
        </div>
        <div class="group-grid">
          ${stars.map(s => renderChip(s)).join("")}
        </div>
      </div>
    `;

    // 绑定分组切换
    this.selectorGrid.querySelectorAll(".group-toggle").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const action = e.currentTarget.dataset.action;
        const group = e.currentTarget.closest(".selector-group");
        
        if (action === "toggle-planet") {
          // 全选/取消全选行星
          const allSelected = planets.every(p => this.selected.has(p.key));
          if (allSelected) {
            planets.forEach(p => this.selected.delete(p.key));
          } else {
            planets.forEach(p => this.selected.add(p.key));
          }
          e.currentTarget.textContent = allSelected ? "全选" : "取消全选";
        } else if (action === "toggle-star") {
          // 展开/折叠恒星分组
          group.classList.toggle("collapsed");
          e.currentTarget.textContent = group.classList.contains("collapsed") ? "展开" : "折叠";
        }
        
        this.renderSelector();
        this.renderStage();
        this.render();
      });
    });

    this.selectorGrid.querySelectorAll(".selector-chip").forEach((button) => {
      button.addEventListener("click", (event) => {
        const { key } = event.currentTarget.dataset;
        if (event.metaKey || event.ctrlKey || event.shiftKey) {
          this.setFocus(key);
        } else {
          this.toggleSelect(key);
        }
      });
      button.addEventListener("dblclick", (event) => {
        const { key } = event.currentTarget.dataset;
        this.focusOnly(key);
      });
    });
  }

  renderStage() {
    const selectedStars = this.getSelectedStars();
    const width = window.innerWidth;
    let columns = 1;

    if (selectedStars.length === 1) {
      columns = 1;
    } else if (width >= 1180) {
      columns = Math.min(selectedStars.length, 6);
    } else if (width >= 820) {
      columns = Math.min(selectedStars.length, 3);
    } else {
      columns = Math.min(selectedStars.length, 2);
    }

    this.stageGrid.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;

    const currentKeys = new Set(selectedStars.map((item) => item.key));
    [...this.cards.keys()].forEach((key) => {
      if (!currentKeys.has(key)) {
        this.cards.delete(key);
      }
    });

    this.stageGrid.innerHTML = "";
    selectedStars.forEach((star) => {
      const mount = document.createElement("div");
      this.stageGrid.appendChild(mount);
      const card = new UniverseStageCard(mount, star, (key) => this.setFocus(key));
      this.cards.set(star.key, card);
    });
  }

  setFocus(key) {
    if (!this.selected.has(key)) this.selected.add(key);
    this.stopNarration();
    this.lastNarratedPhaseKey = null;
    this.focusKey = key;
    this.renderSelector();
    this.renderStage();
    this.render();
  }

  focusOnly(key) {
    this.selected = new Set([key]);
    this.stopNarration();
    this.lastNarratedPhaseKey = null;
    this.focusKey = key;
    this.renderSelector();
    this.renderStage();
    this.render();
  }

  toggleSelect(key) {
    if (this.selected.has(key)) {
      if (this.selected.size === 1) return;
      this.selected.delete(key);
    } else {
      this.selected.add(key);
    }
    this.stopNarration();
    this.lastNarratedPhaseKey = null;
    this.ensureFocusVisible();
    this.renderSelector();
    this.renderStage();
    this.render();
  }

  setPlaying(value) {
    this.playing = value;
    this.playBtn.textContent = value ? "⏸ 暂停" : "▶ 播放";
    if (!value) this.stopNarration();
    cancelAnimationFrame(this.rafId);
    if (value) this.rafId = requestAnimationFrame(() => this.tick());
  }

  tick() {
    if (!this.playing) return;
    this.progress = Math.min(MAX_PROGRESS, this.progress + this.speed * 1.2);
    this.progressBar.value = String(this.progress);
    this.render();
    if (this.progress >= MAX_PROGRESS) {
      this.setPlaying(false);
      return;
    }
    this.rafId = requestAnimationFrame(() => this.tick());
  }

  triggerFlash(type) {
    const now = Date.now();
    if (now - this.lastFxAt < 450) return;
    this.lastFxAt = now;
    this.globalFlash.style.opacity = type === "pisn" ? "1" : "0.75";
    setTimeout(() => {
      this.globalFlash.style.opacity = "0";
    }, type === "pisn" ? 220 : 140);
  }

  showEnding(star) {
    if (!star) return;
    this.endingTitle.textContent = star.endingTitle || "终章";
    this.endingDesc.textContent = star.endingDesc || star.summary || "";
    this.endingBadge.textContent = star.endingBadge || star.fate || "";
    this.endingBadge.style.color = star.fateColor || "#d6e6ff";
    this.endingNote.textContent = star.endingNote || "";
    this.endingOverlay.classList.add("visible");
  }

  hideEnding() {
    this.endingOverlay.classList.remove("visible");
  }

  updateAudioToggleUI() {
    if (!this.audioToggleBtn) return;
    if (!this.speechSupported) {
      this.audioToggleBtn.textContent = "🔇 语音不可用";
      this.audioToggleBtn.classList.add("disabled");
      this.audioToggleBtn.classList.remove("active", "muted");
      this.audioToggleBtn.disabled = true;
      return;
    }

    this.audioToggleBtn.disabled = false;
    this.audioToggleBtn.classList.remove("disabled");
    this.audioToggleBtn.classList.toggle("active", this.audioEnabled);
    this.audioToggleBtn.classList.toggle("muted", !this.audioEnabled);
    this.audioToggleBtn.textContent = this.audioEnabled ? "🔊 讲解开" : "🔈 讲解关";
  }

  stopNarration() {
    if (!this.speechSupported) return;
    window.speechSynthesis.cancel();
  }

  buildNarrationText(result) {
    const { phase, idx } = result;
    const title = phase.teach?.title || phase.name;
    const caption = phase.teach?.caption || phase.note || "";
    const firstSentence = caption
      .split(/[。！？!?]/)
      .map((item) => item.trim())
      .filter(Boolean)[0] || caption;
    return `第${idx + 1}阶段，${title}。${firstSentence}`;
  }

  speakNarration(text) {
    if (!this.speechSupported || !text) return;
    this.stopNarration();
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 1.02;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  maybeNarrateEarthPhase(result) {
    if (!result || !this.playing || !this.audioEnabled || !this.speechSupported) return;
    if (this.focusKey !== "earth" || result.star.key !== "earth") return;

    const phaseKey = result.phase?.key;
    if (!phaseKey) return;

    const narrationKey = `${result.star.key}:${phaseKey}`;
    if (this.lastNarratedPhaseKey === narrationKey) return;

    this.lastNarratedPhaseKey = narrationKey;
    this.speakNarration(this.buildNarrationText(result));
  }

  renderQuiz(star) {
    if (!star || !this.quizSection) return;
    const quizList = Array.isArray(star.quiz) ? star.quiz : [];
    if (!quizList.length) {
      this.quizSection.innerHTML = `<div class="quiz-empty">当前恒星暂无问答内容。</div>`;
      return;
    }

    this.quizSection.innerHTML = `
      <h3 class="quiz-title">🧩 趣味问答 · ${star.name}</h3>
      ${quizList.map((item, i) => `
        <div class="quiz-item" id="quiz-${i}">
          <div class="qi-q">${item.icon || "✨"} ${item.q || ""}</div>
          <button class="qi-btn" data-idx="${i}">揭晓答案</button>
          <div class="qi-a hidden">${item.a || ""}</div>
        </div>
      `).join("")}
    `;

    this.quizSection.querySelectorAll(".qi-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = document.getElementById(`quiz-${btn.dataset.idx}`);
        if (!item) return;
        const answer = item.querySelector(".qi-a");
        if (answer) answer.classList.remove("hidden");
        btn.style.display = "none";
      });
    });
  }

  updateFocusSummary(result) {
    const { star, phase, age, phaseClass } = result;
    const selectedCount = this.selected.size;
    this.stageTitle.textContent = selectedCount === 1
      ? `${star.name} · 单星聚焦模式（自动放大）`
      : `${selectedCount} 颗恒星 · 同屏比较模式（统一比例尺）`;
    this.selectionHint.textContent = selectedCount === 1
      ? "双击其他星卡可切换焦点；单击星卡可重新加入比较。"
      : `当前焦点：${star.name} · 已按质量从小到大排列，可直接拖动上方时间轴`;

    this.focusSummary.innerHTML = `
      <h3>${star.name}</h3>
      <p>${star.summary}</p>
      <div class="focus-meta">
        <span class="focus-pill">质量：${star.massLabel}</span>
        <span class="focus-pill">当前阶段：${phase.name}</span>
        <span class="focus-pill">年龄：${formatAge(age)}</span>
        <span class="focus-pill">阶段类型：${phaseClass}</span>
      </div>
      <p>${phase.note}</p>
    `;

    this.teachEmoji.textContent = phase.teach?.emoji || "🌌";
    this.teachTitle.textContent = phase.teach?.title || phase.name;
    this.teachCaption.textContent = phase.teach?.caption || phase.note;
  }

  bindEvents() {
    this.playBtn.addEventListener("click", () => this.setPlaying(!this.playing));
    this.resetBtn.addEventListener("click", () => {
      this.progress = 0;
      this.progressBar.value = "0";
      this.endingShown = false;
      this.hideEnding();
      this.lastNarratedPhaseKey = null;
      this.setPlaying(false);
      this.render();
    });
    this.speedSelect.addEventListener("change", (event) => {
      this.speed = Number(event.target.value);
    });
    this.progressBar.addEventListener("input", (event) => {
      this.progress = Number(event.target.value);
      this.lastNarratedPhaseKey = null;
      this.stopNarration();
      if (this.progress < MAX_PROGRESS) {
        this.endingShown = false;
        this.hideEnding();
      }
      this.render();
    });
    this.selectAllBtn.addEventListener("click", () => {
      // 全选行星（不包括恒星）
      this.selected = new Set(this.catalog.filter(item => item.category === "planet").map(item => item.key));
      this.stopNarration();
      this.lastNarratedPhaseKey = null;
      this.renderSelector();
      this.renderStage();
      this.render();
    });
    this.showFocusBtn.addEventListener("click", () => {
      this.focusOnly(this.focusKey);
    });

    if (this.audioToggleBtn) {
      this.audioToggleBtn.addEventListener("click", () => {
        if (!this.speechSupported) {
          this.updateAudioToggleUI();
          return;
        }
        this.audioEnabled = !this.audioEnabled;
        if (!this.audioEnabled) {
          this.stopNarration();
        } else {
          this.lastNarratedPhaseKey = null;
          this.render();
        }
        this.updateAudioToggleUI();
      });
    }

    if (this.quizToggleBtn) {
      this.quizToggleBtn.addEventListener("click", () => {
        this.quizOpen = !this.quizOpen;
        this.quizPanel.classList.toggle("hidden", !this.quizOpen);
        this.quizToggleBtn.classList.toggle("active", this.quizOpen);
        if (this.quizOpen) {
          const focusStar = this.getStar(this.focusKey);
          this.renderQuiz(focusStar);
        }
      });
    }

    if (this.endingClose) {
      this.endingClose.addEventListener("click", () => this.hideEnding());
    }

    window.addEventListener("resize", () => {
      this.renderStage();
      this.render();
    });

    setInterval(() => {
      const focusCard = this.cards.get(this.focusKey);
      const phase = focusCard?.star.phases[getPhaseIndex(focusCard.ranges, this.progress)];
      if (!phase) return;
      const phaseClass = classifyPhase(phase);
      if (["pisn", "supernova", "critical", "compact", "white-dwarf", "black-hole"].includes(phaseClass)) {
        this.render();
      }
    }, 80);
  }

  render() {
    this.ensureFocusVisible();
    this.progressText.textContent = `进度 ${Math.round((this.progress / MAX_PROGRESS) * 100)}%`;

    let focusResult = null;
    this.getSelectedStars().forEach((star) => {
      const card = this.cards.get(star.key);
      if (!card) return;
      const result = card.render(this.progress);
      card.setFocused(star.key === this.focusKey);
      if (star.key === this.focusKey) focusResult = result;
      if (result.phase.special === "pisn" || result.phase.special === "supernova") {
        this.triggerFlash(result.phase.special === "pisn" ? "pisn" : "sn");
      }
      if (result.phase.special === "blackhole") {
        this.triggerFlash("sn");
      }
    });

    if (focusResult) {
      this.updateFocusSummary(focusResult);
      this.maybeNarrateEarthPhase(focusResult);
      if (this.quizOpen) {
        this.renderQuiz(focusResult.star);
      }
    }

    if (!focusResult || focusResult.star.key !== "earth" || !this.playing) {
      this.stopNarration();
    }

    if (this.progress >= MAX_PROGRESS && !this.endingShown && focusResult) {
      this.endingShown = true;
      this.showEnding(focusResult.star);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.starUniverseApp = new StarUniverseApp();
});
