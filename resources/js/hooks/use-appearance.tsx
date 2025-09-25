import { useCallback, useEffect, useState } from 'react';

// 1. Definimos los posibles modos de apariencia (agregamos blue y blue-dark)
export type Appearance = 'light' | 'dark' | 'system' | 'blue' | 'blue-dark';

// 2. Función que detecta si el usuario prefiere dark mode a nivel sistema
const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// 3. Guardamos cookies para SSR y persistencia
const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

/**
 * 4. Aplica la clase correspondiente al <html> (document.documentElement)
 *    según el modo seleccionado.
 *    - Agregamos o quitamos 'dark' y 'blue-theme' para que se activen
 *      las variables CSS del tema elegido.
 */
const applyTheme = (appearance: Appearance) => {
    const html = document.documentElement;

    // Limpiamos todas las clases primero
    html.classList.remove('dark');
    html.classList.remove('blue-theme');
    html.classList.remove('blue-dark-theme');

    switch (appearance) {
        case 'light':
            html.style.colorScheme = 'light';
            break;

        case 'dark':
            html.classList.add('dark');
            html.style.colorScheme = 'dark';
            break;

        case 'blue':
            html.classList.add('blue-theme');
            html.style.colorScheme = 'light';
            break;

        case 'blue-dark':
            // Ahora usamos su propia clase independiente
            html.classList.add('blue-dark-theme');
            html.style.colorScheme = 'dark'; // sugerido por accesibilidad
            break;

        case 'system':
        default:
            if (prefersDark()) {
                html.classList.add('dark');
                html.style.colorScheme = 'dark';
            } else {
                html.style.colorScheme = 'light';
            }
            break;
    }
};

// 5. Creamos un MediaQuery para detectar cambios del sistema
const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    return window.matchMedia('(prefers-color-scheme: dark)');
};

// 6. Maneja el cambio del tema del sistema automáticamente
const handleSystemThemeChange = () => {
    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    applyTheme(currentAppearance || 'system');
};

// 7. Inicializamos el tema al cargar
export function initializeTheme() {
    const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';
    applyTheme(savedAppearance);
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

// 8. Hook principal para usar en React
export function useAppearance() {
    // Estado local de la apariencia actual
    const [appearance, setAppearance] = useState<Appearance>('system');

    // Cambia apariencia + guarda en localStorage y cookie
    const updateAppearance = useCallback((mode: Appearance) => {
        setAppearance(mode);
        localStorage.setItem('appearance', mode);
        setCookie('appearance', mode);
        applyTheme(mode);
    }, []);

    // Al montar el hook, leemos la apariencia guardada
    useEffect(() => {
        const savedAppearance = localStorage.getItem('appearance') as Appearance | null;
        updateAppearance(savedAppearance || 'system');

        // Limpieza del event listener
        return () => mediaQuery()?.removeEventListener('change', handleSystemThemeChange);
    }, [updateAppearance]);

    // Devolvemos estado y función para cambiarlo
    return { appearance, updateAppearance } as const;
}
