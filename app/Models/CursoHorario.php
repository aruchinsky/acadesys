<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CursoHorario extends Model
{
    use HasFactory;

    protected $fillable = [
        'curso_id',
        'dia_en_texto',
        'hora_inicio',
        'duracion_min',
        'sala',
    ];

    protected $casts = [
        'hora_inicio' => 'datetime:H:i',
    ];

    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }
}
