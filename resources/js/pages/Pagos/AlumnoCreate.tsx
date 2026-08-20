import AppLayout from '@/layouts/app-layout';
import { Inscripcion, pageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { Toast } from '@/components/toast-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { BookOpen, CalendarDays, CreditCard, CreditCardIcon, DollarSign, QrCode, Upload } from 'lucide-react';

export default function AlumnoCreate() {
    const { inscripciones = [], alias, qrUrl } = usePage<pageProps & { inscripciones: Inscripcion[]; alias: string; qrUrl: string }>().props;

    const [inscripcionId, setInscripcionId] = useState<string>('');
    const [metodo, setMetodo] = useState<string>('Transferencia');
    const [comprobante, setComprobante] = useState<File | null>(null);

    // CAMPOS TARJETA (simulación)
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [dni, setDni] = useState('');

    const inscripcionSeleccionada = useMemo(() => inscripciones.find((i) => String(i.id) === inscripcionId), [inscripcionId, inscripciones]);

    const cursoSeleccionado = inscripcionSeleccionada?.curso;

    // ===========================
    // VALIDACIÓN DE TARJETA
    // ===========================
    const validarTarjeta = () => {
        if (cardNumber.length !== 16) {
            Toast.error('Número de tarjeta inválido.');
            return false;
        }

        if (cardName.trim().length < 3) {
            Toast.error('El nombre del titular es obligatorio.');
            return false;
        }

        if (expMonth.length !== 2 || Number(expMonth) < 1 || Number(expMonth) > 12) {
            Toast.error('Mes de vencimiento inválido.');
            return false;
        }

        if (expYear.length !== 2) {
            Toast.error('Año de vencimiento inválido.');
            return false;
        }

        if (cvv.length !== 3) {
            Toast.error('CVV inválido.');
            return false;
        }

        if (dni.length < 7) {
            Toast.error('DNI inválido.');
            return false;
        }

        return true;
    };

    // ===========================
    // SUBMIT MÉTODOS MANUALES
    // ===========================
    const handleSubmit = () => {
        if (!inscripcionId) {
            return Toast.error('Debes seleccionar un curso.');
        }

        // Transferencia → requiere comprobante
        if (metodo === 'Transferencia' && !comprobante) {
            return Toast.error('Debes subir el comprobante del pago.');
        }

        const formData = new FormData();
        formData.append('inscripcion_id', inscripcionId);
        formData.append('metodo_pago', metodo);

        if (metodo === 'Transferencia') {
            formData.append('comprobante', comprobante as File);
        }

        router.post(route('alumno.pagos.store'), formData, {
            forceFormData: true,
        });
    };

    // ===========================
    // TARJETA (simulado)
    // ===========================
    const handleTarjeta = () => {
        if (!inscripcionId) return Toast.error('Seleccioná un curso.');

        if (!validarTarjeta()) return;

        const formData = new FormData();
        formData.append('inscripcion_id', inscripcionId);
        formData.append('metodo_pago', 'Tarjeta');
        formData.append('comprobante', ''); // No requiere

        router.post(route('alumno.pagos.store'), formData, {
            forceFormData: true,
        });
    };

    // ===========================
    // MERCADOPAGO
    // ===========================
    const handleMercadoPago = async () => {
        if (!inscripcionId) {
            return Toast.error('Seleccioná primero el curso que querés pagar.');
        }

        try {
            const response = await axios.post(route('alumno.pagos.mercadopago.preference'), { inscripcion_id: Number(inscripcionId) });

            const initPoint = response.data.init_point;

            if (!initPoint) {
                return Toast.error('No se pudo iniciar el pago con MercadoPago.');
            }

            window.location.href = initPoint;
        } catch (error) {
            console.error(error);
            Toast.error('No se pudo iniciar el pago con MercadoPago.');
        }
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
                { title: 'Mis pagos', href: route('alumno.pagos.index') },
                { title: 'Registrar pago', href: '#' },
            ]}
        >
            <Head title="Registrar pago" />

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 p-4">
                {/* HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <CreditCard className="h-7 w-7 text-primary" />
                        <div>
                            <h1 className="text-2xl font-semibold text-foreground">Registrar un pago</h1>
                            <p className="text-sm text-muted-foreground">
                                Seleccioná cómo pagaste tu curso. Solo MercadoPago se procesa automáticamente.
                            </p>
                        </div>
                    </div>

                    <Button variant="outline" onClick={() => router.visit(route('alumno.pagos.index'))} className="flex w-fit items-center gap-2">
                        ← Volver
                    </Button>
                </div>

                {/* CARD */}
                <Card className="w-full border border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <CreditCard className="h-5 w-5 text-primary" />
                            Datos del pago
                        </CardTitle>
                        <CardDescription>Seleccioná el curso y el método utilizado.</CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-8">
                        {/* CURSO */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 font-medium">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    Curso (inscripción confirmada)
                                </Label>

                                <Select value={inscripcionId} onValueChange={setInscripcionId}>
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder="Selecciona el curso" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {inscripciones.map((i) => (
                                            <SelectItem key={i.id} value={String(i.id)}>
                                                {i.curso?.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* ARANCEL */}
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 font-medium">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                    Arancel del curso
                                </Label>

                                <Input value={cursoSeleccionado ? cursoSeleccionado.arancel_base : ''} disabled />
                            </div>
                        </div>

                        {/* INFO DEL CURSO */}
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
                            </motion.div>
                        )}

                        {/* MÉTODO + PANEL */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Método */}
                            <div className="grid gap-2">
                                <Label className="font-medium">Método de pago</Label>
                                <Select value={metodo} onValueChange={setMetodo}>
                                    <SelectTrigger className="bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Transferencia">Transferencia</SelectItem>
                                        <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                                        <SelectItem value="MercadoPago">MercadoPago</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* PANEL DINÁMICO */}
                            <div className="grid gap-3 rounded-md border bg-muted/40 p-3">
                                {/* TRANSFERENCIA */}
                                {metodo === 'Transferencia' && (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <QrCode className="h-4 w-4 text-primary" />
                                            <span className="text-xs text-muted-foreground">Alias para transferencias</span>
                                        </div>

                                        <div className="text-sm font-semibold">{alias}</div>

                                        {qrUrl && <img src={qrUrl} className="mt-2 h-32 w-32 rounded-md border bg-background object-contain" />}
                                    </>
                                )}

                                {/* TARJETA — SIMULACIÓN */}
                                {metodo === 'Tarjeta' && (
                                    <div className="grid gap-3 text-sm">
                                        <div className="mb-1 flex items-center gap-2">
                                            <CreditCardIcon className="h-4 w-4 text-primary" />
                                            <span className="font-semibold">Datos de tu tarjeta</span>
                                        </div>

                                        <div className="grid gap-1">
                                            <Label>Número de tarjeta</Label>
                                            <Input
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                                maxLength={16}
                                                placeholder="0000 0000 0000 0000"
                                            />
                                        </div>

                                        <div className="grid gap-1">
                                            <Label>Nombre en la tarjeta</Label>
                                            <Input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Juan Pérez" />
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <Label>Mes</Label>
                                                <Input
                                                    value={expMonth}
                                                    onChange={(e) => setExpMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                                    placeholder="MM"
                                                />
                                            </div>

                                            <div>
                                                <Label>Año</Label>
                                                <Input
                                                    value={expYear}
                                                    onChange={(e) => setExpYear(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                                    placeholder="AA"
                                                />
                                            </div>

                                            <div>
                                                <Label>CVV</Label>
                                                <Input
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                                    placeholder="123"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-1">
                                            <Label>DNI del titular</Label>
                                            <Input
                                                value={dni}
                                                onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                placeholder="12345678"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* MERCADO PAGO */}
                                {metodo === 'MercadoPago' && (
                                    <p className="text-sm text-muted-foreground">Te redirigiremos a MercadoPago para completar tu pago.</p>
                                )}
                            </div>
                        </div>

                        {/* SUBIR COMPROBANTE */}
                        {metodo === 'Transferencia' && (
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2 font-medium">
                                    <Upload className="h-4 w-4 text-primary" />
                                    Subir comprobante del pago
                                </Label>
                                <Input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => setComprobante(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                        )}

                        {/* BOTONES */}
                        {metodo === 'MercadoPago' ? (
                            <Button onClick={handleMercadoPago} className="w-full py-3 text-lg shadow-md" disabled={!inscripcionId}>
                                Pagar con MercadoPago
                            </Button>
                        ) : metodo === 'Tarjeta' ? (
                            <Button onClick={handleTarjeta} className="w-full py-3 text-lg shadow-md" disabled={!inscripcionId}>
                                Confirmar pago con tarjeta
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} className="w-full py-3 text-lg shadow-md" disabled={!inscripcionId}>
                                Registrar pago manual
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
