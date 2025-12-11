import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { BookOpen, ClipboardList, GraduationCap, Users2, Clock3, Sparkles } from "lucide-react"
import { SharedData, Curso } from "@/types"

export default function Profesor() {
  const { user, cursos, stats } = usePage<{
    user: any
    cursos: Curso[]
    stats: {
      cursosAsignados: number
      alumnosActivos: number
      ultimaClase: string | null
    }
  }>().props

  const opciones = [
    {
      titulo: "Mis Cursos",
      descripcion: "Gestioná tus clases, horarios y alumnos.",
      icono: BookOpen,
      href: route("profesor.cursos.index"),
    },
    {
      titulo: "Asistencias",
      descripcion: "Registrá la asistencia diaria de tus cursos.",
      icono: ClipboardList,
      href: route("profesor.asistencias.index"),
    },
  ]

  const fade = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  }

  return (
    <AppLayout>
      <Head title="Dashboard Profesor" />

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-border shadow-sm p-6 bg-gradient-to-br from-primary/10 via-background to-secondary/10 mx-2 sm:mx-4 md:mx-8"
      >
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
          <GraduationCap className="h-6 w-6 text-primary" /> ¡Hola, {user?.nombre_completo}!
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Este es tu espacio docente. Revisá tus cursos, alumnos y asistencias.
        </p>
      </motion.div>

      {/* KPI DOCENTES */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-4 md:px-8"
      >
        <Card className="hover:shadow-md border-border transition-all">
          <CardContent className="flex items-center gap-3 py-5">
            <div className="p-3 bg-primary/10 rounded-full">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cursos asignados</p>
              <p className="text-lg font-semibold">{stats.cursosAsignados}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md border-border transition-all">
          <CardContent className="flex items-center gap-3 py-5">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Alumnos activos</p>
              <p className="text-lg font-semibold">{stats.alumnosActivos}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md border-border transition-all">
          <CardContent className="flex items-center gap-3 py-5">
            <div className="p-3 bg-primary/10 rounded-full">
              <Clock3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Última clase</p>
              <p className="text-lg font-semibold">
                {stats.ultimaClase ? stats.ultimaClase : "Sin registros"}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* OPCIONES */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-4 md:px-8 pb-10">
        {opciones.map((op, i) => (
          <motion.div key={op.titulo} variants={fade} initial="hidden" animate="visible" custom={i}>
            <Card className="hover:shadow-md border-border transition-all h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <op.icono className="h-5 w-5 text-primary" />
                  {op.titulo}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col justify-between flex-1 py-3">
                <p className="text-sm text-muted-foreground mb-3">{op.descripcion}</p>

                <Button asChild size="sm" className="w-full">
                  <Link href={op.href}>
                    <Sparkles className="h-4 w-4 mr-1" /> Ingresar
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
