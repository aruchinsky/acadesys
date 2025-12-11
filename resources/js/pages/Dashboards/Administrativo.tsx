import { Head, Link, router, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Wallet,
  ClipboardList,
  BookOpen,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  BarChart3,
} from "lucide-react"

export default function Administrativo() {

  const { user, stats } = usePage<{
    user: any;
    stats: {
      inscripcionesPendientes: number;
      pagosHoy: number;
      totalCursos: number;
    };
  }>().props;

  // 🍃 Animación
  const fade = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  }

  // 📌 Opciones sincronizadas con el sidebar
  const opciones = [
    {
      titulo: "Gestión de Pagos",
      descripcion: "Listá y administrá todos los pagos registrados.",
      icono: Wallet,
      href: route("administrativo.pagos.index"),
    },
    {
      titulo: "Inscripciones",
      descripcion: "Consultá alumnos inscriptos por curso.",
      icono: ClipboardList,
      href: route("inscripciones.index"),
    },
    {
      titulo: "Cursos",
      descripcion: "Administrá los cursos vigentes y su información.",
      icono: BookOpen,
      href: route("cursos.index"),
    },
    {
      titulo: "Asistencias",
      descripcion: "Visualizá y gestioná registros de asistencia.",
      icono: CheckCircle2,
      href: route("administrativo.asistencias.index"),
    },
    {
      titulo: "Reportes",
      descripcion: "Análisis y estadísticas del sistema.",
      icono: BarChart3,
      href: "#",
    },
  ]

  return (
    <AppLayout>
      <Head title="Dashboard Administrativo" />

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-border shadow-sm p-6 bg-gradient-to-r from-primary/15 via-background to-secondary/15 mx-2 sm:mx-4 md:mx-8"
      >
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" /> Panel Administrativo
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestión económica y académica centralizada.
        </p>
      </motion.div>

      {/* KPI GENERADOS POR EL BACKEND */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 px-2 sm:px-4 md:px-8 mt-6">
        <Card className="p-4 shadow-sm border-border">
          <h3 className="text-sm text-muted-foreground">Inscripciones pendientes</h3>
          <p className="text-xl font-semibold mt-1">{stats.inscripcionesPendientes}</p>
        </Card>

        <Card className="p-4 shadow-sm border-border">
          <h3 className="text-sm text-muted-foreground">Pagos registrados hoy</h3>
          <p className="text-xl font-semibold mt-1">${stats.pagosHoy.toLocaleString()}</p>
        </Card>

        <Card className="p-4 shadow-sm border-border">
          <h3 className="text-sm text-muted-foreground">Total de cursos</h3>
          <p className="text-xl font-semibold mt-1">{stats.totalCursos}</p>
        </Card>
      </div>

      {/* ACCIÓN RÁPIDA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-2 sm:mx-4 md:mx-8 mt-6"
      >
        <Card className="border border-primary/40 shadow-md bg-primary/5 hover:bg-primary/10 transition-all">
          <CardContent className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-primary flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                Acción rápida
              </h2>
              <p className="text-sm text-muted-foreground">
                Generar un nuevo pago presencial para un alumno.
              </p>
            </div>

            <Button
              onClick={() => router.visit(route("administrativo.pagos.create"))}
              className="bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-full"
            >
              <PlusCircle className="h-4 w-4" />
              Generar Pago
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* NAVEGACIÓN PRINCIPAL */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-2 sm:px-4 md:px-8 pb-10">
        {opciones.map((op, i) => (
          <motion.div key={op.titulo} variants={fade} initial="hidden" animate="visible" custom={i}>
            <Card className="hover:shadow-md transition-all border-border h-full flex flex-col">
              <CardHeader className="relative pb-1">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/20 opacity-[0.07] rounded-t-lg" />
                <div className="relative flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{op.titulo}</CardTitle>
                  <div className="p-2 rounded-full bg-muted/50">
                    <op.icono className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="py-3 flex flex-col justify-between flex-1">
                <p className="text-sm text-muted-foreground mb-3">{op.descripcion}</p>
                <Button asChild size="sm" className="w-full">
                  <Link href={op.href}>
                    <Sparkles className="w-4 h-4 mr-1" /> Ingresar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  )
}
