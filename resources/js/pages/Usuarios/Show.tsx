import { Head, Link, router, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import {
  pageProps,
  User,
  Inscripcion,
  Pago,
  BreadcrumbItem,
} from "@/types"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  CreditCard,
  User2,
  AlertTriangle,
} from "lucide-react"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatFechaLocal } from "@/lib/utils"

interface Props {
  usuario: User & {
    inscripciones: Inscripcion[]
    pagos: Pago[]
  }
}

export default function Show() {
  const { usuario } = usePage<pageProps & Props>().props
  const [openDelete, setOpenDelete] = useState(false)

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Usuarios", href: route("usuarios.index") },
    { title: usuario.name, href: route("usuarios.show", usuario.id) },
  ]

  const fade = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  }

  const handleConfirmDelete = () => {
    setOpenDelete(false)
    router.delete(route("usuarios.destroy", usuario.id))
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Usuario - ${usuario.name}`} />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 p-4"
      >
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href={route("usuarios.index")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={route("usuarios.edit", usuario.id)}>
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() => setOpenDelete(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
            </Button>
          </div>
        </div>

        {/* INFORMACIÓN PERSONAL */}
        <motion.div variants={fade} initial="hidden" animate="visible" custom={0}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <User2 className="h-5 w-5" /> Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre completo</p>
                <p className="font-medium">
                  {usuario.name ||
                    usuario.nombre_completo ||
                    `${usuario.nombre ?? ""} ${usuario.apellido ?? ""}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">DNI</p>
                <p className="font-medium">{usuario.dni ?? "—"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p>{usuario.email}</p>
              </div>
              {usuario.telefono && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p>{usuario.telefono}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p>Registrado el {formatFechaLocal(usuario.created_at)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* INSCRIPCIONES */}
        <motion.div variants={fade} initial="hidden" animate="visible" custom={1}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <BookOpen className="h-5 w-5" /> Inscripciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usuario.inscripciones?.length ? (
                <div className="space-y-3">
                  {usuario.inscripciones.map((i) => (
                    <div
                      key={i.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {i.curso?.nombre ?? "Curso sin nombre"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Inscripto: {formatFechaLocal(i.fecha_inscripcion)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          i.estado === "confirmada"
                            ? "bg-green-100 text-green-700"
                            : i.estado === "pendiente"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {i.estado}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Sin inscripciones registradas.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* PAGOS */}
        <motion.div variants={fade} initial="hidden" animate="visible" custom={2}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <CreditCard className="h-5 w-5" /> Historial de Pagos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usuario.pagos?.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-muted-foreground">
                          Fecha
                        </th>
                        <th className="px-4 py-2 text-left text-muted-foreground">
                          Monto
                        </th>
                        <th className="px-4 py-2 text-left text-muted-foreground">
                          Método
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuario.pagos.map((p) => {
                        const montoNumber =
                          typeof p.monto === "number"
                            ? p.monto
                            : Number(p.monto ?? 0)

                        return (
                          <tr
                            key={p.id}
                            className="border-b hover:bg-accent/10"
                          >
                            <td className="px-4 py-2">
                              {formatFechaLocal(p.pagado_at)}
                            </td>
                            <td className="px-4 py-2">
                              {isNaN(montoNumber)
                                ? p.monto
                                : `$${montoNumber.toFixed(2)}`}
                            </td>
                            <td className="px-4 py-2">
                              {p.metodo_pago ?? "—"}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No hay pagos registrados.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* 🔴 MODAL ELIMINAR */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Eliminar usuario
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará permanentemente al usuario{" "}
              <strong>{usuario.name}</strong> y sus relaciones principales.
              ¿Seguro que deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
