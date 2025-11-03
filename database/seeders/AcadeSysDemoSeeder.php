<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Curso;
use App\Models\Inscripcion;
use App\Models\Pago;
use App\Models\Asistencia;

class AcadeSysDemoSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {

            // =====================================================
            // 🧍‍♂️ USUARIOS BASE
            // =====================================================

            $usuariosBase = [
                ['name' => 'Superusuario', 'email' => 'super@acadesys.test', 'role' => 'superusuario'],
                ['name' => 'Administrativo', 'email' => 'admin@acadesys.test', 'role' => 'administrativo'],
                ['name' => 'Profesor Demo', 'email' => 'profesor@acadesys.test', 'role' => 'profesor'],
                ['name' => 'Alumno Demo', 'email' => 'alumno@acadesys.test', 'role' => 'alumno'],
            ];

            foreach ($usuariosBase as $data) {
                $user = User::firstOrCreate(
                    ['email' => $data['email']],
                    [
                        'name' => $data['name'],
                        'password' => Hash::make('password123'),
                        'dni' => fake()->unique()->numerify('########'),
                        'telefono' => fake()->phoneNumber(),
                    ]
                );
                $user->assignRole($data['role']);
            }

            // Profesores adicionales
            $profesores = collect();
            for ($i = 1; $i <= 4; $i++) {
                $prof = User::firstOrCreate(
                    ['email' => "profesor$i@acadesys.test"],
                    [
                        'name' => "Profesor $i",
                        'password' => Hash::make('password123'),
                        'dni' => fake()->unique()->numerify('########'),
                        'telefono' => fake()->phoneNumber(),
                    ]
                );
                $prof->assignRole('profesor');
                $profesores->push($prof);
            }

            // Alumnos adicionales
            $alumnos = collect();
            for ($i = 1; $i <= 10; $i++) {
                $alumno = User::firstOrCreate(
                    ['email' => "alumno$i@acadesys.test"],
                    [
                        'name' => "Alumno $i",
                        'password' => Hash::make('password123'),
                        'dni' => fake()->unique()->numerify('########'),
                        'telefono' => fake()->phoneNumber(),
                    ]
                );
                $alumno->assignRole('alumno');
                $alumnos->push($alumno);
            }

            // =====================================================
            // 🎓 CURSOS Y PROFESORES
            // =====================================================

            $cursosData = [
                [
                    'nombre' => 'Operador de PC',
                    'descripcion' => 'Curso introductorio a la informática básica y ofimática.',
                    'arancel_base' => 15000,
                    'modalidad' => 'Presencial',
                    'fecha_inicio' => now()->subWeeks(2),
                    'fecha_fin' => now()->addMonths(2),
                ],
                [
                    'nombre' => 'Reparación y Mantenimiento de PC',
                    'descripcion' => 'Curso técnico sobre hardware, diagnóstico y reparación.',
                    'arancel_base' => 20000,
                    'modalidad' => 'Presencial',
                    'fecha_inicio' => now()->subWeeks(1),
                    'fecha_fin' => now()->addMonths(3),
                ],
                [
                    'nombre' => 'Introducción a la Programación',
                    'descripcion' => 'Fundamentos de lógica y algoritmos con ejercicios prácticos.',
                    'arancel_base' => 18000,
                    'modalidad' => 'Virtual',
                    'fecha_inicio' => now()->addDays(7),
                    'fecha_fin' => now()->addMonths(2),
                ],
            ];

            $cursos = collect();
            foreach ($cursosData as $cursoData) {
                $curso = Curso::firstOrCreate(
                    ['nombre' => $cursoData['nombre']],
                    $cursoData
                );

                $curso->profesores()->syncWithoutDetaching(
                    $profesores->random(rand(1, 2))->pluck('id')->toArray()
                );

                $cursos->push($curso);
            }

            // =====================================================
            // 🧾 INSCRIPCIONES, PAGOS Y ASISTENCIAS
            // =====================================================

            foreach ($cursos as $curso) {
                // Seleccionar alumnos aleatorios para inscribirse
                $inscriptos = $alumnos->random(rand(4, 8));

                foreach ($inscriptos as $alumno) {
                    $inscripcion = Inscripcion::firstOrCreate(
                        ['curso_id' => $curso->id, 'user_id' => $alumno->id],
                        [
                            'estado' => fake()->randomElement(['pendiente', 'confirmada']),
                            'origen' => fake()->randomElement(['landing', 'admin']),
                            'fecha_inscripcion' => now()->subDays(rand(1, 15)),
                            'monto_total' => $curso->arancel_base,
                        ]
                    );

                    // PAGOS
                    $numPagos = rand(1, 2);
                    for ($i = 0; $i < $numPagos; $i++) {
                        Pago::create([
                            'inscripcion_id' => $inscripcion->id,
                            'monto' => $curso->arancel_base / 2,
                            'pagado_at' => now()->subDays(rand(1, 10)),
                            'metodo_pago' => fake()->randomElement(['Efectivo', 'Transferencia', 'Tarjeta']),
                            'administrativo_id' => User::role('administrativo')->inRandomOrder()->first()->id,
                            'user_id' => $alumno->id,
                        ]);
                    }

                    // ASISTENCIAS
                    $numClases = rand(5, 10);
                    for ($i = 0; $i < $numClases; $i++) {
                        Asistencia::firstOrCreate([
                            'inscripcion_id' => $inscripcion->id,
                            'fecha' => now()->subDays(rand(1, 20))->format('Y-m-d'),
                        ], [
                            'presente' => fake()->boolean(80),
                            'observacion' => fake()->optional()->sentence(3),
                        ]);
                    }
                }
            }

            $this->command->info('✅ Sistema AcadeSys poblado correctamente con datos de ejemplo.');
        });
    }
}
