import { Head, usePage, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { pageProps, Inscripcion } from "@/types"
import { motion } from "framer-motion"
import {
  UserPlus,
  Search,
  Check,
  X,
  Layers,
  AlertTriangle,
} from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { useMemo, useState } from "react"

export default function AdminInscripciones() {
  const { inscripciones = [] } = usePage<pageProps>().props as pageProps & {
    inscripciones: Inscripcion[]
  }

  const [search, setSearch] = useState("")
  const [mostrarPendientes, setMostrarPendientes] = useState(true)

  const fade = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03 },
    }),
  }

  // BADGES DEL ESTADO
  const estadoBadge = (estado: string) => {
    const variants: Record<string, string> = {
      pendiente:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
      confirmada:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
      rechazada:
        "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    }
    return (
      <Badge className={`text-xs ${variants[estado] || ""}`}>{estado}</Badge>
    )
  }

  // FILTRO PRINCIPAL
  const filtered = useMemo(() => {
    let data = inscripciones

    if (mostrarPendientes) {
      data = data.filter((i) => i.estado === "pendiente")
    }

    if (search.trim().length > 0) {
      const term = search.toLowerCase()
      data = data.filter(
        (i) =>
          i.usuario?.nombre_completo?.toLowerCase().includes(term) ||
          i.curso?.nombre?.toLowerCase().includes(term) ||
          i.estado.toLowerCase().includes(term)
      )
    }

    return data
  }, [inscripciones, search, mostrarPendientes])

  const aprobar = (id: number) => {
    router.post(route("admin.inscripciones.aprobar", id))
  }

  const rechazar = (id: number) => {
    router.post(route("admin.inscripciones.rechazar", id))
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Inscripciones", href: route("administrativo.inscripciones.index") },
      ]}
    >
      <Head title="Gestión de Inscripciones" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 flex flex-col gap-6"
      >
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
              <UserPlus className="h-6 w-6 text-primary" /> Gestión de Inscripciones
            </h1>
            <p className="text-sm text-muted-foreground">
              Aprobación, rechazo y revisión de solicitudes de inscripción.
            </p>
          </div>
        </div>

        {/* FILTROS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" /> Buscar inscripciones
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ej: Juan Pérez, Programación, pendiente…"
            />

            <div className="flex items-center gap-3 mt-4">
              <Switch
                checked={mostrarPendientes}
                onCheckedChange={setMostrarPendientes}
                id="mostrar-pendientes"
              />
              <Label htmlFor="mostrar-pendientes" className="cursor-pointer">
                Mostrar solo pendientes
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* TABLA */}
        <Card className="overflow-x-auto border border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="h-5 w-5 text-primary" />
              Listado de inscripciones
            </CardTitle>
          </CardHeader>

          <CardContent>
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                No hay inscripciones que coincidan con el filtro.
              </p>
            ) : (
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">Alumno</th>
                    <th className="px-4 py-2 text-left">Curso</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Origen</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((ins, i) => (
                    <motion.tr
                      key={ins.id}
                      variants={fade}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="border-b hover:bg-accent/10 transition-colors"
                    >
                      <td className="px-4 py-2 font-medium">
                        {ins.usuario?.nombre_completo ?? "—"}
                      </td>

                      <td className="px-4 py-2">
                        {ins.curso?.nombre ?? "—"}
                      </td>

                      <td className="px-4 py-2">
                        {estadoBadge(ins.estado)}
                      </td>

                      <td className="px-4 py-2 capitalize">{ins.origen}</td>

                      <td className="px-4 py-2 flex gap-2">
                        {ins.estado === "pendiente" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-emerald-600 text-white hover:bg-emerald-700"
                              onClick={() => aprobar(ins.id)}
                            >
                              <Check className="h-4 w-4 mr-1" /> Aprobar
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rechazar(ins.id)}
                            >
                              <X className="h-4 w-4 mr-1" /> Rechazar
                            </Button>
                          </>
                        )}

                        {ins.estado !== "pendiente" && (
                          <Badge className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300">
                            Ya procesada
                          </Badge>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  )
}
