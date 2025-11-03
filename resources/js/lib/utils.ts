// resources/js/lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina condicionalmente clases de Tailwind.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ============================================================
   📅 UTILIDADES DE FECHA (USADAS EN TODO EL PROYECTO)
   ============================================================ */

/**
 * ✅ Parsea una fecha (YYYY-MM-DD o ISO) corrigiendo desfase UTC
 */
export function parseLocalDate(fechaStr: string): Date {
  if (!fechaStr) return new Date(NaN);
  try {
    const fecha = fechaStr.includes('T')
      ? new Date(fechaStr)
      : (() => {
          const [y, m, d] = fechaStr.split('-').map(Number);
          return new Date(y, m - 1, d);
        })();

    // 🔹 Laravel guarda las fechas en UTC, esto corrige el día local
    fecha.setDate(fecha.getDate() + 1);
    return fecha;
  } catch {
    return new Date(NaN);
  }
}

/**
 * ✅ Devuelve la fecha local formateada en español (Argentina)
 */
export function formatFechaLocal(fechaStr: string): string {
  const date = parseLocalDate(fechaStr);
  if (isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * 🕒 (Opcional) Devuelve la hora local formateada, ej: "14:30 hs"
 */
export function formatHoraLocal(horaStr: string): string {
  if (!horaStr) return '—';
  try {
    const [h, m] = horaStr.split(':').map(Number);
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')} hs`;
  } catch {
    return horaStr;
  }
}

export function formatFechaSinOffset(fechaStr: string): string {
  if (!fechaStr) return "—";
  try {
    const date = new Date(fechaStr);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}
