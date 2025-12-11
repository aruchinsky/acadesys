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
        'comprobante',          // 📌 NUEVO: archivo subido
        'numero_operacion',     // 📌 NUEVO: ID de MP u operación
        'anulado',
        'motivo_anulacion',
        'administrativo_id',
        'comprobante',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'pagado_at' => 'datetime',
        'anulado' => 'boolean',
    ];

    /** Usuario que realizó el pago */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** Administrativo que registró el pago */
    public function administrativo()
    {
        return $this->belongsTo(User::class, 'administrativo_id');
    }

    /** Inscripción relacionada */
    public function inscripcion()
    {
        return $this->belongsTo(Inscripcion::class, 'inscripcion_id');
    }

    /** Texto útil para selects */
    public function getDetallePagoAttribute()
    {
        return "{$this->usuario?->nombre_completo} - $ {$this->monto}";
    }
}
