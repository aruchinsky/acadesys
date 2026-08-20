<?php

namespace Database\Seeders;

use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AcadeSysExamSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_AR');

        $usuarios = [
            [
                'nombre' => 'Iván',
                'apellido' => 'Ruchinsky',
                'email' => 'super@acadesys.test',
                'role' => 'superusuario',
            ],
            [
                'nombre' => 'María',
                'apellido' => 'López',
                'email' => 'admin@acadesys.test',
                'role' => 'administrativo',
            ],
            [
                'nombre' => 'Carlos',
                'apellido' => 'Pérez',
                'email' => 'profesor@acadesys.test',
                'role' => 'profesor',
            ],
            [
                'nombre' => 'Lucía',
                'apellido' => 'Gómez',
                'email' => 'alumno@acadesys.test',
                'role' => 'alumno',
            ],
        ];

        foreach ($usuarios as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'nombre' => $data['nombre'],
                    'apellido' => $data['apellido'],
                    'name' => "{$data['nombre']} {$data['apellido']}",
                    'dni' => $faker->unique()->numerify('########'),
                    'telefono' => $faker->phoneNumber(),
                    'password' => Hash::make('password123'),
                ]
            );

            $user->assignRole($data['role']);
        }

        $this->command->info('🎓 Seeder de EXAMEN ejecutado: usuarios base creados.');
    }
}
