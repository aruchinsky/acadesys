import AppLayout from '@/layouts/app-layout';
import { pageProps, Role, UserWithRoles } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertTriangle, Pencil, Plus, Search, ShieldCheck, Trash2, UserCog, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
} from '@/components/ui/alert-dialog';

import { useMemo, useState } from 'react';

export default function UsuariosIndex() {
    const { users, roles } = usePage<pageProps>().props;

    const usersList: UserWithRoles[] = useMemo(() => (Array.isArray(users) ? users : []), [users]);
    const roleItems: Role[] = roles as Role[];

    const [search, setSearch] = useState('');
    const [soloAdministrativos, setSoloAdministrativos] = useState(false);

    // MAPEAR ROL ACTIVO DE CADA USUARIO
    const initialRoles: Record<number, string> = {};
    usersList.forEach((u) => (initialRoles[u.id] = u.roles?.[0]?.name || ''));

    const { data, setData, put, processing } = useForm<{ roles: Record<number, string> }>({
        roles: initialRoles,
    });

    const handleRoleChange = (userId: number, role: string) => setData('roles', { ...data.roles, [userId]: role });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('usuarios.roles.update'), { preserveScroll: true });
    };

    const fade = {
        hidden: { opacity: 0, y: 12 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.03 },
        }),
    };

    const deleteUser = (id: number) => router.delete(route('usuarios.destroy', id));

    const filteredUsers = useMemo(() => {
        let data = usersList;

        if (soloAdministrativos) {
            data = data.filter((u) => u.roles?.some((r) => ['administrativo', 'superusuario'].includes(r.name)));
        }

        if (search.trim()) {
            const term = search.toLowerCase();

            data = data.filter(
                (u) =>
                    u.name.toLowerCase().includes(term) ||
                    u.email.toLowerCase().includes(term) ||
                    u.dni.toLowerCase().includes(term) ||
                    u.roles?.[0]?.name.toLowerCase().includes(term),
            );
        }

        return data;
    }, [search, soloAdministrativos, usersList]);

    const roleBadge = (role?: string) => {
        const colors: Record<string, string> = {
            superusuario: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
            administrativo: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
            profesor: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
            alumno: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        };

        return <Badge className={`text-xs ${colors[role || 'alumno']}`}>{role}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Usuarios', href: route('usuarios.index') }]}>
            <Head title="Usuarios" />

            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 p-4">
                {/* HEADER */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-semibold">
                            <Users className="h-6 w-6 text-primary" />
                            Gestión de Usuarios
                        </h1>
                        <p className="text-sm text-muted-foreground">Administración completa de cuentas, roles y accesos.</p>
                    </div>

                    {/* BOTONES */}
                    <div className="flex items-center gap-2">
                        <Button asChild variant="default">
                            <Link href={route('usuarios.create')}>
                                <Plus className="mr-1 h-4 w-4" /> Nuevo usuario
                            </Link>
                        </Button>

                        {/* 🔥 Botón dentro del FORM */}
                        <form onSubmit={handleSubmit}>
                            <Button type="submit" variant="secondary" disabled={processing}>
                                <ShieldCheck className="mr-1 h-4 w-4" /> Guardar roles
                            </Button>
                        </form>
                    </div>
                </div>

                {/* FILTROS */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <Search className="h-4 w-4 text-primary" /> Buscar usuarios
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ej: Juan Pérez, profesor, administrativo…" />

                        <div className="mt-4 flex items-center gap-3">
                            <Switch checked={soloAdministrativos} onCheckedChange={setSoloAdministrativos} id="solo-admin" />
                            <Label htmlFor="solo-admin" className="cursor-pointer">
                                Mostrar solo administrativos / superusuarios
                            </Label>
                        </div>
                    </CardContent>
                </Card>

                {/* TABLA */}
                <Card className="overflow-x-auto border border-border/40 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <UserCog className="h-5 w-5 text-primary" /> Lista de usuarios
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            {filteredUsers.length === 0 ? (
                                <p className="py-4 text-center text-sm text-muted-foreground">No hay usuarios que coincidan con la búsqueda.</p>
                            ) : (
                                <table className="min-w-full table-auto text-sm">
                                    <thead className="bg-muted text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-2 text-left">ID</th>
                                            <th className="px-4 py-2 text-left">Nombre</th>
                                            <th className="px-4 py-2 text-left">Email</th>
                                            <th className="px-4 py-2 text-left">DNI</th>
                                            <th className="px-4 py-2 text-left">Rol actual</th>
                                            <th className="px-4 py-2 text-left">Asignar rol</th>
                                            <th className="px-4 py-2 text-left">Acciones</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredUsers.map((user, i) => (
                                            <motion.tr
                                                key={user.id}
                                                variants={fade}
                                                initial="hidden"
                                                animate="visible"
                                                custom={i}
                                                className="border-b transition-colors hover:bg-accent/10"
                                            >
                                                <td className="px-4 py-2">{user.id}</td>

                                                <td className="px-4 py-2 font-medium">
                                                    <Link href={route('usuarios.show', user.id)} className="text-primary hover:underline">
                                                        {user.name}
                                                    </Link>
                                                </td>

                                                <td className="px-4 py-2">{user.email}</td>
                                                <td className="px-4 py-2">{user.dni}</td>

                                                <td className="px-4 py-2">{roleBadge(user.roles?.[0]?.name)}</td>

                                                {/* SELECT DE ROLES */}
                                                <td className="px-4 py-2">
                                                    <Select value={data.roles[user.id]} onValueChange={(v) => handleRoleChange(user.id, v)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar rol" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {roleItems.map((r) => (
                                                                <SelectItem key={r.id} value={r.name}>
                                                                    {r.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </td>

                                                <td className="px-4 py-2">
                                                    <div className="flex gap-2">
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={route('usuarios.edit', user.id)}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>

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
                                                                        ¿Seguro que deseas eliminar al usuario <strong>{user.name}</strong>? Esta
                                                                        acción no se puede deshacer.
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
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
