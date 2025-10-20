<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    use HasFactory;

    protected $fillable = [
        'inscripcion_id',
        'fecha',
        'presente'
    ];

    protected $casts = [
        'fecha' => 'date',
        'presente' => 'boolean'
    ];

    /**
     * Obtiene la inscripción asociada a la asistencia
     */
    public function inscripcion()
    {
        return $this->belongsTo(Inscripcion::class);
    }

    /**
     * Obtiene el usuario a través de la inscripción
     */
    public function usuario()
    {
        return $this->inscripcion->usuario();
    }

}
