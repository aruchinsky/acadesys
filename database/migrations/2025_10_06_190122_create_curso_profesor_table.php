<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('curso_profesor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('curso_id')->constrained('cursos')->cascadeOnDelete();
            $table->foreignId('profesor_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['curso_id', 'profesor_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('curso_profesor');
    }
};
