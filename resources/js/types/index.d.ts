import { LucideIcon } from "lucide-react"
import type { Config } from "ziggy-js"

// ============================================================
// 🔐 AUTENTICACIÓN Y SESIÓN
// ============================================================

export interface Auth {
  user?: User
  roles?: string[]
  permissions?: string[]
}

// ============================================================
// 🧭 NAVEGACIÓN Y COMPONENTES DE INTERFAZ
// ============================================================

export interface BreadcrumbItem {
  title: string
  href: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface NavItem {
  title: string
  href: string
  icon?: LucideIcon | null
  isActive?: boolean
}

// ============================================================
// 🌍 DATOS COMPARTIDOS GLOBALES (HandleInertiaRequests)
// ============================================================

export interface SharedData {
  name: string
  quote: { message: string; author: string }
  auth: Auth
  ziggy: Config & { location: string }
  sidebarOpen: boolean
  flash: FlashMessages
  [key: string]: unknown
}

export interface FlashMessages {
  success?: string
  error?: string
  warning?: string
  info?: string
}

// ============================================================
// 📚 ENTIDADES PRINCIPALES
// ============================================================

export type EstadoInscripcion = "pendiente" | "confirmada" | "rechazada"
export type MetodoPago = "Efectivo" | "Transferencia" | "Tarjeta"

// --------------------- USUARIO ---------------------
export interface User {
  id: number
  name: string
  email: string
  nombre: string
  apellido: string
  nombre_completo: string
  dni: string
  telefono: string | null
  avatar?: string
  email_verified_at: string | null
  created_at: string
  updated_at: string

  // Relaciones
  inscripciones?: Inscripcion[]
  inscripciones_count?: number
  cursos?: Curso[]
  cursos_count?: number
  pagos?: Pago[]
  pagosAdministrados?: Pago[]
}

// --------------------- CURSOS ---------------------
export interface Curso {
  id: number
  nombre: string
  descripcion: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
  arancel_base: number
  modalidad: "Presencial" | "Virtual"
  activo: boolean
  inscripciones_count?: number
  created_at: string
  updated_at: string

  // Relaciones
  usuarios?: User[]
  inscripciones?: Inscripcion[]
  horarios?: CursoHorario[]
  profesores?: User[]
}


// --------------------- INSCRIPCIONES ---------------------
export interface Inscripcion {
  id: number
  user_id: number
  curso_id: number
  estado: EstadoInscripcion
  fecha_inscripcion: string
  origen: "landing" | "admin"
  created_at: string
  updated_at: string

  // Relaciones
  usuario?: User
  curso?: Curso
  pagos?: Pago[]
  asistencias?: Asistencia[]
}

// --------------------- PAGOS ---------------------
export interface Pago {
  id: number
  user_id: number
  inscripcion_id: number | null
  monto: number
  pagado_at: string
  metodo_pago: MetodoPago
  administrativo_id: number | null
  created_at: string
  updated_at: string

  // Relaciones
  usuario?: User
  administrativo?: User
  inscripcion?: Inscripcion
}

// --------------------- ASISTENCIAS ---------------------
export interface Asistencia {
  id: number
  inscripcion_id: number
  fecha: string
  presente: boolean
  created_at: string
  updated_at: string

  // Relaciones
  inscripcion?: Inscripcion
  usuario?: User
  observacion?: string
}

// --------------------- HORARIOS DE CURSOS ---------------------
export interface CursoHorario {
  id: number
  curso_id: number
  dia_en_texto: string | null
  hora_inicio: string | null
  duracion_min: number | null
  sala: string | null
  turno: "Mañana" | "Tarde" | "Noche" | null
  created_at: string
  updated_at: string
  curso?: Curso
}


// ============================================================
// ⚙️ ROLES Y PERMISOS (Spatie)
// ============================================================

export interface Role {
  id: number
  name: string
  guard_name: string
  users_count?: number
  permissions_count?: number
  created_at: string
  updated_at: string
  permissions?: Permission[]
  [key: string]: unknown
}

export interface Permission {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
}

// Relación usuario ↔ roles
export interface UserWithRoles {
  id: number
  name: string
  email: string
  dni: string
  telefono: string | null
  roles: { id: number; name: string }[]
  [key: string]: unknown
}

// ============================================================
// 📊 DASHBOARD
// ============================================================

export interface DashboardData {
  totalCursos: number
  totalPagos: number
  ingresos: number
  cursosPorCategoria: Record<string, number>
}

// ============================================================
// 🧩 PROPS GLOBALES DE INERTIA
// ============================================================

export interface pageProps {
  flash: FlashMessages

  auth?: {
    user?: User
    roles: string[]
    permissions: string[]
  }

  dashboard?: DashboardData

  // Colecciones principales (se cargan según la vista)
  users?: UserWithRoles[]
  usuarios?: User[]
  roles?: Role[] | { id: number; name: string }[]
  inscripciones?: Inscripcion[]
  cursos?: Curso[]
  pagos?: Pago[]
  asistencias?: Asistencia[]
  cursoHorarios?: CursoHorario[]

  // Propiedades dinámicas adicionales
  [key: string]: unknown
}
