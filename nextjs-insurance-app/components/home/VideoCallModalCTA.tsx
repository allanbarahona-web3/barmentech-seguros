"use client";

import { useEffect, useMemo, useState } from "react";

function extractVimeoId(url: string) {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return match?.[1] ?? null;
}

export default function VideoCallModalCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const configuredVideoUrl = process.env.NEXT_PUBLIC_VIDEO_CALL_INFO_URL?.trim() ?? "";

  const isVimeoUrl = /^https:\/\/(www\.)?vimeo\.com\//i.test(configuredVideoUrl);
  const videoUrl = isVimeoUrl ? configuredVideoUrl : "";

  const playerUrl = useMemo(() => {
    const vimeoId = extractVimeoId(videoUrl);
    if (!vimeoId) {
      return null;
    }

    return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`;
  }, [videoUrl]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("overflow-hidden");

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        disabled={!playerUrl}
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-white font-label-md hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Ver video explicativo
        <span className="material-symbols-outlined">play_circle</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[75] bg-black/60 p-4 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Video explicativo de videollamada medica"
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-black shadow-2xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 z-20 rounded-full bg-black/45 text-white w-9 h-9 hover:bg-black/60"
              aria-label="Cerrar video"
            >
              ×
            </button>

            <div className="aspect-video w-full">
              {playerUrl ? (
                <iframe
                  src={playerUrl}
                  title="Video explicativo de videollamada medica"
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6 text-center text-white/90">
                  No fue posible cargar el video en este momento.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}