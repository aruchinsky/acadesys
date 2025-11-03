<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('curso_horarios', function (Blueprint $table) {
            $table->id();
            
            // Relación con cursos
            $table->foreignId('curso_id')
                  ->constrained('cursos')
                  ->onDelete('cascade'); // Si un curso se elimina, sus horarios también

            $table->string('dia_en_texto', 20)->nullable(); // Ej: 'Lunes', 'Martes'
            $table->time('hora_inicio')->nullable();
            $table->integer('duracion_min')->nullable(); // duración en minutos
            $table->string('sala', 50)->nullable(); // sala o aula
            $table->enum('turno', ['Mañana', 'Tarde', 'Noche'])->nullable();
            
            $table->timestamps(); // created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curso_horarios');
    }
};
