<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Limpia cache de roles y permisos
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1️⃣ Crear roles y permisos
        $this->call(RolesAndPermissionsSeeder::class);

        // 2️⃣ Seeder ESPECIAL para examen (solo usuarios base)
        $this->call(AcadeSysExamSeeder::class);

        // 3️⃣ Seeder completo (DESACTIVADO para examen)
        // $this->call(AcadeSysDemoSeeder::class);
    }
}
