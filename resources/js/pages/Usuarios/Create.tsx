import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuarios', href: '/usuarios' },
    { title: 'Crear Usuario', href: '/usuarios/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('usuarios.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Usuario" />
            <div className="flex flex-col gap-6 p-4">
                {/* Encabezado con acciones */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href={route('usuarios.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a usuarios
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Crear Nuevo Usuario</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Información Personal */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                    />
                                    {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="apellido">Apellido</Label>
                                    <Input
                                        id="apellido"
                                        type="text"
                                        value={data.apellido}
                                        onChange={(e) => setData('apellido', e.target.value)}
                                    />
                                    {errors.apellido && <p className="text-sm text-destructive">{errors.apellido}</p>}
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
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div className="space-y-4 rounded-lg border p-4">
                                <h3 className="text-lg font-medium">Contraseña</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Contraseña</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex items-center justify-end gap-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('usuarios.index')}>Cancelar</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        'Crear Usuario'
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
