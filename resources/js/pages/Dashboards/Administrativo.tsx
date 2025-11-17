import { Head, Link, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, ClipboardList, Users, BookOpen, Sparkles } from "lucide-react"

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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 px-2 sm:px-4 md:px-8">
        {opciones.map((op, i) => (
          <motion.div key={op.titulo} variants={fade} initial="hidden" animate="visible" custom={i}>
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
                  {/* SOLO PARA GESTIÓN DE PAGOS */}
                {op.titulo === "Gestión de Pagos" && (
                  <Button
                    size="sm"
                    variant={"secondary"}
                    className="w-full"
                    onClick={() => router.visit(route("administrativo.pagos.create"))}
                  >
                    + Generar Pago
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  )
}
