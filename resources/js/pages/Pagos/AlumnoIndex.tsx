import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { motion } from "framer-motion"
import { CreditCard } from "lucide-react"

export default function AlumnoIndex({ mensaje }: { mensaje?: string }) {
  return (
    <AppLayout
      breadcrumbs={[
        { title: "Pagos", href: route("alumno.pagos.index") },
      ]}
    >
      <Head title="Pagos del Alumno" />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-4"
      >
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
          <CreditCard className="h-6 w-6 text-primary" /> Pagos y Cuotas
        </h1>
        <p className="text-muted-foreground text-sm">
          {mensaje ?? "Aquí podrás consultar tus pagos, cuotas y comprobantes cuando el módulo esté disponible."}
        </p>
      </motion.div>
    </AppLayout>
  )
}
