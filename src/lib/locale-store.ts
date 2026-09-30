"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/content/portfolio-content";

const STORAGE_KEY = "locale";
const listeners = new Set<() => void>();

// Guarda a escolha em memória também, para funcionar mesmo sem localStorage (aba anônima, bloqueios).
let memoryLocale: Locale | null = null;

function readStored(): Locale | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "pt" || value === "en" ? value : null;
  } catch {
    return null;
  }
}

function browserLocale(): Locale {
  return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

function getSnapshot(): Locale {
  return memoryLocale ?? readStored() ?? browserLocale();
}

function getServerSnapshot(): Locale {
  return "pt";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function setLocale(locale: Locale) {
  memoryLocale = locale;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Sem armazenamento: a escolha vale só nesta visita.
  }
  listeners.forEach((listener) => listener());
}

/** Idioma atual: escolha salva, senão o idioma do navegador. */
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
