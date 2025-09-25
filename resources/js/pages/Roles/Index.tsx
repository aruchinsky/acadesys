import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { pageProps, Role, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

interface IndexProps {
  roles: Role[];
  auth: pageProps['auth'];
  [key: string]: unknown;
}

export default function Index() {
    const { roles, auth } = usePage<IndexProps>().props;

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este rol?')) {
            router.delete(route('roles.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Roles</h1>
                    <Button asChild>
                        <Link href={route('roles.create')}>Crear Rol</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full table-auto text-left text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">ID</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">Nombre</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">Guard</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">Permisos</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">Fecha Alta</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.length > 0 ? (
                                roles.map((role: Role) => (
                                    <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                                            {role.id}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 dark:border-gray-700 font-medium text-gray-800 dark:text-gray-100">
                                            {role.name}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                                            {role.guard_name}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                                            {role.permissions_count}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                                            {role.created_at}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                                            <div className="flex gap-2">
                                                <Link href={route('roles.edit', role.id)}>
                                                    <Button size="sm" variant="default" title="Editar rol">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(role.id)}
                                                    title="Eliminar rol"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-4 text-center text-gray-600 dark:text-gray-300">
                                        No hay roles registrados.
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
