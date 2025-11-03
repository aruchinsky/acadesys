import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Curso, pageProps } from "@/types"
import { motion } from "framer-motion"
import { BookOpen, CalendarDays, Users2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatFechaLocal } from "@/lib/utils"

export default function ProfesorIndex() {
  const { cursos } = usePage<pageProps>().props
  const cursosList: Curso[] = Array.isArray(cursos) ? cursos : []

  const fade = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  }

  const getModalidadBadge = (modalidad?: string) => {
    const colors: Record<string, string> = {
      Presencial: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      Virtual: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    }
    return (
      <Badge className={`text-xs px-2 py-0.5 rounded-md ${colors[modalidad || "Presencial"] || ""}`}>
        {modalidad}
      </Badge>
    )
  }

  return (
    <AppLayout breadcrumbs={[{ title: "Mis Cursos", href: route("profesor.cursos.index") }]}>
      <Head title="Mis Cursos" />

      <div className="p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
          <BookOpen className="h-6 w-6 text-primary" /> Mis Cursos Asignados
        </h1>

        {cursosList.length === 0 ? (
          <p className="text-muted-foreground text-sm mt-4">
            No tienes cursos asignados actualmente.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cursosList.map((curso, i) => (
              <motion.div
                key={curso.id}
                variants={fade}
                initial="hidden"
                animate="visible"
                custom={i}
              >
                <Card className="border border-border/40 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between h-full rounded-2xl overflow-hidden">
                  {/* CABECERA */}
                  <CardHeader className="bg-muted/50 border-b border-border/30 pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold text-foreground leading-tight">
                        {curso.nombre}
                      </CardTitle>
                      {getModalidadBadge(curso.modalidad)}
                    </div>
                  </CardHeader>

                  {/* CONTENIDO */}
                  <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground py-4 px-5 flex-grow">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary shrink-0" />
                      <span>
                        {curso.fecha_inicio
                          ? `${formatFechaLocal(curso.fecha_inicio)} — ${
                              curso.fecha_fin
                                ? formatFechaLocal(curso.fecha_fin)
                                : "Sin definir"
                            }`
                          : "Fechas no definidas"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users2 className="h-4 w-4 text-primary shrink-0" />
                      <span>
                        {curso.inscripciones_count ?? 0}{" "}
                        {curso.inscripciones_count === 1 ? "inscripto" : "inscriptos"}
                      </span>
                    </div>

                    {curso.horarios && curso.horarios.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary shrink-0" />
                        <span>
                          {curso.horarios[0].dia_en_texto ?? "Día no definido"}{" "}
                          {curso.horarios[0].hora_inicio
                            ? `— ${curso.horarios[0].hora_inicio.slice(0, 5)} hs`
                            : ""}
                        </span>
                      </div>
                    )}
                  </CardContent>

                  {/* BOTÓN */}
                  <div className="p-4 border-t border-border/30 flex justify-end bg-muted/30">
                    <Button asChild variant="default" size="sm" className="rounded-md">
                      <Link href={route("profesor.cursos.show", curso.id)}>Ver curso</Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
