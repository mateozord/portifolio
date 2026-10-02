"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/content/portfolio-content";

/** Turno de funcionamento: [abre, fecha], em minutos desde a meia-noite. */
export type Shift = [number, number];
/** Turnos por dia da semana, de domingo (0) a sábado (6). */
export type WeekShifts = Shift[][];

export const hm = (hours: number, minutes = 0) => hours * 60 + minutes;

const LABELS = {
  pt: {
    open: (at: string) => `Aberto agora · fecha às ${at}`,
    today: (at: string) => `Fechado · abre hoje às ${at}`,
    tomorrow: (at: string) => `Fechado · abre amanhã às ${at}`,
    later: (day: string, at: string) => `Fechado · abre ${day} às ${at}`,
    time: (min: number) => `${Math.floor(min / 60)}h${min % 60 ? String(min % 60).padStart(2, "0") : ""}`,
    weekdays: ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"],
  },
  en: {
    open: (at: string) => `Open now · closes at ${at}`,
    today: (at: string) => `Closed · opens today at ${at}`,
    tomorrow: (at: string) => `Closed · opens tomorrow at ${at}`,
    later: (day: string, at: string) => `Closed · opens ${day} at ${at}`,
    time: (min: number) => {
      const h = Math.floor(min / 60) % 24;
      const m = min % 60;
      return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""}${h < 12 ? "am" : "pm"}`;
    },
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
};

// Relógio do visitante, atualizado a cada 30 s. No servidor é null: o que
// depende da hora (selo, "hoje") só aparece depois da hidratação.
function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(id);
}
const minuteNow = () => Math.floor(Date.now() / 60_000);

export function useNow() {
  const minute = useSyncExternalStore(subscribeClock, minuteNow, () => null);
  return minute === null ? null : new Date(minute * 60_000);
}

/** Aberto agora? Se não, quando abre (hoje, amanhã ou outro dia). */
export function openStatus(now: Date, shifts: WeekShifts, locale: Locale) {
  const s = LABELS[locale];
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  for (const [opens, closes] of shifts[day]) {
    if (minutes >= opens && minutes < closes) return { open: true, label: s.open(s.time(closes)) };
  }
  for (let ahead = 0; ahead < 8; ahead++) {
    const d = (day + ahead) % 7;
    const next = shifts[d].find(([opens]) => ahead > 0 || opens > minutes);
    if (!next) continue;
    const at = s.time(next[0]);
    const label = ahead === 0 ? s.today(at) : ahead === 1 ? s.tomorrow(at) : s.later(s.weekdays[d], at);
    return { open: false, label };
  }
  return { open: false, label: "" };
}

/** Selo "Aberto agora" / "Fechado · abre às...", com ponto pulsando quando aberto. */
export function OpenBadge({
  now,
  shifts,
  locale,
  className = "bg-black/45 backdrop-blur",
}: {
  now: Date | null;
  shifts: WeekShifts;
  locale: Locale;
  className?: string;
}) {
  if (!now) return <span className="inline-block h-8" />;
  const status = openStatus(now, shifts, locale);
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${className}`}>
      <span className="relative flex h-2 w-2">
        {status.open && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />}
        <span className={`relative h-2 w-2 rounded-full ${status.open ? "bg-emerald-400" : "bg-current opacity-50"}`} />
      </span>
      {status.label}
    </span>
  );
}
