import { Head, router, useForm, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { pageProps, Role, BreadcrumbItem } from "@/types"
import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Loader2,
  UserPlus,
  Shield,
  AlertTriangle,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Usuarios", href: route("usuarios.index") },
  { title: "Crear Usuario", href: route("usuarios.create") },
]

export default function Create() {
  const { roles } = usePage<pageProps>().props
  const [showConfirm, setShowConfirm] = useState(false)

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    nombre: "",
    apellido: "",
    email: "",
    dni: "",
    telefono: "",
    password: "",
    password_confirmation: "",
    role: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route("usuarios.store"))
  }

  // Detectar si el formulario tiene datos escritos
  const isFormDirty = Object.values(data).some((val) => val.trim() !== "")

  const handleCancel = () => {
    if (isFormDirty) setShowConfirm(true)
    else router.visit(route("usuarios.index"))
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Usuario" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6 p-4"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
        </div>

        {/* FORMULARIO */}
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <UserPlus className="h-5 w-5 text-primary" /> Crear Nuevo Usuario
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* DATOS PERSONALES */}
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                  Datos personales
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={data.nombre}
                      onChange={(e) => setData("nombre", e.target.value)}
                    />
                    {errors.nombre && (
                      <p className="text-sm text-destructive">{errors.nombre}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      value={data.apellido}
                      onChange={(e) => setData("apellido", e.target.value)}
                    />
                    {errors.apellido && (
                      <p className="text-sm text-destructive">{errors.apellido}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dni">DNI</Label>
                    <Input
                      id="dni"
                      value={data.dni}
                      onChange={(e) => setData("dni", e.target.value)}
                    />
                    {errors.dni && (
                      <p className="text-sm text-destructive">{errors.dni}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={data.telefono}
                      onChange={(e) => setData("telefono", e.target.value)}
                      placeholder="Opcional"
                    />
                    {errors.telefono && (
                      <p className="text-sm text-destructive">
                        {errors.telefono}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* INFORMACIÓN DE LA CUENTA */}
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                  Información de la cuenta
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre de usuario</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* CONTRASEÑA */}
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                  Contraseña
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={(e) => setData("password", e.target.value)}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password_confirmation">
                      Confirmar contraseña
                    </Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      value={data.password_confirmation}
                      onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* ROL */}
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Rol de usuario
                </h3>

                <div className="grid sm:grid-cols-2 gap-2">
                  {(roles as Role[]).map((r) => (
                    <label
                      key={r.id}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r.name}
                        checked={data.role === r.name}
                        onChange={() => setData("role", r.name)}
                      />
                      {r.name}
                    </label>
                  ))}
                </div>

                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role}</p>
                )}
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>

                <Button type="submit" disabled={processing}>
                  {processing && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  Crear Usuario
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* MODAL DE CONFIRMACIÓN */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Cancelar creación
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Seguro que deseas cancelar? Los datos ingresados se perderán.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirm(false)}>
              Continuar editando
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => router.visit(route("usuarios.index"))}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
