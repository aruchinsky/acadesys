import { Head, usePage, Link } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Curso, pageProps, Inscripcion, CursoHorario } from "@/types"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock,
  DollarSign,
  Users,
  UserCog,
} from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatFechaLocal, formatHoraLocal } from "@/lib/utils"

export default function Show() {
  const { curso } = usePage<pageProps>().props
  const data = curso as Curso

  const fade = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  }

  const getEstadoInscripcionBadge = (estado: string) => {
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

  // Calcula hora fin a partir de hora_inicio + duracion_min
  const horaFin = (h: CursoHorario): string => {
    if (!h.hora_inicio || !h.duracion_min) return "—"
    try {
      const [hh, mm] = h.hora_inicio.split(":").map(Number)
      const base = new Date(2000, 0, 1, hh || 0, mm || 0)
      base.setMinutes(base.getMinutes() + h.duracion_min)
      const hh2 = base.getHours().toString().padStart(2, "0")
      const mm2 = base.getMinutes().toString().padStart(2, "0")
      return formatHoraLocal(`${hh2}:${mm2}`)
    } catch {
      return "—"
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Cursos", href: route("cursos.index") },
        { title: data.nombre, href: "#" },
      ]}
    >
      <Head title={`Curso: ${data.nombre}`} />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 p-4"
      >
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
            <BookOpen className="h-6 w-6 text-primary" /> {data.nombre}
          </h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={route("cursos.index")}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Volver
              </Link>
            </Button>
            <Button asChild variant="default">
              <Link href={route("cursos.edit", data.id)}>Editar</Link>
            </Button>
          </div>
        </div>

        {/* DATOS GENERALES */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
              Información general
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Descripción</p>
              <p className="font-medium">{data.descripcion ?? "Sin descripción"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Modalidad</p>
              <Badge
                className={`${
                  data.modalidad === "Virtual"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                }`}
              >
                {data.modalidad}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inicio</p>
              <p className="font-medium">{formatFechaLocal(data.fecha_inicio ?? "")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Finalización</p>
              <p className="font-medium">{formatFechaLocal(data.fecha_fin ?? "")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Arancel Base</p>
              <p className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                {data.arancel_base
                  ? data.arancel_base.toLocaleString("es-AR", { style: "currency", currency: "ARS" })
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge variant={data.activo ? "default" : "secondary"}>
                {data.activo ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* DOCENTES */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCog className="h-5 w-5 text-primary" /> Profesores asignados
            </CardTitle>
          </CardHeader>
        <CardContent>
            {data.profesores && data.profesores.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.profesores.map((p, i) => (
                  <motion.li
                    key={p.id}
                    variants={fade}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className="flex items-center gap-2 border border-border/40 rounded-md px-3 py-2"
                  >
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{`${p.nombre} ${p.apellido}`}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No hay profesores asignados.</p>
            )}
          </CardContent>
        </Card>

        {/* HORARIOS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" /> Horarios del curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.horarios && data.horarios.length > 0 ? (
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">Día</th>
                    <th className="px-4 py-2 text-left">Inicio</th>
                    <th className="px-4 py-2 text-left">Fin</th>
                    <th className="px-4 py-2 text-left">Duración</th>
                    <th className="px-4 py-2 text-left">Sala</th>
                    <th className="px-4 py-2 text-left">Turno</th>
                  </tr>
                </thead>
                <tbody>
                  {data.horarios.map((h, i) => (
                    <motion.tr
                      key={h.id}
                      variants={fade}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="border-b hover:bg-accent/10 transition-colors"
                    >
                      <td className="px-4 py-2">{h.dia_en_texto ?? "—"}</td>
                      <td className="px-4 py-2">
                        {h.hora_inicio ? formatHoraLocal(h.hora_inicio) : "—"}
                      </td>
                      <td className="px-4 py-2">
                        {h.hora_inicio && h.duracion_min ? horaFin(h) : "—"}
                      </td>
                      <td className="px-4 py-2">{h.duracion_min ? `${h.duracion_min} min` : "—"}</td>
                      <td className="px-4 py-2">{h.sala ?? "—"}</td>
                      <td className="px-4 py-2">{h.turno ?? "—"}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground">No se registraron horarios.</p>
            )}
          </CardContent>
        </Card>

        {/* INSCRIPTOS */}
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
                    <th className="px-4 py-2 text-left">Fecha de inscripción</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Origen</th>
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
                      className="border-b hover:bg-accent/10 transition-colors"
                    >
                      <td className="px-4 py-2 font-medium">
                        {ins.usuario?.nombre_completo || "Sin datos"}
                      </td>
                      <td className="px-4 py-2">
                        {ins.fecha_inscripcion ? formatFechaLocal(ins.fecha_inscripcion) : "—"}
                      </td>
                      <td className="px-4 py-2">{getEstadoInscripcionBadge(ins.estado)}</td>
                      <td className="px-4 py-2 capitalize">{ins.origen}</td>
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
