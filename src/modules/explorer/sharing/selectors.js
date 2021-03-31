/**
 * When on an embed view, this function transforms
 * the current view to a full explorer view
 */
export const getBreakawayLink = () => {
  return window.location.href
    .split('+secondary')
    .join('')
    .split('/embed')
    .join('')
}
