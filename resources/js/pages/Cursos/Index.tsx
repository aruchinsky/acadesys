import { Head, Link, router, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Curso, pageProps } from "@/types"
import { motion } from "framer-motion"
import {
  Search,
  BookOpen,
  Layers,
  Users2,
  Trash2,
  AlertTriangle,
  Pencil,
  Plus,
} from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { useMemo, useState } from "react"
import { formatFechaLocal } from "@/lib/utils"

export default function AdminCursosIndex() {
  const { cursos = [] } = usePage<pageProps>().props as pageProps & {
    cursos: Curso[]
  }

  const [search, setSearch] = useState("")
  const [soloActivos, setSoloActivos] = useState(false)

  const fade = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03 },
    }),
  }

  // BADGES
  const modalidadBadge = (modalidad?: string) => {
    const colors: Record<string, string> = {
      Presencial: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      Virtual:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    }
    return (
      <Badge className={`text-xs ${colors[modalidad ?? "Presencial"]}`}>
        {modalidad}
      </Badge>
    )
  }

  const estadoBadge = (activo: boolean) => (
    <Badge
      className={`text-xs ${
        activo
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
      }`}
    >
      {activo ? "Activo" : "Inactivo"}
    </Badge>
  )

  // FILTROS
  const filteredCursos = useMemo(() => {
    let data = cursos

    if (soloActivos) {
      data = data.filter((c) => c.activo)
    }

    if (search.trim().length > 0) {
      const term = search.toLowerCase()

      data = data.filter(
        (c) =>
          c.nombre.toLowerCase().includes(term) ||
          c.modalidad.toLowerCase().includes(term) ||
          String(c.arancel_base).includes(term)
      )
    }

    return data
  }, [search, soloActivos, cursos])

  const deleteCurso = (id: number) => {
    router.delete(route("cursos.destroy", id))
  }

  return (
    <AppLayout breadcrumbs={[{ title: "Cursos", href: route("cursos.index") }]}>
      <Head title="Gestión de Cursos" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 flex flex-col gap-6"
      >
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
              <BookOpen className="h-6 w-6 text-primary" /> Gestión de Cursos
            </h1>
            <p className="text-sm text-muted-foreground">
              Administración completa de los cursos activos e inactivos.
            </p>
          </div>

          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow"
          >
            <Link href={route("cursos.create")}>
              <Plus className="h-4 w-4 mr-1" /> Nuevo curso
            </Link>
          </Button>
        </div>

        {/* FILTROS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" /> Buscar cursos
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ej: programación, presencial, 15000…"
            />

            <div className="flex items-center gap-3 mt-4">
              <Switch
                checked={soloActivos}
                onCheckedChange={setSoloActivos}
                id="solo-activos"
              />
              <Label htmlFor="solo-activos" className="cursor-pointer">
                Mostrar solo activos
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* TABLA */}
        <Card className="overflow-x-auto border border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="h-5 w-5 text-primary" />
              Listado de cursos
            </CardTitle>
          </CardHeader>

          <CardContent>
            {filteredCursos.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                No hay cursos que coincidan con la búsqueda.
              </p>
            ) : (
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Nombre</th>
                    <th className="px-4 py-2 text-left">Modalidad</th>
                    <th className="px-4 py-2 text-left">Fechas</th>
                    <th className="px-4 py-2 text-left">Arancel</th>
                    <th className="px-4 py-2 text-left">Inscriptos</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCursos.map((curso, i) => (
                    <motion.tr
                      key={curso.id}
                      variants={fade}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="border-b hover:bg-accent/10 transition-colors"
                    >
                      <td className="px-4 py-2">{curso.id}</td>

                      <td className="px-4 py-2 font-medium">
                        <Link
                          href={route("cursos.show", curso.id)}
                          className="text-primary hover:underline"
                        >
                          {curso.nombre}
                        </Link>
                      </td>

                      <td className="px-4 py-2">
                        {modalidadBadge(curso.modalidad)}
                      </td>

                      <td className="px-4 py-2">
                        {curso.fecha_inicio
                          ? `${formatFechaLocal(curso.fecha_inicio)} — ${
                              curso.fecha_fin
                                ? formatFechaLocal(curso.fecha_fin)
                                : "Sin definir"
                            }`
                          : "No establecidas"}
                      </td>

                      <td className="px-4 py-2">
                        {curso.arancel_base
                          ? `$${curso.arancel_base.toLocaleString("es-AR")}`
                          : "—"}
                      </td>

                      <td className="px-4 py-2 flex items-center gap-1">
                        <Users2 className="h-4 w-4 text-muted-foreground" />
                        {curso.inscripciones_count ?? 0}
                      </td>

                      <td className="px-4 py-2">
                        {estadoBadge(curso.activo)}
                      </td>

                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          {/* Editar */}
                          <Button asChild size="sm" variant="outline">
                            <Link href={route("cursos.edit", curso.id)}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>

                          {/* Eliminar */}
                          {curso.inscripciones_count > 0 ? (
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled
                              className="opacity-50 cursor-not-allowed"
                              title="Este curso no puede eliminarse porque tiene alumnos inscriptos."
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    Confirmar eliminación
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    ¿Seguro que deseas eliminar el curso{" "}
                                    <strong>{curso.nombre}</strong>?  
                                    Esta acción no se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => deleteCurso(curso.id)}
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
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
