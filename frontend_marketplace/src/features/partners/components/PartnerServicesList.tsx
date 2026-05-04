import type { PartnerService } from "../models";
import { PartnerServiceCard } from "./PartnerServiceCard";

type PartnerServicesListProps = {
  services: PartnerService[];
  labels: {
    source: string;
    price: string;
    open: string;
  };
};

export function PartnerServicesList({
  services,
  labels,
}: PartnerServicesListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <PartnerServiceCard
          key={service.id}
          service={service}
          labels={labels}
        />
      ))}
    </div>
  );
}
