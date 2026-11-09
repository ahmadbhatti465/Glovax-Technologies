"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { OPEN_COMMAND_MENU_EVENT, openCommandMenu } from "@/components/layout/command-menu-events";

const ChatWidget = dynamic(() => import("@/components/chat/ChatWidget").then((mod) => mod.ChatWidget), { ssr: false });
const CommandMenu = dynamic(() => import("@/components/layout/CommandMenu").then((mod) => mod.CommandMenu), { ssr: false });
const Toaster = dynamic(() => import("sonner").then((mod) => mod.Toaster), { ssr: false });

const INTERACTIONS = ["pointermove", "pointerdown", "keydown", "scroll"] as const;
const IDLE_DELAY_MS = 8000;

const toastOptions = {
  style: {
    background: "var(--surface-raised)",
    color: "var(--foreground)",
    border: "1px solid var(--hairline-strong)",
  },
};

/**
 * Chat, search and toasts aren't needed to read a page, so their code waits for
 * the first interaction, or for the browser to be idle after the page has loaded.
 */
export function DeferredWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;

    const load = () => setReady(true);
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openCommandMenu();
      }
    };

    let idleHandle: number | undefined;
    const timer = setTimeout(() => {
      if ("requestIdleCallback" in window) idleHandle = window.requestIdleCallback(load);
      else load();
    }, IDLE_DELAY_MS);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_COMMAND_MENU_EVENT, load);
    INTERACTIONS.forEach((name) => window.addEventListener(name, load, { once: true, passive: true }));

    return () => {
      clearTimeout(timer);
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_COMMAND_MENU_EVENT, load);
      INTERACTIONS.forEach((name) => window.removeEventListener(name, load));
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <CommandMenu />
      <ChatWidget />
      <Toaster position="bottom-right" toastOptions={toastOptions} />
    </>
  );
}
