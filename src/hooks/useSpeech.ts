import { useCallback, useEffect, useRef } from 'react'

export function useSpeech() {
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const synth = window.speechSynthesis

    // On iOS Safari, getVoices() returns [] initially — voices load
    // asynchronously and fire 'voiceschanged' when ready.
    const loadVoices = () => {
      voicesRef.current = synth.getVoices()
    }
    loadVoices()
    synth.addEventListener('voiceschanged', loadVoices)
    return () => synth.removeEventListener('voiceschanged', loadVoices)
  }, [])

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return
    const synth = window.speechSynthesis

    synth.cancel()

    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.95
    u.volume = 1

    const enVoice = voicesRef.current.find(
      (v) => v.lang.startsWith('en') && v.localService,
    )
    if (enVoice) u.voice = enVoice

    // Must be called synchronously within the user-gesture handler on iOS.
    // requestAnimationFrame / setTimeout break the gesture chain and the
    // utterance is silently dropped.
    synth.speak(u)
  }, [])

  return { speak }
}
