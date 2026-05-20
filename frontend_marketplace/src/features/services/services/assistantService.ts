export type AssistantSummaryResult = {
  summary: string;
  suggestions: string[];
  provider: "local" | "gemini" | string;
  disclaimer: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function extractErrorMessage(data: unknown): string {
  if (typeof data === "string") return data;
  if (!data || typeof data !== "object") return "Error desconocido";

  return Object.values(data)
    .flat()
    .map((value) => String(value))
    .join(" ");
}

function normalizeAssistantResult(data: unknown): AssistantSummaryResult {
  if (!data || typeof data !== "object") {
    return {
      summary: "",
      suggestions: [],
      provider: "local",
      disclaimer: "",
    };
  }

  const record = data as Record<string, unknown>;
  const suggestions = Array.isArray(record.suggestions)
    ? record.suggestions
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  return {
    summary: typeof record.summary === "string" ? record.summary : "",
    suggestions,
    provider: typeof record.provider === "string" ? record.provider : "local",
    disclaimer: typeof record.disclaimer === "string" ? record.disclaimer : "",
  };
}

export async function summarizeService(
  fetcher: typeof fetch,
  payload: { title: string; description: string },
): Promise<AssistantSummaryResult> {
  const res = await fetcher(`${API_URL}/api/integrations/summarize-service/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    if (res.ok) return normalizeAssistantResult({});
    throw new Error(`Error del servidor (${res.status})`);
  }

  if (!res.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return normalizeAssistantResult(data);
}
