import type { Word } from '../data/words'

interface CardProps {
  word: Word
  revealed: boolean
  onReveal: () => void
}

const posColors: Record<string, string> = {
  'n.': 'bg-blue-50/80 text-blue-600',
  'v.': 'bg-amber-50/80 text-amber-600',
  'adj.': 'bg-emerald-50/80 text-emerald-600',
  'adv.': 'bg-violet-50/80 text-violet-600',
}

export default function Card({ word, revealed, onReveal }: CardProps) {
  const badgeColor = posColors[word.pos] ?? 'bg-gray-100/80 text-gray-500'

  return (
    <div
      onClick={() => !revealed && onReveal()}
      className="w-full max-w-md mx-auto card-premium rounded-3xl px-10 py-12
                 flex flex-col items-center justify-center min-h-[420px]
                 cursor-pointer select-none"
    >
      <span
        className={`text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-8 ${badgeColor}`}
      >
        {word.pos}
      </span>

      <h2 className="font-word text-4xl md:text-5xl text-gray-900 tracking-tight mb-4 text-center">
        {word.word}
      </h2>

      <p className="text-sm text-gray-400 mb-8 tracking-widest font-mono">
        {word.phonetic}
      </p>

      <div className="min-h-[48px] flex items-center">
        {revealed ? (
          <p
            key={word.id}
            className="reveal-text font-kai text-2xl text-gray-700 text-center leading-relaxed"
          >
            {word.translation}
          </p>
        ) : (
          <p className="text-sm text-gray-300 animate-pulse">
            点击卡片显示释义
          </p>
        )}
      </div>
    </div>
  )
}
