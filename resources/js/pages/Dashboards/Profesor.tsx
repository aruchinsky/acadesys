import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { BookOpen, ClipboardList, FileText, Users2, BarChart3, Clock3, Sparkles, GraduationCap } from "lucide-react"
import { SharedData } from "@/types"

export default function Profesor() {
  const { auth } = usePage<SharedData>().props
  const user = auth.user
  const opciones = [
    { titulo: "Mis Cursos", descripcion: "Gestioná tus clases y alumnos.", icono: BookOpen, href: route("cursos.index") },
    { titulo: "Asistencias", descripcion: "Registrá la asistencia diaria.", icono: ClipboardList, href: route("asistencias.index") },
    { titulo: "Pagos", descripcion: "Consultá pagos de tus cursos.", icono: FileText, href: route("pagos.index") },
  ]
  const stats = [
    { label: "Cursos asignados", value: 3, icon: BookOpen },
    { label: "Alumnos activos", value: 45, icon: Users2 },
    { label: "Promedio general", value: "8.1", icon: BarChart3 },
    { label: "Última clase", value: "Ayer", icon: Clock3 },
  ]
  const fade = { hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }) }

  return (
    <AppLayout>
      <Head title="Dashboard Profesor" />
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-border shadow-sm p-6 bg-gradient-to-br from-primary/10 via-background to-secondary/10 mx-2 sm:mx-4 md:mx-8"
      >
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
          <GraduationCap className="h-6 w-6 text-primary" /> ¡Hola, {user.name}!
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Este es tu espacio docente: gestioná alumnos, clases y asistencias.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-4 md:px-8">
        {opciones.map((op, i) => (
          <motion.div key={op.titulo} variants={fade} initial="hidden" animate="visible" custom={i}>
            <Card className="h-full hover:shadow-md border-border transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <op.icono className="h-5 w-5 text-primary" /> {op.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent>
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

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 px-2 sm:px-4 md:px-8"
      >
        {stats.map((item, i) => (
          <Card key={i} className="hover:shadow-md border-border transition-all">
            <CardContent className="flex items-center gap-3 py-5">
              <div className="p-3 bg-primary/10 rounded-full">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-lg font-semibold">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </AppLayout>
  )
}
