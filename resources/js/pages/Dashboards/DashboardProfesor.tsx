import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Profesor', href: '/dashboard' },
];

export default function DashboardProfesor() {
    const cursosAsignados = 5;
    const alumnosTotales = 120;
    const tareasPendientes = 12;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Profesor" />
            <div className="grid auto-rows-min gap-4 md:grid-cols-3 p-4">
                <Card><CardHeader><CardTitle>Cursos</CardTitle></CardHeader><CardContent><h2 className="text-6xl text-indigo-500">{cursosAsignados}</h2></CardContent><CardFooter>Cursos asignados</CardFooter></Card>
                <Card><CardHeader><CardTitle>Alumnos</CardTitle></CardHeader><CardContent><h2 className="text-6xl text-green-500">{alumnosTotales}</h2></CardContent><CardFooter>Total de alumnos inscritos</CardFooter></Card>
                <Card><CardHeader><CardTitle>Tareas</CardTitle></CardHeader><CardContent><h2 className="text-6xl text-red-500">{tareasPendientes}</h2></CardContent><CardFooter>Tareas pendientes de corrección</CardFooter></Card>
            </div>
        </AppLayout>
    );
}
