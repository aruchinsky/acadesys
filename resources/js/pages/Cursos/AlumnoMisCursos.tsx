import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Curso, Inscripcion, pageProps } from "@/types"
import { motion } from "framer-motion"
import { BookOpen, CheckCircle2, Users2, CalendarDays, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatFechaLocal } from "@/lib/utils"

export default function AlumnoMisCursos() {
  const { cursos } = usePage<pageProps>().props
  const list: Curso[] = Array.isArray(cursos) ? cursos : []

  const fade = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04 } }),
  }

  const miInscripcion = (c: Curso): Inscripcion | undefined => (c.inscripciones || [])[0]

  const porcentajeAsistencia = (ins?: Inscripcion) => {
    const total = ins?.asistencias?.length ?? 0
    if (!total) return 0
    const presentes = ins!.asistencias!.filter(a => a.presente).length
    return Math.round((presentes / total) * 100)
  }

  return (
    <AppLayout breadcrumbs={[{ title: "Mis Cursos", href: route("alumno.mis-cursos.index") }]}>
      <Head title="Mis cursos" />
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" /> Mis cursos
        </h1>

        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no estás inscripto en ningún curso.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((c, i) => {
              const ins = miInscripcion(c)
              const pct = porcentajeAsistencia(ins)
              return (
                <motion.div key={c.id} variants={fade} initial="hidden" animate="visible" custom={i}>
                  <Card className="h-full flex flex-col border border-border/40 shadow-sm hover:shadow-md transition">
                    <CardHeader className="border-b border-border/30">
                      <CardTitle className="text-base font-semibold">{c.nombre}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-4 text-sm text-muted-foreground space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span>
                          {c.fecha_inicio
                            ? `${formatFechaLocal(c.fecha_inicio)} — ${c.fecha_fin ? formatFechaLocal(c.fecha_fin) : "Sin definir"}`
                            : "Fechas no definidas"}
                        </span>
                      </div>
                      {c.horarios && c.horarios.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>
                            {c.horarios[0]?.dia_en_texto || "Día no definido"}
                            {c.horarios[0]?.hora_inicio ? ` — ${c.horarios[0].hora_inicio.slice(0,5)} hs` : ""}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users2 className="h-4 w-4 text-primary" />
                        <span>{c.inscripciones_count ?? 0} inscriptos</span>
                      </div>

                      <div className="pt-2">
                        <Badge className="bg-primary/10 text-primary border border-primary/20">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Asistencia: {pct}%
                        </Badge>
                      </div>
                    </CardContent>
                    <div className="p-4 border-t border-border/30 flex justify-end">
                      <Button asChild size="sm">
                        <Link href={route("alumno.cursos.show", c.id)}>Ver curso</Link>
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
