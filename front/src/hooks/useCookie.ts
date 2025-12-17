import { useCallback, useEffect, useState } from 'react'
import { getCookie, setCookie, deleteCookie, CookieOptions } from '../utils/cookies'

/**
 * Hook React pour gérer un cookie de manière réactive
 * 
 * @example
 * const [theme, setTheme] = useCookie('theme', 'light', { expires: 365 * 24 * 60 * 60 })
 */
export function useCookie<T extends string>(
  key: string,
  defaultValue: T,
  options?: CookieOptions
): [T, (value: T) => void, () => void] {
  const [value, setValue] = useState<T>(() => {
    const cookie = getCookie(key)
    return (cookie as T) || defaultValue
  })

  // Fonction pour mettre à jour le cookie
  const updateCookie = useCallback(
    (newValue: T) => {
      setValue(newValue)
      setCookie(key, newValue, {
        expires: 365 * 24 * 60 * 60, // 1 an par défaut
        path: '/',
        secure: window.location.protocol === 'https:',
        sameSite: 'lax',
        ...options,
      })
    },
    [key, options]
  )

  // Fonction pour supprimer le cookie
  const removeCookie = useCallback(() => {
    setValue(defaultValue)
    deleteCookie(key, { path: options?.path || '/' })
  }, [key, defaultValue, options?.path])

  // Synchroniser avec les changements de cookie (ex: depuis un autre onglet)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentCookie = getCookie(key)
      if (currentCookie && currentCookie !== value) {
        setValue(currentCookie as T)
      }
    }, 1000) // Vérifier toutes les secondes

    return () => clearInterval(interval)
  }, [key, value])

  return [value, updateCookie, removeCookie]
}
