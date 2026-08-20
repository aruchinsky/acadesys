import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatFechaLocal } from '@/lib/utils';
import { Curso, pageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, CalendarDays, Clock, Users2 } from 'lucide-react';

export default function ProfesorIndex() {
    const { cursos } = usePage<pageProps>().props;
    const cursosList: Curso[] = Array.isArray(cursos) ? cursos : [];

    const fade = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.05 },
        }),
    };

    const getModalidadBadge = (modalidad?: string) => {
        const colors: Record<string, string> = {
            Presencial: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
            Virtual: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        };
        return <Badge className={`rounded-md px-2 py-0.5 text-xs ${colors[modalidad || 'Presencial'] || ''}`}>{modalidad}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Mis Cursos', href: route('profesor.cursos.index') }]}>
            <Head title="Mis Cursos" />

            <div className="flex flex-col gap-6 p-6">
                <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
                    <BookOpen className="h-6 w-6 text-primary" /> Mis Cursos Asignados
                </h1>

                {cursosList.length === 0 ? (
                    <p className="mt-4 text-sm text-muted-foreground">No tienes cursos asignados actualmente.</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {cursosList.map((curso, i) => (
                            <motion.div key={curso.id} variants={fade} initial="hidden" animate="visible" custom={i}>
                                <Card className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/40 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
                                    {/* CABECERA */}
                                    <CardHeader className="border-b border-border/30 bg-muted/50 pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg leading-tight font-semibold text-foreground">{curso.nombre}</CardTitle>
                                            {getModalidadBadge(curso.modalidad)}
                                        </div>
                                    </CardHeader>

                                    {/* CONTENIDO */}
                                    <CardContent className="flex flex-grow flex-col gap-3 px-5 py-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                                            <span>
                                                {curso.fecha_inicio
                                                    ? `${formatFechaLocal(curso.fecha_inicio)} — ${
                                                          curso.fecha_fin ? formatFechaLocal(curso.fecha_fin) : 'Sin definir'
                                                      }`
                                                    : 'Fechas no definidas'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Users2 className="h-4 w-4 shrink-0 text-primary" />
                                            <span>
                                                {curso.inscripciones_count ?? 0} {curso.inscripciones_count === 1 ? 'inscripto' : 'inscriptos'}
                                            </span>
                                        </div>

                                        {curso.horarios && curso.horarios.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 shrink-0 text-primary" />
                                                <span>
                                                    {curso.horarios[0].dia_en_texto ?? 'Día no definido'}{' '}
                                                    {curso.horarios[0].hora_inicio ? `— ${curso.horarios[0].hora_inicio.slice(0, 5)} hs` : ''}
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>

                                    {/* BOTÓN */}
                                    <div className="flex justify-end border-t border-border/30 bg-muted/30 p-4">
                                        <Button asChild variant="default" size="sm" className="rounded-md">
                                            <Link href={route('profesor.cursos.show', curso.id)}>Ver curso</Link>
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
