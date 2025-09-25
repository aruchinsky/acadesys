import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Permission } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Roles', href: '/roles' },
  { title: 'Crear Rol', href: '#' },
];

interface CreateProps {
  permissions: Record<string, Permission[]>;
}

export default function Create({ permissions }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    permissions: [] as string[],
  });

  const handleCheckboxChange = (permissionName: string, checked: boolean) => {
    if (checked) {
      setData('permissions', [...data.permissions, permissionName]);
    } else {
      setData(
        'permissions',
        data.permissions.filter((p) => p !== permissionName)
      );
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
              {/* Nombre del Rol */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Rol</Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Ej: superusuario, profesor, alumno"
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
                  {Object.entries(permissions).map(([entity, perms]) => (
                    <div key={entity} className="space-y-2">
                      <h4 className="font-semibold capitalize">{entity}</h4>
                      <div className="space-y-2 rounded-lg border p-3">
                        {perms.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`perm-${permission.id}`}
                              checked={data.permissions.includes(permission.name)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(permission.name, !!checked)
                              }
                            />
                            <Label
                              htmlFor={`perm-${permission.id}`}
                              className="text-sm"
                            >
                              {permission.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.permissions && (
                  <p className="text-sm text-destructive">{errors.permissions}</p>
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
