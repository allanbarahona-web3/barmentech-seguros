"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api/client";
import {
  openWhatsAppTarget,
  resolveAdvisorWhatsAppUrl,
  withWhatsAppMessage,
} from "@/lib/contact-advisor";

interface ContactAdvisorButtonProps {
  message: string;
  className: string;
  label?: string;
  loadingLabel?: string;
  disabled?: boolean;
  showChatIcon?: boolean;
  fallbackPhone?: string;
  onBeforeResolve?: () => Promise<void> | void;
  onResolved?: (url: string) => void;
  onUnavailable?: () => void;
}

export default function ContactAdvisorButton({
  message,
  className,
  label = "Hablar con un asesor",
  loadingLabel = "Conectando...",
  disabled = false,
  showChatIcon = false,
  fallbackPhone,
  onBeforeResolve,
  onResolved,
  onUnavailable,
}: ContactAdvisorButtonProps) {
  const [isResolving, setIsResolving] = useState(false);

  const handleClick = async () => {
    const popup = window.open("", "_blank", "noopener,noreferrer");

    try {
      setIsResolving(true);

      if (onBeforeResolve) {
        try {
          await onBeforeResolve();
        } catch (error) {
          console.error("Error running pre-contact action:", error);
        }
      }

      const rawUrl = await resolveAdvisorWhatsAppUrl(apiClient, fallbackPhone);
      if (!rawUrl) {
        popup?.close();
        onUnavailable?.();
        return;
      }

      const finalUrl = withWhatsAppMessage(rawUrl, message);
      openWhatsAppTarget(finalUrl, popup);
      onResolved?.(finalUrl);
    } catch (error) {
      popup?.close();
      console.error("Error opening advisor contact:", error);
      onUnavailable?.();
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isResolving}
      className={className}
    >
      {showChatIcon ? (
        <span className="material-symbols-outlined">chat</span>
      ) : null}
      {isResolving ? loadingLabel : label}
    </button>
  );
}
