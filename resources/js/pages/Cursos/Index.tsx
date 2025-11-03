import { Head, Link, router, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Curso, pageProps, BreadcrumbItem } from "@/types"
import { motion } from "framer-motion"
import {
  Plus,
  BookOpen,
  DollarSign,
  Pencil,
  Trash2,
  AlertTriangle,
  Users2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { formatFechaLocal } from "@/lib/utils"

const breadcrumbs: BreadcrumbItem[] = [{ title: "Cursos", href: route("cursos.index") }]

export default function Index() {
  const { cursos } = usePage<pageProps>().props
  const cursosList: Curso[] = Array.isArray(cursos) ? cursos : []

  const fade = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03 },
    }),
  }

  const deleteCurso = (id: number) => {
    router.delete(route("cursos.destroy", id))
  }

  const getEstadoBadge = (activo: boolean) => (
    <Badge variant={activo ? "default" : "secondary"} className="text-xs">
      {activo ? "Activo" : "Inactivo"}
    </Badge>
  )

  const getModalidadBadge = (modalidad?: string) => {
    const colors: Record<string, string> = {
      Presencial: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      Virtual: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    }
    return (
      <Badge className={`text-xs ${colors[modalidad || "Presencial"] || ""}`}>
        {modalidad}
      </Badge>
    )
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Cursos" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 p-4"
      >
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
            <BookOpen className="h-6 w-6 text-primary" /> Gestión de Cursos
          </h1>
          <Button asChild variant="default">
            <Link href={route("cursos.create")}>
              <Plus className="h-4 w-4 mr-1" /> Nuevo
            </Link>
          </Button>
        </div>

        {/* TABLA DE CURSOS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Lista de cursos
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
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
                {cursosList.length > 0 ? (
                  cursosList.map((curso, i) => (
                    <motion.tr
                      key={curso.id}
                      variants={fade}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="border-b hover:bg-accent/10 transition-colors"
                    >
                      {/* ID */}
                      <td className="px-4 py-2">{curso.id}</td>

                      {/* NOMBRE → Show */}
                      <td className="px-4 py-2 font-medium">
                        <Link
                          href={route("cursos.show", curso.id)}
                          className="text-primary hover:underline"
                        >
                          {curso.nombre}
                        </Link>
                      </td>

                      {/* MODALIDAD */}
                      <td className="px-4 py-2">{getModalidadBadge(curso.modalidad)}</td>

                      {/* FECHAS */}
                      <td className="px-4 py-2">
                        {curso.fecha_inicio
                          ? `${formatFechaLocal(curso.fecha_inicio)} — ${
                              curso.fecha_fin
                                ? formatFechaLocal(curso.fecha_fin)
                                : "Sin definir"
                            }`
                          : "No establecidas"}
                      </td>

                      {/* ARANCEL */}
                      <td className="px-4 py-2">
                        {curso.arancel_base
                          ? `$${curso.arancel_base.toLocaleString("es-AR")}`
                          : "—"}
                      </td>

                      {/* INSCRIPTOS */}
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center gap-1">
                          <Users2 className="h-4 w-4 text-muted-foreground" />
                          {curso.inscripciones_count ?? 0}
                        </span>
                      </td>

                      {/* ESTADO */}
                      <td className="px-4 py-2">{getEstadoBadge(curso.activo)}</td>

                      {/* ACCIONES */}
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          {/* Editar */}
                          <Button asChild size="sm" variant="outline">
                            <Link href={route("cursos.edit", curso.id)}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>

                          {/* Eliminar */}
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
                                  <strong>{curso.nombre}</strong>? Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteCurso(curso.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-muted-foreground">
                      No hay cursos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  )
}
