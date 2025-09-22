<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CursoHorario extends Model
{
    use HasFactory;

    protected $fillable = [
        'curso_id',
        'dia_semana',
        'hora_inicio',
        'hora_fin'
    ];

    protected $casts = [
        'hora_inicio' => 'datetime',
        'hora_fin' => 'datetime'
    ];

    /**
     * Obtiene el curso al que pertenece el horario
     */
    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }
}
