import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import words from '../data/words'
import { useSRS } from '../hooks/useSRS'
import { useSpeech } from '../hooks/useSpeech'
import CardStack from '../components/CardStack'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const SIZE_OPTIONS = [5, 10, 15, 20, 0] as const
const SIZE_LABELS: Record<number, string> = { 5: '5 个', 10: '10 个', 15: '15 个', 20: '20 个', 0: '全部' }

export default function Study() {
  const [phase, setPhase] = useState<'onboarding' | 'studying' | 'complete'>('onboarding')
  const [allWordIds, setAllWordIds] = useState<number[]>([])
  const [batchSize, setBatchSize] = useState(10)
  const [round, setRound] = useState(0)

  const { fullQueue, rate } = useSRS(allWordIds)
  const queue = useMemo(
    () => (batchSize === 0 ? fullQueue : fullQueue.slice(0, batchSize)),
    [fullQueue, batchSize],
  )
  const { speak } = useSpeech()

  const handleStart = (size: number) => {
    setBatchSize(size)
    setAllWordIds(shuffle(words.map((w) => w.id)))
    setPhase('studying')
  }

  const handleRoundDone = useCallback(() => {
    setPhase('complete')
  }, [])

  const handleNextRound = (size: number) => {
    setBatchSize(size)
    setAllWordIds(shuffle(words.map((w) => w.id)))
    setRound((r) => r + 1)
    setPhase('studying')
  }

  const handleQuit = () => {
    setAllWordIds([])
    setPhase('onboarding')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <AnimatePresence mode="wait">
        {phase === 'onboarding' && (
          <Onboarding key="onboarding" onStart={handleStart} />
        )}
        {phase === 'studying' && (
          <motion.div
            key={`study-${round}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <CardStack
              words={words}
              queue={queue}
              onRate={rate}
              onSpeak={speak}
              onRoundDone={handleRoundDone}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete Modal */}
      {phase === 'complete' && (
        <CompleteModal
          completedCount={queue.length}
          currentSize={batchSize}
          onSelect={handleNextRound}
          onQuit={handleQuit}
        />
      )}
    </main>
  )
}

function Onboarding({ onStart }: { onStart: (size: number) => void }) {
  const [selected, setSelected] = useState(10)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="card-premium rounded-3xl px-10 py-12 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
          <span className="text-white font-word text-2xl">V</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">VocabCard</h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          50 个 CET-6 核心词汇
          <br />
          科学间隔重复 &middot; 键盘高效记忆
        </p>

        <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
          选择本轮单词数
        </p>

        <div className="grid grid-cols-5 gap-2 w-full mb-8">
          {SIZE_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setSelected(n)}
              className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                selected === n
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/15'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {SIZE_LABELS[n]}
            </button>
          ))}
        </div>

        <button
          onClick={() => onStart(selected)}
          className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-semibold text-sm
                     hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg shadow-gray-900/10"
        >
          开始学习
        </button>
      </div>
    </motion.div>
  )
}

function CompleteModal({
  completedCount,
  currentSize,
  onSelect,
  onQuit,
}: {
  completedCount: number
  currentSize: number
  onSelect: (size: number) => void
  onQuit: () => void
}) {
  const [selected, setSelected] = useState(currentSize)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-sm card-premium rounded-3xl px-8 py-10 flex flex-col items-center text-center"
      >
        <div className="text-4xl mb-4">&#x2728;</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">本组完成</h3>
        <p className="text-sm text-gray-500 mb-8">
          {completedCount} 张卡片已过完，继续保持！
        </p>

        <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
          继续下一组
        </p>

        <div className="grid grid-cols-5 gap-2 w-full mb-6">
          {SIZE_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setSelected(n)}
              className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                selected === n
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/15'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {SIZE_LABELS[n]}
            </button>
          ))}
        </div>

        <button
          onClick={() => onSelect(selected)}
          className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-semibold text-sm
                     hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg shadow-gray-900/10 mb-3"
        >
          开始下一组
        </button>

        <button
          onClick={onQuit}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          返回首页
        </button>
      </motion.div>
    </motion.div>
  )
}
