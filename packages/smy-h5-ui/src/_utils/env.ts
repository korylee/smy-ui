export const IN_BROWSER = typeof window !== 'undefined'
export const SUPPORT_INTERSECTION = IN_BROWSER && 'IntersectionObserver' in window
