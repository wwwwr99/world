import { useState, useCallback } from 'react'
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

const BATCH_OPTIONS = [5, 10, 15, 20, 0] as const
const BATCH_LABELS: Record<number, string> = { 5: '5个', 10: '10个', 15: '15个', 20: '20个', 0: '全部' }

export default function Study() {
  const [allWordIds, setAllWordIds] = useState(() => shuffle(words.map((w) => w.id)))
  const [batchSize, setBatchSize] = useState<number>(10)
  const [round, setRound] = useState(0)

  const { queue, rate } = useSRS(allWordIds)

  const handleRoundDone = useCallback(() => {
    setAllWordIds(shuffle(words.map((w) => w.id)))
    setRound((r) => r + 1)
  }, [])

  const { speak } = useSpeech()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-6">
      {/* Batch size selector */}
      <div className="flex items-center gap-2 bg-white/60 backdrop-blur rounded-2xl p-1 shadow-sm">
        <span className="text-xs text-gray-400 pl-2 pr-1">每轮</span>
        {BATCH_OPTIONS.map((n) => (
          <button
            key={n}
            onClick={() => setBatchSize(n)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              batchSize === n
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
          >
            {BATCH_LABELS[n]}
          </button>
        ))}
      </div>

      <CardStack
        key={`${round}-${batchSize}`}
        words={words}
        queue={queue}
        batchSize={batchSize}
        onRoundDone={handleRoundDone}
        onRate={rate}
        onSpeak={speak}
      />
    </main>
  )
}
