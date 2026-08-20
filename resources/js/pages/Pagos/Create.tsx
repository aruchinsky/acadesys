import AppLayout from '@/layouts/app-layout';
import { Inscripcion, pageProps, User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { Toast } from '@/components/toast-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { BookOpen, CalendarDays, CreditCard, DollarSign, User2 } from 'lucide-react';

export default function Create() {
    const { alumnos = [], inscripciones = [] } = usePage<pageProps>().props as {
        alumnos?: User[];
        inscripciones?: Inscripcion[];
    };

    // Estados
    const [alumnoId, setAlumnoId] = useState<string>('');
    const [inscripcionId, setInscripcionId] = useState<string>('');
    const [monto, setMonto] = useState<string>('');
    const [metodo, setMetodo] = useState<string>('Efectivo');
    const [observacion, setObservacion] = useState('');

    // Filtrar inscripciones del alumno
    const inscripcionesFiltradas = useMemo(() => {
        if (!alumnoId) return [];
        return inscripciones.filter((i) => String(i.user_id) === alumnoId);
    }, [alumnoId, inscripciones]);

    const inscripcionSeleccionada = useMemo(() => {
        return inscripciones.find((i) => String(i.id) === inscripcionId);
    }, [inscripcionId, inscripciones]);

    const cursoSeleccionado = inscripcionSeleccionada?.curso;

    // VALIDACIÓN
    const handleSubmit = () => {
        if (!alumnoId) return Toast.error('Debes seleccionar un alumno.');
        if (!inscripcionId) return Toast.error('Debes seleccionar un curso.');
        if (!monto) return Toast.error('Debes ingresar un monto.');
        if (Number(monto) < 1) return Toast.error('El monto debe ser mayor a 0.');

        router.post(
            route('administrativo.pagos.store'),
            {
                inscripcion_id: Number(inscripcionId),
                monto: Number(monto),
                metodo_pago: metodo,
                observacion,
            },
            { preserveScroll: true },
        );
    };

    // ---------------------------------------------
    // 🗓️ FORMATEADOR DE FECHA CORTA
    // ---------------------------------------------
    const formatFecha = (fechaString?: string) => {
        if (!fechaString) return '—';

        const fecha = new Date(fechaString);
        if (isNaN(fecha.getTime())) return '—';

        return fecha.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Pagos', href: route('administrativo.pagos.index') },
                { title: 'Registrar pago', href: '#' },
            ]}
        >
            <Head title="Registrar pago" />

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 p-4">
                {/* ENCABEZADO */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <CreditCard className="h-7 w-7 text-primary" />
                        <h1 className="text-3xl font-semibold">Registrar pago presencial</h1>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => router.visit(route('administrativo.pagos.index'))}
                        className="flex w-fit items-center gap-2"
                    >
                        ← Volver
                    </Button>
                </div>

                {/* CARD PRINCIPAL */}
                <Card className="w-full border border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <CreditCard className="h-5 w-5 text-primary" />
                            Datos del pago
                        </CardTitle>
                        <CardDescription>Completa la información necesaria para registrar un pago presencial en el sistema.</CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-8">
                        {/* ALUMNO + CURSO */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* ALUMNO */}
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 font-medium">
                                    <User2 className="h-4 w-4 text-primary" />
                                    Alumno
                                </Label>

                                <Select value={alumnoId} onValueChange={setAlumnoId}>
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder="Selecciona un alumno" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {alumnos.map((a) => (
                                            <SelectItem key={a.id} value={String(a.id)}>
                                                {a.nombre} {a.apellido}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* CURSO */}
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 font-medium">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    Curso (inscripción confirmada)
                                </Label>

                                <Select value={inscripcionId} onValueChange={setInscripcionId} disabled={!alumnoId}>
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder="Selecciona un curso" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {inscripcionesFiltradas.map((i) => (
                                            <SelectItem key={i.id} value={String(i.id)}>
                                                {i.curso?.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* DETALLE DEL CURSO */}
                        {cursoSeleccionado && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid gap-2 rounded-md border bg-muted/40 p-4 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    <strong>{cursoSeleccionado.nombre}</strong>
                                </div>

                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CalendarDays className="h-4 w-4" />
                                    Inicio: {formatFecha(cursoSeleccionado.fecha_inicio)} | Fin: {formatFecha(cursoSeleccionado.fecha_fin)}
                                </div>

                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <DollarSign className="h-4 w-4" />
                                    Arancel base:{' '}
                                    {Number(cursoSeleccionado.arancel_base).toLocaleString('es-AR', {
                                        style: 'currency',
                                        currency: 'ARS',
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* MONTO + MÉTODO */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* MONTO */}
                            <div className="grid gap-2">
                                <Label className="font-medium">Monto</Label>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Ej: 35000"
                                />
                            </div>

                            {/* METODO */}
                            <div className="grid gap-2">
                                <Label className="font-medium">Método de pago</Label>
                                <Select value={metodo} onValueChange={setMetodo}>
                                    <SelectTrigger className="bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Efectivo">Efectivo</SelectItem>
                                        <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* OBSERVACIÓN */}
                        <div className="grid gap-2">
                            <Label className="font-medium">Observación (opcional)</Label>
                            <textarea
                                rows={3}
                                className="w-full rounded-md border bg-background p-2 text-sm"
                                placeholder="Ej: Pago parcial, descuento especial…"
                                value={observacion}
                                onChange={(e) => setObservacion(e.target.value)}
                            />
                        </div>

                        {/* BOTÓN */}
                        <Button onClick={handleSubmit} className="w-full py-3 text-lg shadow-md">
                            Registrar pago
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
