import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './Card'
import type { Word } from '../data/words'

interface CardStackProps {
  words: Word[]
  queue: number[]
  batchSize: number
  onRoundDone: () => void
  onRate: (wordId: number, rating: 0 | 1 | 2 | 3) => void
  onSpeak: (text: string) => void
}

export default function CardStack({
  words,
  queue,
  batchSize,
  onRoundDone,
  onRate,
  onSpeak,
}: CardStackProps) {
  const effectiveSize = batchSize === 0 ? queue.length : Math.min(batchSize, queue.length)

  const [batchStart, setBatchStart] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [history, setHistory] = useState<number[]>([])

  const batchQueue = useMemo(
    () => queue.slice(batchStart, batchStart + effectiveSize),
    [queue, batchStart, effectiveSize],
  )

  const absoluteIndex = batchStart + currentIndex
  const currentWordId = batchQueue[currentIndex]
  const currentWord = words.find((w) => w.id === currentWordId) ?? null
  const isBatchFinished = currentIndex >= batchQueue.length
  const hasMoreBatches = batchStart + effectiveSize < queue.length
  const progress = batchQueue.length > 0 ? (currentIndex / batchQueue.length) * 100 : 0

  const advance = useCallback(() => {
    setHistory((h) => [...h, absoluteIndex])
    setRevealed(false)
    if (currentIndex + 1 >= batchQueue.length) {
      setCurrentIndex(batchQueue.length) // triggers finished state
    } else {
      requestAnimationFrame(() => setCurrentIndex((i) => i + 1))
    }
  }, [currentIndex, batchQueue.length, absoluteIndex])

  const goBack = useCallback(() => {
    if (history.length === 0) return
    const prevAbsoluteIdx = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setRevealed(true)

    if (prevAbsoluteIdx < batchStart || prevAbsoluteIdx >= batchStart + effectiveSize) {
      setBatchStart(Math.floor(prevAbsoluteIdx / effectiveSize) * effectiveSize)
      setCurrentIndex(prevAbsoluteIdx % effectiveSize)
    } else {
      setCurrentIndex(prevAbsoluteIdx - batchStart)
    }
  }, [history, batchStart, effectiveSize])

  const handleRate = (rating: 0 | 1 | 2 | 3) => {
    if (!currentWord) return
    onRate(currentWord.id, rating)
    advance()
  }

  const handleNextBatch = () => {
    setBatchStart((b) => b + effectiveSize)
    setCurrentIndex(0)
    setHistory([])
    setRevealed(false)
  }

  const handleRestartBatch = () => {
    setCurrentIndex(0)
    setHistory([])
    setRevealed(false)
  }

  const handleNewRound = () => {
    setBatchStart(0)
    setCurrentIndex(0)
    setHistory([])
    setRevealed(false)
    onRoundDone()
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isBatchFinished) return
      if (e.key === ' ') {
        e.preventDefault()
        if (!revealed && currentWord) {
          setRevealed(true)
          onSpeak(currentWord.word)
        } else if (currentWord) {
          onSpeak(currentWord.word)
        }
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goBack()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (!revealed && currentWord) {
          setRevealed(true)
          onSpeak(currentWord.word)
        } else {
          handleRate(2)
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
  }, [currentIndex, revealed, isBatchFinished, currentWord, goBack])

  if (isBatchFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] gap-6">
        <div className="text-5xl">&#x2728;</div>
        <h3 className="text-2xl font-semibold text-gray-800">本组完成</h3>
        <p className="text-gray-500 text-sm">
          {batchQueue.length} 张卡片已过完
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={handleRestartBatch}
            className="px-5 py-2.5 bg-white card-premium rounded-2xl text-sm font-medium
                       text-gray-600 hover:text-gray-800 transition-colors"
          >
            重学本组
          </button>
          {hasMoreBatches ? (
            <button
              onClick={handleNextBatch}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-2xl text-sm font-medium
                         hover:bg-gray-800 transition-colors"
            >
              下一组
            </button>
          ) : (
            <button
              onClick={handleNewRound}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-2xl text-sm font-medium
                         hover:bg-gray-800 transition-colors"
            >
              全新一轮
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200/60 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gray-700 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs text-gray-400 -mt-3">
        {currentIndex + 1} / {batchQueue.length}
        {batchSize > 0 && queue.length > batchSize && (
          <span className="text-gray-300"> &middot; 第 {Math.floor(batchStart / effectiveSize) + 1} 组</span>
        )}
      </p>

      {/* Card */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {currentWord && (
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
            >
              <Card
                word={currentWord}
                revealed={revealed}
                onReveal={() => {
                  setRevealed(true)
                  onSpeak(currentWord.word)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-6 w-full">
        <button
          onClick={goBack}
          disabled={history.length === 0}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            history.length === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-400 hover:text-gray-600'
          }`}
          title="上一张 (←)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          上一张
        </button>

        {currentWord && (
          <button
            onClick={() => onSpeak(currentWord.word)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="发音 (Space)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <span className="text-sm">发音</span>
          </button>
        )}
      </div>

      {/* Rating buttons */}
      {revealed && currentWord && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12 }}
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

      {/* Hints */}
      {revealed ? (
        <p className="text-xs text-gray-300">
          1 重来 &middot; 2 困难 &middot; 3 良好 &middot; 4 简单 &middot; &larr; 上一张 &middot; &rarr; 下一张
        </p>
      ) : (
        <p className="text-xs text-gray-300">
          Space 显示释义 &middot; &larr; 上一张 &middot; &rarr; 下一张
        </p>
      )}
    </div>
  )
}
