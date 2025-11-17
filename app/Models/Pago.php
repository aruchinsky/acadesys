<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'inscripcion_id',
        'monto',
        'pagado_at',
        'metodo_pago',
        'anulado',
        'motivo_anulacion',
        'administrativo_id'
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'pagado_at' => 'datetime'
    ];

    /**
     * Obtiene el usuario que realizó el pago
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function administrativo()
    {
        return $this->belongsTo(User::class, 'administrativo_id');
    }

    public function inscripcion()
    {
        return $this->belongsTo(Inscripcion::class, 'inscripcion_id');
    }

    public function getDetallePagoAttribute()
    {
        return "{$this->usuario?->nombre_completo} - $ {$this->monto}";
    }


}
