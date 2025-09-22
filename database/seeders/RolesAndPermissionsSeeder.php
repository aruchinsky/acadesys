<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpia la cache de laravel de permisos antes de crearlos
        // Aseguramos que no haya valores antiguos en cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Entidades y sus permisos
        $entitiesPermissions = [
            //La clave es el nombre de la entidad y el valor es un array de acciones
            'cursos' => ['crear', 'ver', 'editar', 'eliminar', 'preinscribirse'],
            'inscripciones' => ['crear', 'ver', 'editar', 'eliminar', 'cambiar estado'],
            'usuarios' => ['crear', 'ver', 'editar', 'eliminar'],
            'pagos' => ['crear', 'ver', 'editar', 'eliminar'],
            'asistencias' => ['crear', 'ver', 'editar', 'eliminar'],
            'reportes' => ['ver'],
            'configuraciones' => ['ver', 'editar'],
        ];

        //Recorremos cada entidad y sus acciones para crear los permisos
        foreach ($entitiesPermissions as $entity => $actions) {
            foreach ($actions as $action) {
                //Se crea el permiso en la tabla "Permissions"
                Permission::firstOrCreate(['name' => "{$action} {$entity}"]);
            }
        }

        // Definimos los roles del sistema
        // Estos roles son los perfiles de los usuarios
        $roles = ['superusuario', 'administrativo', 'profesor', 'alumno'];

        // Recorremos el arreglo de roles
        // Por cada rol, se crea un registro en la tabla "Roles"
        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // Definimos QUE PERMISOS TIENE CADA ROL
        $rolesPermissions = [
            // El superusuario tiene todos los permisos
            'superusuario' => Permission::all()->pluck('name')->toArray(),
            
            'administrativo' => [
                'crear cursos', 'ver cursos', 'editar cursos', 'eliminar cursos',
                'crear inscripciones', 'ver inscripciones', 'editar inscripciones', 'eliminar inscripciones',
                'cambiar estado inscripciones',
                'crear usuarios', 'ver usuarios', 'editar usuarios', 'eliminar usuarios',
                'crear pagos', 'ver pagos', 'editar pagos', 'eliminar pagos',
                'crear asistencias', 'ver asistencias', 'editar asistencias', 'eliminar asistencias',
                'ver reportes',
                'ver configuraciones', 'editar configuraciones'
            ],
            'profesor' => [
                'ver cursos',
                'ver inscripciones',
                'ver asistencias', 'crear asistencias', 'editar asistencias',
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

        // Asignamos los permisos a cada rol
        // Recorremos el arreglo rolesPermissions
        // Para cada rol, buscamos el rol en la base de datos y sincronizamos sus permisos
        foreach ($rolesPermissions as $roleName => $permissions) {
            $role = Role::where('name', $roleName)->first();
            $role->syncPermissions($permissions);
        }
    }
}
