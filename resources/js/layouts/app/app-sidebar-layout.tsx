import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { BreadcrumbItem, pageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    // ============================
    // 📌 LEER AUTH DE FORMA TIPADA
    // ============================
    const { auth } = usePage<pageProps>().props;

    // roles viene definido como string[], pero auth puede ser undefined
    const roles: string[] = auth?.roles ?? [];

    // Si tienen varios roles, tomamos el primero (tu sistema ya trabaja así)
    const currentRole = roles.length ? roles[0] : 'usuario';

    // Capitalizar
    const roleLabel = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);

    // ============================
    // 📌 AGREGAR EL ROL COMO PRIMER BREADCRUMB
    // ============================
    const enhancedBreadcrumbs: BreadcrumbItem[] = [{ title: roleLabel, href: '#' }, ...breadcrumbs];

    return (
        <AppShell variant="sidebar">
            <AppSidebar />

            <AppContent variant="sidebar" className="overflow-x-hidden">
                {/* HEADER: ahora incluye el rol */}
                <AppSidebarHeader breadcrumbs={enhancedBreadcrumbs} />

                {children}
            </AppContent>
        </AppShell>
    );
}
