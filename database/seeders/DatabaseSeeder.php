<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Limpia cache de roles y permisos
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1️⃣ Crear roles y permisos
        $this->call(RolesAndPermissionsSeeder::class);

        // 2️⃣ Poblado completo del sistema
        $this->call(AcadeSysDemoSeeder::class);
    }
}
