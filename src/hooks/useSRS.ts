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
  const [srsData, setSRSData] = useState<Map<number, SRSCard>>(loadSRSData)

  const queue = useMemo(() => {
    const { due, newCards } = getDueWords(allWordIds, srsData)
    return [...due, ...shuffle(newCards)]
  }, [allWordIds, srsData])

  const rate = useCallback(
    (wordId: number, rating: 0 | 1 | 2 | 3) => {
      const updated = rateCard(wordId, rating, srsData)
      setSRSData(updated)
    },
    [srsData],
  )

  return { srsData, queue, rate }
}
