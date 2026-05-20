import { useMemo } from 'react'
import words from '../data/words'
import { useSRS } from '../hooks/useSRS'
import { useSpeech } from '../hooks/useSpeech'
import CardStack from '../components/CardStack'

export default function Study() {
  const allWordIds = useMemo(() => words.map((w) => w.id), [])
  const { queue, rate } = useSRS(allWordIds)
  const { speak } = useSpeech()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <CardStack words={words} queue={queue} onRate={rate} onSpeak={speak} />
    </main>
  )
}
