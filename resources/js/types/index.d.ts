import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export type EstadoInscripcion = 'pendiente' | 'confirmada' | 'rechazada';
export type MetodoPago = 'Efectivo' | 'Transferencia' | 'Tarjeta';

export interface User {
    id: number;
    name: string;
    email: string;
    nombre: string;
    apellido: string;
    nombre_completo: string;
    dni: string;
    telefono: string | null;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    inscripciones?: Inscripcion[];
    inscripciones_count?: number;
    cursos?: Curso[];
    cursos_count?: number;
    pagos?: Pago[];
    pagosAdministrados?: Pago[];
}

export interface Inscripcion {
    id: number;
    user_id: number;
    curso_id: number;
    estado: EstadoInscripcion;
    fecha_inscripcion: string;
    origen: 'landing' | 'admin';
    created_at: string;
    updated_at: string;
    curso: string;
    usuario?: User;
    pagos?: Pago[];
    asistencias?: Asistencia[];
}

export interface Curso {
    id: number;
    nombre: string;
    descripcion: string | null;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    created_at: string;
    updated_at: string;
    usuarios?: User[];
    inscripciones?: Inscripcion[];
    horarios?: CursoHorario[];
}

export interface Pago {
    id: number;
    user_id: number;
    inscripcion_id: number | null;
    monto: number;
    pagado_at: string;
    metodo_pago: MetodoPago;
    administrativo_id: number | null;
    created_at: string;
    updated_at: string;
    usuario?: User;
    administrativo?: User;
    inscripcion?: Inscripcion;
}

export interface Asistencia {
    id: number;
    inscripcion_id: number;
    fecha: string;
    presente: boolean;
    created_at: string;
    updated_at: string;
    inscripcion?: Inscripcion;
    usuario?: User;
}

export interface CursoHorario {
    id: number;
    curso_id: number;
    dia_semana: number;
    hora_inicio: string;
    hora_fin: string;
    created_at: string;
    updated_at: string;
    curso?: Curso;
}


export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions_count: number;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface Inscripcion {
    id: number;
    user_id: number;
    curso_id: number;
    estado: 'pendiente' | 'confirmada' | 'rechazada';
    fecha_inscripcion: string;
    origen: 'landing' | 'admin';
    created_at: string;
    updated_at: string;
    usuario?: User;
    curso?: Curso;
    pagos?: Pago[];
    asistencias?: Asistencia[];
}

export interface Curso {
    id: number;
    nombre: string;
    descripcion: string | null;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    created_at: string;
    updated_at: string;
    usuarios?: User[];
    inscripciones?: Inscripcion[];
    horarios?: CursoHorario[];
}

export interface Pago {
    id: number;
    user_id: number;
    inscripcion_id: number | null;
    monto: number;
    pagado_at: string;
    metodo_pago: 'Efectivo' | 'Transferencia' | 'Tarjeta';
    administrativo_id: number | null;
    created_at: string;
    updated_at: string;
    usuario?: User;
    administrativo?: User;
    inscripcion?: Inscripcion;
}

export interface Asistencia {
    id: number;
    inscripcion_id: number;
    fecha: string;
    presente: boolean;
    created_at: string;
    updated_at: string;
    inscripcion?: Inscripcion;
    usuario?: User;
}

export interface CursoHorario {
    id: number;
    curso_id: number;
    dia_semana: number;
    hora_inicio: string;
    hora_fin: string;
    created_at: string;
    updated_at: string;
    curso?: Curso;
}

//Interfaces para el proyecto
export interface pageProps {
    flash: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };

    [key: string]: unknown;
    //roles y permisos
    auth?: {
        user?: User;
        roles: string[];
        permissions: string[];
    }

    usuarios: User[];
    roles: Role[];
    permisos: Permission[];
    inscripciones: Inscripcion[];
    cursos: Curso[];
    pagos: Pago[];
    asistencias: Asistencia[];
    cursoHorarios: CursoHorario[];
}
