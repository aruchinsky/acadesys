import { Head, usePage, Link } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Curso } from "@/types"
import { motion } from "framer-motion"
import {
  CalendarDays,
  UserCheck,
  XCircle,
  CheckCircle2,
  NotebookText,
  ArrowLeft,
  Info,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useMemo } from "react"
import { formatFechaLocal } from "@/lib/utils"

export default function AsistenciasHistorial() {
    const props = usePage().props as any;
    const curso: Curso = props.curso;
    const fechas: string[] = props.fechas ?? [];
    const rol: string = props.rol ?? "profesor"; // fallback seguro


  const [selectedAlumno, setSelectedAlumno] = useState<any | null>(null)

  // ---------------------------------------
  // 🔥 BREADCRUMBS DINÁMICOS SEGÚN EL ROL
  // ---------------------------------------
  const breadcrumbs = useMemo(() => {
    switch (rol) {
      case "profesor":
        return [
          { title: "Mis Cursos", href: route("profesor.cursos.index") },
          { title: curso.nombre, href: route("profesor.cursos.show", curso.id) },
          { title: "Historial de Asistencias", href: "#" },
        ]
      case "administrativo":
        return [
          { title: "Asistencias", href: route("administrativo.asistencias.index") },
          { title: curso.nombre, href: "#" },
          { title: "Historial", href: "#" },
        ]
      case "superusuario":
        return [
          { title: "Panel Superusuario", href: route("dashboard") },
          { title: curso.nombre, href: "#" },
          { title: "Historial", href: "#" },
        ]
      default:
        return [{ title: "Historial", href: "#" }]
    }
  }, [rol, curso])

  const backUrl = useMemo(() => {
    switch (rol) {
      case "profesor":
        return route("profesor.cursos.show", curso.id)
      case "administrativo":
        return route("administrativo.asistencias.index")
      case "superusuario":
        return route("superusuario.asistencias.index")
      default:
        return route("dashboard")
    }
  }, [rol, curso])

  const fade = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.02 },
    }),
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Historial de Asistencias - ${curso.nombre}`} />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 flex flex-col gap-6"
      >
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
            <CalendarDays className="h-6 w-6 text-primary" /> Historial de Asistencias
          </h1>

          <Button asChild variant="outline" size="sm">
            <Link href={backUrl}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Volver
            </Link>
          </Button>
        </div>

        {/* INFO DEL CURSO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <NotebookText className="h-5 w-5 text-primary" /> {curso.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex flex-wrap gap-6">
            <p><strong>Modalidad:</strong> {curso.modalidad}</p>
            <p><strong>Duración:</strong> {formatFechaLocal(curso.fecha_inicio ?? "")} — {formatFechaLocal(curso.fecha_fin ?? "")}</p>
            <p><strong>Inscriptos:</strong> {curso.inscripciones?.length ?? 0}</p>
          </CardContent>
        </Card>
        {/* TABLA DE HISTORIAL */}
        <Card className="overflow-x-auto border border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" /> Asistencia por fecha
            </CardTitle>
          </CardHeader>
          <CardContent>
            {curso.inscripciones && curso.inscripciones.length > 0 ? (
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                      {/* ALUMNO HEADER (sticky) */}
                      <th
                        className="px-4 py-2 text-left bg-muted sticky left-0 z-40 border-r border-border/40 whitespace-nowrap"
                        style={{ position: "sticky", left: 0 }}
                      >
                        Alumno
                      </th>

                      {/* DNI HEADER (sticky) */}
                      <th
                        className="px-4 py-2 text-left bg-muted sticky left-[160px] z-40 border-r border-border/40 whitespace-nowrap"
                        style={{ position: "sticky", left: "160px" }}
                      >
                        DNI
                      </th>

                    {fechas.map((f) => (
                      <th key={f} className="px-2 py-2 text-center min-w-[90px]">
                        {formatFechaLocal(f)}
                      </th>
                    ))}
                    {/* NUEVA COLUMNA TOTAL */}
                    <th className="px-4 py-2 text-center">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {curso.inscripciones.map((ins, i) => (
                    <motion.tr
                      key={ins.id}
                      variants={fade}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="border-b hover:bg-accent/10 transition-colors"
                    >
                        {/* ALUMNO (sticky) */}
                        <td
                          className="px-4 py-2 font-medium bg-background sticky left-0 z-30 border-r border-border/40 whitespace-nowrap"
                          style={{ position: "sticky", left: 0 }}
                        >
                          {ins.usuario?.nombre_completo}
                        </td>

                        {/* DNI (sticky) */}
                        <td
                          className="px-4 py-2 bg-background sticky left-[160px] z-20 border-r border-border/40 whitespace-nowrap"
                          style={{ position: "sticky", left: "160px" }}
                        >
                          {ins.usuario?.dni}
                        </td>


                      {fechas.map((f) => {
                        const asistencia = ins.asistencias?.find((a: any) => a.fecha === f)
                        const presente = asistencia?.presente
                        const observacion = asistencia?.observacion

                        return (
                          <td key={f} className="px-2 py-1 text-center">
                            {asistencia ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={`flex justify-center items-center cursor-pointer ${
                                        presente ? "text-green-500" : "text-red-500"
                                      }`}
                                      onClick={() =>
                                        setSelectedAlumno({
                                          alumno: ins.usuario,
                                          asistencia,
                                          fecha: f,
                                        })
                                      }
                                    >
                                      {presente ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                      ) : (
                                        <XCircle className="h-4 w-4" />
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  {observacion && (
                                    <TooltipContent side="top">
                                      <p>{observacion}</p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </td>
                        )
                      })}

                      {/* TOTAL POR ALUMNO */}
                      <td className="px-4 py-2 font-semibold text-center">
                        {(() => {
                          const totalPresentes = fechas.filter((f) =>
                            ins.asistencias?.some((a: any) => a.fecha === f && a.presente)
                          ).length

                          const totalFechas = fechas.length
                          const porcentaje =
                            totalFechas > 0
                              ? Math.round((totalPresentes / totalFechas) * 100)
                              : 0

                          return `${totalPresentes}/${totalFechas} (${porcentaje}%)`
                        })()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>

                {/* TOTALES POR FECHA */}
                <tfoot>
                  <tr className="bg-accent/20 font-semibold">
                    <td className="px-4 py-2">Totales</td>
                    <td className="px-4 py-2">—</td>

                    {fechas.map((f) => {
                      const total = (curso.inscripciones ?? []).filter((ins: any) =>
                        ins.asistencias?.some((a: any) => a.fecha === f && a.presente)
                      ).length

                      return (
                        <td key={f} className="px-2 py-2 text-center text-primary font-bold">
                          {total}
                        </td>
                      )
                    })}

                    <td className="px-4 py-2 text-center">—</td>
                  </tr>
                </tfoot>

              </table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay alumnos registrados para este curso.
              </p>
            )}
          </CardContent>
        </Card>

        {/* MODAL DETALLE DE ALUMNO */}
        <Dialog open={!!selectedAlumno} onOpenChange={() => setSelectedAlumno(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Detalle de asistencia
              </DialogTitle>
            </DialogHeader>
            {selectedAlumno && (
              <div className="space-y-3 text-sm text-foreground">
                <p>
                  <strong>Alumno:</strong> {selectedAlumno.alumno?.nombre_completo}
                </p>
                <p>
                  <strong>Fecha:</strong> {formatFechaLocal(selectedAlumno.fecha)}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <Badge
                    className={`${
                      selectedAlumno.asistencia.presente
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedAlumno.asistencia.presente ? "Presente" : "Ausente"}
                  </Badge>
                </p>
                {selectedAlumno.asistencia.observacion && (
                  <p>
                    <strong>Observación:</strong> {selectedAlumno.asistencia.observacion}
                  </p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </AppLayout>
  )
}
