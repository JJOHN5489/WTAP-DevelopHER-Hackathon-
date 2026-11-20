import { QueryClient } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Node ships its own experimental localStorage that shadows jsdom's; use a plain in-memory one.
const store = new Map<string, string>();
Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  },
});

globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.scrollIntoView ??= () => {};

export async function open(path: string) {
  const router = createRouter({
    routeTree,
    context: { queryClient: new QueryClient() },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  await router.load();
  render(<RouterProvider router={router} />);
  await screen.findByAltText("RBC");
  return router;
}

// Text queries instead of getByRole: role queries get very slow in jsdom with Radix portals.
export const link = (name: string) => screen.getByText(name, { selector: "a" });
export const btn = (name: string | RegExp) => screen.getByText(name, { selector: "button, button *" }).closest("button")!;
export const findDialog = () => waitFor(() => document.querySelector<HTMLElement>('[role="dialog"]')!.parentElement!.querySelector<HTMLElement>('[role="dialog"]')!);

// Radix focus traps leak between tests if a drawer is left open, so close it before the test ends.
export async function closeDialog(dialog: HTMLElement) {
  fireEvent.keyDown(dialog, { key: "Escape" });
  await waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull());
}

beforeEach(() => { localStorage.clear(); });
afterEach(() => {
  cleanup();
  // Radix leaves scroll-lock / aria-hidden state on <body> after a drawer closes.
  document.body.removeAttribute("style");
  document.body.removeAttribute("data-scroll-locked");
  document.body.removeAttribute("aria-hidden");
});

