"use client";

import { RiArrowLeftLine, RiEditLine, RiLoader4Line } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PropuestaModal } from "@/features/contracts/components/PropuestaModal";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuthFetch } from "@/infrastructure/auth/useAuthFetch";
import { toServiceDetailProps } from "./adapters";
import { FreelancerProfileCard } from "./components/FreelancerProfileCard";
import { ReviewCard } from "./components/ReviewCard";
import { ReviewsSummary } from "./components/ReviewsSummary";
import { ServiceDescription } from "./components/ServiceDescription";
import { ServiceGallery } from "./components/ServiceGallery";
import { ServicePricingCard } from "./components/ServicePricingCard";
import { useCalificaciones } from "./hooks/useCalificaciones";
import { usePublicacion } from "./hooks/usePublicacion";
import { closePublicacion } from "./services/publicacionService";

interface ServiceDetailProps {
  id: string;
}

export function ServiceDetail({ id }: ServiceDetailProps) {
  const t = useTranslations("services.detail");
  const tMy = useTranslations("services.my");
  const tReviews = useTranslations("services.reviews");
  const authFetch = useAuthFetch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const backHref = searchParams.get("from") === "dashboard" ? "/dashboard" : "/services";
  const { data, isLoading, error } = usePublicacion(id);
  const { data: calificaciones } = useCalificaciones(data?.creador.id);
  const [modalOpen, setModalOpen] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const [closeError, setCloseError] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);

  async function handleClose() {
    if (!confirmClose) {
      setConfirmClose(true);
      return;
    }
    setCloseLoading(true);
    setCloseError(null);
    try {
      await closePublicacion(id, authFetch);
      router.push("/services/my");
    } catch (err) {
      setCloseError(err instanceof Error ? err.message : tMy("closeError"));
      setConfirmClose(false);
    } finally {
      setCloseLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <RiLoader4Line className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">{t("loadError", { error })}</p>
        <Link href={backHref}>
          <Button variant="outline" size="sm">
            {t("back")}
          </Button>
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const s = toServiceDetailProps(data);

  return (
    <div className="space-y-4">
      <div>
        <Link href={backHref}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <RiArrowLeftLine className="size-4" />
            {t("back")}
          </Button>
        </Link>
      </div>

      {data.is_owner && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <p className="flex-1 text-sm text-muted-foreground">{tMy("ownerBanner")}</p>
          <Link href={`/services/${id}/edit`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <RiEditLine className="size-4" />
              {tMy("edit")}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={closeLoading}
            className={confirmClose ? "border-destructive text-destructive hover:bg-destructive/10" : ""}
          >
            {closeLoading
              ? tMy("closing")
              : confirmClose
                ? tMy("confirmClose")
                : tMy("close")}
          </Button>
          {confirmClose && !closeLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmClose(false)}
            >
              {tMy("cancel")}
            </Button>
          )}
        </div>
      )}

      {closeError && (
        <p className="text-sm text-destructive">{closeError}</p>
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left column */}
        <div className="flex-[3] space-y-8">
          <ServiceGallery category={s.category} images={s.images} />

          <ServiceDescription
            description={s.description}
            includes={s.includes}
          />

          <FreelancerProfileCard
            name={s.freelancer.name}
            initials={s.freelancer.initials}
            title={s.freelancer.title}
            bio={s.freelancer.bio}
            rating={s.rating}
            reviews={s.reviews}
            creatorId={s.creatorId}
          />

          {/* Reviews section */}
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              {tReviews("title")}
            </h2>

            {calificaciones && calificaciones.total > 0 ? (
              <>
                <ReviewsSummary
                  averageRating={calificaciones.promedios.general}
                  totalReviews={calificaciones.total}
                  breakdown={[5, 4, 3, 2, 1].map((stars) => {
                    const count = calificaciones.calificaciones.filter(
                      (c) => Math.round(c.promedio) === stars,
                    ).length;
                    return {
                      stars,
                      percentage:
                        calificaciones.total > 0
                          ? Math.round((count / calificaciones.total) * 100)
                          : 0,
                    };
                  })}
                />
                <div className="space-y-4">
                  {calificaciones.calificaciones.map((c) => (
                    <ReviewCard
                      key={c.id}
                      name={c.calificador_nombre}
                      initials={c.calificador_nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                      date={new Date(c.created_at).toLocaleDateString()}
                      rating={Math.round(c.promedio)}
                      comment={c.comentario || tReviews("noComment")}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {tReviews("empty")}
              </p>
            )}
          </section>
        </div>

        {/* Right column - sticky pricing */}
        <div className="flex-[2] lg:sticky lg:top-0 lg:self-start">
          <ServicePricingCard
            title={data.titulo}
            author={s.freelancer.name}
            price={s.price}
            includes={s.includes}
            deliveryTime={s.deliveryTime}
            onContratar={data.is_owner ? undefined : () => setModalOpen(true)}
          />
        </div>
      </div>

      {!data.is_owner && (
        <PropuestaModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          publicacionId={id}
          precioBase={s.price}
        />
      )}
    </div>
  );
}
