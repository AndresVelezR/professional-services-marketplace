"use client";

import {
  RiBriefcaseLine,
  RiGoogleFill,
  RiLinkedinFill,
  RiLockLine,
  RiMailLine,
} from "@remixicon/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/infrastructure/auth/AuthContext";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const locale = useLocale();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password }, locale);
      router.push("/dashboard");
    } catch {
      setError(t("errorDefault"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <RiBriefcaseLine className="size-7" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="w-full">
          <CardContent className="flex flex-col gap-6">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="login-email">{t("emailLabel")}</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <RiMailLine className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="login-email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
              </Field>

              {/* Password */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="login-password">
                    {t("passwordLabel")}
                  </FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t("forgotPassword")}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                  {t("rememberMe")}
                </span>
              </label>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-11 text-base font-semibold"
                disabled={loading}
              >
                {loading ? t("submitting") : t("submit")}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("divider")}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg" className="h-11" disabled>
                <RiGoogleFill className="size-5" />
                Google
              </Button>
              <Button variant="outline" size="lg" className="h-11" disabled>
                <RiLinkedinFill className="size-5" />
                LinkedIn
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Register link */}
        <p className="text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:underline"
          >
            {t("signupLink")}
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground">
          {t.rich("terms", {
            terms: (chunks) => (
              <Link
                href="/terms"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
