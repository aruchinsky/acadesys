import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatFechaLocal } from '@/lib/utils';
import { Curso, Inscripcion, pageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, CalendarDays, Clock, UserCheck, Users2 } from 'lucide-react';

export default function AlumnoIndex() {
    const { cursos } = usePage<pageProps>().props;
    const list: Curso[] = Array.isArray(cursos) ? cursos : [];

    const fade = {
        hidden: { opacity: 0, y: 16 },
        visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04 } }),
    };

    const estadoInscripcion = (curso: Curso): Inscripcion | undefined => (curso.inscripciones || [])[0];

    const badgeModalidad = (m?: string) => {
        const cls: Record<string, string> = {
            Presencial: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
            Virtual: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        };
        return <Badge className={`text-xs ${cls[m || 'Presencial'] || ''}`}>{m}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Cursos', href: route('alumno.cursos.index') }]}>
            <Head title="Cursos disponibles" />
            <div className="space-y-6 p-6">
                <h1 className="flex items-center gap-2 text-2xl font-semibold">
                    <BookOpen className="h-6 w-6 text-primary" /> Cursos disponibles
                </h1>

                {list.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay cursos publicados por el momento.</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {list.map((c, i) => {
                            const mi = estadoInscripcion(c);
                            return (
                                <motion.div key={c.id} variants={fade} initial="hidden" animate="visible" custom={i}>
                                    <Card className="flex h-full flex-col border border-border/40 shadow-sm transition hover:shadow-md">
                                        <CardHeader className="border-b border-border/30">
                                            <CardTitle className="flex items-center justify-between gap-2 text-base">
                                                <span className="font-semibold">{c.nombre}</span>
                                                {badgeModalidad(c.modalidad)}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-1 flex-col gap-2 py-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4 text-primary" />
                                                <span>
                                                    {c.fecha_inicio
                                                        ? `${formatFechaLocal(c.fecha_inicio)} — ${c.fecha_fin ? formatFechaLocal(c.fecha_fin) : 'Sin definir'}`
                                                        : 'Fechas no definidas'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users2 className="h-4 w-4 text-primary" />
                                                <span>{c.inscripciones_count ?? 0} inscriptos</span>
                                            </div>
                                            {c.horarios && c.horarios.length > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                    <span>
                                                        {c.horarios[0]?.dia_en_texto || 'Día no definido'}{' '}
                                                        {c.horarios[0]?.hora_inicio ? `— ${c.horarios[0].hora_inicio.slice(0, 5)} hs` : ''}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="mt-2">
                                                {mi ? (
                                                    <Badge className="border border-primary/20 bg-primary/10 text-primary">
                                                        <UserCheck className="mr-1 h-4 w-4" />
                                                        Estado: {mi.estado}
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                                        No inscripto
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                        <div className="flex justify-between border-t border-border/30 p-4">
                                            {!mi && (
                                                <Button size="sm" variant="secondary" onClick={() => router.post(route('cursos.preinscribir', c.id))}>
                                                    Preinscribirme
                                                </Button>
                                            )}

                                            {mi?.estado === 'pendiente' && (
                                                <Button size="sm" variant="outline" disabled>
                                                    Pendiente
                                                </Button>
                                            )}

                                            {mi?.estado === 'rechazada' && (
                                                <Button size="sm" variant="destructive" disabled>
                                                    Rechazada
                                                </Button>
                                            )}

                                            <Button asChild size="sm">
                                                <Link href={route('alumno.cursos.show', { curso: c.id, from: 'disponibles' })}>Ver curso</Link>
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
