import { Head, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { pageProps, Inscripcion, Asistencia } from "@/types"
import { motion } from "framer-motion"
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  BookOpen,
  Circle,
} from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function AlumnoAsistencia() {
  const { inscripciones = [] } = usePage<pageProps>().props as {
    inscripciones: Inscripcion[]
  }

  const fade = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07, duration: 0.4 },
    }),
  }

    const formatFecha = (fecha: any) => {
        if (!fecha) return "—"

        // Caso 1: viene como string "2025-11-10"
        if (typeof fecha === "string") {
            const d = new Date(fecha.replace(/-/g, "/"))
            return !isNaN(d.getTime())
            ? d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
            : "—"
        }

        // Caso 2: viene como objeto de Laravel cast
        if (typeof fecha === "object" && fecha.date) {
            const d = new Date(fecha.date.replace(/-/g, "/"))
            return !isNaN(d.getTime())
            ? d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
            : "—"
        }

        return "—"
    }




  return (
    <AppLayout
      breadcrumbs={[{ title: "Mis asistencias", href: route("alumno.asistencias.index") }]}
    >
      <Head title="Mis asistencias" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 flex flex-col gap-6"
      >
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          <CalendarDays className="h-7 w-7 text-primary" />
          Mis asistencias
        </h1>

        <p className="text-muted-foreground text-sm mb-4">
          Aquí podés consultar tu asistencia registrada en cada curso en el que estás inscripto.
        </p>

        {/* LISTADO DE CURSOS */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {inscripciones.map((insc, i) => {
            const total = insc.asistencias?.length ?? 0
            const presentes = insc.asistencias?.filter(a => a.presente).length ?? 0
            const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 0

            return (
              <motion.div key={insc.id} variants={fade} initial="hidden" animate="visible" custom={i}>
                <Card className="border border-border shadow-sm h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {insc.curso?.nombre}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4">

                    {/* PROGRESO VISUAL */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20">
                        <svg className="w-full h-full">
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                            fill="none"
                          />
                          <motion.circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="#16a34a"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={2 * Math.PI * 32}
                            strokeDashoffset={(2 * Math.PI * 32) * (1 - porcentaje / 100)}
                            initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                            animate={{ strokeDashoffset: (2 * Math.PI * 32) * (1 - porcentaje / 100) }}
                            transition={{ duration: 1 }}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-semibold text-sm">
                          {porcentaje}%
                        </span>
                      </div>

                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium">{presentes} presentes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="font-medium">{total - presentes} ausentes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Circle className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{total} clases</span>
                        </div>
                      </div>
                    </div>

                    {/* TABLA MODERNA */}
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                          <tr>
                            <th className="px-3 py-2 text-left">Fecha</th>
                            <th className="px-3 py-2 text-left">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {insc.asistencias?.map((a: Asistencia) => (
                            <tr key={a.id} className="border-t">
                              <td className="px-3 py-2">{formatFecha(a.fecha)}</td>
                              <td className="px-3 py-2">
                                {a.presente ? (
                                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4" /> Presente
                                  </span>
                                ) : (
                                  <span className="text-red-600 font-medium flex items-center gap-1">
                                    <XCircle className="h-4 w-4" /> Ausente
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </AppLayout>
  )
}
