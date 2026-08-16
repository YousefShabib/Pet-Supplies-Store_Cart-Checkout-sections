import { createContext, useContext } from 'react'

export const EmbeddedContext = createContext(false)

export function isEmbeddedProp(embedded?: boolean | string) {
  if (embedded === true || embedded === 'true' || embedded === '1' || embedded === '') return true
  return typeof document !== 'undefined' && Boolean(document.querySelector('.shell-header'))
}

export function useEmbedded() {
  return useContext(EmbeddedContext)
}

export function crossApp(path: string) {
  window.location.assign(path)
}
