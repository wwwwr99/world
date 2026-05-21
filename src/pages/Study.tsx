import { useMemo } from 'react'
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

export default function Study() {
  const allWordIds = useMemo(() => {
    const ids = words.map((w) => w.id)
    return shuffle(ids)
  }, [])
  const { queue, rate } = useSRS(allWordIds)
  const { speak } = useSpeech()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <CardStack words={words} queue={queue} onRate={rate} onSpeak={speak} />
    </main>
  )
}
