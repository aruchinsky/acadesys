<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'arancel_base',
        'modalidad',
        'activo',
    ];


    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date'
    ];

    /**
     * Obtiene los usuarios inscritos en el curso
     */
    public function usuarios()
    {
        return $this->belongsToMany(User::class, 'inscripciones', 'curso_id', 'user_id')
                    ->withPivot(['estado', 'fecha_inscripcion', 'origen'])
                    ->withTimestamps();
    }

    /**
     * Obtiene las inscripciones del curso
     */
    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class);
    }

    /**
     * Obtiene los horarios del curso
     */
    public function horarios()
    {
        return $this->hasMany(CursoHorario::class);
    }

    /**
     * Profesores asignados al curso
     */
    public function profesores()
    {
        return $this->belongsToMany(User::class, 'curso_profesor', 'curso_id', 'profesor_id')
                    ->withTimestamps();
    }

}
