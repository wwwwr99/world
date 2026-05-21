# VocabCard — 英语单词卡片记忆

基于 SM-2 间隔重复算法的词汇记忆工具，50 个 CET-6 核心词汇，白色极简卡片设计，键盘驱动的高效学习体验。

## 界面预览

纯白卡片居中展示，词性标签 → 单词（Georgia 衬线体）→ IPA 音标 → 点击后释义平滑浮现。底部四色评级按钮对应 Anki 同款 SM-2 算法。Framer Motion 驱动卡片切换动画，毛玻璃底栏导航，整体保持克制的高级感。

## 功能

- **SM-2 间隔重复** — Anki 同款算法，根据评分自动计算下次复习时间，数据持久化在 localStorage
- **键盘优先** — Space 显义/发音，1-4 评分，← 回退上一张，→ 快速通过，全程无需鼠标
- **Web Speech API 发音** — 浏览器原生 TTS，第一次点击卡片自动朗读，后续通过喇叭按钮手动触发
- **学习统计** — 连续打卡天数、已掌握词数、待复习量、总进度条
- **词库随机打乱** — Fisher-Yates 洗牌，每轮学习顺序不同，避免首字母顺序记忆
- **PWA 就绪** — meta 标签和 manifest 已配置，手机浏览器可添加到桌面

## 快速开始

```bash
npm install
npm run dev      # 开发 → http://localhost:5173
npm run build    # 生产构建 → dist/
```

## 快捷键

| 键 | 操作 |
|---|---|
| Space | 显示释义 / 发音 |
| 1 / 2 / 3 / 4 | 评分：重来 / 困难 / 良好 / 简单 |
| ← | 返回上一张 |
| → | 显示释义 或 快速通过（等同于"良好"） |

## 技术栈

React 19 · TypeScript · Tailwind CSS 3 · Framer Motion · React Router 7 · Vite 8

## 设计取舍与优缺点

**优点**
- 零外部 API 依赖 — 词库静态内置，发音用浏览器原生能力，离线可用，没有后端维护成本
- 卡片视觉聚焦 — 一张卡片只展示一个单词，无干扰元素，符合间隔重复的"最小信息原则"
- 键盘驱动 — 熟练后每秒可过 3-5 张卡片，效率远高于触屏点按
- SM-2 实现精简 — 核心逻辑不到 60 行，不依赖第三方算法库

**不足**
- 词库仅 50 词，尚未支持自定义导入 CSV/JSON 词表
- Web Speech API 在不同浏览器上语音质量不一致（Chrome 最优，Firefox 较差），且首次调用有约 200-500ms 冷启动延迟
- 缺乏图片辅助记忆（百词斩的核心差异化能力），纯文字卡片对抽象词汇的联想效果有限
- localStorage 存储方案无法跨设备同步，换手机数据丢失
- 未实现深色模式

## 开发中遇到的问题与解决

### 1. 卡片切换卡顿
**现象** — Framer Motion AnimatePresence 在两张卡片过渡时出现明显掉帧，尤其在低端设备上。

**排查过程** — 用 Chrome DevTools Performance 面板录制，发现帧时间高达 60-80ms（目标 16.7ms）。逐帧分析发现瓶颈在 CSS `blur()` filter 动画 — 浏览器需要对卡片内容逐像素做高斯模糊再反向还原，触发大量 GPU 合成层重绘。

**解决** — 用 `opacity` + `translateY` 替代 `blur` + `translateY`。动画时长从 500ms 压到 300ms（翻译浮现）和 200ms（卡片切换）。去掉 scale 变换，减少 GPU 合成层的尺寸变化。最终在普通设备上稳定 60fps。

### 2. 发音与卡片点击的时序冲突
**现象** — 快速点击卡片后立刻点喇叭按钮，两个 `speak()` 调用互相干扰，浏览器语音队列出现竞争，表现为延迟或无声音。

**根因** — `SpeechSynthesis.cancel()` 是异步操作，但 Chrome 的实现中 cancel 不会立即清空队列，后续 `speak()` 可能与残留的 utterance 产生冲突。

**解决** — 将 `speak()` 中的 `cancel()` 与 `speak()` 之间插入 `requestAnimationFrame` 延迟，确保 cancel 在当前帧完成后再创建新的 utterance。同时将语速从 0.85 调至 0.95，降低感知延迟。

### 3. SM-2 数据一致性与 React 状态管理
**现象** — 评级操作 → 写入 localStorage → 重新计算 due queue，但 `useSRS` hook 中的 queue 依赖 `srsData` state，每次 rating 后 queue 立即变化，导致当前进度条索引与 queue 错位。

**解决** — 将 queue（卡片顺序）与 srsData（评分记录）解耦。queue 只在组件挂载时根据 due/new 计算一次，rating 操作更新 srsData 但不触发 queue 重新计算。下次打开应用时新的 srsData 才会影响 queue 顺序。

### 4. "上一张"功能的状态回溯
**现象** — 简单的 `currentIndex - 1` 在同一次会话中可以回退，但无法正确处理"回退后重新评分"的场景 — 需要上一次的评分记录被新的覆盖。

**解决** — 引入 `history` 栈追踪浏览路径。`goBack()` 从栈中弹出上一张的索引并恢复。重新评分时 SM-2 的 `rateCard` 方法用 `Map.set` 覆盖旧记录，天然支持同一单词在本次会话中多次评分，无需额外去重逻辑。
