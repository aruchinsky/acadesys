import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Roles', href: '/roles' },
  { title: 'Crear Rol', href: '#' },
];

interface CreateProps {
  permissions: Record<string, { id: number; name: string }[]>;
}

export default function Create({ permissions }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    permissions: [] as string[],
  });

  const handleToggle = (perm: string) => {
    if (data.permissions.includes(perm)) {
      setData(
        'permissions',
        data.permissions.filter((p) => p !== perm)
      );
    } else {
      setData('permissions', [...data.permissions, perm]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('roles.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Rol" />
      <div className="flex flex-col gap-6 p-4">
        {/* Volver */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href={route('roles.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Roles
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Rol</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre del rol */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del rol</Label>
                <input
                  id="name"
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Permisos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Permisos</h3>
                <p className="text-sm text-muted-foreground">
                  Selecciona los permisos que tendrá este rol
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  {Object.entries(permissions).map(([group, perms]) => (
                    <div key={group} className="space-y-2">
                      <h4 className="font-semibold capitalize">{group}</h4>
                      <div className="space-y-2 rounded-lg border p-3">
                        {perms.map((perm) => (
                          <div
                            key={perm.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`perm-${perm.id}`}
                              checked={data.permissions.includes(perm.name)}
                              onCheckedChange={() =>
                                handleToggle(perm.name)
                              }
                            />
                            <Label
                              htmlFor={`perm-${perm.id}`}
                              className="text-sm"
                            >
                              {perm.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.permissions && (
                  <p className="text-sm text-destructive">
                    {errors.permissions}
                  </p>
                )}
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                  <Link href={route('roles.index')}>Cancelar</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Crear Rol'
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
