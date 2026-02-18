"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  RiDashboardLine,
  RiSearchLine,
  RiFileList3Line,
  RiMessage3Line,
  RiUserLine,
  RiFlashlightLine,
} from "@remixicon/react"

import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: RiDashboardLine },
  { name: "Buscar", href: "/services", icon: RiSearchLine },
  { name: "Contratos", href: "/contracts", icon: RiFileList3Line },
  { name: "Mensajes", href: "/messages", icon: RiMessage3Line },
  { name: "Perfil", href: "/profile", icon: RiUserLine },
] as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-56 flex-col bg-[#1f2937] text-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500 text-white">
          <RiFlashlightLine className="size-5" />
        </div>
        <span className="text-base font-bold tracking-tight text-white">
          FreelanceHub
        </span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 px-3 pt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-blue-200/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="size-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User profile at bottom */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
            AJ
          </div>
          <div>
            <p className="text-sm font-medium text-white">Alex Johnson</p>
            <p className="text-xs text-blue-200/60">Plan Premium</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
