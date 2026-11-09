export const OPEN_COMMAND_MENU_EVENT = "glovax:command-menu";

let openRequested = false;

/** Open the command menu from anywhere, even before its code has loaded. */
export function openCommandMenu() {
  openRequested = true;
  window.dispatchEvent(new Event(OPEN_COMMAND_MENU_EVENT));
}

// Reading and clearing are separate because React can discard a render while
// lazy code is still loading, which would lose a request cleared during render.
export const wasOpenRequested = () => openRequested;

export function clearOpenRequest() {
  openRequested = false;
}
