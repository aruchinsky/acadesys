import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardList, Clock3, GraduationCap, Sparkles, Users2 } from 'lucide-react';

export default function Profesor() {
    const { user, stats } = usePage<{
        user: User;
        stats: {
            cursosAsignados: number;
            alumnosActivos: number;
            ultimaClase: string | null;
        };
    }>().props;

    const opciones = [
        {
            titulo: 'Mis Cursos',
            descripcion: 'Gestioná tus clases, horarios y alumnos.',
            icono: BookOpen,
            href: route('profesor.cursos.index'),
        },
        {
            titulo: 'Asistencias',
            descripcion: 'Registrá la asistencia diaria de tus cursos.',
            icono: ClipboardList,
            href: route('profesor.asistencias.index'),
        },
    ];

    const fade = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.05 },
        }),
    };

    return (
        <AppLayout>
            <Head title="Dashboard Profesor" />

            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mx-2 rounded-xl border border-border bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6 shadow-sm sm:mx-4 md:mx-8"
            >
                <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
                    <GraduationCap className="h-6 w-6 text-primary" /> ¡Hola, {user?.nombre_completo}!
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">Este es tu espacio docente. Revisá tus cursos, alumnos y asistencias.</p>
            </motion.div>

            {/* KPI DOCENTES */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-8 grid gap-4 px-2 sm:grid-cols-2 sm:px-4 md:px-8 lg:grid-cols-3"
            >
                <Card className="border-border transition-all hover:shadow-md">
                    <CardContent className="flex items-center gap-3 py-5">
                        <div className="rounded-full bg-primary/10 p-3">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Cursos asignados</p>
                            <p className="text-lg font-semibold">{stats.cursosAsignados}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border transition-all hover:shadow-md">
                    <CardContent className="flex items-center gap-3 py-5">
                        <div className="rounded-full bg-primary/10 p-3">
                            <Users2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Alumnos activos</p>
                            <p className="text-lg font-semibold">{stats.alumnosActivos}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border transition-all hover:shadow-md">
                    <CardContent className="flex items-center gap-3 py-5">
                        <div className="rounded-full bg-primary/10 p-3">
                            <Clock3 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Última clase</p>
                            <p className="text-lg font-semibold">{stats.ultimaClase ? stats.ultimaClase : 'Sin registros'}</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* OPCIONES */}
            <div className="mt-8 grid gap-4 px-2 pb-10 sm:grid-cols-2 sm:px-4 md:px-8 lg:grid-cols-3">
                {opciones.map((op, i) => (
                    <motion.div key={op.titulo} variants={fade} initial="hidden" animate="visible" custom={i}>
                        <Card className="flex h-full flex-col border-border transition-all hover:shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                    <op.icono className="h-5 w-5 text-primary" />
                                    {op.titulo}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="flex flex-1 flex-col justify-between py-3">
                                <p className="mb-3 text-sm text-muted-foreground">{op.descripcion}</p>

                                <Button asChild size="sm" className="w-full">
                                    <Link href={op.href}>
                                        <Sparkles className="mr-1 h-4 w-4" /> Ingresar
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </AppLayout>
    );
}
