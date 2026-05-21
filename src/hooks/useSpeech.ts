export function useSpeech() {
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    requestAnimationFrame(() => {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'en-US'
      u.rate = 0.95
      u.volume = 1
      window.speechSynthesis.speak(u)
    })
  }

  return { speak }
}
