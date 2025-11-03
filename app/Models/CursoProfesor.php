<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CursoProfesor extends Model
{
    use HasFactory;

    protected $table = 'curso_profesor';

    protected $fillable = [
        'curso_id',
        'profesor_id',
    ];

    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }

    public function profesor()
    {
        return $this->belongsTo(User::class, 'profesor_id');
    }
}
