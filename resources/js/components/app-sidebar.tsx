import { NavFooter } from "@/components/nav-footer"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { type NavItem, pageProps } from "@/types"
import { Link, usePage } from "@inertiajs/react"
import {
  LayoutGrid,
  Users,
  UserCog,
  Wallet,
  BookOpen,
  ClipboardList,
  CheckCircle2,
  Settings2,
  BarChart3,
  Home,
  GraduationCap,
} from "lucide-react"
import AppLogo from "./app-logo"

export function AppSidebar() {
  const { auth } = usePage<pageProps>().props
  const userRoles = auth?.roles ?? []
  const rol = userRoles[0]?.toLowerCase() ?? null

  // 🔹 Base común
  const mainNavItems: NavItem[] = [
    {
      title: "Panel principal",
      href: route("dashboard"),
      icon: LayoutGrid,
    },
  ]

  // 🔹 Superusuario
  if (rol === "superusuario") {
    mainNavItems.push(
      { title: "Usuarios", href: route("usuarios.index"), icon: Users },
      { title: "Roles y Permisos", href: route("roles.index"), icon: UserCog },
      { title: "Cursos", href: route("cursos.index"), icon: BookOpen },
      { title: "Inscripciones", href: route("inscripciones.index"), icon: ClipboardList },
      { title: "Pagos", href: route("administrativo.pagos.index"), icon: Wallet },
      { title: "Asistencias", href: route("asistencias.index"), icon: CheckCircle2 },
      { title: "Reportes", href: "#", icon: BarChart3 },
      { title: "Configuración", href: "#", icon: Settings2 },
    )
  }

  // 🔹 Administrativo
  if (rol === "administrativo") {
    mainNavItems.push(
      { title: "Cursos", href: route("cursos.index"), icon: BookOpen },
      { title: "Inscripciones", href: route("inscripciones.index"), icon: ClipboardList },
      { title: "Pagos", href: route("administrativo.pagos.index"), icon: Wallet },
      { title: "Asistencias", href: route("asistencias.index"), icon: CheckCircle2 },
      { title: "Reportes", href: "#", icon: BarChart3 },
    )
  }

  // 🔹 Profesor
  if (rol === "profesor") {
    mainNavItems.push(
      { title: "Mis Cursos", href: route("profesor.cursos.index"), icon: BookOpen },
      { title: "Asistencias", href: route("profesor.asistencias.index"), icon: ClipboardList },
      // { title: "Pagos", href: route("pagos.index"), icon: Wallet },
    )
  }

  // 🔹 Alumno (ACTUALIZADO)
  if (rol === "alumno") {
    mainNavItems.push(
      { title: "Cursos disponibles", href: route("alumno.cursos.index"), icon: GraduationCap },
      { title: "Mis Cursos", href: route("alumno.mis-cursos.index"), icon: BookOpen },
      { title: "Pagos", href: route("alumno.pagos.index"), icon: Wallet },
      { title: "Mis Asistencias", href: route("alumno.asistencias.index"), icon: ClipboardList },
    )
  }

  const footerNavItems: NavItem[] = []

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-r border-[var(--sidebar-border)] transition-colors duration-200"
    >
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={route("dashboard")} prefetch>
                <div className="flex items-center gap-2">
                  <AppLogo />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Contenido */}
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={route("home")} prefetch>
                <Home className="mr-2 h-4 w-4 text-[var(--sidebar-foreground)]" />
                <span>Inicio</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="my-2 border-t border-[var(--sidebar-border)]" />
        <NavMain items={mainNavItems} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {footerNavItems.length > 0 && <NavFooter items={footerNavItems} className="mt-auto" />}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
