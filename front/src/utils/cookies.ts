/**
 * Utilitaires pour gérer les cookies de manière sécurisée
 */

export interface CookieOptions {
  expires?: number | Date
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  httpOnly?: boolean
}

/**
 * Définit un cookie avec des options de sécurité
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  const {
    expires,
    path = '/',
    domain,
    secure = window.location.protocol === 'https:',
    sameSite = 'lax',
  } = options

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (expires) {
    const expiresDate = expires instanceof Date ? expires : new Date(Date.now() + expires * 1000)
    cookieString += `; expires=${expiresDate.toUTCString()}`
  }

  if (path) {
    cookieString += `; path=${path}`
  }

  if (domain) {
    cookieString += `; domain=${domain}`
  }

  if (secure) {
    cookieString += '; secure'
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`
  }

  document.cookie = cookieString
}

/**
 * Récupère la valeur d'un cookie
 */
export function getCookie(name: string): string | null {
  const nameEQ = `${encodeURIComponent(name)}=`
  const cookies = document.cookie.split(';')

  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length))
    }
  }

  return null
}

/**
 * Supprime un cookie
 */
export function deleteCookie(name: string, options: Omit<CookieOptions, 'expires'> = {}): void {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
  })
}

/**
 * Vérifie si les cookies sont activés dans le navigateur
 */
export function areCookiesEnabled(): boolean {
  try {
    const testKey = '__cookie_test__'
    setCookie(testKey, 'test', { expires: 1 })
    const result = getCookie(testKey) === 'test'
    deleteCookie(testKey)
    return result
  } catch {
    return false
  }
}

/**
 * Stocke une préférence utilisateur dans un cookie
 */
export function setUserPreference(key: string, value: string, daysToExpire = 365): void {
  setCookie(`vtom_${key}`, value, {
    expires: daysToExpire * 24 * 60 * 60, // Convertir en secondes
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'lax',
  })
}

/**
 * Récupère une préférence utilisateur depuis un cookie
 */
export function getUserPreference(key: string): string | null {
  return getCookie(`vtom_${key}`)
}

/**
 * Supprime une préférence utilisateur
 */
export function deleteUserPreference(key: string): void {
  deleteCookie(`vtom_${key}`, { path: '/' })
}
