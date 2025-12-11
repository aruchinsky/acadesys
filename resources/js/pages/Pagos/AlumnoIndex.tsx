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
  PlusCircle,
  FileText,
} from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

import { useMemo, useState } from "react"
import { Toast } from "@/components/toast-provider"

function formatFechaLocal(fechaString: string) {
  if (!fechaString) return "—"

  let fecha = new Date(fechaString)

  if (isNaN(fecha.getTime())) {
    const [fechaPart] = fechaString.split(" ")
    const [y, m, d] = fechaPart.split("-")
    fecha = new Date(Number(y), Number(m) - 1, Number(d))
  }

  if (isNaN(fecha.getTime())) return "Fecha inválida"

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
  const isAdminLike =
    roles.includes("administrativo") || roles.includes("superusuario")
  const isAlumno = roles.includes("alumno") && !isAdminLike

  const [search, setSearch] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const abrirComprobante = (ruta?: string | null) => {
    if (!ruta) {
      return Toast.error("No hay comprobante disponible.")
    }

    setPreviewUrl(`/storage/${ruta}`)
    setOpenModal(true)
  }

  const fade = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03 },
    }),
  }

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

  const totalMonto = useMemo(() => {
    return filteredPagos
      .filter((p) => !p.anulado)
      .reduce((acc, p) => acc + Number(p.monto ?? 0), 0)
  }, [filteredPagos])

  const methodBadge = (metodo: string) => {
    let classes =
      "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200"

    if (metodo === "Efectivo")
      classes =
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
    if (metodo === "Transferencia")
      classes =
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
    if (metodo === "Tarjeta")
      classes =
        "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
    if (metodo === "MercadoPago")
      classes =
        "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300"

    return <Badge className={`text-xs ${classes}`}>{metodo}</Badge>
  }

  const breadcrumbs = [
    {
      title: isAlumno ? "Mis pagos" : "Pagos",
      href: isAlumno
        ? route("alumno.pagos.index")
        : route("administrativo.pagos.index"),
    },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isAlumno ? "Mis pagos" : "Gestión de pagos"} />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 flex flex-col gap-6"
      >
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
                : "Listado general filtrable de pagos registrados."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Card className="sm:w-64 border border-border/60 shadow-sm">
              <CardContent className="py-3 px-4 flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {isAlumno ? "Total abonado" : "Total cobrado"}
                </span>
                <span className="text-lg font-semibold">
                  {totalMonto.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </span>
              </CardContent>
            </Card>

            {isAlumno && (
              <Button
                onClick={() => router.visit(route("alumno.pagos.create"))}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Realizar pago
              </Button>
            )}
          </div>
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
                    {!isAlumno && (
                      <th className="px-4 py-2 text-left">Alumno</th>
                    )}
                    <th className="px-4 py-2 text-left">Curso</th>
                    <th className="px-4 py-2 text-left">Monto</th>
                    <th className="px-4 py-2 text-left">Fecha</th>
                    <th className="px-4 py-2 text-left">Método</th>

                    {/* ✔️ NUEVO: comprobante del alumno */}
                    {isAlumno && (
                      <th className="px-4 py-2 text-left">Comprobante subido</th>
                    )}

                    {/* ✔️ NUEVO: comprobante del sistema */}
                    {isAlumno && (
                      <th className="px-4 py-2 text-left">Comprobante PDF</th>
                    )}

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
                            {pago.monto.toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            })}
                          </span>
                        ) : (
                          <span className="font-medium">
                            {pago.monto.toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            })}
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

                      {/* ✔️ comprobante subido por alumno */}
                      {isAlumno && (
                        <td className="px-4 py-2">
                          {!pago.anulado && pago.comprobante ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => abrirComprobante(pago.comprobante)}
                              className="flex items-center gap-2"
                            >
                              Ver comprobante
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </td>
                      )}

                      {/* ✔️ PDF generado por el sistema */}
                      {isAlumno && (
                        <td className="px-4 py-2">
                          {!pago.anulado ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(
                                  route("pagos.comprobante", pago.id),
                                  "_blank"
                                )
                              }
                              className="flex items-center gap-2"
                            >
                              <FileText className="h-4 w-4" />
                              PDF
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
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

{/* MODAL COMPROBANTE — ALUMNO */}
<AlertDialog open={openModal} onOpenChange={setOpenModal}>
  <AlertDialogContent
    className="
      w-[70vw]          /* ancho centrado */
      max-w-4xl         /* límite elegante */
      h-[90vh]          /* alto grande */
      max-h-none
      flex 
      flex-col 
      p-4
    "
  >
    <AlertDialogHeader>
      <AlertDialogTitle>Comprobante del pago</AlertDialogTitle>
      <AlertDialogDescription>
        Vista previa del comprobante cargado.
      </AlertDialogDescription>
    </AlertDialogHeader>

    {/* CONTENEDOR DEL COMPROBANTE */}
    <div className="
      flex-1
      flex
      items-center
      justify-center
      bg-background 
      rounded-lg 
      overflow-hidden
    ">
      {previewUrl && previewUrl.endsWith(".pdf") ? (
        <iframe
          src={previewUrl ?? ""}
          className="w-full h-full object-contain"
          style={{ border: "none" }}
        />
      ) : (
        <img
          src={previewUrl ?? ""}
          className="max-h-full max-w-full object-contain rounded-md"
        />
      )}
    </div>

    <AlertDialogFooter className="mt-4">
      <AlertDialogCancel
        onClick={() => setOpenModal(false)}
        className="w-full sm:w-auto"
      >
        Cerrar
      </AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </AppLayout>
  )
}
