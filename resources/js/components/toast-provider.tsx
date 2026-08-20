'use client';

import { pageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Info, Loader2, XCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';

/**
 * 🔔 Proveedor global de notificaciones
 * - Escucha automáticamente los mensajes flash del backend (HandleInertiaRequests)
 * - Muestra los toasts de forma centralizada con diseño consistente
 */
export function ToastProvider() {
    const { flash } = usePage<pageProps>().props;

    // 🧠 Guardamos el último flash para evitar mostrarlo dos veces
    const lastFlash = useRef<typeof flash | null>(null);

    useEffect(() => {
        if (!flash) return;

        // Evita mostrar el mismo mensaje repetidamente
        const isSameFlash = JSON.stringify(flash) === JSON.stringify(lastFlash.current);
        if (isSameFlash) return;
        lastFlash.current = flash;

        if (flash.success)
            toast.success(flash.success, {
                icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            });

        if (flash.error)
            toast.error(flash.error, {
                icon: <XCircle className="h-5 w-5 text-red-500" />,
            });

        if (flash.warning)
            toast.warning(flash.warning, {
                icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
            });

        if (flash.info)
            toast.message(flash.info, {
                icon: <Info className="h-5 w-5 text-blue-500" />,
            });
    }, [flash]);

    return (
        <Toaster
            position="top-right"
            expand
            richColors
            closeButton
            theme="system" // Se adapta automáticamente al tema claro/oscuro
            toastOptions={{
                classNames: {
                    toast: 'rounded-xl shadow-md border bg-background/95 backdrop-blur-sm dark:bg-gray-900/90',
                    title: 'font-semibold text-foreground',
                    description: 'text-muted-foreground',
                    actionButton: 'bg-primary text-white hover:bg-primary/90 rounded-md transition-colors',
                    cancelButton: 'bg-transparent text-muted-foreground hover:text-foreground',
                },
                duration: 4000,
            }}
        />
    );
}

/**
 * 🎯 Helpers reutilizables
 * Permiten disparar toasts manualmente desde cualquier parte del sistema
 */
export const Toast = {
    success: (msg: string) =>
        toast.success(msg, {
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        }),

    error: (msg: string) =>
        toast.error(msg, {
            icon: <XCircle className="h-5 w-5 text-red-500" />,
        }),

    warning: (msg: string) =>
        toast.warning(msg, {
            icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        }),

    info: (msg: string) =>
        toast.message(msg, {
            icon: <Info className="h-5 w-5 text-blue-500" />,
        }),

    loading: (msg: string) =>
        toast.loading(msg, {
            icon: <Loader2 className="h-5 w-5 animate-spin text-primary" />,
            duration: 2500,
        }),
};
