import { adaptPartnerServices } from "../adapters";
import type { PartnerServicesResult } from "../models";

const JSON_HEADERS = { Accept: "application/json" };

export async function getPartnerServices(): Promise<PartnerServicesResult> {
  const apiUrl = process.env.NEXT_PUBLIC_PARTNER_API_URL?.trim();

  if (!apiUrl) {
    return { status: "missing-config", services: [] };
  }

  let response: Response;
  try {
    response = await fetch(apiUrl, {
      headers: JSON_HEADERS,
      cache: "no-store",
    });
  } catch (error) {
    return {
      status: "error",
      services: [],
      message: error instanceof Error ? error.message : "Network error",
    };
  }

  if (!response.ok) {
    return {
      status: "error",
      services: [],
      message: `HTTP ${response.status}`,
    };
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    return {
      status: "error",
      services: [],
      message: "Invalid JSON response",
    };
  }

  const services = adaptPartnerServices(data);
  if (services.length === 0) {
    return { status: "empty", services: [] };
  }

  return { status: "success", services };
}
