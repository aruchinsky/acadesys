import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, CalendarCheck, ClipboardList, Wallet, Sparkles, GraduationCap } from "lucide-react"
import { SharedData } from "@/types"

export default function Alumno() {
  const { auth } = usePage<SharedData>().props
  const user = auth.user

  const opciones = [
    {
      titulo: "Cursos disponibles",
      descripcion: "Explorá los cursos abiertos para inscripción.",
      icono: GraduationCap,
      href: route("alumno.cursos.index"),
    },
    {
      titulo: "Mis Cursos",
      descripcion: "Visualizá tus cursos activos y progreso.",
      icono: BookOpen,
      href: route("alumno.mis-cursos.index"),
    },
    {
      titulo: "Pagos",
      descripcion: "Consultá tus cuotas, comprobantes y estado.",
      icono: Wallet,
      href: route("alumno.pagos.index"),
    },
    {
      titulo: "Mis Asistencias",
      descripcion: "Revisá tus registros de asistencia.",
      icono: ClipboardList,
      href: route("alumno.asistencias.index"),
    },
    // {
    //   titulo: "Calendario",
    //   descripcion: "Fechas importantes y próximos exámenes.",
    //   icono: CalendarCheck,
    //   href: "#",
    // },
  ]

  const fade = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
  }

  return (
    <AppLayout>
      <Head title="Dashboard Estudiante" />

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-border shadow-sm p-6 bg-gradient-to-r from-primary/15 via-background to-secondary/15 mx-2 sm:mx-4 md:mx-8"
      >
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
          <GraduationCap className="w-6 h-6 text-primary" /> ¡Hola, {user?.nombre ?? 'Estudiante'}!
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bienvenido a tu panel de estudiante 🎓. Consultá tus cursos, pagos y asistencias desde aquí.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-2 sm:px-4 md:px-8">
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
