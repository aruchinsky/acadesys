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

<div className="overflow-x-auto rounded-lg border border-[var(--border)]">
  <table className="min-w-full table-auto text-left text-sm">
    <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
      <tr>
        <th className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">ID</th>
        <th className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">Nombre</th>
        <th className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">Usuarios Asignados</th>
        <th className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">Permisos</th>
        <th className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {roles.length > 0 ? (
        roles.map((role) => (
          <tr key={role.id} className="hover:bg-[var(--accent)]">
            <td className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">{role.id}</td>
            <td className="border-b border-[var(--border)] px-4 py-2 font-medium text-[var(--foreground)]">{role.name}</td>
            <td className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">{role.users_count}</td>
            <td className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">{role.permissions_count}</td>
            <td className="border-b border-[var(--border)] px-4 py-2">
              <div className="flex gap-2">
                <Link href={route('roles.edit', role.id)}>
                  <Button size="sm" variant="default" title="Editar rol">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={6} className="py-4 text-center text-[var(--muted-foreground)]">
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
