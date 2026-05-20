# VocabCard - 单词卡片记忆

基于间隔重复（SM-2）算法的英语单词记忆卡片应用。

## 功能

- 50 个 CET-6 核心词汇，带音标、词性、中文释义
- SM-2 间隔重复算法（Anki 同款），科学安排复习时间
- 点击卡片显示释义，键盘快捷键快速操作
- Web Speech API 真人发音
- 学习统计：连续打卡、掌握词数、待复习量
- PWA 支持，手机可安装

## 快速开始

```bash
npm install
npm run dev
```

## 快捷键

| 键 | 操作 |
|---|---|
| Space | 显示释义 / 发音 |
| 1 / 2 / 3 / 4 | 评分：重来 / 困难 / 良好 / 简单 |
| → | 快速通过（等同于"良好"） |

## 技术栈

React 19 · TypeScript · Tailwind CSS · Framer Motion · React Router · Vite
