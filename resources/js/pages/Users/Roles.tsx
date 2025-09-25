import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { pageProps, Role, UserWithRoles, type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Asignación de Roles',
        href: '/users/roles',
    },
];

export default function UserRolesPage() {
    //Desestructurando los usuarios y roles de las props de la página
    const { users, roles } = usePage<pageProps>().props;

    const usersList: UserWithRoles[] = users;
    const roleItems: Role[] = roles as Role[];


    const initialRoles: Record<number, string> = {};
    usersList.forEach((user) => {
        initialRoles[user.id] = user.roles?.[0]?.name || '';
    });

    const { data, setData, put, processing } = useForm<{roles: Record<number, string>}>({
        roles: initialRoles,
    });

    const handleChange = (userId: number, role: string) => {
        setData('roles', { 
            ...data.roles, 
            [userId]: role,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.roles.update'), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleCancel = () => {
        router.visit(route('dashboard'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Asignación de Roles" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Asignación de Roles</h1>
                    <div className="flex gap-2">
                        <Button 
                            variant="secondary" 
                            onClick={handleCancel}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={processing}
                        >
                            Guardar Cambios
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full table-auto text-left text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">ID</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">Nombre Completo</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">Email</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">DNI</th>
                                <th className="border-b border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-200">Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.length > 0 ? (
                                usersList.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-800 dark:border-gray-700 dark:text-gray-100">
                                            {user.id}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-800 dark:border-gray-700 dark:text-gray-100">
                                            {user.name}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-800 dark:border-gray-700 dark:text-gray-100">
                                            {user.email}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-800 dark:border-gray-700 dark:text-gray-100">
                                            {user.dni}
                                        </td>
                                        <td className="border-b border-gray-200 px-4 py-2 text-gray-800 dark:border-gray-700 dark:text-gray-100">
                                            <Select
                                                value={data.roles[user.id]}
                                                onValueChange={(value) => handleChange(user.id, value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccionar rol" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roleItems.map((role) => (
                                                        <SelectItem key={role.name} value={role.name}>
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-gray-600 dark:text-gray-300">
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