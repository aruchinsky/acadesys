import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Curso, pageProps } from "@/types"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  History,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatFechaLocal, formatHoraLocal } from "@/lib/utils"

export default function ProfesorShow() {
  const { curso } = (usePage<pageProps>().props as unknown) as { curso: Curso }
  const data = curso

  const fade = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  }

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, string> = {
      confirmada: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
      pendiente: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      rechazada: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    }
    return (
      <Badge className={`text-xs ${variants[estado] || "bg-gray-100 text-gray-600"}`}>
        {estado}
      </Badge>
    )
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Mis Cursos", href: route("profesor.cursos.index") },
        { title: data.nombre, href: "#" },
      ]}
    >
      <Head title={`Curso: ${data.nombre}`} />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 p-6"
      >
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
            <BookOpen className="h-6 w-6 text-primary" /> {data.nombre}
          </h1>

          <div className="flex flex-wrap gap-2 justify-end">
            <Button asChild variant="outline" size="sm">
              <Link href={route("profesor.cursos.index")}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Volver
              </Link>
            </Button>

            <Button asChild variant="default" size="sm">
              <Link href={route("profesor.asistencias.index", { curso_id: data.id })}>
                <CheckCircle2 className="h-4 w-4 mr-1" /> Gestionar asistencia
              </Link>
            </Button>

            <Button asChild variant="secondary" size="sm">
              <Link href={route("profesor.asistencias.historial", { curso: data.id })}>
                <History className="h-4 w-4 mr-1" /> Ver historial
              </Link>
            </Button>
          </div>

        </div>

        {/* INFORMACIÓN GENERAL */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-primary" /> Información del curso
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Modalidad</p>
              <Badge
                className={`mt-1 ${
                  data.modalidad === "Virtual"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                }`}
              >
                {data.modalidad}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Fecha de inicio</p>
              <p className="font-medium">{formatFechaLocal(data.fecha_inicio ?? "")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fecha de fin</p>
              <p className="font-medium">{formatFechaLocal(data.fecha_fin ?? "")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Alumnos inscriptos</p>
              <p className="font-medium">{data.inscripciones?.length ?? 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Arancel base</p>
              <p className="font-medium">
                {data.arancel_base
                  ? data.arancel_base.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* HORARIOS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" /> Horarios de dictado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.horarios && data.horarios.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.horarios.map((h, i) => (
                  <motion.div
                    key={h.id}
                    variants={fade}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className="border border-border/40 rounded-md p-3 flex flex-col gap-1 hover:bg-accent/10"
                  >
                    <span className="font-medium">{h.dia_en_texto ?? "Día no definido"}</span>
                    <span className="text-sm text-muted-foreground">
                      {h.hora_inicio
                        ? `${formatHoraLocal(h.hora_inicio)} (${h.duracion_min} min)`
                        : "Horario no definido"}
                    </span>
                    {h.sala && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" /> {h.sala}
                      </span>
                    )}
                    {h.turno && (
                      <span className="text-xs text-primary/80 font-medium">
                        Turno: {h.turno}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay horarios registrados.</p>
            )}
          </CardContent>
        </Card>

        {/* ALUMNOS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" /> Alumnos inscriptos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.inscripciones && data.inscripciones.length > 0 ? (
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">Alumno</th>
                    <th className="px-4 py-2 text-left">DNI</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.inscripciones.map((ins, i) => (
                    <motion.tr
                      key={ins.id}
                      variants={fade}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="border-b hover:bg-accent/10"
                    >
                      <td className="px-4 py-2 font-medium">
                        {ins.usuario?.nombre_completo || "Sin datos"}
                      </td>
                      <td className="px-4 py-2">{ins.usuario?.dni || "—"}</td>
                      <td className="px-4 py-2">{getEstadoBadge(ins.estado)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground">No hay alumnos inscriptos.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  )
}
