import { usePage, router } from "@inertiajs/react";
import { pageProps } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Index() {
  const { inscripciones } = usePage<pageProps>().props as any;

  const estadoBadge = (estado: string) => {
    const map: any = {
      pendiente: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
      confirmada: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
      rechazada: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    };
    return <Badge className={map[estado] || ""}>{estado}</Badge>;
  };

  const aprobar = (id: number) => {
    router.post(route("admin.inscripciones.aprobar", id));
  };

  const rechazar = (id: number) => {
    router.post(route("admin.inscripciones.rechazar", id));
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Inscripciones", href: route("administrativo.inscripciones.index") }]}>      
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          Gestión de Inscripciones
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Solicitudes de Inscripción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">Alumno</th>
                    <th className="px-4 py-2 text-left">Curso</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Origen</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {inscripciones.map((ins: any, i: number) => (
                    <motion.tr
                      key={ins.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b"
                    >
                      <td className="px-4 py-2">{ins.alumno?.nombre} {ins.alumno?.apellido}</td>
                      <td className="px-4 py-2">{ins.curso?.nombre}</td>
                      <td className="px-4 py-2">{estadoBadge(ins.estado)}</td>
                      <td className="px-4 py-2 capitalize">{ins.origen}</td>
                      <td className="px-4 py-2 flex gap-2">
                        {ins.estado === "pendiente" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-emerald-600 text-white"
                              onClick={() => aprobar(ins.id)}
                            >
                              <Check className="h-4 w-4 mr-1" /> Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rechazar(ins.id)}
                            >
                              <X className="h-4 w-4 mr-1" /> Rechazar
                            </Button>
                          </>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}