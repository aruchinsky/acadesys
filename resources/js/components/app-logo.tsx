// app-logo.tsx
export default function AppLogo() {
    return (
        <div className="flex aspect-square size-40 items-center justify-center">
            <img
                src="/image/acadesys_logo.png"
                alt="AcadeSys Logo"
                className="w-full h-full object-contain" // ocupa todo el bloque sin deformarse
            />
        </div>
    );
}
