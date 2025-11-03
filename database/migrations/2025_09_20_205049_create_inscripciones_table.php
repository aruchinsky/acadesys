<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inscripciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('curso_id')->constrained('cursos')->cascadeOnDelete();
            $table->enum('estado', ['pendiente','confirmada','rechazada'])->default('pendiente');
            $table->enum('origen', ['landing','admin'])->default('landing');
            $table->date('fecha_inscripcion')->useCurrent();
            $table->decimal('monto_total', 10, 2)->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'curso_id']); // evita duplicidad
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscripciones');
    }
};
