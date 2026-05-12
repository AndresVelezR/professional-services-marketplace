export type PartnerService = {
  id: string;
  title: string;
  description?: string;
  sourceName?: string;
  priceLabel?: string;
  externalUrl?: string;
};

export type PartnerServicesResult =
  | { status: "missing-config"; services: [] }
  | { status: "success"; services: PartnerService[] }
  | { status: "empty"; services: [] }
  | { status: "error"; services: []; message: string };
