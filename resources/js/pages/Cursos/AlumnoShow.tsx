import { Head, Link, usePage, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Curso, Inscripcion, Asistencia, pageProps } from "@/types"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, CalendarDays, Clock, MapPin, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatFechaLocal, formatHoraLocal } from "@/lib/utils"

export default function AlumnoShow() {
  const { curso, miInscripcion } = usePage<pageProps>().props as unknown as {
    curso: Curso
    miInscripcion?: Inscripcion
  }

  const fade = {
    hidden: { opacity: 0, y: 14 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04 } }),
  }

  const asistencias: Asistencia[] = miInscripcion?.asistencias || []
  const presentes = asistencias.filter(a => a.presente).length
  const pct = asistencias.length ? Math.round((presentes / asistencias.length) * 100) : 0

  const params = new URLSearchParams(window.location.search)
  const origen = params.get("from")

    // Determinar ruta de regreso
    const rutaVolver =
    origen === "disponibles"
        ? route("alumno.cursos.index")
        : route("alumno.mis-cursos.index")


  return (
    <AppLayout
      breadcrumbs={[
        { title: "Mis Cursos", href: route("alumno.mis-cursos.index") },
        { title: curso.nombre, href: "#" },
      ]}
    >
      <Head title={`Curso: ${curso.nombre}`} />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> {curso.nombre}
          </h1>
            <Button asChild variant="outline" size="sm">
            <Link href={rutaVolver}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Volver
            </Link>
            </Button>
                    {/* BOTÓN DE PREINSCRIPCIÓN */}
        <div className="flex justify-end">
          {!miInscripcion && (
            <Button
              onClick={() => router.post(route("cursos.preinscribir", curso.id))}
              className="bg-primary text-white"
            >
              Preinscribirme a este curso
            </Button>
          )}

          {miInscripcion?.estado === "pendiente" && (
            <Button disabled variant="secondary">
              Inscripción pendiente de aprobación
            </Button>
          )}

          {miInscripcion?.estado === "rechazada" && (
            <Button variant="destructive" disabled>
              Inscripción rechazada
            </Button>
          )}
        </div>
        </div>




        {/* Info general */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-primary" /> Información del curso
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Modalidad</p>
              <Badge className={`mt-1 ${curso.modalidad === "Virtual"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"}`}>
                {curso.modalidad}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Fecha de inicio</p>
              <p className="font-medium">{formatFechaLocal(curso.fecha_inicio ?? "")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fecha de fin</p>
              <p className="font-medium">{formatFechaLocal(curso.fecha_fin ?? "")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Profesores</p>
              <p className="font-medium">
                {curso.profesores?.length
                  ? curso.profesores.map(p => `${p.nombre} ${p.apellido}`).join(" · ")
                  : "A asignar"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Estado de inscripción</p>
              <p className="font-medium">{miInscripcion ? miInscripcion.estado : "No inscripto"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Mi asistencia</p>
              <p className="font-medium">{pct}% ({presentes}/{asistencias.length})</p>
            </div>
          </CardContent>
        </Card>

        {/* Horarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" /> Horarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            {curso.horarios?.length ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {curso.horarios.map((h, i) => (
                  <motion.div
                    key={h.id}
                    variants={fade}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className="border border-border/40 rounded-md p-3 flex flex-col gap-1 hover:bg-accent/10"
                  >
                    <span className="font-medium">{h.dia_en_texto || "Día no definido"}</span>
                    <span className="text-sm text-muted-foreground">
                      {h.hora_inicio ? `${formatHoraLocal(h.hora_inicio)} (${h.duracion_min} min)` : "Horario no definido"}
                    </span>
                    {h.sala && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" /> {h.sala}
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

        {/* Historial de asistencias (mío) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" /> Mi historial de asistencias
            </CardTitle>
          </CardHeader>
          <CardContent>
            {asistencias.length ? (
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">Fecha</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {asistencias
                    .slice()
                    .sort((a, b) => a.fecha.localeCompare(b.fecha)) // asc
                    .map((a, i) => (
                      <motion.tr key={a.id} variants={fade} initial="hidden" animate="visible" custom={i} className="border-b">
                        <td className="px-4 py-2">{formatFechaLocal(a.fecha)}</td>
                        <td className="px-4 py-2">
                          {a.presente ? (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Presente</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Ausente</Badge>
                          )}
                        </td>
                        <td className="px-4 py-2">{a.observacion ?? "—"}</td>
                      </motion.tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground">Todavía no hay registros de asistencia.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  )
}
