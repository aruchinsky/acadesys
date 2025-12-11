import { Head, Link, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Wallet,
  ClipboardList,
  Users,
  BookOpen,
  Sparkles,
  PlusCircle,
} from "lucide-react"

export default function Administrativo() {
  const fade = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.3 },
    }),
  }

  const opciones = [
    { titulo: "Gestión de Pagos", icono: Wallet, href: route("administrativo.pagos.index") },
    { titulo: "Inscripciones", icono: ClipboardList, href: route("inscripciones.index") },
    { titulo: "Alumnos", icono: Users, href: route("usuarios.index") },
    { titulo: "Cursos", icono: BookOpen, href: route("cursos.index") },
  ]

  return (
    <AppLayout>
      <Head title="Dashboard Administrativo" />

      {/* HEADER PRINCIPAL */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-border shadow-sm p-6 bg-gradient-to-r from-primary/10 via-background to-secondary/10 mx-2 sm:mx-4 md:mx-8"
      >
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> Panel Administrativo
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acceso rápido a módulos de gestión económica y académica.
        </p>
      </motion.div>

      {/* 🚀 ACCIONES RÁPIDAS */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mx-2 sm:mx-4 md:mx-8 mt-6"
      >
        <Card className="border border-primary/40 shadow-md bg-primary/5 hover:bg-primary/10 transition-all">
          <CardContent className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-primary flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                Acción rápida
              </h2>
              <p className="text-sm text-muted-foreground">
                Generar un nuevo pago presencial para un alumno.
              </p>
            </div>

            <Button
              onClick={() => router.visit(route("administrativo.pagos.create"))}
              className="bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-full"
            >
              <PlusCircle className="h-4 w-4" />
              Generar Pago
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* GRID DE OPCIONES */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 px-2 sm:px-4 md:px-8">
        {opciones.map((op, i) => (
          <motion.div
            key={op.titulo}
            variants={fade}
            initial="hidden"
            animate="visible"
            custom={i}
          >
            <Card className="hover:shadow-md transition-all border-border">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <op.icono className="h-5 w-5 text-primary" /> {op.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild size="sm" className="w-full mt-1">
                  <Link href={op.href}>Ingresar</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  )
}
