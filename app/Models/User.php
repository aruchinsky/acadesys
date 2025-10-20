<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    
    // UN TRAIT ES DE PHP NATIVO Y PERMITE REUTILIZAR CODIGO EN DIFERENTES CLASES
    use HasFactory, Notifiable, HasRoles;

    protected $guard_name = 'web';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'nombre',
        'apellido',
        'dni',
        'telefono',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Obtiene las inscripciones del usuario
     */
    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class);
    }

    /**
     * Obtiene los pagos realizados por el usuario
     */
    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }

    /**
     * Obtiene los pagos que el usuario ha procesado como administrativo
     */
    public function pagosAdministrados()
    {
        return $this->hasMany(Pago::class, 'administrativo_id');
    }

    /**
     * Obtiene los cursos en los que está inscrito el usuario
     */
    public function cursos()
    {
        return $this->belongsToMany(Curso::class, 'inscripciones')
                    ->withPivot(['estado', 'fecha_inscripcion', 'origen'])
                    ->withTimestamps();
    }

    /**
     * Cursos que el usuario dicta como profesor
     */
    public function cursosDictados()
    {
        return $this->belongsToMany(Curso::class, 'curso_profesor', 'profesor_id', 'curso_id')
                    ->withTimestamps();
    }


    /**
     * Obtiene el nombre completo del usuario
     */
    public function getNombreCompletoAttribute()
    {
        return trim("{$this->nombre} {$this->apellido}") ?: $this->name;
    }


}
