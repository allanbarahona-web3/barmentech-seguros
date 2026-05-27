import type { AxiosInstance } from "axios";

interface ContactRouteResponse {
  route?: {
    whatsappUrl: string | null;
  };
}

interface PublicSettingsResponse {
  socialMedia?: {
    whatsapp?: string;
  };
}

const DEFAULT_FALLBACK_WHATSAPP = "50670067572";

export function withWhatsAppMessage(rawUrl: string, message: string): string {
  try {
    const url = new URL(rawUrl);
    const existingText = url.searchParams.get("text");

    if (!existingText) {
      url.searchParams.set("text", message);
    }

    return url.toString();
  } catch {
    const separator = rawUrl.includes("?") ? "&" : "?";
    return `${rawUrl}${separator}text=${encodeURIComponent(message)}`;
  }
}

export function normalizeWhatsAppUrl(rawValue?: string | null): string | null {
  if (!rawValue) {
    return null;
  }

  const value = rawValue.trim();
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export function openWhatsAppTarget(url: string, popup: Window | null) {
  if (popup) {
    popup.location.href = url;
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

export async function resolveAdvisorWhatsAppUrl(
  apiClient: AxiosInstance,
  fallbackPhoneOverride?: string,
): Promise<string | null> {
  try {
    const response = await apiClient.get<ContactRouteResponse>(
      "/settings/public/contact-route",
    );
    const resolved = response.data?.route?.whatsappUrl;

    if (resolved) {
      return resolved;
    }
  } catch (error) {
    console.error("Error resolving geo WhatsApp route:", error);
  }

  try {
    const settingsResponse =
      await apiClient.get<PublicSettingsResponse>("/settings/public");
    const fallbackWhatsApp = normalizeWhatsAppUrl(
      settingsResponse.data?.socialMedia?.whatsapp,
    );

    if (fallbackWhatsApp) {
      return fallbackWhatsApp;
    }
  } catch (error) {
    console.error("Error resolving fallback WhatsApp from settings:", error);
  }

  const envFallback = normalizeWhatsAppUrl(
    process.env.NEXT_PUBLIC_ADVISOR_WHATSAPP_FALLBACK,
  );
  if (envFallback) {
    return envFallback;
  }

  return normalizeWhatsAppUrl(fallbackPhoneOverride || DEFAULT_FALLBACK_WHATSAPP);
}
