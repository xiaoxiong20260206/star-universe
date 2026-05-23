// ============================================================
//  star-1000m-data.js
//  1000 M☉ 极端大质量恒星 + 4光年外行星演化数据
//  结局：不稳定对超新星（PISN）—— 完全湮灭
// ============================================================

const STAR_1000M = {
  key: "1000m",
  name: "千倍太阳质量恒星",
  emoji: "🔥",
  massLabel: "1000 M☉",
  massRatio: 1000,
  themeColor: "#ff2255",
  gradientFrom: "#ff6688",
  gradientTo:   "#2a0015",
  summary: "宇宙早期可能存在的极端巨星！质量是太阳1000倍，寿命仅约220万年，最终以不稳定对超新星（PISN）完全湮灭——不留黑洞，不留任何残骸。四光年外的行星将目睹这场宇宙级灾难，并幸存下来。",
  funFact: "如果这颗恒星在4光年外（比邻星距离）爆发PISN，地球上看到的亮度将比满月亮1000倍，持续数周！",
  fate: "💥 不稳定对超新星（完全湮灭）",
  fateColor: "#ffee88",

  phases: [
    {
      key: "cloud",
      name: "分子云极速坍缩",
      ageStartMyr: 0, ageEndMyr: 0.008,
      spanLabel: "0 ~ 8千年",
      state: "极端引力坍缩",
      lumLsun: 0.5, tempK: 8000, radiusRsun: 25,
      color: "#ff6688", halo: "rgba(255,80,120,0.55)",
      note: "1000倍太阳质量的引力如同宇宙级的锤子，仅8000年就完成坍缩——太阳花了50万年！",
      teach: {
        emoji: "🌌",
        title: "宇宙最早的怪物：8000年诞生",
        caption: "在宇宙诞生仅数亿年的时代，没有金属元素污染的纯净气体云，可以毫不费力地坍缩出这种1000倍太阳质量的巨星。引力极强，坍缩仅用8000年——这是太阳出生时间的1/60。这种第一代恒星（Population III）可能大量存在于早期宇宙中。"
      }
    },
    {
      key: "protostar",
      name: "极端原恒星",
      ageStartMyr: 0.008, ageEndMyr: 0.04,
      spanLabel: "8千 ~ 4万年",
      state: "暴力预主序",
      lumLsun: 80000, tempK: 20000, radiusRsun: 15,
      color: "#ff4477", halo: "rgba(255,50,100,0.6)",
      note: "还没正式点燃聚变，就已经比太阳亮8万倍！周围的原行星盘被辐射压猛烈吹散。",
      teach: {
        emoji: "⚡",
        title: "还没点火就已经是怪物",
        caption: "仅靠引力收缩释放的能量，它的亮度就达到8万个太阳！周围的气体物质被极端紫外线辐射猛烈蒸发。这种辐射反馈甚至可能阻止更大质量恒星的形成——1000 M☉ 可能就是恒星质量的上限之一。"
      }
    },
    {
      key: "zams",
      name: "零龄主序点火",
      ageStartMyr: 0.04, ageEndMyr: 0.15,
      spanLabel: "4万 ~ 15万年",
      state: "CNO极效聚变启动",
      lumLsun: 30000000, tempK: 62000, radiusRsun: 42,
      color: "#dd2244", halo: "rgba(220,40,80,0.65)",
      note: "核心点燃CNO循环，亮度飙升至3000万个太阳！表面温度62000K，辐射压几乎与引力抗衡。",
      teach: {
        emoji: "🔥",
        title: "3000万个太阳的光芒",
        caption: "点火即巅峰！亮度3000万L☉，表面温度62000K，远超任何已知恒星。它发出的辐射以X射线和极紫外线为主，照亮4光年内的整个空间。4光年外的那颗行星，此时接收到的光照比地球从太阳接收的还强——尽管它在250,000 AU之外！"
      }
    },
    {
      key: "hypergiant",
      name: "O型极超巨星",
      ageStartMyr: 0.15, ageEndMyr: 1.0,
      spanLabel: "15万 ~ 100万年",
      state: "极端主序·质量剧减",
      lumLsun: 25000000, tempK: 55000, radiusRsun: 48,
      color: "#cc1840", halo: "rgba(200,30,70,0.6)",
      note: "恒星风每年带走数个太阳质量的物质！在主序阶段就已经损失了上百个太阳质量。",
      teach: {
        emoji: "💙",
        title: "一边燃烧一边蒸发",
        caption: "这颗星的主序阶段不是安静的——它以每年1-3 M☉的速度把外层物质喷射到宇宙中！这意味着在100万年的主序期间，它可能已经损失了100-300 M☉。但它的核心依然足够巨大，终局仍将是PISN。4光年外的行星在这段时间沐浴在比自身恒星亮数千倍的光芒中。"
      }
    },
    {
      key: "lbv",
      name: "亮蓝变星（LBV）",
      ageStartMyr: 1.0, ageEndMyr: 1.6,
      spanLabel: "100万 ~ 160万年",
      state: "剧烈不稳定脉动",
      lumLsun: 35000000, tempK: 25000, radiusRsun: 250,
      color: "#bb2266", halo: "rgba(180,40,110,0.65)",
      note: "辐射压彻底超过引力约束！每隔数十年就爆发性抛出数十个太阳质量的气体壳层。",
      teach: {
        emoji: "🌪️",
        title: "无法控制自己：亮蓝变星",
        caption: "辐射压已经超过引力，恒星变成一个无法稳定的怪物。每隔几十年，它就剧烈喷发，一次抛出10-50个太阳质量的气体！每一次喷发在4光年外都能清晰观测到——像是一次次宇宙级的信号弹。这颗行星的大气层开始受到冲击波的影响。"
      }
    },
    {
      key: "wolf-rayet",
      name: "沃夫-拉叶星（WN/WC）",
      ageStartMyr: 1.6, ageEndMyr: 2.0,
      spanLabel: "160万 ~ 200万年",
      state: "外层剥离·裸核心",
      lumLsun: 20000000, tempK: 120000, radiusRsun: 12,
      color: "#aa2855", halo: "rgba(170,50,90,0.6)",
      note: "氢和氦外壳被完全吹走，暴露出炽热的碳氧核心。表面温度12万K，恒星风速度4000 km/s。",
      teach: {
        emoji: "☄️",
        title: "赤裸的核心：宇宙最热天体",
        caption: "所有外层都已消失，只剩炽热的核心裸露在宇宙中。表面温度12万K，是太阳表面的20倍！恒星风速度达到4000公里/秒——这些高速物质正在向4光年外的行星方向扩散。行星的大气层开始被这些高速粒子流剥蚀。"
      }
    },
    {
      key: "ppisn",
      name: "脉冲对不稳定（PPISN）",
      ageStartMyr: 2.0, ageEndMyr: 2.15,
      spanLabel: "200万 ~ 215万年",
      state: "核心脉冲·多次预爆",
      lumLsun: 50000000, tempK: 300000, radiusRsun: 8,
      color: "#ffcc22", halo: "rgba(255,200,80,0.75)",
      note: "核心温度超过10亿K！光子产生电子-正电子对，辐射压骤降，核心周期性坍缩-反弹——每一次脉冲都是一次小型超新星！",
      special: "pre-pisn",
      teach: {
        emoji: "⚠️",
        title: "物理崩溃：脉冲对不稳定",
        caption: "核心温度超过10亿K，γ光子直接变成电子-正电子对！辐射压力被「吃掉」了——引力反超。但不同于250 M☉的一步到位，1000 M☉的核心太大了，它不会一次性炸开，而是反复坍缩-反弹-坍缩-反弹，每次脉冲抛出数十个太阳质量。这叫「脉冲对不稳定超新星」（PPISN），每次脉冲都比普通超新星还猛烈！4光年外的行星每一次都受到冲击波冲击。"
      }
    },
    {
      key: "pisn",
      name: "不稳定对超新星 💥💥💥",
      ageStartMyr: 2.15, ageEndMyr: 2.15001,
      spanLabel: "几秒！宇宙最强爆炸",
      state: "PISN — 千倍太阳质量完全湮灭",
      lumLsun: 500000000000, tempK: 10000000000, radiusRsun: 200000000,
      color: "#ffffff", halo: "rgba(255,255,200,0.99)",
      note: "热核爆轰波从核心向外炸穿！1000 M☉的整颗恒星被完全摧毁！爆炸能量是250 M☉ PISN的数倍，亮度超过整个银河系100倍！4光年外的行星将看到比满月亮1000倍的光芒持续数周！",
      special: "pisn",
      teach: {
        emoji: "💥",
        title: "PISN：宇宙最强爆炸——4光年外都亮如千个满月",
        caption: "最后一次脉冲引爆了整颗恒星的核心！热核爆轰波从中心向外冲破一切束缚，1000 M☉全部化为元素碎片——没有黑洞，没有中子星，连一颗豌豆大的残骸都不留！爆炸能量是250 M☉ PISN的4倍，亮度超过整个银河系100倍！在4光年外的行星上，这颗超新星的亮度将达到满月的1000倍，持续数周。即使在地球上，如果距离相同，人类会看到白天有两个太阳！"
      }
    },
    {
      key: "pisn-nebula",
      name: "超新星遗迹星云",
      ageStartMyr: 2.15001, ageEndMyr: 50,
      spanLabel: "爆炸后数千万年扩散",
      state: "重元素播种宇宙",
      lumLsun: 50000, tempK: 15000, radiusRsun: 50000000,
      color: "#ff8844", halo: "rgba(255,140,60,0.35)",
      note: "爆炸抛射物以3万公里/秒的速度扩散，富含铁、镍、金、铂等重元素。4光年处的冲击波将在约4年后到达行星。",
      special: "pisn-nebula",
      teach: {
        emoji: "🌈",
        title: "星云扩散：重元素播种宇宙",
        caption: "爆炸物质以3万公里/秒的速度向外扩散，携带大量铁、镍、钴、金、铂等重元素。4光年外的冲击波将在约4年后抵达那颗行星——剥蚀大气层，但行星的岩石核心完好无损。此后，行星将永远失去它的恒星邻居，在一片扩散的元素云中孤独运行。这些重元素最终将融入新的分子云，孕育下一代恒星和行星——也许，数十亿年后，其中一颗行星上会诞生生命。"
      }
    }
  ],

  endingTitle: "终章：千倍太阳质量的不稳定对超新星",
  endingDesc: "宇宙中最壮烈的死亡！1000倍太阳质量的极端巨星以不稳定对超新星（PISN）完全湮灭，不留黑洞，不留任何残骸——化为一片重元素云，播撒到数十光年的宇宙空间。",
  endingBadge: "💥 PISN · 千倍湮灭",
  endingNote: "⚡ 1000 M☉ PISN vs 250 M☉ PISN：能量约为250 M☉的4倍，抛射物总量是250 M☉的4倍以上。扩散速度约3万公里/秒，4光年处的冲击波将在约4年后抵达行星。行星的大气层将遭受严重剥蚀，但岩石核心完好——它将继续在遗迹星云中孤独运行数十亿年。",

  quiz: [
    {
      q: "为什么1000 M☉恒星也能走PISN路线？",
      a: "虽然PISN的典型质量窗口是140-260 M☉，但1000 M☉恒星通过极端恒星风和PPISN脉冲抛射大量外层后，核心质量可以降到对不稳定区间。最终的PISN爆炸能量远超250 M☉级别。",
      ok: true, icon: "💥"
    },
    {
      q: "PPISN和PISN有什么区别？",
      a: "PPISN是「脉冲对不稳定」——核心多次坍缩-反弹，每次抛出数十M☉；PISN是最终的完全湮灭。250 M☉可能一次就爆，而1000 M☉需要多次PPISN脉冲后才会最终PISN。",
      ok: true, icon: "⚠️"
    },
    {
      q: "4光年外的行星会受到什么影响？",
      a: "PISN爆炸时行星看到比满月亮1000倍的光芒；4年后冲击波抵达，剥蚀大部分大气层；但行星岩石核心完好，引力束缚仍然存在。此后行星将在遗迹星云中孤独运行。",
      ok: true, icon: "🪐"
    },
    {
      q: "1000 M☉恒星在宇宙中真的存在吗？",
      a: "目前观测到的最大恒星约250-300 M☉（R136a1）。但宇宙早期（Population III）可能存在500-1000 M☉的巨星——它们全部在数百万年内以PISN方式结束，为宇宙播下第一批重元素种子。",
      ok: true, icon: "🌟"
    }
  ]
};

// ============================================================
//  4光年外的行星数据
// ============================================================
const PLANET_4LY = {
  key: "planet-4ly",
  name: "四光年外行星",
  emoji: "🪐",
  massLabel: "2 M⊕",
  massRatio: 2,
  distanceAU: 252000,  // 4光年 ≈ 252,000 AU
  distanceLy: 4,
  category: "planet",
  themeColor: "#44aaff",
  summary: "一颗位于4光年（252,000 AU）外的岩石行星，拥有稀薄大气层。在1000 M☉恒星PISN爆炸中幸存，但大气层被冲击波严重剥蚀。此后将孤独运行数十亿年。",
  fate: "✅ 幸存（大气剥蚀）",
  fateColor: "#88ccff",

  // 行星的演化状态（根据恒星阶段变化）
  planetStates: [
    {
      starPhase: "cloud",
      state: "原行星盘中的尘埃",
      description: "行星尚未形成，只是4光年外分子云中的尘埃颗粒。",
      atmosphere: "无",
      surface: "尘埃颗粒",
      color: "#887766",
      icon: "🌫️"
    },
    {
      starPhase: "protostar",
      state: "原行星形成中",
      description: "恒星极端辐射开始照亮4光年外的空间，行星在原行星盘中缓慢凝聚。",
      atmosphere: "极稀薄",
      surface: "熔融岩石",
      color: "#aa6644",
      icon: "🪐"
    },
    {
      starPhase: "zams",
      state: "行星受强辐射照耀",
      description: "恒星亮度3000万L☉，行星接收的光照比地球从太阳接收的更强——尽管在252,000 AU之外！",
      atmosphere: "稀薄大气",
      surface: "炽热岩石",
      color: "#cc8844",
      icon: "☀️"
    },
    {
      starPhase: "hypergiant",
      state: "行星沐浴在超强辐射中",
      description: "恒星持续高亮度照射，行星表面温度升高，但252,000 AU的距离提供了足够的保护。",
      atmosphere: "中等大气层",
      surface: "温暖岩石",
      color: "#88aacc",
      icon: "🌟"
    },
    {
      starPhase: "lbv",
      state: "受LBV喷发冲击波影响",
      description: "恒星每次LBV喷发产生的冲击波抵达行星需要约4年，剥蚀少量大气。",
      atmosphere: "大气层开始变薄",
      surface: "温暖岩石",
      color: "#7799bb",
      icon: "🌊"
    },
    {
      starPhase: "wolf-rayet",
      state: "受高速恒星风侵蚀",
      description: "4000 km/s的恒星风粒子持续抵达行星，大气层被缓慢剥蚀。",
      atmosphere: "大气层变薄",
      surface: "岩石表面",
      color: "#6688aa",
      icon: "💨"
    },
    {
      starPhase: "ppisn",
      state: "PPISN脉冲冲击波抵达",
      description: "每次PPISN脉冲的冲击波4年后抵达行星，严重剥蚀大气层。行星经历多次冲击波冲击。",
      atmosphere: "大气层严重受损",
      surface: "裸露岩石",
      color: "#ff8844",
      icon: "⚠️"
    },
    {
      starPhase: "pisn",
      state: "PISN光芒照亮整颗行星",
      description: "比满月亮1000倍的光芒照射行星数周！行星表面被照亮如白昼，大气层遭受终极冲击波。",
      atmosphere: "大气层几乎被剥光",
      surface: "炽热岩石表面",
      color: "#ffff88",
      icon: "💥"
    },
    {
      starPhase: "pisn-nebula",
      state: "冲击波过后·孤独运行",
      description: "4年后PISN冲击波抵达，剥蚀了大部分大气。此后行星失去恒星邻居，在遗迹星云中孤独运行数十亿年。",
      atmosphere: "极稀薄残余",
      surface: "冷却岩石",
      color: "#556688",
      icon: "🌑"
    }
  ]
};