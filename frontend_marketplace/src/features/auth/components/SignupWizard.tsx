"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiCodeLine,
  RiLockLine,
  RiMailLine,
  RiSearchLine,
  RiUserLine,
} from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useAuth } from "@/infrastructure/auth/AuthContext"
import { registro } from "@/features/auth/services/authService"
import type { TipoUsuario } from "@/features/auth/models"

const accountTypes: { id: TipoUsuario; title: string; description: string; icon: React.ElementType }[] = [
  {
    id: "freelancer",
    title: "Freelancer",
    description:
      "Busco proyectos emocionantes y quiero ofrecer mis servicios profesionales al mundo.",
    icon: RiBriefcaseLine,
  },
  {
    id: "cliente",
    title: "Cliente",
    description:
      "Busco el mejor talento para realizar mis proyectos y contratar servicios especializados.",
    icon: RiSearchLine,
  },
  {
    id: "ambos",
    title: "Ambos",
    description:
      "Quiero tanto contratar como ofrecer mis servicios en la plataforma sin limitaciones.",
    icon: RiCodeLine,
  },
]

interface BasicData {
  first_name: string
  last_name: string
  email: string
  password: string
}

export function SignupWizard() {
  const [step, setStep] = useState(0)
  const [basicData, setBasicData] = useState<BasicData>({ first_name: "", last_name: "", email: "", password: "" })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Progress bar at the very top */}
      <div className="h-1 w-full bg-border">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${((step + 1) / 2) * 100}%`,
            background: "linear-gradient(to right, #EF4444, #F59E0B, #10B981)",
          }}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4">
        {step === 0 && (
          <StepBasicData
            initial={basicData}
            onNext={(data) => {
              setBasicData(data)
              setStep(1)
            }}
          />
        )}
        {step === 1 && (
          <StepAccountType
            basicData={basicData}
            onBack={() => setStep(0)}
          />
        )}
      </div>
    </div>
  )
}

function StepBasicData({
  initial,
  onNext,
}: {
  initial: BasicData
  onNext: (data: BasicData) => void
}) {
  const [first_name, setFirstName] = useState(initial.first_name)
  const [last_name, setLastName] = useState(initial.last_name)
  const [email, setEmail] = useState(initial.email)
  const [password, setPassword] = useState(initial.password)

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8">
      {/* Logo + Title */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <RiBriefcaseLine className="size-7" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Crear cuenta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paso 1 de 2 — Información básica
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardContent className="flex flex-col gap-5">
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault()
              onNext({ first_name, last_name, email, password })
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="signup-first-name">Nombre</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <RiUserLine className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="signup-first-name"
                    type="text"
                    placeholder="Juan"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="signup-last-name">Apellido</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <RiUserLine className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="signup-last-name"
                    type="text"
                    placeholder="Pérez"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </InputGroup>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="signup-email">Correo electrónico</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <RiMailLine className="size-4 text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput
                  id="signup-email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="signup-password">Contraseña</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <RiLockLine className="size-4 text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </InputGroup>
              <FieldDescription>Mínimo 8 caracteres</FieldDescription>
            </Field>

            <Button type="submit" size="lg" className="w-full h-11 text-base font-semibold">
              Continuar →
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Iniciar sesión
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        Al unirte, aceptas nuestros{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
          Términos de servicio
        </Link>{" "}
        y{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
          Política de privacidad
        </Link>
        .
      </p>
    </div>
  )
}

function StepAccountType({
  basicData,
  onBack,
}: {
  basicData: BasicData
  onBack: () => void
}) {
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSelect(tipo: TipoUsuario) {
    setError("")
    setLoading(true)
    try {
      await registro({ ...basicData, tipo_usuario: tipo })
      await login({ email: basicData.email, password: basicData.password })
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
          ¿Cómo quieres usar la plataforma?
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
          Personaliza tu experiencia seleccionando el perfil que mejor se adapte
          a tus necesidades. Podrás cambiar esto más adelante.
        </p>
        {error && (
          <p className="mt-4 rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {accountTypes.map((type) => (
          <Card
            key={type.id}
            className="flex flex-col items-center text-center transition-shadow hover:shadow-md"
          >
            <CardContent className="flex flex-1 flex-col items-center gap-5 pt-8 pb-6">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <type.icon className="size-7 text-primary" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <h2 className="text-xl font-semibold text-foreground">
                  {type.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {type.description}
                </p>
              </div>
              <Button
                className="w-full h-11 text-base font-semibold"
                disabled={loading}
                onClick={() => handleSelect(type.id)}
              >
                {loading ? "Creando cuenta..." : "Seleccionar"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="ghost" size="lg" onClick={onBack} disabled={loading}>
          <RiArrowLeftLine className="size-4" />
          Volver
        </Button>
      </div>
    </div>
  )
}
