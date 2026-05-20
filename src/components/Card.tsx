import { type Word } from '../data/words'

interface CardProps {
  word: Word
  revealed: boolean
  onReveal: () => void
}

const posColors: Record<string, string> = {
  'n.': 'bg-blue-50 text-blue-700',
  'v.': 'bg-amber-50 text-amber-700',
  'adj.': 'bg-emerald-50 text-emerald-700',
  'adv.': 'bg-violet-50 text-violet-700',
}

export default function Card({ word, revealed, onReveal }: CardProps) {
  const badgeColor =
    posColors[word.pos] ?? 'bg-gray-100 text-gray-600'

  return (
    <div
      onClick={() => !revealed && onReveal()}
      className="w-full max-w-md mx-auto bg-white rounded-3xl card-shadow px-10 py-12
                 flex flex-col items-center justify-center min-h-[420px]
                 cursor-pointer select-none transition-transform duration-150 active:scale-[0.98]"
    >
      {/* Part of speech badge */}
      <span
        className={`text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-8 ${badgeColor}`}
      >
        {word.pos}
      </span>

      {/* Word */}
      <h2 className="font-word text-4xl md:text-5xl text-gray-900 tracking-tight mb-4 text-center">
        {word.word}
      </h2>

      {/* Phonetic */}
      <p className="text-base text-gray-400 mb-8 tracking-wide">{word.phonetic}</p>

      {/* Translation — blurred until revealed */}
      <div
        className={`transition-all duration-500 ${
          revealed
            ? 'opacity-100 blur-0 translate-y-0'
            : 'opacity-0 blur-sm translate-y-2'
        }`}
      >
        <p className="text-xl text-gray-700 font-medium text-center">
          {word.translation}
        </p>
      </div>

      {!revealed && (
        <p className="text-sm text-gray-300 mt-8 animate-pulse">
          点击卡片显示释义
        </p>
      )}
    </div>
  )
}
