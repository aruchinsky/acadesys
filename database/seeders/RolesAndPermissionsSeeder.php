<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $entitiesPermissions = [
            'cursos' => ['crear', 'ver', 'editar', 'eliminar', 'asignar profesor', 'preinscribirse'],
            'inscripciones' => ['crear', 'ver', 'editar', 'eliminar', 'cambiar estado'],
            'usuarios' => ['crear', 'ver', 'editar', 'eliminar'],
            'pagos' => ['crear', 'ver', 'editar', 'eliminar'],
            'asistencias' => ['crear', 'ver', 'editar', 'eliminar'],
            'reportes' => ['ver'],
            'configuraciones' => ['ver', 'editar'],
        ];

        foreach ($entitiesPermissions as $entity => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name' => "{$action} {$entity}",
                    'guard_name' => 'web',
                ]);
            }
        }

        $roles = ['superusuario', 'administrativo', 'profesor', 'alumno'];

        foreach ($roles as $roleName) {
            Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'web',
            ]);
        }

        $rolesPermissions = [
            'superusuario' => Permission::all()->pluck('name')->toArray(),

            'administrativo' => [
                'crear cursos', 'ver cursos', 'editar cursos', 'eliminar cursos', 'asignar profesor cursos',
                'crear inscripciones', 'ver inscripciones', 'editar inscripciones', 'eliminar inscripciones',
                'cambiar estado inscripciones',
                'crear usuarios', 'ver usuarios', 'editar usuarios', 'eliminar usuarios',
                'crear pagos', 'ver pagos', 'editar pagos', 'eliminar pagos',
                'crear asistencias', 'ver asistencias', 'editar asistencias', 'eliminar asistencias',
                'ver reportes', 'ver configuraciones', 'editar configuraciones',
            ],

            'profesor' => [
                'ver cursos',
                'ver inscripciones',
                'crear asistencias', 'ver asistencias', 'editar asistencias',
                'ver reportes'
            ],

            'alumno' => [
                'crear usuarios',
                'ver cursos', 'preinscribirse cursos',
                'ver inscripciones',
                'ver asistencias',
                'ver pagos'
            ],
        ];

        foreach ($rolesPermissions as $roleName => $permissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($permissions);
        }
    }
}
