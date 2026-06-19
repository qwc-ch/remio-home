/*
 * @Author: kasuie
 * @Date: 2024-08-18 11:34:25
 * @LastEditors: kasuie
 * @LastEditTime: 2025-06-18 16:00:00
 * @Description: Music Player adapted from Firefly design
 */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  TrackNext,
  TrackPrevious,
  Loop,
  Shuffle,
  VolumeHigh,
  VolumeXmark,
} from "@kasuie/icon";
import { clsx } from "@kasuie/utils";

interface Track {
  name: string;
  artist: string;
  url: string;
  pic?: string;
  lrc?: string;
}

interface LyricsLine {
  time: number;
  text: string;
}

interface LocalSong {
  name: string;
  artist: string;
  url: string;
  cover?: string;
  lrc?: string;
}

interface MetingConfig {
  api?: string;
  server?: string;
  type?: string;
  id?: string;
  auth?: string;
  fallbackApis?: string[];
}

interface MusicConfig {
  enable?: boolean;
  mode?: "meting" | "local";
  volume?: number;
  playMode?: "list" | "one" | "random";
  showLyrics?: boolean;
  meting?: MetingConfig;
  local?: {
    playlist?: LocalSong[];
  };
}

type PlayMode = 0 | 1 | 2;

function proxyAudioUrl(url: string): string {
  if (!url || url.startsWith("/") || url.startsWith("blob:")) return url;
  return `/api/music/audio?url=${encodeURIComponent(url)}`;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

function parseLRC(lrc: string): LyricsLine[] {
  if (!lrc) return [];
  const lines = lrc.split("\n");
  const result: LyricsLine[] = [];
  const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
  for (const line of lines) {
    const matches = Array.from(line.matchAll(timeReg));
    if (matches.length > 0) {
      const text = line.replace(timeReg, "").trim();
      if (text) {
        for (const match of matches) {
          const m = parseInt(match[1]);
          const s = parseInt(match[2]);
          const ms = parseInt(match[3]);
          const time = m * 60 + s + ms / (match[3].length === 3 ? 1000 : 100);
          result.push({ time, text });
        }
      }
    }
  }
  return result.sort((a, b) => a.time - b.time);
}

const MusicNoteIcon = () => (
  <svg className="text-2xl opacity-40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>
);

const SubtitlesIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6v-2zm0 4h8v2H6v-2zm10 0h2v2h-2v-2zm-6-4h8v2h-8v-2z"/>
  </svg>
);

const SubtitlesOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6.83 10.83L8 12l-1.17 1.17L5.66 12l1.17-1.17zM10 14h2v2h-2v-2zm6-4h-2V8h2v2zm-2 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm-2 2h2v2h-2v-2z"/>
  </svg>
);

const PlaylistIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
  </svg>
);

const RepeatOneIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/>
  </svg>
);

const SyncIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="text-3xl" aria-hidden="true">
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
  </svg>
);

/* ───────── Music Toggle Button (goes inside Controller's settings menu) ───────── */

export const MusicToggle = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div
    onClick={onToggle}
    className="relative z-10 flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/15 opacity-75 shadow-[2px_2px_10px_rgba(0,0,0,0.13)] transition duration-300 hover:opacity-100"
    title={isOpen ? "关闭音乐播放器" : "打开音乐播放器"}
  >
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  </div>
);

/* ───────── Player Panel ───────── */

export const Player = ({
  open,
  musicConfig,
  primaryColor,
}: {
  open: boolean;
  musicConfig?: MusicConfig | null;
  primaryColor?: string;
}) => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    if (typeof window === "undefined") return musicConfig?.volume ?? 0.7;
    const saved = localStorage.getItem("music-player-volume");
    return saved ? parseFloat(saved) : (musicConfig?.volume ?? 0.7);
  });
  const [isMuted, setIsMuted] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>(() => {
    const pm = musicConfig?.playMode ?? "list";
    if (pm === "random") return 2;
    if (pm === "one") return 1;
    return 0;
  });
  const [lyrics, setLyrics] = useState<LyricsLine[]>([]);
  const [currentLrcIndex, setCurrentLrcIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlistFullOpen, setPlaylistFullOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lrcContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadVersionRef = useRef(0);
  const initializedRef = useRef(false);
  const lastFetchRef = useRef(0);

  const currentTrack = playlist[currentIndex] || null;

  const primaryStyle = primaryColor ? { color: primaryColor } : undefined;
  const primaryBg = primaryColor ? { backgroundColor: primaryColor } : undefined;

  const loadLyrics = useCallback(async (track: Track) => {
    if (!track.lrc) {
      setLyrics([]);
      setCurrentLrcIndex(-1);
      return;
    }
    const isLrcUrl =
      /^(https?:)?\/\//.test(track.lrc) ||
      track.lrc.startsWith("/") ||
      /\.(lrc|txt)(\?|#|$)/i.test(track.lrc);
    if (isLrcUrl) {
      try {
        const res = await fetch(track.lrc);
        const text = await res.text();
        setLyrics(parseLRC(text));
      } catch {
        setLyrics([]);
      }
    } else {
      setLyrics(parseLRC(track.lrc));
    }
    setCurrentLrcIndex(-1);
  }, []);

  const loadTrack = useCallback(
    (index: number, autoPlay: boolean) => {
      if (index < 0 || index >= playlist.length) return false;
      const ver = ++loadVersionRef.current;
      const track = playlist[index];
      setCurrentIndex(index);
      setError(null);
      if (audioRef.current) {
        audioRef.current.src = proxyAudioUrl(track.url);
        audioRef.current.load();
        loadLyrics(track);
        if (autoPlay) {
          audioRef.current.play().then(() => {
            if (ver !== loadVersionRef.current) return;
            setIsPlaying(true);
          }).catch((e) => {
            if (ver !== loadVersionRef.current) return;
            if (e.name === "AbortError") return;
            setIsPlaying(false);
          });
        } else {
          setIsPlaying(false);
        }
      }
      return true;
    },
    [playlist, loadLyrics]
  );

  const playNext = useCallback(
    (auto?: boolean) => {
      if (playMode === 1 && auto && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
        return;
      }
      let nextIndex: number;
      if (playMode === 2) {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } else {
        nextIndex = (currentIndex + 1) % playlist.length;
      }
      loadTrack(nextIndex, true);
    },
    [playMode, playlist, currentIndex, loadTrack]
  );

  const playNextRef = useRef(playNext);
  playNextRef.current = playNext;

  const playPrev = useCallback(() => {
    let prevIndex: number;
    if (playMode === 2) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    }
    loadTrack(prevIndex, true);
  }, [playMode, playlist, currentIndex, loadTrack]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((e) => {
          console.warn("[Player] audio.play() failed:", e);
          setIsPlaying(false);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const setVolume = useCallback((val: number) => {
    const v = Math.max(0, Math.min(1, val));
    setVolumeState(v);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = v;
      audioRef.current.muted = false;
    }
    localStorage.setItem("music-player-volume", v.toString());
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }, []);

  const seek = useCallback((percent: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = Math.max(0, percent) * audio.duration;
  }, []);

  const seekToTime = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = Math.max(0, Math.min(time, audio.duration));
  }, []);

  const cyclePlayMode = useCallback(() => {
    setPlayMode((prev) => ((prev + 1) % 3) as PlayMode);
  }, []);

  const playTrackByIndex = useCallback(
    (index: number) => {
      if (index === currentIndex && audioRef.current && !audioRef.current.paused) {
        togglePlay();
      } else {
        loadTrack(index, true);
      }
    },
    [currentIndex, togglePlay, loadTrack]
  );

  const toggleLyrics = useCallback(() => {
    setLyricsOpen((prev) => !prev);
  }, []);

  const refreshPlaylist = useCallback(async () => {
    setLoading(true);
    const tracks = await fetchPlaylist();
    if (tracks.length > 0) {
      setPlaylist(tracks);
    }
    setLoading(false);
  }, [fetchPlaylist]);

  const togglePlaylist = useCallback(() => {
    setPlaylistFullOpen((prev) => !prev);
    if (lyricsOpen) setLyricsOpen(false);
  }, [lyricsOpen]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      seek(Math.min(Math.max(x / rect.width, 0), 1));
    },
    [seek]
  );

  const handleVolumeClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setVolume(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
    },
    [setVolume]
  );

  const handleLrcScroll = useCallback(() => {
    setIsUserScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
      const idx = currentLrcIndex;
      if (idx >= 0 && lrcContainerRef.current) {
        const line = lrcContainerRef.current.querySelector(
          `.lrc-line[data-index="${idx}"]`
        ) as HTMLElement | null;
        if (line) {
          const ch = lrcContainerRef.current.clientHeight;
          const target = line.offsetTop - ch / 2 + line.offsetHeight / 2;
          lrcContainerRef.current.scrollTo({ top: target, behavior: "auto" });
        }
      }
    }, 3000);
  }, [currentLrcIndex]);

  const fetchPlaylist = useCallback(async () => {
    let tracks: Track[] = [];
    try {
      if (musicConfig?.mode === "meting" && musicConfig.meting) {
        const m = musicConfig.meting;
        const apis = [m.api].concat(m.fallbackApis || []);
        for (const baseApi of apis) {
          if (!baseApi) continue;
          try {
            const fetchUrl = baseApi
              .replace(":server", m.server || "netease")
              .replace(":type", m.type || "playlist")
              .replace(":id", m.id || "")
              .replace(":r", Math.random().toString());
            const url = m.auth ? fetchUrl + "&auth=" + m.auth : fetchUrl;
            const res = await fetch(`/api/music?url=${encodeURIComponent(url)}`);
            const json = await res.json();
            if (json.success && Array.isArray(json.data) && json.data.length > 0) {
              tracks = json.data.map((item: any) => ({
                name: item.title || item.name || "Unknown",
                artist: item.author || item.artist || "Unknown",
                url: item.url,
                pic: item.pic || item.cover || "",
                lrc: item.lrc,
              }));
              break;
            }
          } catch {
            continue;
          }
        }
      } else if (musicConfig?.mode === "local" && musicConfig.local?.playlist) {
        tracks = musicConfig.local.playlist.map((song: LocalSong) => ({
          name: song.name,
          artist: song.artist,
          url: song.url,
          pic: song.cover,
          lrc: song.lrc,
        }));
      }
    } catch {
      // fallthrough
    }
    lastFetchRef.current = Date.now();
    return tracks;
  }, [musicConfig]);

  // Init
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Firefly pattern: singleton audio, never removed from DOM
    let audio = audioRef.current;
    if (!audio) {
      const existing = document.querySelector('audio[data-player]');
      if (existing instanceof HTMLAudioElement) {
        audio = existing;
      } else {
        audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.style.display = "none";
        audio.setAttribute("data-player", "");
        document.body.appendChild(audio);
      }
      audioRef.current = audio;

      const a = audio;
      a.addEventListener("timeupdate", () => {
        setCurrentTime(a.currentTime);
        setDuration(a.duration || 0);
      });
      a.addEventListener("ended", () => {
        playNextRef.current(true);
      });
      a.addEventListener("error", () => {
        console.warn("[Player] audio error:", a?.error);
        setError("音频播放错误");
      });
      a.addEventListener("loadedmetadata", () => {
        setDuration(a.duration || 0);
      });
    }

    const init = async () => {
      setLoading(true);
      const tracks = await fetchPlaylist();
      if (tracks.length > 0) {
        audio.volume = volume;
        setPlaylist(tracks);
        const startIndex = playMode === 2
          ? Math.floor(Math.random() * tracks.length)
          : 0;
        setCurrentIndex(startIndex);
        const track = tracks[startIndex];
        const src = proxyAudioUrl(track.url);
        audio.src = src;
        audio.load();
        loadLyrics(track);
      }
      setLoading(false);
    };

    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Periodic playlist refresh (every 30 min)
  useEffect(() => {
    if (!musicConfig?.enable) return;
    const interval = setInterval(async () => {
      if (Date.now() - lastFetchRef.current < 30 * 60 * 1000) return;
      const tracks = await fetchPlaylist();
      if (tracks.length > 0) {
        setPlaylist(tracks);
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [musicConfig?.enable, fetchPlaylist]);

  // Lyrics sync
  useEffect(() => {
    if (lyrics.length === 0) {
      setCurrentLrcIndex(-1);
      return;
    }
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) idx = i;
      else break;
    }
    if (idx !== currentLrcIndex) setCurrentLrcIndex(idx);
  }, [currentTime, lyrics, currentLrcIndex]);

  // Auto-scroll lyrics
  useEffect(() => {
    if (currentLrcIndex >= 0 && !isUserScrolling && lrcContainerRef.current) {
      const line = lrcContainerRef.current.querySelector(
        `.lrc-line[data-index="${currentLrcIndex}"]`
      ) as HTMLElement | null;
      if (line) {
        const ch = lrcContainerRef.current.clientHeight;
        lrcContainerRef.current.scrollTo({
          top: line.offsetTop - ch / 2 + line.offsetHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [currentLrcIndex, isUserScrolling]);

  const [coverLoaded, setCoverLoaded] = useState(false);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const filteredPlaylist = playlist.filter(
    (t) =>
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!musicConfig?.enable || !open || playlist.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-6 z-20">
      <div
        style={{ backgroundColor: "rgba(var(--mio-main), 0.1)" }}
        className="w-72 select-none rounded-xl p-3 backdrop-blur transition-all duration-300"
      >
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-[2px] dark:bg-[#1e1e1e]/60">
            <div className="h-8 w-8 animate-spin" style={primaryStyle}>
              <SyncIcon />
            </div>
          </div>
        )}

        <div className="mb-2 flex items-center gap-2 px-1">
          <div className="relative h-14 w-14 shrink-0">
            <div
              className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-lg dark:border-neutral-700"
              style={{ backgroundColor: `${primaryColor}1a` }}
            >
              <MusicNoteIcon />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={clsx(
                  "absolute inset-0 z-10 h-full w-full rounded-full object-cover transition-opacity duration-300",
                  coverLoaded ? "opacity-100" : "opacity-0"
                )}
                style={{
                  animation: `spin-slow 10s linear infinite`,
                  animationPlayState: isPlaying ? "running" : "paused",
                }}
                src={currentTrack?.pic || ""}
                alt={currentTrack?.name || ""}
                onLoad={() => setCoverLoaded(true)}
                onError={() => setCoverLoaded(false)}
              />
            </div>
          </div>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center justify-between gap-2 overflow-hidden">
              <h3 className="truncate text-base font-bold leading-tight text-neutral-800 dark:text-neutral-100">
                {currentTrack?.name || "音乐"}
              </h3>
              {musicConfig.showLyrics && (
                <button
                  onClick={toggleLyrics}
                  className={clsx(
                    "shrink-0 p-0.5 pr-2 transition-all duration-300 active:scale-95",
                    lyricsOpen ? "text-[var(--primary-color)]" : "text-neutral-400 hover:text-[var(--primary-color)]"
                  )}
                  title="歌词"
                >
                  <span className="text-xl">
                    {lyricsOpen ? <SubtitlesIcon /> : <SubtitlesOffIcon />}
                  </span>
                </button>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {currentTrack?.artist || "暂无播放"}
              </p>
            </div>

            <div className="flex h-5 items-center gap-3 text-neutral-400">
              <div className="flex shrink-0 items-center gap-1 font-mono text-[10px]" aria-live="polite">
                <span>{formatTime(currentTime)}</span>
                <span className="opacity-50">/</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="ml-auto flex h-full items-center gap-1 bg-transparent">
                <button
                  onClick={toggleMute}
                  className="flex items-center rounded-md p-0.5 transition-colors hover:text-[var(--primary-color)]"
                  title="音量"
                >
                  <span className="text-lg">
                    {isMuted || volume === 0 ? <VolumeXmark size={20} /> : <VolumeHigh size={20} />}
                  </span>
                </button>
                <div className="flex w-16 items-center">
                  <div
                    onClick={handleVolumeClick}
                    className="relative ml-1 h-1 w-16 cursor-pointer rounded-full bg-neutral-300/50 dark:bg-neutral-500/40"
                    role="slider"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(isMuted ? 0 : volume * 100)}
                  >
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-all"
                      style={{ ...primaryBg, width: `${isMuted ? 0 : volume * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-2 px-1">
          <div
            onClick={handleProgressClick}
            className="group relative h-1 w-full cursor-pointer touch-none rounded-full bg-neutral-300/60 dark:bg-neutral-500/40"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-[width] duration-100"
              style={{ ...primaryBg, width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -ml-1.5 -mt-1.5 h-3 w-3 scale-0 rounded-full bg-[var(--primary-color)] shadow-sm ring-2 ring-white transition-transform duration-200 group-hover:scale-100 dark:ring-neutral-800"
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-1 select-none">
          <button
            onClick={cyclePlayMode}
            className={clsx(
              "p-2 transition-colors active:scale-95",
              playMode === 0
                ? "text-neutral-300 hover:text-[var(--primary-color)] dark:text-neutral-600"
                : "text-[var(--primary-color)]"
            )}
            title="播放模式"
          >
            <span className="text-xl">
              {playMode === 2 ? <Shuffle size={20} /> : playMode === 1 ? <RepeatOneIcon /> : <Loop size={20} />}
            </span>
          </button>

          <button
            onClick={playPrev}
            className="p-2 text-neutral-600 transition-colors hover:text-[var(--primary-color)] active:scale-95 dark:text-neutral-300"
            title="上一首"
          >
            <span className="text-3xl"><TrackPrevious size={28} /></span>
          </button>

          <button
            onClick={togglePlay}
            className="flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300"
            style={{ backgroundColor: isPlaying ? primaryColor : "rgba(var(--mio-main), 0.15)" }}
            title={isPlaying ? "暂停" : "播放"}
          >
            <span className={clsx("text-3xl", isPlaying ? "" : "ml-0.5")}>
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </span>
          </button>

          <button
            onClick={() => playNext()}
            className="p-2 text-neutral-600 transition-colors hover:text-[var(--primary-color)] active:scale-95 dark:text-neutral-300"
            title="下一首"
          >
            <span className="text-3xl"><TrackNext size={28} /></span>
          </button>

          <button
            onClick={togglePlaylist}
            className={clsx(
              "p-2 transition-all duration-300 active:scale-95",
              playlistFullOpen ? "text-[var(--primary-color)]" : "text-neutral-400 hover:text-[var(--primary-color)]"
            )}
            title="播放列表"
          >
            <span className="text-xl"><PlaylistIcon /></span>
          </button>
        </div>

        <div
          className={clsx(
            "grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            lyricsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="mx-1 mt-2 border-t border-neutral-100 pt-2 dark:border-white/5">
              <div
                ref={lrcContainerRef}
                onWheel={handleLrcScroll}
                onTouchStart={() => {
                  setIsUserScrolling(true);
                  if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
                  scrollTimeoutRef.current = setTimeout(() => setIsUserScrolling(false), 3000);
                }}
                className="custom-scrollbar relative flex h-48 flex-col items-center gap-2 overflow-y-auto p-4 py-24 text-center scroll-smooth"
                role="listbox"
                aria-label="歌词"
              >
                {lyrics.length === 0 ? (
                  <div className="py-10 text-sm text-neutral-400">暂无歌词</div>
                ) : (
                  lyrics.map((line, i) => (
                    <div
                      key={i}
                      data-index={i}
                      onClick={() => seekToTime(line.time)}
                      className={clsx(
                        "lrc-line cursor-pointer py-1 transition-all duration-300",
                        i === currentLrcIndex
                          ? "text-base font-bold text-[var(--primary-color)]"
                          : "text-sm text-neutral-400 hover:text-[var(--primary-color)]"
                      )}
                      role="option"
                      aria-selected={i === currentLrcIndex}
                    >
                      {line.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Global styles for animations and custom scrollbar */}
        <style>{`
          @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes eq-bounce { 0%, 100% { height: 4px; } 50% { height: 14px; } }
          .eq-bars .eq-bar { animation: eq-bounce 1.2s ease-in-out infinite; }
          .eq-bars .eq-bar:nth-child(1) { animation-duration: 0.8s; }
          .eq-bars .eq-bar:nth-child(2) { animation-duration: 0.6s; animation-delay: 0.15s; }
          .eq-bars .eq-bar:nth-child(3) { animation-duration: 1.0s; animation-delay: 0.3s; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 2px; }
        `}</style>
      </div>

      {/* Full-screen playlist overlay */}
      {playlistFullOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setPlaylistFullOpen(false)}
        >
          <div
            className="relative mx-4 flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#1e1e1e]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-white/5">
              <div>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">播放列表</h2>
                <p className="text-xs text-neutral-400">{playlist.length} 首歌曲</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshPlaylist}
                  className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-[var(--primary-color)] dark:hover:bg-white/10"
                  title="刷新歌单"
                >
                  <span className={clsx("text-lg", loading && "animate-spin")}>
                    <SyncIcon />
                  </span>
                </button>
                <button
                  onClick={() => setPlaylistFullOpen(false)}
                  className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-white/10 dark:hover:text-neutral-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-5 pt-3">
              <input
                type="text"
                placeholder="搜索歌曲或歌手..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800 outline-none transition-colors focus:border-[var(--primary-color)] dark:border-white/10 dark:bg-white/5 dark:text-neutral-100"
              />
            </div>

            {/* Song list */}
            <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-2">
              {filteredPlaylist.length === 0 ? (
                <div className="py-10 text-center text-sm text-neutral-400">
                  {searchQuery ? "没有找到匹配的歌曲" : "暂无歌曲"}
                </div>
              ) : (
                filteredPlaylist.map((track) => {
                  const realIndex = playlist.indexOf(track);
                  const isCurrent = realIndex === currentIndex;
                  return (
                    <div
                      key={realIndex}
                      onClick={() => {
                        playTrackByIndex(realIndex);
                        setPlaylistFullOpen(false);
                      }}
                      className={clsx(
                        "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all group",
                        isCurrent
                          ? "bg-[var(--primary-color)]/10"
                          : "hover:bg-neutral-100 dark:hover:bg-white/5"
                      )}
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-700">
                        {track.pic ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={track.pic} className="h-full w-full object-cover" alt="" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <MusicNoteIcon />
                          </div>
                        )}
                        {isCurrent && (
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ backgroundColor: `${primaryColor}55` }}
                          >
                            {isPlaying ? (
                              <div className="eq-bars flex h-3.5 items-end gap-[2px]">
                                <span className="eq-bar w-[3px] rounded-sm bg-white" />
                                <span className="eq-bar w-[3px] rounded-sm bg-white" />
                                <span className="eq-bar w-[3px] rounded-sm bg-white" />
                              </div>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className={clsx(
                            "truncate text-sm font-medium transition-colors",
                            isCurrent
                              ? "text-[var(--primary-color)]"
                              : "text-neutral-800 group-hover:text-[var(--primary-color)] dark:text-neutral-100"
                          )}
                        >
                          {track.name}
                        </div>
                        <div className="truncate text-xs text-neutral-400">{track.artist}</div>
                      </div>
                      {isCurrent && (
                        <div className="shrink-0 text-xs text-[var(--primary-color)]">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
