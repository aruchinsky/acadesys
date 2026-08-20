// app-logo.tsx
export default function AppLogo() {
    return (
        <div className="flex aspect-square size-40 items-center justify-center">
            <img
                src="/acadesys_logo.png"
                alt="AcadeSys Logo"
                className="h-full w-full object-contain" // ocupa todo el bloque sin deformarse
            />
        </div>
    );
}
