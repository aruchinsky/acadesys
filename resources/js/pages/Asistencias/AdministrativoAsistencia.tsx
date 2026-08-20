import AppLayout from '@/layouts/app-layout';
import { Curso, pageProps } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CalendarDays, History, NotebookText, Save, UserCheck, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AdministrativoAsistencia() {
    const { cursos, fechaHoy } = usePage<pageProps>().props;
    const cursosList: Curso[] = Array.isArray(cursos) ? cursos : [];

    const [cursoSeleccionado, setCursoSeleccionado] = useState<number | null>(null);
    const [fecha, setFecha] = useState<string>(fechaHoy as string);
    const [asistencias, setAsistencias] = useState<Record<number, { presente: boolean; observacion: string }>>({});

    const { processing } = useForm({});

    const cursoActual = cursosList.find((c) => c.id === cursoSeleccionado);

    const toggleAsistencia = (userId: number) => {
        setAsistencias((prev) => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                presente: !prev[userId]?.presente,
                observacion: prev[userId]?.observacion || '',
            },
        }));
    };

    const handleObservacionChange = (userId: number, value: string) => {
        setAsistencias((prev) => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                observacion: value,
                presente: prev[userId]?.presente ?? false,
            },
        }));
    };

    const handleGuardar = () => {
        if (!cursoSeleccionado) return;

        router.post(
            route('administrativo.asistencias.store'),
            {
                curso_id: cursoSeleccionado,
                fecha,
                asistencias,
            },
            {
                preserveState: true,
                onSuccess: () => {
                    router.visit(route('dashboard'));
                },
            },
        );
    };

    const fade = {
        hidden: { opacity: 0, y: 10 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.03 },
        }),
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Administrativo', href: route('dashboard') },
                { title: 'Asistencias', href: route('administrativo.asistencias.index') },
            ]}
        >
            <Head title="Registrar Asistencias" />

            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
                        <UserCheck className="h-6 w-6 text-primary" /> Registro de Asistencias
                    </h1>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        {/* BOTÓN GUARDAR */}
                        <Button onClick={handleGuardar} disabled={!cursoSeleccionado || processing} className="gap-2">
                            <Save className="h-4 w-4" /> Guardar Asistencia
                        </Button>

                        {/* BOTÓN HISTORIAL */}
                        <Button asChild variant="secondary" disabled={!cursoSeleccionado} className="gap-2 px-4 py-2 text-sm">
                            <Link href={cursoSeleccionado ? route('administrativo.asistencias.historial', { curso: cursoSeleccionado }) : '#'}>
                                <History className="h-4 w-4" /> Ver historial
                            </Link>
                        </Button>

                        {/* BOTÓN VOLVER */}
                        <Button asChild variant="outline" className="gap-2">
                            <Link href={route('dashboard')}>
                                <Users className="h-4 w-4" /> Volver al panel
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* FILTROS */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <NotebookText className="h-5 w-5 text-primary" /> Selección de curso
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex flex-1 flex-col gap-1">
                            <Label>Curso</Label>
                            <Select value={cursoSeleccionado?.toString() || ''} onValueChange={(v) => setCursoSeleccionado(Number(v))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar curso..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {cursosList.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex w-full flex-col gap-1 sm:w-48">
                            <Label>Fecha</Label>
                            <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="text-sm" />
                        </div>
                    </CardContent>
                </Card>

                {/* TABLA DE ASISTENCIAS */}
                {cursoActual ? (
                    <Card className="border border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <CalendarDays className="h-5 w-5 text-primary" /> {cursoActual.nombre}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {fecha} — {cursoActual.inscripciones?.length ?? 0} alumnos inscriptos
                            </p>
                        </CardHeader>

                        <CardContent>
                            {cursoActual.inscripciones && cursoActual.inscripciones.length > 0 ? (
                                <table className="min-w-full table-auto text-sm">
                                    <thead className="bg-muted text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Alumno</th>
                                            <th className="px-4 py-2 text-left">DNI</th>
                                            <th className="px-4 py-2 text-center">Presente</th>
                                            <th className="px-4 py-2 text-left">Observación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cursoActual.inscripciones.map((ins, i) => (
                                            <motion.tr
                                                key={ins.id}
                                                variants={fade}
                                                initial="hidden"
                                                animate="visible"
                                                custom={i}
                                                className="border-b transition-colors hover:bg-accent/10"
                                            >
                                                <td className="px-4 py-2 font-medium">{ins.usuario?.nombre_completo || 'Sin datos'}</td>
                                                <td className="px-4 py-2">{ins.usuario?.dni || '—'}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <Checkbox
                                                        checked={!!asistencias[ins.user_id]?.presente}
                                                        onCheckedChange={() => toggleAsistencia(ins.user_id)}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Input
                                                        type="text"
                                                        placeholder="Observación..."
                                                        value={asistencias[ins.user_id]?.observacion || ''}
                                                        onChange={(e) => handleObservacionChange(ins.user_id, e.target.value)}
                                                        className="text-sm"
                                                    />
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="py-4 text-center text-sm text-muted-foreground">No hay alumnos inscriptos en este curso.</p>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <p className="text-sm text-muted-foreground italic">Seleccioná un curso para comenzar a registrar asistencias.</p>
                )}
            </motion.div>
        </AppLayout>
    );
}
