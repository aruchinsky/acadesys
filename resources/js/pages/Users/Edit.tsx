import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { pageProps, type BreadcrumbItem, type User, Role, UserWithRoles } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Loader2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuarios', href: '/usuarios' },
    { title: 'Editar Usuario', href: '#' },
];

interface EditProps extends pageProps {
    user: UserWithRoles;
    roles: Role[];
}

export default function Edit() {
    const { user, roles } = usePage<EditProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        dni: user.dni,
        telefono: user.telefono || '',
        password: '',
        password_confirmation: '',
        role: user.roles[0]?.name ?? '', // Asignar el primer rol si existe
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    const handleCancel = () => {
        if(data.name !== user.name || data.email !== user.email || data.dni !== user.dni || data.telefono !== user.telefono || data.role !== user.roles[0]?.name) {
            if(!confirm('¿Estás seguro de que deseas cancelar? Se perderán los datos no guardados.')) return;
        }
        router.visit(route('users.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Usuario" />
            <div className="flex flex-col gap-6 p-4">
                {/* Encabezado con acciones */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={handleCancel}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a usuarios
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Editar Usuario</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Información de la Cuenta */}
                            <div className="space-y-4 rounded-lg border p-4">
                                <h3 className="text-lg font-medium">Información de la Cuenta</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre de Usuario</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dni">DNI</Label>
                                        <Input
                                            id="dni"
                                            type="text"
                                            value={data.dni}
                                            onChange={(e) => setData('dni', e.target.value)}
                                        />
                                        {errors.dni && <p className="text-sm text-destructive">{errors.dni}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="telefono">Teléfono</Label>
                                        <Input
                                            id="telefono"
                                            type="tel"
                                            value={data.telefono}
                                            onChange={(e) => setData('telefono', e.target.value)}
                                            placeholder="Opcional"
                                        />
                                        {errors.telefono && <p className="text-sm text-destructive">{errors.telefono}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Cambio de Contraseña */}
                            <div className="space-y-4 rounded-lg border p-4">
                                <h3 className="text-lg font-medium">Cambiar Contraseña</h3>
                                <p className="text-sm text-muted-foreground">
                                    Dejar en blanco para mantener la contraseña actual
                                </p>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Nueva Contraseña</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirmar Nueva Contraseña</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Rol */}
                            <div className="space-y-4 rounded-lg border p-4">
                                <h3 className="text-lg font-medium">Rol</h3>
                                <div className="grid gap-2">
                                    {roles && (roles as Role[]).map((role) => (
                                        <label key={role.id} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role.name}
                                                checked={data.role === role.name}
                                                onChange={() => setData('role', role.name)}
                                            />
                                            {role.name}
                                        </label>
                                    ))}
                                </div>
                                {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex items-center justify-end gap-4">
                                <Button type="button" variant="outline" onClick={handleCancel}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar Cambios'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
