export const APP_BASE_PATH = '/app' as const

export function appPath(path = ''): string {
  if (!path || path === '/' || path === '.') {
    return APP_BASE_PATH
  }

  return `${APP_BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`
}

export function stripAppPath(pathname: string): string {
  if (!pathname.startsWith(APP_BASE_PATH)) {
    return pathname
  }

  const trimmed = pathname.slice(APP_BASE_PATH.length)
  return trimmed === '' ? '/' : trimmed
}
