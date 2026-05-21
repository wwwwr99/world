import { useState, useCallback, useMemo } from 'react'
import { loadSRSData, rateCard, getDueWords } from '../utils/sm2'
import type { SRSCard } from '../utils/sm2'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function useSRS(allWordIds: number[]) {
  const [, setSRSData] = useState<Map<number, SRSCard>>(() => loadSRSData())

  const fullQueue = useMemo(() => {
    const data = loadSRSData()
    const { due, newCards } = getDueWords(allWordIds, data)
    return [...due, ...shuffle(newCards)]
  }, [allWordIds])

  const rate = useCallback(
    (wordId: number, rating: 0 | 1 | 2 | 3) => {
      setSRSData((prev) => rateCard(wordId, rating, prev))
    },
    [],
  )

  return { fullQueue, rate }
}
