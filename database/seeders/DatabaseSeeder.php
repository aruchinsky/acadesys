<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ejecuta el seeder de roles y permisos primero
        $this->call(RolesAndPermissionsSeeder::class);

        // Crear usuario superusuario por defecto
        $user = User::factory()->create([
            'name' => 'Developer',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'), // clave segura hasheada
        ]);

        // Asignar rol superusuario (debe existir en RolesAndPermissionsSeeder)
        $user->assignRole('superusuario');
    }
}
