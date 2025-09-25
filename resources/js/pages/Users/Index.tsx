import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { pageProps, UserWithRoles, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Usuarios',
    href: '/users',
  },
];

export default function Index() {
  const { users, auth } = usePage<pageProps>().props;
  const usersList: UserWithRoles[] = Array.isArray(users) ? users : [];

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      router.delete(route('users.destroy', id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Usuarios" />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Usuarios</h1>
          <Button asChild>
            <Link href={route('users.create')}>Crear Usuario</Link>
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="min-w-full table-auto text-left text-sm">
            <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
              <tr>
                <th className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">ID</th>
                <th className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">Nombre</th>
                <th className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">Email</th>
                <th className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">DNI</th>
                <th className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">Rol</th>
                <th className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usersList.length > 0 ? (
                usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--accent)]">
                    <td className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">{user.id}</td>
                    <td className="border-b border-[var(--border)] px-4 py-2">
                      <Link
                        href={route('users.show', user.id)}
                        className="text-[var(--primary)] hover:text-[var(--primary-foreground)]"
                      >
                        {user.name}
                      </Link>
                    </td>
                    <td className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">{user.email}</td>
                    <td className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">{user.dni}</td>
                    <td className="border-b border-[var(--border)] px-4 py-2 text-[var(--foreground)]">
                      {user.roles && user.roles.length > 0
                        ? user.roles.map((r) => r.name).join(', ')
                        : 'Sin rol'}
                    </td>
                    <td className="border-b border-[var(--border)] px-4 py-2">
                      <div className="flex gap-2">
                        <Link href={route('users.edit', user.id)}>
                          <Button size="sm" variant="default" title="Editar usuario">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(user.id)}
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
                  <td colSpan={6} className="py-4 text-center text-[var(--muted-foreground)]">
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
