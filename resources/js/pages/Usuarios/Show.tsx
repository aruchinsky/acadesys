import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatFechaLocal } from '@/lib/utils';
import { BreadcrumbItem, Curso, Inscripcion, pageProps, Pago, Role, User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, type Variants } from 'framer-motion';
import { AlertTriangle, ArrowLeft, BookOpen, Calendar, CreditCard, GraduationCap, Mail, Pencil, Phone, Shield, Trash2, User2 } from 'lucide-react';
import { useState } from 'react';

// ===============================================
// 📌 Tipado de props que vienen desde el backend
// ===============================================
interface Props {
    usuario: UsuarioDetalle;
    rol: string;
}

type UsuarioDetalle = User & {
    inscripciones: Inscripcion[];
    pagos: Pago[];
    roles?: Role[];
    cursosDictados?: Curso[];
    pagos_realizados?: Pago[];
};

interface VistaUsuarioProps {
    usuario: UsuarioDetalle;
    fade: Variants;
}

// ===============================================
// 📌 Componente principal
// ===============================================
export default function Show() {
    const { usuario, rol } = usePage<pageProps & Props>().props;
    const [openDelete, setOpenDelete] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Usuarios', href: route('usuarios.index') },
        { title: usuario.nombre_completo, href: route('usuarios.show', usuario.id) },
    ];

    const fade: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.05 },
        }),
    };

    const handleConfirmDelete = () => {
        setOpenDelete(false);
        router.delete(route('usuarios.destroy', usuario.id));
    };

    // ===============================================
    // 📌 Render dinámico por rol
    // ===============================================
    const renderVista = () => {
        switch (rol) {
            case 'alumno':
                return <VistaAlumno usuario={usuario} fade={fade} />;
            case 'profesor':
                return <VistaProfesor usuario={usuario} fade={fade} />;
            case 'administrativo':
                return <VistaAdministrativo usuario={usuario} fade={fade} />;
            case 'superusuario':
            default:
                return <VistaSuperusuario usuario={usuario} fade={fade} />;
        }
    };

    // ===============================================
    // 📌 RETURN FINAL
    // ===============================================
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Usuario - ${usuario.nombre_completo}`} />

            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 p-4">
                {/* ENCABEZADO */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href={route('usuarios.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                        </Link>
                    </Button>

                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href={route('usuarios.edit', usuario.id)}>
                                <Pencil className="mr-2 h-4 w-4" /> Editar
                            </Link>
                        </Button>

                        <Button variant="destructive" onClick={() => setOpenDelete(true)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </Button>
                    </div>
                </div>

                {/* Render dinámico */}
                {renderVista()}
            </motion.div>

            {/* 🔴 MODAL ELIMINAR */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Eliminar usuario
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esto eliminará al usuario <strong>{usuario.nombre_completo}</strong>. ¿Seguro que deseas continuar?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Sí, eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

// ===============================================================
// 🧩 COMPONENTES POR ROL
// ===============================================================

// ---------------------------------------------------------------
// 👤 DATOS PERSONALES (USADO POR TODAS LAS VISTAS)
// ---------------------------------------------------------------
function DatosPersonales({ usuario }: { usuario: UsuarioDetalle }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <User2 className="h-5 w-5" /> Información Personal
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-sm text-muted-foreground">Nombre completo</p>
                    <p className="font-medium">{usuario.nombre_completo}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">DNI</p>
                    <p className="font-medium">{usuario.dni ?? '—'}</p>
                </div>

                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{usuario.email}</p>
                </div>

                {usuario.telefono && (
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p>{usuario.telefono}</p>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>Registrado el {formatFechaLocal(usuario.created_at)}</p>
                </div>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------
// 🎓 VISTA ALUMNO
// ---------------------------------------------------------------
function VistaAlumno({ usuario, fade }: VistaUsuarioProps) {
    return (
        <>
            <motion.div variants={fade} initial="hidden" animate="visible" custom={0}>
                <DatosPersonales usuario={usuario} />
            </motion.div>

            {/* INSCRIPCIONES */}
            <motion.div variants={fade} initial="hidden" animate="visible" custom={1}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600">
                            <BookOpen className="h-5 w-5" /> Inscripciones
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {usuario.inscripciones?.length ? (
                            <div className="space-y-3">
                                {usuario.inscripciones.map((i) => (
                                    <div key={i.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div>
                                            <p className="font-medium">{i.curso?.nombre}</p>
                                            <p className="text-sm text-muted-foreground">Inscripto: {formatFechaLocal(i.fecha_inscripcion)}</p>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                i.estado === 'confirmada'
                                                    ? 'bg-green-100 text-green-700'
                                                    : i.estado === 'pendiente'
                                                      ? 'bg-yellow-100 text-yellow-700'
                                                      : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {i.estado}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground">Sin inscripciones registradas.</p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* PAGOS */}
            <motion.div variants={fade} initial="hidden" animate="visible" custom={2}>
                <HistorialPagos titulo="Historial de Pagos" pagos={usuario.pagos} />
            </motion.div>
        </>
    );
}

// ---------------------------------------------------------------
// 🎓 VISTA PROFESOR
// ---------------------------------------------------------------
function VistaProfesor({ usuario, fade }: VistaUsuarioProps) {
    return (
        <>
            <motion.div variants={fade} initial="hidden" animate="visible" custom={0}>
                <DatosPersonales usuario={usuario} />
            </motion.div>

            <motion.div variants={fade} initial="hidden" animate="visible" custom={1}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-600">
                            <GraduationCap className="h-5 w-5" /> Cursos Dictados
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {usuario.cursosDictados?.length ? (
                            <div className="space-y-3">
                                {usuario.cursosDictados.map((c) => (
                                    <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <p className="font-medium">{c.nombre}</p>

                                        <Button asChild variant="secondary" size="sm">
                                            <Link href={route('cursos.show', c.id)}>Ver curso</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground">Este profesor no tiene cursos asignados.</p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </>
    );
}

// ---------------------------------------------------------------
// 🏦 VISTA ADMINISTRATIVO
// ---------------------------------------------------------------
function VistaAdministrativo({ usuario, fade }: VistaUsuarioProps) {
    return (
        <>
            <motion.div variants={fade} initial="hidden" animate="visible" custom={0}>
                <DatosPersonales usuario={usuario} />
            </motion.div>

            <motion.div variants={fade} initial="hidden" animate="visible" custom={1}>
                <HistorialPagos titulo="Pagos Procesados" pagos={usuario.pagos_realizados ?? []} />
            </motion.div>
        </>
    );
}

// ---------------------------------------------------------------
// 🛡️ VISTA SUPERUSUARIO
// ---------------------------------------------------------------
function VistaSuperusuario({ usuario, fade }: VistaUsuarioProps) {
    return (
        <>
            <motion.div variants={fade} initial="hidden" animate="visible" custom={0}>
                <DatosPersonales usuario={usuario} />
            </motion.div>

            <motion.div variants={fade} initial="hidden" animate="visible" custom={1}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <Shield className="h-5 w-5" /> Información del Sistema
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2">
                        <p className="text-sm">
                            Rol principal: <strong>{usuario.roles?.[0]?.name ?? '—'}</strong>
                        </p>

                        <p className="text-sm">Total de inscripciones: {usuario.inscripciones?.length ?? 0}</p>

                        <p className="text-sm">Total de pagos realizados: {usuario.pagos?.length ?? 0}</p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={fade} initial="hidden" animate="visible" custom={2}>
                <HistorialPagos titulo="Historial de Pagos" pagos={usuario.pagos} />
            </motion.div>
        </>
    );
}

// ---------------------------------------------------------------
// 💳 HISTORIAL DE PAGOS (USADO POR 3 ROLES)
// ---------------------------------------------------------------
function HistorialPagos({ pagos, titulo }: { pagos?: Pago[]; titulo: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <CreditCard className="h-5 w-5" /> {titulo}
                </CardTitle>
            </CardHeader>

            <CardContent>
                {pagos?.length ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-4 py-2 text-left text-muted-foreground">Fecha</th>
                                    <th className="px-4 py-2 text-left text-muted-foreground">Monto</th>
                                    <th className="px-4 py-2 text-left text-muted-foreground">Método</th>
                                </tr>
                            </thead>

                            <tbody>
                                {pagos.map((p: Pago) => (
                                    <tr key={p.id} className="border-b hover:bg-accent/10">
                                        <td className="px-4 py-2">{formatFechaLocal(p.pagado_at)}</td>
                                        <td className="px-4 py-2">${p.monto}</td>
                                        <td className="px-4 py-2">{p.metodo_pago}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">No hay pagos registrados.</p>
                )}
            </CardContent>
        </Card>
    );
}
