"use client"

import { Toaster, toast } from "sonner"
import { useEffect, useRef } from "react"
import { usePage } from "@inertiajs/react"
import { pageProps } from "@/types"
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Loader2,
} from "lucide-react"

/**
 * 🔔 Proveedor global de notificaciones
 * - Escucha automáticamente los mensajes flash del backend (HandleInertiaRequests)
 * - Muestra los toasts de forma centralizada con diseño consistente
 */
export function ToastProvider() {
  const { flash } = usePage<pageProps>().props

  // 🧠 Guardamos el último flash para evitar mostrarlo dos veces
  const lastFlash = useRef<typeof flash | null>(null)

  useEffect(() => {
    if (!flash) return

    // Evita mostrar el mismo mensaje repetidamente
    const isSameFlash =
      JSON.stringify(flash) === JSON.stringify(lastFlash.current)
    if (isSameFlash) return
    lastFlash.current = flash

    if (flash.success)
      toast.success(flash.success, {
        icon: <CheckCircle2 className="text-green-500 h-5 w-5" />,
      })

    if (flash.error)
      toast.error(flash.error, {
        icon: <XCircle className="text-red-500 h-5 w-5" />,
      })

    if (flash.warning)
      toast.warning(flash.warning, {
        icon: <AlertTriangle className="text-yellow-500 h-5 w-5" />,
      })

    if (flash.info)
      toast.message(flash.info, {
        icon: <Info className="text-blue-500 h-5 w-5" />,
      })
  }, [flash])

  return (
    <Toaster
      position="top-right"
      expand
      richColors
      closeButton
      theme="system" // Se adapta automáticamente al tema claro/oscuro
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl shadow-md border bg-background/95 backdrop-blur-sm dark:bg-gray-900/90",
          title: "font-semibold text-foreground",
          description: "text-muted-foreground",
          actionButton:
            "bg-primary text-white hover:bg-primary/90 rounded-md transition-colors",
          cancelButton:
            "bg-transparent text-muted-foreground hover:text-foreground",
        },
        duration: 4000,
      }}
    />
  )
}

/**
 * 🎯 Helpers reutilizables
 * Permiten disparar toasts manualmente desde cualquier parte del sistema
 */
export const Toast = {
  success: (msg: string) =>
    toast.success(msg, {
      icon: <CheckCircle2 className="text-green-500 h-5 w-5" />,
    }),

  error: (msg: string) =>
    toast.error(msg, {
      icon: <XCircle className="text-red-500 h-5 w-5" />,
    }),

  warning: (msg: string) =>
    toast.warning(msg, {
      icon: <AlertTriangle className="text-yellow-500 h-5 w-5" />,
    }),

  info: (msg: string) =>
    toast.message(msg, {
      icon: <Info className="text-blue-500 h-5 w-5" />,
    }),

  loading: (msg: string) =>
    toast.loading(msg, {
      icon: <Loader2 className="animate-spin text-primary h-5 w-5" />,
      duration: 2500,
    }),
}
