import { Head, useForm, usePage, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { pageProps, Curso } from "@/types"
import { motion } from "framer-motion"
import {
  UserCheck,
  Save,
  Users,
  NotebookText,
  CalendarDays,
  History,
} from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link } from "@inertiajs/react"

export default function SuperusuarioAsistencia() {
  const { cursos, fechaHoy } = usePage<pageProps>().props
  const cursosList: Curso[] = Array.isArray(cursos) ? cursos : []

  const [cursoSeleccionado, setCursoSeleccionado] = useState<number | null>(null)
  const [fecha, setFecha] = useState<string>(fechaHoy as string)
  const [asistencias, setAsistencias] = useState<
    Record<number, { presente: boolean; observacion: string }>
  >({})

  const { processing } = useForm({})

  const cursoActual = cursosList.find((c) => c.id === cursoSeleccionado)

  const toggleAsistencia = (userId: number) => {
    setAsistencias((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        presente: !prev[userId]?.presente,
        observacion: prev[userId]?.observacion || "",
      },
    }))
  }

  const handleObservacionChange = (userId: number, value: string) => {
    setAsistencias((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        observacion: value,
        presente: prev[userId]?.presente ?? false,
      },
    }))
  }

  const handleGuardar = () => {
    if (!cursoSeleccionado) return

    router.post(
      route("superusuario.asistencias.store"),
      {
        curso_id: cursoSeleccionado,
        fecha,
        asistencias,
      },
      {
        preserveState: true,
        onSuccess: () => {
          router.visit(route("dashboard"))
        },
      }
    )
  }

  const fade = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03 },
    }),
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Panel Superusuario", href: route("dashboard") },
        { title: "Asistencias", href: route("superusuario.asistencias.index") },
      ]}
    >
      <Head title="Registrar Asistencias (Superusuario)" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 flex flex-col gap-6"
      >
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
    <UserCheck className="h-6 w-6 text-primary" /> Registro de Asistencias (Superusuario)
  </h1>

  <div className="flex flex-col sm:flex-row gap-2">

    {/* BOTÓN GUARDAR */}
    <Button
      onClick={handleGuardar}
      disabled={!cursoSeleccionado || processing}
      className="gap-2"
    >
      <Save className="h-4 w-4" /> Guardar Asistencia
    </Button>

    {/* BOTÓN HISTORIAL */}
    <Button
      asChild
      variant="secondary"
      disabled={!cursoSeleccionado}
      className="gap-2 px-4 py-2 text-sm"
    >
      <Link
        href={
          cursoSeleccionado
            ? route("superusuario.asistencias.historial", { curso: cursoSeleccionado })
            : "#"
        }
      >
        <History className="h-4 w-4" /> Ver historial
      </Link>
    </Button>

    {/* BOTÓN VOLVER */}
    <Button asChild variant="outline" className="gap-2">
      <Link href={route("dashboard")}>
        <Users className="h-4 w-4" /> Volver al panel
      </Link>
    </Button>

  </div>
</div>


        {/* FILTROS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <NotebookText className="h-5 w-5 text-primary" /> Selección de curso
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col flex-1 gap-1">
              <Label>Curso</Label>
              <Select
                value={cursoSeleccionado?.toString() || ""}
                onValueChange={(v) => setCursoSeleccionado(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar curso..." />
                </SelectTrigger>
                <SelectContent>
                  {cursosList.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1 w-full sm:w-48">
              <Label>Fecha</Label>
              <Input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* TABLA */}
        {cursoActual ? (
          <Card className="shadow-sm border border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarDays className="h-5 w-5 text-primary" /> {cursoActual.nombre}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {fecha} — {cursoActual.inscripciones?.length ?? 0} alumnos inscriptos
              </p>
            </CardHeader>

            <CardContent>
              {cursoActual.inscripciones && cursoActual.inscripciones.length > 0 ? (
                <table className="min-w-full table-auto text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 text-left">Alumno</th>
                      <th className="px-4 py-2 text-left">DNI</th>
                      <th className="px-4 py-2 text-center">Presente</th>
                      <th className="px-4 py-2 text-left">Observación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cursoActual.inscripciones.map((ins, i) => (
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
                        <td className="px-4 py-2">{ins.usuario?.dni || "—"}</td>
                        <td className="px-4 py-2 text-center">
                          <Checkbox
                            checked={!!asistencias[ins.user_id]?.presente}
                            onCheckedChange={() => toggleAsistencia(ins.user_id)}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <Input
                            type="text"
                            placeholder="Observación..."
                            value={asistencias[ins.user_id]?.observacion || ""}
                            onChange={(e) =>
                              handleObservacionChange(ins.user_id, e.target.value)
                            }
                            className="text-sm"
                          />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No hay alumnos inscriptos en este curso.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <p className="text-muted-foreground text-sm italic">
            Seleccioná un curso para comenzar a registrar asistencias.
          </p>
        )}
      </motion.div>
    </AppLayout>
  )
}
