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
        Schema::create('asistencias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('inscripcion_id');
            $table->date('fecha');
            $table->boolean('presente')->default(true);
            $table->timestamps();

            $table->unique(['inscripcion_id', 'fecha'], 'uq_asistencia');

            $table->foreign('inscripcion_id')
                  ->references('id')
                  ->on('inscripciones')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asistencias');
    }
};
