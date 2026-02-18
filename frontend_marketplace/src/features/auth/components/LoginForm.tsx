"use client"

import Link from "next/link"
import {
  RiBriefcaseLine,
  RiGoogleFill,
  RiLinkedinFill,
  RiLockLine,
  RiMailLine,
} from "@remixicon/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function LoginForm() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <RiBriefcaseLine className="size-7" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Iniciar Sesión
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Bienvenido de nuevo a la plataforma
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="w-full">
          <CardContent className="flex flex-col gap-6">
            <form className="flex flex-col gap-5">
              {/* Email */}
              <Field>
                <FieldLabel htmlFor="login-email">Email</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <RiMailLine className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="login-email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                  />
                </InputGroup>
              </Field>

              {/* Password */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="login-password">Contraseña</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <InputGroup>
                  <InputGroupAddon>
                    <RiLockLine className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </InputGroup>
              </Field>

              {/* Remember me */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="size-4 rounded border-input accent-primary"
                />
                <span className="text-sm text-muted-foreground">
                  Recordar mi sesión
                </span>
              </label>

              {/* Submit */}
              <Button type="submit" size="lg" className="w-full h-11 text-base font-semibold">
                Ingresar
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                O continuar con
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg" className="h-11">
                <RiGoogleFill className="size-5" />
                Google
              </Button>
              <Button variant="outline" size="lg" className="h-11">
                <RiLinkedinFill className="size-5" />
                LinkedIn
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Register link */}
        <p className="text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:underline"
          >
            Regístrate
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground">
          Al ingresar, aceptas nuestros{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
            Términos de Servicio
          </Link>{" "}
          y{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            Política de Privacidad
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
