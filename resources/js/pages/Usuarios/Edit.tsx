import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, pageProps, Role, UserWithRoles } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Loader2, Shield, UserCog } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuarios', href: route('usuarios.index') },
    { title: 'Editar Usuario', href: '#' },
];

type EditPageProps = pageProps & {
    user: UserWithRoles & {
        nombre: string;
        apellido: string;
    };
    roles: Role[];
};

export default function Edit() {
    const { user, roles } = usePage<EditPageProps>().props;

    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        dni: user.dni,
        telefono: user.telefono ?? '',
        password: '',
        password_confirmation: '',
        role: user.roles[0]?.name ?? '',
    });

    // 🧠 Detectar si hubo cambios respecto a los datos originales
    const isFormDirty = useMemo(() => {
        return (
            data.name !== user.name ||
            data.nombre !== user.nombre ||
            data.apellido !== user.apellido ||
            data.email !== user.email ||
            data.dni !== user.dni ||
            data.telefono !== (user.telefono || '') ||
            data.password.trim() !== '' ||
            data.role !== (user.roles[0]?.name ?? '')
        );
    }, [data, user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('usuarios.update', user.id));
    };

    const handleCancel = () => {
        if (isFormDirty) setShowConfirm(true);
        else router.visit(route('usuarios.index'));
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Usuario - ${user.name}`} />

            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex flex-col gap-6 p-4">
                {/* ENCABEZADO */}
                <div className="flex items-center justify-between">
                    <Button type="button" variant="ghost" onClick={handleCancel}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                    </Button>
                </div>

                {/* FORMULARIO */}
                <Card className="border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                            <UserCog className="h-5 w-5 text-primary" /> Editar Usuario
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* DATOS PERSONALES */}
                            <div className="rounded-lg border p-4">
                                <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Datos personales</h3>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="nombre">Nombre</Label>
                                        <Input id="nombre" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} />
                                        {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="apellido">Apellido</Label>
                                        <Input id="apellido" value={data.apellido} onChange={(e) => setData('apellido', e.target.value)} />
                                        {errors.apellido && <p className="text-sm text-destructive">{errors.apellido}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="dni">DNI</Label>
                                        <Input id="dni" value={data.dni} onChange={(e) => setData('dni', e.target.value)} />
                                        {errors.dni && <p className="text-sm text-destructive">{errors.dni}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="telefono">Teléfono</Label>
                                        <Input
                                            id="telefono"
                                            value={data.telefono}
                                            onChange={(e) => setData('telefono', e.target.value)}
                                            placeholder="Opcional"
                                        />
                                        {errors.telefono && <p className="text-sm text-destructive">{errors.telefono}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* INFORMACIÓN DE LA CUENTA */}
                            <div className="rounded-lg border p-4">
                                <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Información de la cuenta</h3>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="name">Nombre de usuario</Label>
                                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* CONTRASEÑA */}
                            <div className="rounded-lg border p-4">
                                <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Cambiar contraseña</h3>
                                <p className="mb-3 text-xs text-muted-foreground">Dejar en blanco para mantener la contraseña actual.</p>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="password">Nueva contraseña</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ROL */}
                            <div className="rounded-lg border p-4">
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                    <Shield className="h-4 w-4 text-primary" />
                                    Rol de usuario
                                </h3>

                                <div className="grid gap-2 sm:grid-cols-2">
                                    {roles.map((r) => (
                                        <label key={r.id} className="flex cursor-pointer items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="role"
                                                value={r.name}
                                                checked={data.role === r.name}
                                                onChange={() => setData('role', r.name)}
                                            />
                                            {r.name}
                                        </label>
                                    ))}
                                </div>

                                {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                            </div>

                            {/* BOTONES */}
                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={handleCancel}>
                                    Cancelar
                                </Button>

                                <Button type="submit" disabled={processing}>
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Guardar cambios
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
                            Cancelar edición
                        </AlertDialogTitle>
                        <AlertDialogDescription>¿Seguro que deseas cancelar? Los cambios realizados se perderán.</AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowConfirm(false)}>Continuar editando</AlertDialogCancel>

                        <AlertDialogAction
                            onClick={() => router.visit(route('usuarios.index'))}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Cancelar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
