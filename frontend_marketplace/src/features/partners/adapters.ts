import type { PartnerService } from "./models";

type UnknownRecord = Record<string, unknown>;

const ID_FIELDS = ["id", "uuid", "pk", "slug"];
const TITLE_FIELDS = ["title", "name", "nombre", "titulo"];
const DESCRIPTION_FIELDS = [
  "description",
  "descripcion",
  "summary",
  "short_description",
  "detalle",
];
const PRICE_FIELDS = ["price", "precio", "amount", "priceLabel"];
const URL_FIELDS = ["url", "detail_url", "externalUrl", "link"];
const SOURCE_FIELDS = ["source", "sourceName", "provider", "team"];

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function valueToString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
}

function pickString(item: UnknownRecord, fields: string[]): string | undefined {
  for (const field of fields) {
    const value = valueToString(item[field]);
    if (value) return value;
  }

  return undefined;
}

function safeExternalUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function fallbackId(title: string, index: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  return `partner-${index}-${slug || "service"}`;
}

function extractItems(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;

  if (isRecord(data)) {
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.data)) return data.data;
  }

  return [];
}

export function adaptPartnerServices(data: unknown): PartnerService[] {
  return extractItems(data).flatMap((rawItem, index) => {
    if (!isRecord(rawItem)) return [];

    const rawTitle = pickString(rawItem, TITLE_FIELDS);
    const description = pickString(rawItem, DESCRIPTION_FIELDS);
    const sourceName = pickString(rawItem, SOURCE_FIELDS);
    const priceLabel = pickString(rawItem, PRICE_FIELDS);
    const externalUrl = safeExternalUrl(pickString(rawItem, URL_FIELDS));

    if (
      !rawTitle &&
      !description &&
      !sourceName &&
      !priceLabel &&
      !externalUrl
    ) {
      return [];
    }

    const title = rawTitle || "Partner service";
    const id = pickString(rawItem, ID_FIELDS) || fallbackId(title, index);

    return [
      {
        id,
        title,
        description,
        sourceName,
        priceLabel,
        externalUrl,
      },
    ];
  });
}
