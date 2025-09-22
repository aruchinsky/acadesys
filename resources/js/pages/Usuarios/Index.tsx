import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { pageProps, User, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/usuarios',
    },
];

export default function Index() {
    const { usuarios, auth } = usePage<pageProps>().props;

    console.log(auth);

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            router.delete(route('usuarios.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Usuarios</h1>
                    <Button asChild>
                        <Link href={route('usuarios.create')}>Crear Usuario</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full table-auto text-left text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">ID</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">Nombre Completo</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">Email</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">DNI</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">Inscripciones</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">Fecha Alta</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.length > 0 ? (
                                usuarios.map((usuario: User) => (
                                    <tr key={usuario.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-800 dark:border-gray-700 dark:text-gray-100">
                                            {usuario.id}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-800 dark:border-gray-700 dark:text-gray-100">
                                            <Link
                                                href={route('usuarios.show', usuario.id)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {usuario.nombre_completo}
                                            </Link>
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-800 dark:border-gray-700 dark:text-gray-100">
                                            {usuario.email}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-800 dark:border-gray-700 dark:text-gray-100">
                                            {usuario.dni}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-800 dark:border-gray-700 dark:text-gray-100">
                                            {usuario.inscripciones_count} / {usuario.cursos_count}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-800 dark:border-gray-700 dark:text-gray-100">
                                            {usuario.created_at}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                                            <div className="flex gap-2">
                                                <Link href={route('usuarios.edit', usuario.id)}>
                                                    <Button size="sm" variant="default" title="Editar usuario">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    size="sm" 
                                                    variant="destructive" 
                                                    onClick={() => handleDelete(usuario.id)}
                                                    title="Eliminar usuario"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="py-4 text-center text-gray-600 dark:text-gray-300">
                                        No hay usuarios registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
