<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inscripcion extends Model
{
    use HasFactory;

    protected $table = 'inscripciones';

    protected $fillable = [
        'user_id',
        'curso_id',
        'estado',
        'fecha_inscripcion',
        'origen',
        'monto_total',
    ];

    protected $casts = [
        'fecha_inscripcion' => 'date'
    ];

    /**
     * Obtiene el usuario inscrito
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Obtiene el curso de la inscripción
     */
    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }

    /**
     * Obtiene los pagos asociados a la inscripción
     */
    public function pagos()
    {
        return $this->hasMany(Pago::class, 'inscripcion_id');
    }

    /**
     * Obtiene las asistencias del alumno
     */
    public function asistencias()
    {
        return $this->hasMany(Asistencia::class);
    }

    public function getNombreAlumnoAttribute()
    {
        return $this->usuario?->nombre_completo;
    }

}
