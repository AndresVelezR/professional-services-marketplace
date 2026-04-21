export function ContractHeader() {
    return (
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Contratos activos</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Revisa y gestiona tus proyectos profesionales en curso.
                </p>
            </div>
            <button
                type="button"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
                + Publicar servicio
            </button>
        </div>
    )
}
