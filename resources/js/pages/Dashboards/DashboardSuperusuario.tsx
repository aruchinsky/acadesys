import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem, pageProps } from '@/types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const colors = ['#2662d9','#2EB88A','#E23670','#F5A623','#AF57DB'];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Superusuario', href: '/dashboard' },
];

export default function DashboardSuperusuario() {
    const { dashboard } = usePage<pageProps>().props;

    // Datos que vienen desde backend
    // const totalCursos = dashboard?.totalCursos ?? 0;
    // const totalPagos = dashboard?.totalPagos ?? 0;
    // const ingresos = dashboard?.ingresos ?? 0;
    //Datos SIMULADOS para visualización
    const totalCursos = 15;
    const totalPagos = 62;
    const ingresos = 850000;
    const cursosPorCategoria = dashboard?.cursosPorCategoria ?? {
        Programación: 4,
        Redes: 2,
        Diseño: 7,
        Marketing: 9,
    };

    const pieChartData = Object.entries(cursosPorCategoria).map(([cat, count], i) => ({
        especialidad: cat,
        count,
        fill: colors[i % colors.length],
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Superusuario" />

            {/* Indicadores principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Cursos</CardTitle>
                        <CardDescription>Total cursos activos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-6xl text-blue-500 font-bold">{totalCursos}</h2>
                    </CardContent>
                    <CardFooter>Actualizado hoy</CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pagos</CardTitle>
                        <CardDescription>Total de pagos procesados</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-6xl text-green-500 font-bold">{totalPagos}</h2>
                    </CardContent>
                    <CardFooter>Última transacción: hoy</CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ingresos</CardTitle>
                        <CardDescription>Ingresos totales</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-6xl text-purple-500 font-bold">${ingresos.toLocaleString()}</h2>
                    </CardContent>
                    <CardFooter>Actualizado mensualmente</CardFooter>
                </Card>
            </div>

            {/* Pie Chart: Cursos por categoría */}
            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Cursos por Categoría</CardTitle>
                        <CardDescription>Año 2025</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Tooltip />
                                <Pie
                                    data={pieChartData}
                                    dataKey="count"
                                    nameKey="especialidad"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                    <CardFooter>Distribución de cursos por especialidad</CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
