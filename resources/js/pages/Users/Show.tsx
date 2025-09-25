import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { pageProps, User, Inscripcion, Pago, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2, Phone, Mail, Calendar, BookOpen, CreditCard } from 'lucide-react';

interface Props {
    usuario: User & {
        inscripciones: Inscripcion[];
        pagos: Pago[];
    };
}

export default function Show() {
    const { usuario } = usePage<pageProps & Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Usuarios',
            href: '/usuarios',
        },
        {
            title: usuario.nombre_completo,
            href: `/usuarios/${usuario.id}`,
        },
    ];

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            router.delete(route('usuarios.destroy', usuario.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Usuario - ${usuario.nombre_completo}`} />
            <div className="flex flex-col gap-6 p-4">
                {/* Encabezado con acciones */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href={route('usuarios.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a usuarios
                        </Link>
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="default" asChild>
                            <Link href={route('usuarios.edit', usuario.id)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Información Personal */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Personal</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                                    <p className="font-medium">{usuario.nombre_completo}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">DNI</p>
                                    <p className="font-medium">{usuario.dni}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <Mail className="mr-2 inline-block h-4 w-4" />
                                    Email
                                </p>
                                <p className="font-medium">{usuario.email}</p>
                            </div>
                            {usuario.telefono && (
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        <Phone className="mr-2 inline-block h-4 w-4" />
                                        Teléfono
                                    </p>
                                    <p className="font-medium">{usuario.telefono}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <Calendar className="mr-2 inline-block h-4 w-4" />
                                    Fecha de registro
                                </p>
                                <p className="font-medium">{usuario.created_at}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cursos e Inscripciones */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>
                                <BookOpen className="mr-2 inline-block h-5 w-5" />
                                Inscripciones
                            </CardTitle>
                            <span className="text-sm text-gray-500">
                                Total: {usuario.inscripciones?.length ?? 0}
                            </span>
                        </CardHeader>
                        <CardContent>
                            {usuario.inscripciones && usuario.inscripciones.length > 0 ? (
                                <div className="space-y-4">
                                    {usuario.inscripciones.map((inscripcion) => (
                                        <div
                                            key={inscripcion.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            <div>
                                                <h4 className="font-medium">{inscripcion.curso}</h4>
                                                <p className="text-sm text-gray-500">
                                                    Inscripto: {inscripcion.fecha_inscripcion}
                                                </p>
                                            </div>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                    inscripcion.estado === 'confirmada'
                                                        ? 'bg-green-100 text-green-800'
                                                        : inscripcion.estado === 'pendiente'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {inscripcion.estado}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">No hay inscripciones registradas</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pagos */}
                    <Card className="md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>
                                <CreditCard className="mr-2 inline-block h-5 w-5" />
                                Historial de Pagos
                            </CardTitle>
                            <span className="text-sm text-gray-500">Total: {usuario.pagos?.length ?? 0}</span>
                        </CardHeader>
                        <CardContent>
                            {usuario.pagos && usuario.pagos.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Fecha
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Monto
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Método de Pago
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {usuario.pagos.map((pago) => (
                                                <tr key={pago.id}>
                                                    <td className="whitespace-nowrap px-4 py-2">{pago.pagado_at}</td>
                                                    <td className="whitespace-nowrap px-4 py-2">
                                                        ${pago.monto.toFixed(2)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2">{pago.metodo_pago}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">No hay pagos registrados</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
