"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { RiLoader4Line, RiSaveLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import type { PerfilCompleto, UpdatePerfilPayload } from "../models"

interface ProfileInfoFormProps {
  perfil: PerfilCompleto
  isSaving: boolean
  onSave: (payload: UpdatePerfilPayload) => Promise<void>
}

export function ProfileInfoForm({
  perfil,
  isSaving,
  onSave,
}: ProfileInfoFormProps) {
  const t = useTranslations("profile.info")
  const [firstName, setFirstName] = useState(perfil.first_name)
  const [lastName, setLastName] = useState(perfil.last_name)
  const [bio, setBio] = useState(perfil.bio)
  const [telefono, setTelefono] = useState(perfil.telefono)
  const [urlPortafolio, setUrlPortafolio] = useState(perfil.url_portafolio)
  const [tipoUsuario, setTipoUsuario] = useState(perfil.tipo_usuario)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      first_name: firstName,
      last_name: lastName,
      bio,
      telefono,
      url_portafolio: urlPortafolio,
      tipo_usuario: tipoUsuario,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">{t("firstName")}</Label>
          <Input
            id="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">{t("lastName")}</Label>
          <Input
            id="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">{t("bio")}</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={t("bioPlaceholder")}
          className="min-h-28 resize-y"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="telefono">{t("phone")}</Label>
          <Input
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder={t("phonePlaceholder")}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label>{t("userType")}</Label>
          <Select value={tipoUsuario} onValueChange={setTipoUsuario}>
            <SelectTrigger className="h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="freelancer">{t("userTypeOptions.freelancer")}</SelectItem>
              <SelectItem value="cliente">{t("userTypeOptions.cliente")}</SelectItem>
              <SelectItem value="ambos">{t("userTypeOptions.ambos")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url_portafolio">{t("portfolioUrl")}</Label>
        <Input
          id="url_portafolio"
          type="url"
          value={urlPortafolio}
          onChange={(e) => setUrlPortafolio(e.target.value)}
          placeholder={t("portfolioPlaceholder")}
          className="h-10"
        />
      </div>

      <Button
        type="submit"
        disabled={isSaving}
        className="h-10 gap-2 bg-action text-action-foreground hover:bg-action/90 font-semibold"
      >
        {isSaving ? (
          <RiLoader4Line className="size-4 animate-spin" />
        ) : (
          <RiSaveLine className="size-4" />
        )}
        {isSaving ? t("saving") : t("save")}
      </Button>
    </form>
  )
}
