import { useState, useMemo, useEffect } from 'react'
import words from '../data/words'
import { loadSRSData, computeStats, updateStreak } from '../utils/sm2'

export default function StatsPage() {
  const allWordIds = useMemo(() => words.map((w) => w.id), [])
  const [srsData] = useState(() => loadSRSData())
  const stats = useMemo(() => computeStats(srsData), [srsData])
  const [streak, setStreak] = useState(() => updateStreak())

  useEffect(() => {
    setStreak(updateStreak())
  }, [])

  const dueData = useMemo(() => {
    const now = Date.now()
    const cards = Array.from(srsData.values())
    return {
      due: cards.filter((c) => c.nextReview <= now).length,
      total: allWordIds.length,
      learned: cards.filter((c) => c.repetitions > 0).length,
    }
  }, [srsData, allWordIds])

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          学习统计
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard label="连续打卡" value={`${streak} 天`} color="blue" />
          <StatCard label="已学习" value={`${stats.totalLearned} 词`} color="emerald" />
          <StatCard label="已掌握" value={`${stats.matureCount} 词`} color="violet" />
          <StatCard label="待复习" value={`${dueData.due} 词`} color="amber" />
        </div>

        {/* Overall progress */}
        <div className="bg-white rounded-2xl card-shadow p-6">
          <p className="text-sm text-gray-500 mb-2">总进度</p>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gray-800 rounded-full transition-all"
              style={{ width: `${(stats.totalLearned / allWordIds.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 text-right">
            {stats.totalLearned} / {allWordIds.length}
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex px-6 py-3 bg-gray-900 text-white rounded-2xl font-medium
                       hover:bg-gray-800 transition-colors"
          >
            返回学习
          </a>
        </div>
      </div>
    </main>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  const bgMap: Record<string, string> = {
    blue: 'bg-blue-50',
    emerald: 'bg-emerald-50',
    violet: 'bg-violet-50',
    amber: 'bg-amber-50',
  }
  const textMap: Record<string, string> = {
    blue: 'text-blue-700',
    emerald: 'text-emerald-700',
    violet: 'text-violet-700',
    amber: 'text-amber-700',
  }

  return (
    <div className={`rounded-2xl p-5 ${bgMap[color] ?? 'bg-gray-50'}`}>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className={`text-sm font-medium ${textMap[color] ?? 'text-gray-600'}`}>
        {label}
      </p>
    </div>
  )
}
