import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { motion } from "framer-motion"
import {
  BarChart3,
  Users,
  BookOpen,
  Wallet,
  Layers,
  Settings2,
  ClipboardList,
  UserCog,
  Activity,
  Sparkles,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import { type BreadcrumbItem, type pageProps } from "@/types"

const breadcrumbs: BreadcrumbItem[] = [{ title: "Dashboard", href: "/dashboard" }]
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
}

export default function AdminSistema() {
  const { auth, stats = {} } = usePage<pageProps & { stats: any }>().props
  const user = auth?.user ?? null

  const dataCards = [
    { label: "Cursos activos", value: stats.cursosActivos ?? 0, icon: BookOpen },
    { label: "Profesores", value: stats.profesores ?? 0, icon: UserCog },
    { label: "Alumnos", value: stats.alumnos ?? 0, icon: Users },
    { label: "Inscripciones", value: stats.inscripciones ?? 0, icon: ClipboardList },
    { label: "Pagos registrados", value: stats.pagosTotales ?? 0, icon: Wallet },
    { label: "Ingresos del mes", value: `$${stats.ingresosMes ?? 0}`, icon: BarChart3 },
    { label: "Asistencias del mes", value: stats.asistenciasMes ?? 0, icon: Activity },
  ]

  const accesos = [
    { titulo: "Cursos", icono: BookOpen, href: route("cursos.index") },
    { titulo: "Usuarios", icono: Users, href: route("usuarios.index") },
    { titulo: "Pagos", icono: Wallet, href: route("pagos.index") },
    { titulo: "Asistencias", icono: ClipboardList, href: route("asistencias.index") },
    { titulo: "Roles y Permisos", icono: Settings2, href: route("roles.index") },
    { titulo: "Reportes", icono: BarChart3, href: "#" },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard Administrador" />

      {/* ===== HERO ===== */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-xl bg-gradient-to-r from-primary/15 via-background to-secondary/15 border border-border shadow-sm p-6 mx-2 sm:mx-4 md:mx-8 overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
            <Layers className="w-6 h-6 text-primary" /> Panel de Control
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bienvenido, <strong>{user?.name}</strong>. Administrá cursos, usuarios y supervisá la actividad del campus.
          </p>
        </div>
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute -bottom-16 -right-16 w-56 h-56 bg-primary/25 rounded-full blur-3xl"
        />
      </motion.div>

      {/* ===== MÉTRICAS ===== */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-2 sm:px-4 md:px-8">
        {dataCards.map((card, i) => (
          <motion.div key={card.label} variants={fadeIn} initial="hidden" animate="visible" custom={i}>
            <Card className="hover:shadow-md transition-all duration-300 border-border">
              <CardContent className="flex items-center gap-3 py-5">
                <div className="p-3 bg-primary/10 rounded-full">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-lg font-semibold text-foreground">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ===== ACCESOS ===== */}
      <div className="mt-10 px-2 sm:px-4 md:px-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
          <Sparkles className="w-5 h-5 text-primary" /> Accesos rápidos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accesos.map((item, i) => (
            <motion.div key={i} variants={fadeIn} initial="hidden" animate="visible" custom={i}>
              <Card className="group h-full border-border hover:shadow-md transition-all">
                <CardHeader className="relative pb-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-secondary/20 opacity-[0.07] rounded-t-lg" />
                  <div className="relative flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">{item.titulo}</CardTitle>
                    <div className="p-2 rounded-full bg-muted/50">
                      <item.icono className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col justify-between py-3">
                  <Button asChild size="sm" className="w-full">
                    <Link href={item.href}>Ingresar</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== ACTIVIDAD ===== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 mx-2 sm:mx-4 md:mx-8 border border-border rounded-xl p-6 relative overflow-hidden"
      >
        <PlaceholderPattern className="absolute inset-0 stroke-muted/10 pointer-events-none" />
        <h2 className="relative z-10 text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
          <Activity className="h-5 w-5" /> Actividad reciente
        </h2>
        <p className="relative z-10 text-sm text-muted-foreground">
          Visualizá los movimientos generales del sistema: pagos, inscripciones y nuevas altas.
        </p>
        <div className="relative z-10 mt-4 flex flex-wrap gap-2 text-sm">
          <Badge className="bg-primary/10 text-primary">💳 {stats.pagosTotales} pagos</Badge>
          <Badge className="bg-secondary/10 text-secondary-foreground">📚 {stats.cursosActivos} cursos</Badge>
          <Badge className="bg-accent/10 text-accent-foreground">👩‍🏫 {stats.profesores} docentes</Badge>
        </div>
      </motion.div>
    </AppLayout>
  )
}
