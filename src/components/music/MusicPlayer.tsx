"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipForward, Music2 } from "lucide-react";

const DEFAULT_PLAYLIST_ID = "PLyORnIW1xT6xL7lVBSCsEoI0NPlpcwzj2";
const PLAYLIST_ID =
  process.env.NEXT_PUBLIC_YT_PLAYLIST_ID || DEFAULT_PLAYLIST_ID;
const STORAGE_KEY = "mani-music-on";

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  nextVideo(): void;
  getPlayerState(): number;
  getVideoData(): { title?: string };
  destroy(): void;
}

interface YTPlayerOptions {
  height: string;
  width: string;
  playerVars: Record<string, string | number>;
  events: {
    onReady: () => void;
    onStateChange: (e: { data: number }) => void;
    onError: (e: { data: number }) => void;
  };
}

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, opts: YTPlayerOptions) => YTPlayer;
      PlayerState: { PLAYING: number; ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  });
  return apiPromise;
}

export default function MusicPlayer() {
  const holderRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    if (!PLAYLIST_ID || !holderRef.current) return;
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !holderRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(holderRef.current, {
        height: "1",
        width: "1",
        playerVars: {
          listType: "playlist",
          list: PLAYLIST_ID,
          autoplay: 0,
          controls: 0,
          loop: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            if (cancelled) return;
            setReady(true);
            if (localStorage.getItem(STORAGE_KEY) === "1") {
              playerRef.current?.playVideo();
            }
          },
          onStateChange: (e) => {
            if (cancelled || !window.YT) return;
            setPlaying(e.data === window.YT.PlayerState.PLAYING);
            const t = playerRef.current?.getVideoData()?.title;
            if (t) setTitle(t);
          },
          onError: () => {
            if (!cancelled) playerRef.current?.nextVideo();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  function toggle() {
    const p = playerRef.current;
    if (!p) return;
    if (playing) {
      p.pauseVideo();
      localStorage.setItem(STORAGE_KEY, "0");
    } else {
      p.playVideo();
      localStorage.setItem(STORAGE_KEY, "1");
    }
  }

  if (!PLAYLIST_ID) return null;

  return (
    <div className="fixed bottom-6 right-22 z-60 flex flex-row-reverse items-center gap-3">
      <button
        onClick={toggle}
        disabled={!ready}
        aria-label={playing ? "Pause music" : "Play ambient music"}
        title={playing ? "Pause music" : "Play ambient music"}
        className="group flex h-14 w-14 items-center justify-center border border-white/10 bg-black text-white shadow-2xl transition-all duration-500 hover:border-accent hover:text-accent disabled:opacity-40"
      >
        {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
      </button>

      {/* Equalizer - animates only while playing. */}
      <div
        className={`flex items-end gap-[3px] transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"
          }`}
        aria-hidden
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[3px] bg-accent"
            style={{
              height: "16px",
              animation: playing
                ? `mani-eq 0.9s ease-in-out ${i * 0.15}s infinite alternate`
                : "none",
            }}
          />
        ))}
      </div>

      {playing && (
        <button
          onClick={() => playerRef.current?.nextVideo()}
          aria-label="Next track"
          title="Next track"
          className="flex h-9 w-9 items-center justify-center text-foreground/40 transition-colors hover:text-accent"
        >
          <SkipForward size={14} />
        </button>
      )}

      {/* Now-playing label (truncated). */}
      <span className="hidden max-w-[160px] items-center gap-1.5 truncate text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30 md:flex">
        <Music2 size={10} className="shrink-0" />
        <span className="truncate">{playing && title ? title : "Ambient"}</span>
      </span>

      {/* Hidden YouTube player host (must stay in the DOM to play). */}
      <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
        <div ref={holderRef} />
      </div>

      <style jsx global>{`
        @keyframes mani-eq {
          0% {
            height: 4px;
          }
          100% {
            height: 16px;
          }
        }
      `}</style>
    </div>
  );
}
