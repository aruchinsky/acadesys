import { Head, usePage, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { pageProps, Pago } from "@/types"
import { motion } from "framer-motion"
import {
  CreditCard,
  Search,
  Trash2,
  AlertTriangle,
  DollarSign,
  ShieldCheck,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useMemo, useState } from "react"
import { Toast } from "@/components/toast-provider"

/* ------------------------------------------------------------
   FUNCIÓN ROBUSTA PARA FECHAS — evita "Invalid Date"
------------------------------------------------------------ */
function formatFechaLocal(fechaString: string) {
  if (!fechaString) return "—"

  // 1) intento normal
  let fecha = new Date(fechaString)

  // 2) si falla, crearla manualmente
  if (isNaN(fecha.getTime())) {
    const [fechaPart] = fechaString.split(" ")
    const [y, m, d] = fechaPart.split("-")
    fecha = new Date(Number(y), Number(m) - 1, Number(d))
  }

  // 3) fallback final
  if (isNaN(fecha.getTime())) return "Fecha inválida"

  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export default function AdminIndex() {
  const { pagos = [] } = usePage<pageProps>().props as pageProps & {
    pagos: Pago[]
  }

  const auth = usePage<pageProps>().props.auth
  const roles = auth?.roles ?? []
  const isAdminLike =
    roles.includes("administrativo") || roles.includes("superusuario")

  const [search, setSearch] = useState("")
  const [mostrarAnulados, setMostrarAnulados] = useState(false)
  const [motivos, setMotivos] = useState<Record<number, string>>({})

  const fade = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03 },
    }),
  }

  // FILTRO PRINCIPAL
  const filteredPagos = useMemo(() => {
    if (!search.trim()) return pagos

    const term = search.toLowerCase()
    return pagos.filter((p) => {
      const alumno = p.inscripcion?.usuario?.nombre_completo?.toLowerCase() ?? ""
      const curso = p.inscripcion?.curso?.nombre?.toLowerCase() ?? ""
      const metodo = p.metodo_pago?.toLowerCase() ?? ""

      return (
        alumno.includes(term) ||
        curso.includes(term) ||
        metodo.includes(term)
      )
    })
  }, [pagos, search])

  // TOTAL sin anulados
  const totalMonto = useMemo(() => {
    return filteredPagos
      .filter((p) => !p.anulado)
      .reduce((acc, p) => acc + Number(p.monto ?? 0), 0)
  }, [filteredPagos])

  const methodBadge = (metodo: string) => {
    const variants: Record<string, string> = {
      Efectivo: "bg-emerald-100 text-emerald-700",
      Transferencia: "bg-blue-100 text-blue-700",
      Tarjeta: "bg-purple-100 text-purple-700",
    }
    return (
      <Badge
        className={`text-xs ${
          variants[metodo] || "bg-slate-200 text-slate-700"
        }`}
      >
        {metodo}
      </Badge>
    )
  }

  return (
    <AppLayout
      breadcrumbs={[{ title: "Pagos", href: route("administrativo.pagos.index") }]}
    >
      <Head title="Gestión de pagos" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 flex flex-col gap-6"
      >
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
              <CreditCard className="h-6 w-6 text-primary" /> Gestión de pagos
            </h1>
            <p className="text-sm text-muted-foreground">
              Pagos registrados, filtrados y anulados.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* TOTAL */}
            <Card className="sm:w-64 border border-border/60 shadow-sm">
              <CardContent className="py-3 px-4">
                <span className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Total cobrado
                </span>
                <span className="text-lg font-bold">
                  {totalMonto.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </span>
              </CardContent>
            </Card>

            {/* BOTÓN GENERAR PAGO */}
            {isAdminLike && (
              <Button
                onClick={() =>
                  router.visit(route("administrativo.pagos.create"))
                }
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              >
                + Generar pago
              </Button>
            )}
          </div>
        </div>

        {/* FILTROS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              Buscar
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ej: Juan Pérez, Programación, transferencia…"
            />

            {/* SWITCH */}
            <div className="flex items-center gap-3 mt-4">
              <Switch
                checked={mostrarAnulados}
                onCheckedChange={setMostrarAnulados}
                id="mostrar-anulados"
              />
              <Label htmlFor="mostrar-anulados" className="cursor-pointer">
                Mostrar pagos anulados
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* TABLA */}
        <Card className="overflow-x-auto border border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Listado de pagos
            </CardTitle>
          </CardHeader>

          <CardContent>
            {filteredPagos.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                No hay pagos registrados.
              </p>
            ) : (
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Alumno</th>
                    <th className="px-4 py-2 text-left">Curso</th>
                    <th className="px-4 py-2 text-left">Monto</th>
                    <th className="px-4 py-2 text-left">Fecha</th>
                    <th className="px-4 py-2 text-left">Método</th>
                    <th className="px-4 py-2 text-left">Registrado por</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPagos
                    .filter((p) => (mostrarAnulados ? true : !p.anulado))
                    .map((pago, i) => (
                      <motion.tr
                        key={pago.id}
                        variants={fade}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                        className="border-b hover:bg-accent/10 transition-colors"
                      >
                        <td className="px-4 py-2">{pago.id}</td>

                        <td className="px-4 py-2">
                          {pago.inscripcion?.usuario?.nombre_completo ?? "—"}
                        </td>

                        <td className="px-4 py-2">
                          {pago.inscripcion?.curso?.nombre ?? "—"}
                        </td>

                        <td className="px-4 py-2 align-middle">
                          {pago.anulado ? (
                            <div className="flex flex-col">
                              <span className="line-through text-red-500/70 font-medium">
                                {Number(pago.monto).toLocaleString("es-AR", {
                                  style: "currency",
                                  currency: "ARS",
                                })}
                              </span>
                              {mostrarAnulados &&
                                pago.motivo_anulacion && (
                                  <span className="text-xs text-red-400 mt-1 italic">
                                    Motivo: {pago.motivo_anulacion}
                                  </span>
                                )}
                            </div>
                          ) : (
                            <span className="font-medium">
                              {Number(pago.monto).toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              })}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-2">
                          {formatFechaLocal(pago.pagado_at)}
                        </td>

                        <td className="px-4 py-2">
                          {methodBadge(pago.metodo_pago)}
                        </td>

                        <td className="px-4 py-2">
                          {pago.administrativo?.nombre_completo ?? "—"}
                        </td>

                        {/* ACCIONES */}
                        {isAdminLike && (
                          <td className="px-4 py-2 align-middle">
                            {pago.anulado ? (
                              <Badge className="bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                                ANULADO
                              </Badge>
                            ) : (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="flex items-center gap-1"
                                  >
                                    <Trash2 className="h-4 w-4" /> Anular
                                  </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                      <AlertTriangle className="h-5 w-5 text-red-500" />
                                      Anular pago
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Debes ingresar un{" "}
                                      <strong>motivo</strong> para anular este
                                      pago.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>

                                  <div className="mt-3">
                                    <textarea
                                      className="w-full p-2 text-sm border rounded-md bg-background"
                                      rows={3}
                                      placeholder="Ej: pago duplicado, error administrativo..."
                                      onChange={(e) =>
                                        setMotivos({
                                          ...motivos,
                                          [pago.id]: e.target.value,
                                        })
                                      }
                                    />
                                  </div>

                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>

                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => {
                                        const motivo = motivos[pago.id]
                                        if (
                                          !motivo ||
                                          motivo.trim().length < 5
                                        ) {
                                          return Toast.error(
                                            "Debes ingresar un motivo más detallado."
                                          )
                                        }

                                        router.post(
                                          route(
                                            "administrativo.pagos.anular",
                                            pago.id
                                          ),
                                          { motivo },
                                          { preserveScroll: true }
                                        )
                                      }}
                                    >
                                      Anular
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
    </AppLayout>
  )
}
