import { Head, Link, router, useForm, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { pageProps, Role, UserWithRoles, BreadcrumbItem } from "@/types"
import { motion } from "framer-motion"
import {
  Pencil,
  Trash2,
  ShieldCheck,
  Plus,
  UserCog,
  Users,
  AlertTriangle,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const breadcrumbs: BreadcrumbItem[] = [{ title: "Usuarios", href: route("usuarios.index") }]

export default function Index() {
  const { users, roles } = usePage<pageProps>().props
  const usersList: UserWithRoles[] = Array.isArray(users) ? users : []
  const roleItems: Role[] = roles as Role[]

  const initialRoles: Record<number, string> = {}
  usersList.forEach((u) => (initialRoles[u.id] = u.roles?.[0]?.name || ""))

  const { data, setData, put, processing } = useForm<{ roles: Record<number, string> }>({
    roles: initialRoles,
  })

  const handleChange = (userId: number, role: string) =>
    setData("roles", { ...data.roles, [userId]: role })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(route("usuarios.roles.update"), { preserveScroll: true })
  }

  const fade = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03 },
    }),
  }

  const deleteUser = (id: number) => {
    router.delete(route("usuarios.destroy", id))
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Usuarios" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 p-4"
      >
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
            <Users className="h-6 w-6 text-primary" /> Gestión de Usuarios
          </h1>
          <div className="flex gap-2">
            <Button asChild variant="default">
              <Link href={route("usuarios.create")}>
                <Plus className="h-4 w-4 mr-1" /> Nuevo
              </Link>
            </Button>
            <Button
              variant="secondary"
              onClick={handleSubmit}
              disabled={processing}
            >
              <ShieldCheck className="h-4 w-4 mr-1" /> Guardar roles
            </Button>
          </div>
        </div>

        {/* TABLA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" /> Lista de usuarios
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <form onSubmit={handleSubmit}>
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Nombre</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">DNI</th>
                    <th className="px-4 py-2 text-left">Rol</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.length > 0 ? (
                    usersList.map((user, i) => (
                      <motion.tr
                        key={user.id}
                        variants={fade}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                        className="border-b hover:bg-accent/10"
                      >
                        <td className="px-4 py-2">{user.id}</td>
                        <td className="px-4 py-2">
                          <Link
                            href={route("usuarios.show", user.id)}
                            className="text-primary hover:underline"
                          >
                            {user.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">{user.dni}</td>
                        <td className="px-4 py-2">
                          <Select
                            value={data.roles[user.id]}
                            onValueChange={(v) => handleChange(user.id, v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              {roleItems.map((r) => (
                                <SelectItem key={r.name} value={r.name}>
                                  {r.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                            >
                              <Link href={route("usuarios.edit", user.id)}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>

                            {/* 🧩 ALERT DIALOG para eliminación moderna */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    Confirmar eliminación
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    ¿Seguro que deseas eliminar al usuario{" "}
                                    <strong>{user.name}</strong>? Esta acción no se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteUser(user.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-6 text-center text-muted-foreground"
                      >
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  )
}
