import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem, pageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ClipboardList, FileText, Folder, LayoutGrid, UserCog, UsersRound } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
  const { auth } = usePage<pageProps>().props;
  const rol = auth?.roles?.[0]?.toLowerCase() ?? null;

  const mainNavItems: NavItem[] = [{ title: 'Dashboard', href: '/dashboard', icon: LayoutGrid }];

  if (rol === 'superusuario') {
    mainNavItems.push(
      { title: 'Pagos', href: '/pagos', icon: FileText },
      { title: 'Inscripciones', href: '/inscripciones', icon: ClipboardList },
      { title: 'Asistencias', href: '/asistencias', icon: Folder }
    );
  }

  if (rol === 'administrativo') {
    mainNavItems.push(
      { title: 'Pagos', href: '/pagos', icon: FileText },
      { title: 'Inscripciones', href: '/inscripciones', icon: ClipboardList },
      { title: 'Asistencias', href: '/asistencias', icon: Folder }
    );
  }

  if (rol === 'profesor') {
    mainNavItems.push(
      { title: 'Mis Materias', href: '/materias', icon: BookOpen },
      { title: 'Notas', href: '/notas', icon: FileText },
      { title: 'Asistencias', href: '/asistencias', icon: ClipboardList }
    );
  }

  if (rol === 'alumno') {
    mainNavItems.push(
      { title: 'Mis Cursos', href: '/cursos', icon: Folder },
      { title: 'Mis Notas', href: '/notas', icon: FileText },
      { title: 'Pagos', href: '/pagos', icon: FileText }
    );
  }

  const footerNavItems: NavItem[] =
    rol === 'superusuario'
      ? [
          { title: 'Roles', href: '/roles', icon: UserCog },
          { title: 'Usuarios', href: '/users', icon: UsersRound },
        ]
      : [];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        {footerNavItems.length > 0 && <NavFooter items={footerNavItems} className="mt-auto" />}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
