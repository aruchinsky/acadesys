import { Form, Head, router } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { passwordStrength } from 'check-password-strength';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [strength, setStrength] = useState<string>(''); // Too weak, Weak, Medium, Strong

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () =>
        setShowConfirmPassword(!showConfirmPassword);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // calcula la fuerza con la librería
        const result = passwordStrength(value).value;
        setStrength(result);
    };

    const getStrengthColor = (value: string) => {
        switch (value) {
            case 'Too weak':
                return 'bg-red-500';
            case 'Weak':
                return 'bg-orange-500';
            case 'Medium':
                return 'bg-yellow-400';
            case 'Strong':
                return 'bg-green-600';
            default:
                return 'bg-gray-300';
        }
    };

    const getStrengthLabel = (value: string) => {
        switch (value) {
            case 'Too weak':
                return 'Demasiado débil';
            case 'Weak':
                return 'Débil';
            case 'Medium':
                return 'Media';
            case 'Strong':
                return 'Fuerte';
            default:
                return '';
        }
    };

    return (
        <AuthLayout
            title="Crear una cuenta"
            description="Completá tus datos para registrarte en el sistema."
        >
            <Head title="Registro" />
            <Form
                method="post"
                action={route('register')}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            {/* Nombre */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre completo</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Ej: Juan Pérez"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Correo */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="correo@ejemplo.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Contraseña */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Tu contraseña"
                                        onChange={handlePasswordChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Indicador de fuerza */}
                                { /* Muestra la barra solo si hay algo escrito */ }
                                {strength !== '' && (
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`${getStrengthColor(strength)} h-2 rounded-full transition-all`}
                                                style={{
                                                    // ancho relativo según fuerza (approx)
                                                    width:
                                                        strength === 'Too weak'
                                                            ? '20%'
                                                            : strength === 'Weak'
                                                            ? '45%'
                                                            : strength === 'Medium'
                                                            ? '70%'
                                                            : '100%',
                                                }}
                                            />
                                        </div>
                                        <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                                            {getStrengthLabel(strength)}
                                        </p>
                                    </div>
                                )}

                                <InputError message={errors.password} />
                            </div>

                            {/* Confirmación */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmar contraseña
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Repetí tu contraseña"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        tabIndex={-1}
                                        aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Botón de registro */}
                            <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                                {processing && (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                )}
                                Crear cuenta
                            </Button>

                            {/* Botón volver al inicio */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => router.visit(route('home'))}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver al inicio
                            </Button>
                        </div>

                        {/* Enlace a login */}
                        <div className="text-center text-sm text-muted-foreground">
                            ¿Ya tenés una cuenta?{' '}
                            <TextLink href={route('login')} tabIndex={6}>
                                Iniciá sesión
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
