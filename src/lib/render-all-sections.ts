/**
 * Lower homepage sections render lazily using estimated heights. Call this before
 * jumping to one of them, so the scroll position is based on their real heights.
 */
export function renderAllSections() {
  document.documentElement.toggleAttribute("data-render-all", true);
}
