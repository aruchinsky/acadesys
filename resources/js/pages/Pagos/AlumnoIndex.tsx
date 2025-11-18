import { Head, usePage, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { pageProps, Pago } from "@/types"
import { motion } from "framer-motion"
import {
  CreditCard,
  Search,
  Trash2,
  AlertTriangle,
  User2,
  BookOpen,
  CalendarDays,
  DollarSign,
  ShieldCheck,
} from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useMemo, useState } from "react"

function formatFechaLocal(fechaString: string) {
  if (!fechaString) return "—"

  // 1) Intento directo estándar (compatible con la mayoría de navegadores)
  let fecha = new Date(fechaString)

  // 2) Si falla → crearla manualmente
  if (isNaN(fecha.getTime())) {
    const [fechaPart] = fechaString.split(" ")
    const [y, m, d] = fechaPart.split("-")

    fecha = new Date(Number(y), Number(m) - 1, Number(d))
  }

  // 3) Si sigue fallando → fallback de emergencia
  if (isNaN(fecha.getTime())) {
    return "Fecha inválida"
  }

  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}


export default function AlumnoIndex() {
  const { pagos = [], auth } = usePage<pageProps>().props as pageProps & {
    pagos: Pago[]
  }

  const roles = auth?.roles ?? []
  const isAdminLike = roles.includes("administrativo") || roles.includes("superusuario")
  const isAlumno = roles.includes("alumno") && !isAdminLike

  const [search, setSearch] = useState("")

  const fade = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03 },
    }),
  }

  // FILTRADO
  const filteredPagos = useMemo(() => {
    if (!search.trim()) return pagos

    const term = search.toLowerCase()

    return pagos.filter((p) => {
      const curso = p.inscripcion?.curso?.nombre?.toLowerCase() ?? ""
      const metodo = p.metodo_pago?.toLowerCase() ?? ""
      const fecha = formatFechaLocal(p.pagado_at)?.toLowerCase() ?? ""

      return curso.includes(term) || metodo.includes(term) || fecha.includes(term)
    })
  }, [pagos, search])

  // TOTAL — solo pagos NO anulados
  const totalMonto = useMemo(() => {
    return filteredPagos
      .filter((p) => !p.anulado)
      .reduce((acc, p) => acc + Number(p.monto ?? 0), 0)
  }, [filteredPagos])

  const handleDelete = (id: number) => {
    router.delete(route("administrativo.pagos.destroy", id))
  }

  const methodBadge = (metodo: string) => {
    let classes =
      "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200"

    if (metodo === "Efectivo")
      classes = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
    if (metodo === "Transferencia")
      classes = "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
    if (metodo === "Tarjeta")
      classes = "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"

    return <Badge className={`text-xs ${classes}`}>{metodo}</Badge>
  }

  const breadcrumbs = [
    {
      title: isAlumno ? "Mis pagos" : "Pagos",
      href: isAlumno ? route("alumno.pagos.index") : route("administrativo.pagos.index"),
    },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isAlumno ? "Mis pagos" : "Gestión de pagos"} />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 flex flex-col gap-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
              <CreditCard className="h-6 w-6 text-primary" />
              {isAlumno ? "Mis pagos" : "Gestión de pagos"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isAlumno
                ? "Aquí podés consultar los pagos registrados de tus cursos."
                : "Listado general filtrable."}
            </p>
          </div>

          <Card className="sm:w-64 border border-border/60 shadow-sm">
            <CardContent className="py-3 px-4 flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {isAlumno ? "Total abonado" : "Total cobrado"}
              </span>
              <span className="text-lg font-semibold">
                {totalMonto.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* FILTROS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              Filtros rápidos
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  isAlumno
                    ? "Buscar por curso, método o fecha…"
                    : "Buscar por alumno, curso o método…"
                }
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* TABLA */}
        <Card className="border border-border/40 shadow-sm overflow-x-auto">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              {isAlumno ? "Detalle de mis pagos" : "Listado de pagos registrados"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {filteredPagos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {search
                  ? "No se encontraron pagos que coincidan con la búsqueda."
                  : "Todavía no hay pagos registrados."}
              </p>
            ) : (
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    {!isAlumno && <th className="px-4 py-2 text-left">Alumno</th>}
                    <th className="px-4 py-2 text-left">Curso</th>
                    <th className="px-4 py-2 text-left">Monto</th>
                    <th className="px-4 py-2 text-left">Fecha</th>
                    <th className="px-4 py-2 text-left">Método / Estado</th>
                    {!isAlumno && <th className="px-4 py-2 text-left">Registrado por</th>}
                    {isAdminLike && <th className="px-4 py-2 text-left">Acciones</th>}
                  </tr>
                </thead>

                <tbody>
                  {filteredPagos.map((pago, i) => (
                    <motion.tr
                      key={pago.id}
                      variants={fade}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="border-b hover:bg-accent/10 transition-colors"
                    >
                      <td className="px-4 py-2">{pago.id}</td>

                      {!isAlumno && (
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <User2 className="h-4 w-4 text-muted-foreground" />
                            {pago.inscripcion?.usuario?.nombre_completo ?? "—"}
                          </div>
                        </td>
                      )}

                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          {pago.inscripcion?.curso?.nombre ?? "—"}
                        </div>
                      </td>

                      <td className="px-4 py-2">
                        {pago.anulado ? (
                          <span className="line-through text-red-500/70">
                            {pago.monto.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                          </span>
                        ) : (
                          <span className="font-medium">
                            {pago.monto.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          {formatFechaLocal(pago.pagado_at)}
                        </div>
                      </td>

                      <td className="px-4 py-2">
                        {pago.anulado ? (
                          <Badge className="bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                            ANULADO
                          </Badge>
                        ) : (
                          methodBadge(pago.metodo_pago)
                        )}
                      </td>

                      {!isAlumno && (
                        <td className="px-4 py-2">
                          {pago.administrativo?.nombre_completo ?? "—"}
                        </td>
                      )}

                      {isAdminLike && (
                        <td className="px-4 py-2">
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
                                  Eliminar pago
                                </AlertDialogTitle>

                                <AlertDialogDescription>
                                  ¿Seguro que deseas eliminar este pago?
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(pago.id)}
                                  className="bg-destructive"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      )}
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
