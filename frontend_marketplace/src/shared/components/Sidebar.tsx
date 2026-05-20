"use client";

import {
  RiAddCircleLine,
  RiDashboardLine,
  RiFileList3Line,
  RiFlashlightLine,
  RiMessage3Line,
  RiSearchLine,
  RiUserLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/infrastructure/auth/AuthContext";
import { cn } from "@/lib/utils";
import { ProfileAvatar } from "./ProfileAvatar";

type NavKey =
  | "dashboard"
  | "search"
  | "publish"
  | "contracts"
  | "messages"
  | "profile";

const navigation: { key: NavKey; href: string; icon: React.ElementType }[] = [
  { key: "dashboard", href: "/dashboard", icon: RiDashboardLine },
  { key: "search", href: "/services", icon: RiSearchLine },
  { key: "publish", href: "/services/new", icon: RiAddCircleLine },
  { key: "contracts", href: "/contracts", icon: RiFileList3Line },
  { key: "messages", href: "/messages", icon: RiMessage3Line },
  { key: "profile", href: "/profile", icon: RiUserLine },
];

export function Sidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { perfil, logout } = useAuth();

  const initials = perfil
    ? `${perfil.first_name?.[0] ?? ""}${perfil.last_name?.[0] ?? ""}`.toUpperCase()
    : "";

  const tipoUsuario = perfil?.tipo_usuario;
  const userTypeLabel =
    tipoUsuario === "freelancer" ||
    tipoUsuario === "cliente" ||
    tipoUsuario === "ambos"
      ? t(`userType.${tipoUsuario}`)
      : "";

  return (
    <aside className="flex h-screen w-56 flex-col bg-[#1f2937] text-white">
      {/* Logo */}
      <Link
        href="/dashboard"
        aria-label={t("goToDashboard")}
        className="flex items-center gap-2.5 px-5 py-5 transition-opacity hover:opacity-80"
      >
        <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500 text-white">
          <RiFlashlightLine className="size-5" />
        </div>
        <span className="text-base font-bold tracking-tight text-white">
          FreelanceHub
        </span>
      </Link>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 px-3 pt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-blue-200/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className="size-5" />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      {/* User profile at bottom */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <ProfileAvatar
            src={perfil?.foto_perfil_url}
            initials={initials}
            alt={
              perfil?.nombre_completo
                ? t("avatarAlt", { name: perfil.nombre_completo })
                : t("avatarAltFallback")
            }
            className="size-9 text-sm"
            fallbackClassName="bg-blue-500 text-white"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {perfil?.nombre_completo}
            </p>
            <p className="text-xs text-blue-200/60">{userTypeLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm text-blue-200/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}
