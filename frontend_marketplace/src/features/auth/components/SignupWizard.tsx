"use client";

import {
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiCodeLine,
  RiLockLine,
  RiMailLine,
  RiSearchLine,
  RiUserLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { TipoUsuario } from "@/features/auth/models";
import { registro } from "@/features/auth/services/authService";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/infrastructure/auth/AuthContext";

const accountTypeIcons: Record<TipoUsuario, React.ElementType> = {
  freelancer: RiBriefcaseLine,
  cliente: RiSearchLine,
  ambos: RiCodeLine,
};

const accountTypeIds: TipoUsuario[] = ["freelancer", "cliente", "ambos"];

interface BasicData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export function SignupWizard() {
  const [step, setStep] = useState(0);
  const [basicData, setBasicData] = useState<BasicData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [registrationError, setRegistrationError] = useState("");

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
            error={registrationError}
            onNext={(data) => {
              setRegistrationError("");
              setBasicData(data);
              setStep(1);
            }}
          />
        )}
        {step === 1 && (
          <StepAccountType
            basicData={basicData}
            onBack={() => setStep(0)}
            onError={(msg) => {
              setRegistrationError(msg);
              setStep(0);
            }}
          />
        )}
      </div>
    </div>
  );
}

function StepBasicData({
  initial,
  error,
  onNext,
}: {
  initial: BasicData;
  error?: string;
  onNext: (data: BasicData) => void;
}) {
  const t = useTranslations("auth.signup");
  const [first_name, setFirstName] = useState(initial.first_name);
  const [last_name, setLastName] = useState(initial.last_name);
  const [email, setEmail] = useState(initial.email);
  const [password, setPassword] = useState(initial.password);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8">
      {/* Logo + Title */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <RiBriefcaseLine className="size-7" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("stepSubtitle")}
          </p>
        </div>
      </div>

      {error && (
        <p className="w-full rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Card className="w-full">
        <CardContent className="flex flex-col gap-5">
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              onNext({ first_name, last_name, email, password });
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="signup-first-name">
                  {t("firstNameLabel")}
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <RiUserLine className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="signup-first-name"
                    type="text"
                    placeholder={t("firstNamePlaceholder")}
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="signup-last-name">
                  {t("lastNameLabel")}
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <RiUserLine className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="signup-last-name"
                    type="text"
                    placeholder={t("lastNamePlaceholder")}
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </InputGroup>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="signup-email">{t("emailLabel")}</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <RiMailLine className="size-4 text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput
                  id="signup-email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="signup-password">
                {t("passwordLabel")}
              </FieldLabel>
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
              <FieldDescription>{t("passwordHint")}</FieldDescription>
            </Field>

            <Button
              type="submit"
              size="lg"
              className="w-full h-11 text-base font-semibold"
            >
              {t("continue")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        {t("hasAccount")}{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          {t("loginLink")}
        </Link>
      </p>

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
  );
}

function StepAccountType({
  basicData,
  onBack,
  onError,
}: {
  basicData: BasicData;
  onBack: () => void;
  onError: (msg: string) => void;
}) {
  const t = useTranslations("auth.signup.accountType");
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSelect(tipo: TipoUsuario) {
    setLoading(true);
    try {
      await registro({ ...basicData, tipo_usuario: tipo });
      await login({ email: basicData.email, password: basicData.password });
      router.push("/dashboard");
    } catch (err) {
      onError(err instanceof Error ? err.message : t("errorDefault"));
    }
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {accountTypeIds.map((id) => {
          const Icon = accountTypeIcons[id];
          return (
            <Card
              key={id}
              className="flex flex-col items-center text-center transition-shadow hover:shadow-md"
            >
              <CardContent className="flex flex-1 flex-col items-center gap-5 pt-8 pb-6">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="size-7 text-primary" />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <h2 className="text-xl font-semibold text-foreground">
                    {t(`${id}.title`)}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`${id}.description`)}
                  </p>
                </div>
                <Button
                  className="w-full h-11 text-base font-semibold"
                  disabled={loading}
                  onClick={() => handleSelect(id)}
                >
                  {loading ? t("creating") : t("select")}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="ghost" size="lg" onClick={onBack} disabled={loading}>
          <RiArrowLeftLine className="size-4" />
          {t("back")}
        </Button>
      </div>
    </div>
  );
}
