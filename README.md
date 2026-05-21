# VocabCard — 英语单词卡片记忆

基于 SM-2 间隔重复算法的词汇记忆工具。150 个 CET-6 核心词汇，渐变质感卡片，楷体中文释义 clip-path reveal 动画，键盘驱动的分组学习体验。

## 界面

白色卡片悬浮于微渐变背景之上，多层阴影营造纸张悬浮感。词性标签 → 单词（Georgia 衬线体）→ IPA 音标（等宽字体）→ 点击后中文释义以 clip-path 动画从左侧逐笔画方向展开，楷体渲染带 text-shadow 深度感。底部四色评级按钮对应 SM-2 算法。卡片切换采用 120ms 纯淡入淡出，消除 GPU filter 开销。

## 功能

- **SM-2 间隔重复** — Anki 同款算法，记录 `lastRating`，困难/重来词在后续队列中优先排列
- **分组学习** — 每轮可选 5/10/15/20 或全部词，学完一组可选择"重学本组"、"下一组"或"全新一轮"
- **键盘优先** — Space 显义/发音，1-4 评分，← 回退上一张，→ 快速通过
- **中文 reveal 动画** — CSS `clip-path: inset` + `text-shadow`，文字从左向右展开，模拟笔画书写方向
- **楷体翻译** — 系统原生楷体（KaiTi / STKaiti），无需加载 Web Font
- **发音** — Web Speech API，首次点击卡片自动朗读，后续喇叭按钮手动触发，RAF 延迟消除覆盖冲突
- **学习统计** — 连续打卡天数、已掌握词数（interval ≥ 21）、待复习量
- **随机打乱** — Fisher-Yates 洗牌，每轮不同顺序，new cards 随机排列避免首字母记忆

## 快速开始

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # → dist/
```

## 快捷键

| 键 | 操作 |
|---|---|
| Space | 显示释义 / 发音 |
| 1 / 2 / 3 / 4 | 评分：重来 / 困难 / 良好 / 简单 |
| ← | 返回上一张 |
| → | 显示释义 或 快速通过（等同"良好"） |

## 技术栈

React 19 · TypeScript · Tailwind CSS 3 · Framer Motion · React Router 7 · Vite 8

## 设计取舍与优缺点

**优点**
- 零外部 API 依赖，离线可用，无后端
- 卡片视觉聚焦，符合间隔重复"最小信息原则"
- 键盘驱动，熟练后每秒 3-5 张卡片
- SM-2 核心逻辑不到 70 行
- 系统楷体 + CSS clip-path reveal，无需加载字体文件或 JS 逐字动画库

**不足**
- 词库仅 50 词，暂不支持自定义导入
- Web Speech API 浏览器语音质量不一致（Chrome 最优），首次调用有 ~200-500ms 冷启动延迟
- 无图片辅助记忆，纯文字卡片对抽象词汇联想有限
- localStorage 无法跨设备同步
- 无深色模式

## 开发中遇到的问题与解决

### 1. 卡片切换卡顿（两轮优化）
**现象** — 初版使用 `blur` filter + scale + translateX 三组动画叠加，Chrome Performance 面板显示帧时间 60-80ms。

**第一轮** — 去掉 `blur` filter（GPU 逐像素高斯模糊），duration 500→300ms，移除 scale 变换。改善明显但仍偶有掉帧。

**第二轮** — 进一步移除 translateX 位移，简化为纯 `opacity` 淡入淡出 120ms。AnimatePresence 保留 `mode="wait"` 但每帧只需处理单层透明度变化。最终稳定 60fps，包括低端设备。

### 2. 发音与卡片点击时序冲突
**现象** — 快速点击卡片再点喇叭，浏览器语音队列出现竞争，延迟或无声音。

**根因** — Chrome 的 `SpeechSynthesis.cancel()` 不会同步清空内部队列，后续 `speak()` 与残留 utterance 产生竞态。

**解决** — 在 `cancel()` 与 `speak()` 之间插入 `requestAnimationFrame`，确保浏览器在下一帧前完成队列清理。语速从 0.85 调至 0.95。`volume: 1` 显式设置避免默认值抖动。

### 3. SM-2 queue 与 rating 的解耦
**现象** — 评级操作更新 `srsData` state → queue 依赖此 state 重新计算 → 进度条索引错位。

**解决** — queue 在组件挂载时根据 due/new 一次性计算，`rate` 更新 srsData 但不触发 queue 重算。"全新一轮"时通过 `key` 变更强制重新挂载，触发全新 queue 计算。

### 4. 上一张功能的状态回溯
**现象** — `currentIndex - 1` 可以回退，但同卡片多次评分时旧记录需被新记录覆盖。

**解决** — `history` 栈追踪浏览路径（存绝对索引）。`goBack()` 弹栈并恢复位置，必要时自动回退到上一组（`batchStart` 重新计算）。SM-2 的 `rateCard` 用 `Map.set` 覆盖旧记录，天然支持同词多次评分。

### 5. clip-path reveal 动画的跨卡片复用
**现象** — CSS `@keyframes` 动画只在元素首次挂载时播放，AnimatePresence 的组件缓存可能导致动画不触发。

**解决** — 使用 React 的 `key={word.id}` 确保每张卡片是独立 DOM 实例。翻译文字条件渲染（`{revealed ? <p className="reveal-text">... : null}`），每次 revealed 切换时元素销毁重建，动画自动重播。与 AnimatePresence 的卸载/挂载周期天然配合。
