import { Head, Link, useForm } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { pageProps, Curso, User } from "@/types"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  DollarSign,
  UserCog,
  Clock,
  PlusCircle,
  Trash2,
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function Edit({
  curso,
  profesores,
}: pageProps & { curso: Curso; profesores: User[] }) {
  const { data, setData, put, processing, errors } = useForm({
    nombre: curso.nombre || "",
    descripcion: curso.descripcion || "",
    fecha_inicio: curso.fecha_inicio ? curso.fecha_inicio.substring(0, 10) : "",
    fecha_fin: curso.fecha_fin ? curso.fecha_fin.substring(0, 10) : "",
    arancel_base: curso.arancel_base || "",
    modalidad: curso.modalidad || "Presencial",
    activo: curso.activo ?? true,
    profesores: curso.profesores?.map((p) => p.id) || [],
    horarios:
      curso.horarios?.map((h) => ({
        dia_en_texto: h.dia_en_texto || "",
        hora_inicio: h.hora_inicio || "",
        duracion_min: h.duracion_min?.toString() || "",
        sala: h.sala || "",
        turno: h.turno || "",
      })) || [],
  })

  const addHorario = () => {
    setData("horarios", [
      ...data.horarios,
      { dia_en_texto: "", hora_inicio: "", duracion_min: "", sala: "", turno: "" },
    ])
  }

  const removeHorario = (index: number) => {
    setData(
      "horarios",
      data.horarios.filter((_, i) => i !== index)
    )
  }

  const duplicateHorario = (index: number) => {
    const item = data.horarios[index];
    setData("horarios", [
      ...data.horarios,
      { ...item }
    ]);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(route("cursos.update", curso.id))
  }

  const fade = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04 },
    }),
  }

  const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const SALAS = ["Sala 1", "Sala 2", "Sala 3", "Laboratorio", "Aula Virtual"];

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Cursos", href: route("cursos.index") },
        { title: curso.nombre, href: route("cursos.show", curso.id) },
        { title: "Editar", href: "#" },
      ]}
    >
      <Head title={`Editar curso: ${curso.nombre}`} />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 p-4"
      >
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
            <BookOpen className="h-6 w-6 text-primary" /> Editar Curso
          </h1>
          <Button asChild variant="outline">
            <Link href={route("cursos.show", curso.id)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Volver
            </Link>
          </Button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* DATOS GENERALES */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarDays className="h-5 w-5 text-primary" /> Datos generales
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre del curso</Label>
                <Input
                  id="nombre"
                  value={data.nombre}
                  onChange={(e) => setData("nombre", e.target.value)}
                />
                {errors.nombre && (
                  <p className="text-destructive text-sm mt-1">{errors.nombre}</p>
                )}
              </div>

              <div>
                <Label htmlFor="arancel_base">Arancel base</Label>
                <Input
                  id="arancel_base"
                  type="number"
                  value={data.arancel_base}
                  onChange={(e) => setData("arancel_base", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="fecha_inicio">Fecha de inicio</Label>
                <Input
                  id="fecha_inicio"
                  type="date"
                  value={data.fecha_inicio}
                  onChange={(e) => setData("fecha_inicio", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="fecha_fin">Fecha de finalización</Label>
                <Input
                  id="fecha_fin"
                  type="date"
                  value={data.fecha_fin}
                  onChange={(e) => setData("fecha_fin", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="modalidad">Modalidad</Label>
                <Select
                  value={data.modalidad}
                  onValueChange={(v) => setData("modalidad", v as "Presencial" | "Virtual")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                    <SelectItem value="Virtual">Virtual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 mt-6">
                <input
                  id="activo"
                  type="checkbox"
                  checked={data.activo}
                  onChange={(e) => setData("activo", e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                <Label htmlFor="activo">Curso activo</Label>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  rows={4}
                  value={data.descripcion}
                  onChange={(e) => setData("descripcion", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* PROFESORES */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCog className="h-5 w-5 text-primary" /> Profesores asignados
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {profesores.length > 0 ? (
                profesores.map((p) => (
                  <Badge
                    key={p.id}
                    className={`cursor-pointer select-none ${
                      data.profesores.includes(p.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                    onClick={() =>
                      setData(
                        "profesores",
                        data.profesores.includes(p.id)
                          ? data.profesores.filter((id) => id !== p.id)
                          : [...data.profesores, p.id]
                      )
                    }
                  >
                    {p.nombre} {p.apellido}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay profesores disponibles.</p>
              )}
            </CardContent>
          </Card>

          {/* HORARIOS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" /> Horarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.horarios.map((h, i) => (
                <motion.div
                  key={i}
                  variants={fade}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end border-b border-border/40 pb-3 mb-3"
                >
                <div>
                  <Label>Día</Label>
                  <Select
                    value={h.dia_en_texto}
                    onValueChange={(v) =>
                      setData("horarios", data.horarios.map((v2, idx) =>
                        idx === i ? { ...v2, dia_en_texto: v } : v2
                      ))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar día" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIAS.map((dia) => (
                        <SelectItem key={dia} value={dia}>
                          {dia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                  <div>
                    <Label>Inicio</Label>
                    <Input
                      type="time"
                      value={h.hora_inicio}
                      onChange={(e) =>
                        setData(
                          "horarios",
                          data.horarios.map((v, idx) =>
                            idx === i ? { ...v, hora_inicio: e.target.value } : v
                          )
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Duración (min)</Label>
                    <Input
                      type="number"
                      value={h.duracion_min}
                      onChange={(e) =>
                        setData(
                          "horarios",
                          data.horarios.map((v, idx) =>
                            idx === i ? { ...v, duracion_min: e.target.value } : v
                          )
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Sala</Label>
                    <Select
                      value={h.sala}
                      onValueChange={(v) =>
                        setData("horarios", data.horarios.map((v2, idx) =>
                          idx === i ? { ...v2, sala: v } : v2
                        ))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar sala" />
                      </SelectTrigger>
                      <SelectContent>
                        {SALAS.map((sala) => (
                          <SelectItem key={sala} value={sala}>
                            {sala}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Turno</Label>
                    <Select
                      value={h.turno}
                      onValueChange={(v) =>
                        setData(
                          "horarios",
                          data.horarios.map((v2, idx) =>
                            idx === i ? { ...v2, turno: v } : v2
                          )
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mañana">Mañana</SelectItem>
                        <SelectItem value="Tarde">Tarde</SelectItem>
                        <SelectItem value="Noche">Noche</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 md:col-span-5 flex justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => duplicateHorario(i)}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" /> Duplicar
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => removeHorario(i)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                    </Button>
                  </div>

                </motion.div>
              ))}

              <Button type="button" onClick={addHorario} variant="secondary" className="mt-2">
                <PlusCircle className="h-4 w-4 mr-1" /> Agregar horario
              </Button>
            </CardContent>
          </Card>

          {/* BOTÓN DE GUARDAR */}
          <div className="flex justify-end">
            <Button type="submit" disabled={processing}>
              Actualizar curso
            </Button>
          </div>
        </form>
      </motion.div>
    </AppLayout>
  )
}
