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
        Schema::create('pagos', function (Blueprint $table) {
            $table->id(); // id INT AUTO_INCREMENT PRIMARY KEY
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // user_id con FK a users
            $table->unsignedBigInteger('inscripcion_id')->nullable(); // inscripcion_id
            $table->decimal('monto', 10, 2); // monto DECIMAL(10,2)
            $table->dateTime('pagado_at')->default(DB::raw('CURRENT_TIMESTAMP')); // pagado_at
            $table->enum('metodo_pago', ['Efectivo','Transferencia','Tarjeta'])->default('Efectivo');
            $table->unsignedBigInteger('administrativo_id')->nullable(); // FK administrativo
            $table->timestamps(); // created_at y updated_at

            // Índices
            $table->index('user_id');
            $table->index('inscripcion_id');
            $table->index('administrativo_id');

            // Claves foráneas
            $table->foreign('inscripcion_id')->references('id')->on('inscripciones')->onDelete('set null');
            $table->foreign('administrativo_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
