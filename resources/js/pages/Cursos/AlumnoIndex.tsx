import { Head, Link, router, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Curso, Inscripcion, pageProps } from "@/types"
import { motion } from "framer-motion"
import { BookOpen, CalendarDays, Users2, Clock, UserCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatFechaLocal } from "@/lib/utils"

export default function AlumnoIndex() {
  const { cursos } = usePage<pageProps>().props
  const list: Curso[] = Array.isArray(cursos) ? cursos : []

  const fade = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04 } }),
  }

  const estadoInscripcion = (curso: Curso): Inscripcion | undefined =>
    (curso.inscripciones || [])[0]

  const badgeModalidad = (m?: string) => {
    const cls: Record<string, string> = {
      Presencial: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      Virtual: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    }
    return <Badge className={`text-xs ${cls[m || "Presencial"] || ""}`}>{m}</Badge>
  }

  return (
    <AppLayout breadcrumbs={[{ title: "Cursos", href: route("alumno.cursos.index") }]}>
      <Head title="Cursos disponibles" />
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" /> Cursos disponibles
        </h1>

        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay cursos publicados por el momento.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((c, i) => {
              const mi = estadoInscripcion(c)
              return (
                <motion.div key={c.id} variants={fade} initial="hidden" animate="visible" custom={i}>
                  <Card className="h-full flex flex-col border border-border/40 shadow-sm hover:shadow-md transition">
                    <CardHeader className="border-b border-border/30">
                      <CardTitle className="flex items-center justify-between gap-2 text-base">
                        <span className="font-semibold">{c.nombre}</span>
                        {badgeModalidad(c.modalidad)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-4 text-sm text-muted-foreground flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span>
                          {c.fecha_inicio
                            ? `${formatFechaLocal(c.fecha_inicio)} — ${c.fecha_fin ? formatFechaLocal(c.fecha_fin) : "Sin definir"}`
                            : "Fechas no definidas"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users2 className="h-4 w-4 text-primary" />
                        <span>{c.inscripciones_count ?? 0} inscriptos</span>
                      </div>
                      {c.horarios && c.horarios.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>
                            {c.horarios[0]?.dia_en_texto || "Día no definido"}{" "}
                            {c.horarios[0]?.hora_inicio ? `— ${c.horarios[0].hora_inicio.slice(0, 5)} hs` : ""}
                          </span>
                        </div>
                      )}
                      <div className="mt-2">
                        {mi ? (
                          <Badge className="bg-primary/10 text-primary border border-primary/20">
                            <UserCheck className="h-4 w-4 mr-1" />
                            Estado: {mi.estado}
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                            No inscripto
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <div className="p-4 border-t border-border/30 flex justify-between">
                      {!mi && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => router.post(route("cursos.preinscribir", c.id))}
                        >
                          Preinscribirme
                        </Button>
                      )}

                      {mi?.estado === "pendiente" && (
                        <Button size="sm" variant="outline" disabled>
                          Pendiente
                        </Button>
                      )}

                      {mi?.estado === "rechazada" && (
                        <Button size="sm" variant="destructive" disabled>
                          Rechazada
                        </Button>
                      )}

                      <Button asChild size="sm">
                        <Link href={route("alumno.cursos.show", { curso: c.id, from: "disponibles" })}>
                          Ver curso
                        </Link>
                      </Button>

                    </div>

                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
