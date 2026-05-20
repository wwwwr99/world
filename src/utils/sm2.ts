export interface SRSCard {
  wordId: number
  ease: number
  interval: number
  repetitions: number
  nextReview: number // timestamp
}

const STORAGE_KEY = 'vocabcard_srs'

export function loadSRSData(): Map<number, SRSCard> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Map()
    const arr: SRSCard[] = JSON.parse(raw)
    return new Map(arr.map((c) => [c.wordId, c]))
  } catch {
    return new Map()
  }
}

function saveSRSData(data: Map<number, SRSCard>): void {
  const arr = Array.from(data.values())
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
}

export function rateCard(
  wordId: number,
  rating: 0 | 1 | 2 | 3,
  data: Map<number, SRSCard>,
): Map<number, SRSCard> {
  const now = Date.now()
  const card = data.get(wordId) ?? {
    wordId,
    ease: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: now,
  }

  let { ease, interval, repetitions } = card

  if (rating === 0) {
    repetitions = 0
    interval = 1
  } else if (rating === 1) {
    ease = Math.max(1.3, ease - 0.15)
    interval = Math.max(1, Math.round(interval * 1.2))
    repetitions += 1
  } else if (rating === 2) {
    interval = Math.round((interval || 1) * ease)
    repetitions += 1
  } else {
    ease += 0.15
    interval = Math.round((interval || 1) * ease * 1.3)
    repetitions += 1
  }

  const nextReview = now + interval * 24 * 60 * 60 * 1000

  const updated: SRSCard = { wordId, ease, interval, repetitions, nextReview }
  const newData = new Map(data)
  newData.set(wordId, updated)
  saveSRSData(newData)
  return newData
}

export function getDueWords(
  allWordIds: number[],
  data: Map<number, SRSCard>,
): { due: number[]; newCards: number[] } {
  const now = Date.now()
  const due: number[] = []
  const newCards: number[] = []

  for (const id of allWordIds) {
    const card = data.get(id)
    if (!card) {
      newCards.push(id)
    } else if (card.nextReview <= now) {
      due.push(id)
    }
  }

  return { due, newCards }
}

export function computeStats(data: Map<number, SRSCard>): {
  totalLearned: number
  matureCount: number
} {
  const cards = Array.from(data.values())
  const totalLearned = cards.filter((c) => c.repetitions > 0).length
  const matureCount = cards.filter((c) => c.interval >= 21).length
  return { totalLearned, matureCount }
}

export function updateStreak(): number {
  const streakRaw = localStorage.getItem('vocabcard_streak')
  const streakData = streakRaw ? JSON.parse(streakRaw) : { count: 0, lastDate: '' }
  const today = new Date().toISOString().slice(0, 10)

  if (streakData.lastDate === today) {
    // already recorded today
  } else {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    if (streakData.lastDate === yesterday) {
      streakData.count += 1
    } else {
      streakData.count = 1
    }
    streakData.lastDate = today
    localStorage.setItem('vocabcard_streak', JSON.stringify(streakData))
  }

  return streakData.count
}
