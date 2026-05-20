import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './Card'
import type { Word } from '../data/words'

interface CardStackProps {
  words: Word[]
  queue: number[]
  onRate: (wordId: number, rating: 0 | 1 | 2 | 3) => void
  onSpeak: (text: string) => void
}

export default function CardStack({ words, queue, onRate, onSpeak }: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const currentWordId = queue[currentIndex]
  const currentWord = words.find((w) => w.id === currentWordId) ?? null
  const isFinished = currentIndex >= queue.length
  const progress = queue.length > 0 ? ((currentIndex) / queue.length) * 100 : 0

  const advance = () => {
    setRevealed(false)
    setTimeout(() => setCurrentIndex((i) => i + 1), 50)
  }

  const handleRate = (rating: 0 | 1 | 2 | 3) => {
    if (!currentWord) return
    onRate(currentWord.id, rating)
    advance()
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isFinished) return
      if (e.key === ' ') {
        e.preventDefault()
        if (!revealed) {
          setRevealed(true)
          if (currentWord) onSpeak(currentWord.word)
        } else {
          if (currentWord) onSpeak(currentWord.word)
        }
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (!revealed) {
          setRevealed(true)
        } else {
          handleRate(2) // Good
        }
      }
      if (!revealed) return
      if (e.key === '1') handleRate(0)
      if (e.key === '2') handleRate(1)
      if (e.key === '3') handleRate(2)
      if (e.key === '4') handleRate(3)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentIndex, revealed, isFinished, currentWord])

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] gap-6">
        <div className="text-6xl">🎉</div>
        <h3 className="text-2xl font-semibold text-gray-800">本轮学习完成</h3>
        <p className="text-gray-500">
          复习了 {queue.length} 张卡片，继续保持！
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0)
            setRevealed(false)
          }}
          className="mt-4 px-8 py-3 bg-gray-900 text-white rounded-2xl font-medium
                     hover:bg-gray-800 transition-colors"
        >
          再来一轮
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gray-800 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p className="text-xs text-gray-400 -mt-4">
        {currentIndex + 1} / {queue.length}
      </p>

      {/* Card with animation */}
      <div className="w-full relative">
        <AnimatePresence mode="wait">
          {currentWord && (
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Card word={currentWord} revealed={revealed} onReveal={() => {
                setRevealed(true)
                onSpeak(currentWord.word)
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Speak button */}
      {currentWord && (
        <button
          onClick={() => onSpeak(currentWord.word)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="发音 (Space)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
          <span className="text-sm">发音</span>
        </button>
      )}

      {/* Rating buttons — show after reveal */}
      {revealed && currentWord && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex gap-3 w-full"
        >
          <button
            onClick={() => handleRate(0)}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-rose-50 text-rose-600
                       hover:bg-rose-100 active:scale-95 transition-all"
          >
            重来
          </button>
          <button
            onClick={() => handleRate(1)}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-orange-50 text-orange-600
                       hover:bg-orange-100 active:scale-95 transition-all"
          >
            困难
          </button>
          <button
            onClick={() => handleRate(2)}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-blue-50 text-blue-600
                       hover:bg-blue-100 active:scale-95 transition-all"
          >
            良好
          </button>
          <button
            onClick={() => handleRate(3)}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-emerald-50 text-emerald-600
                       hover:bg-emerald-100 active:scale-95 transition-all"
          >
            简单
          </button>
        </motion.div>
      )}

      {/* Keyboard hints */}
      {revealed && (
        <p className="text-xs text-gray-300">
          键盘: 1 重来 · 2 困难 · 3 良好 · 4 简单 · → 快速通过
        </p>
      )}
      {!revealed && (
        <p className="text-xs text-gray-300">
          键盘: Space 显示释义 · → 下一张
        </p>
      )}
    </div>
  )
}
