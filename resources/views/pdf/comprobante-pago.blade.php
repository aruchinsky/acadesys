<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Comprobante de Pago #{{ $pago->id }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 18px; }
        .section { margin-bottom: 12px; }
        .section h2 { font-size: 14px; margin-bottom: 6px; border-bottom: 1px solid #ccc; padding-bottom: 3px; }
        .row { margin-bottom: 4px; }
        .label { font-weight: bold; display: inline-block; width: 140px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Comprobante de Pago</h1>
        <p>AcadeSys - IG 2000 Cursos Informáticos</p>
    </div>

    <div class="section">
        <h2>Datos del pago</h2>
        <div class="row"><span class="label">N° de comprobante:</span> {{ $pago->id }}</div>
        <div class="row"><span class="label">Fecha de pago:</span> {{ $pago->pagado_at?->format('d/m/Y H:i') }}</div>
        <div class="row"><span class="label">Monto:</span> $ {{ number_format($pago->monto, 2, ',', '.') }}</div>
        <div class="row"><span class="label">Método de pago:</span> {{ $pago->metodo_pago }}</div>
        <div class="row"><span class="label">Anulado:</span> {{ $pago->anulado ? 'Sí' : 'No' }}</div>
    </div>

    <div class="section">
        <h2>Alumno</h2>
        <div class="row"><span class="label">Nombre:</span> {{ $pago->inscripcion->usuario->nombre ?? '' }} {{ $pago->inscripcion->usuario->apellido ?? '' }}</div>
        <div class="row"><span class="label">Email:</span> {{ $pago->inscripcion->usuario->email ?? '' }}</div>
        <div class="row"><span class="label">DNI:</span> {{ $pago->inscripcion->usuario->dni ?? '' }}</div>
    </div>

    <div class="section">
        <h2>Curso</h2>
        <div class="row"><span class="label">Curso:</span> {{ $pago->inscripcion->curso->nombre ?? '' }}</div>
        <div class="row"><span class="label">Arancel base:</span> $ {{ number_format($pago->inscripcion->curso->arancel_base ?? 0, 2, ',', '.') }}</div>
    </div>

    <div class="section">
        <h2>Registro administrativo</h2>
        <div class="row">
            <span class="label">Registrado por:</span>
            @if($pago->administrativo)
                {{ $pago->administrativo->nombre ?? '' }} {{ $pago->administrativo->apellido ?? '' }}
            @else
                Registrado desde el perfil del alumno
            @endif
        </div>
    </div>

    <div class="section" style="margin-top: 20px;">
        <p>Este comprobante no reemplaza la factura legal, pero certifica el registro del pago en el sistema AcadeSys.</p>
    </div>
</body>
</html>
