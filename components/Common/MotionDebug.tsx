"use client";

import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";

type Report = {
  reducedMotion: boolean;
  fps: number;
  renderer: string;
  softwareRendering: boolean;
  platform: "mac" | "windows" | "other";
  userAgent: string;
  cores: number;
};

function detectRenderer() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    if (!gl || !(gl instanceof WebGLRenderingContext)) return "WebGL không khả dụng";
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    return info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : String(gl.getParameter(gl.RENDERER));
  } catch {
    return "Không đọc được";
  }
}

function detectPlatform(userAgent: string): Report["platform"] {
  if (/Mac OS X|Macintosh/i.test(userAgent) && !/iPhone|iPad/i.test(userAgent)) return "mac";
  if (/Windows/i.test(userAgent)) return "windows";
  return "other";
}

const REDUCED_MOTION_FIX: Record<Report["platform"], string> = {
  mac: "macOS: System Settings → Accessibility → Display → tắt “Reduce motion”.",
  windows:
    "Windows 11: Settings → Accessibility → Visual effects → bật “Animation effects”. Windows 10: Settings → Ease of Access → Display → bật “Show animations in Windows”.",
  other: "Tắt tuỳ chọn giảm chuyển động (Reduce motion) trong phần Trợ năng của hệ điều hành.",
};

function verdicts(report: Report) {
  const items: string[] = [];
  if (report.reducedMotion) {
    items.push(`Hệ điều hành đang bật giảm chuyển động nên website tự tắt animation. ${REDUCED_MOTION_FIX[report.platform]} Sau đó tải lại trang.`);
  }
  if (report.softwareRendering) {
    items.push("Trình duyệt đang render bằng phần mềm: bật lại “Use graphics acceleration when available” trong cài đặt trình duyệt.");
  }
  if (report.fps > 0 && report.fps < 30) {
    items.push(`Trình duyệt chỉ đạt ${report.fps} fps nên animation sẽ giật hoặc gần như đứng yên.`);
  }
  if (!items.length) items.push("Không phát hiện nguyên nhân nào chặn animation trên trình duyệt này.");
  return items;
}

export default function MotionDebug() {
  const lenis = useLenis();
  const [enabled, setEnabled] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEnabled(new URLSearchParams(window.location.search).get("debug") === "motion");
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const renderer = detectRenderer();
    const userAgent = navigator.userAgent;
    const base = {
      renderer,
      softwareRendering: /swiftshader|llvmpipe|software|basic render/i.test(renderer),
      platform: detectPlatform(userAgent),
      userAgent,
      cores: navigator.hardwareConcurrency ?? 0,
    };

    let frames = 0;
    let fps = 0;
    let start = performance.now();
    let raf = 0;
    const update = () => setReport({ ...base, reducedMotion: query.matches, fps });
    const tick = (now: number) => {
      frames += 1;
      if (now - start >= 1000) {
        fps = Math.round((frames * 1000) / (now - start));
        frames = 0;
        start = now;
        update();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    update();
    query.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(raf);
      query.removeEventListener("change", update);
    };
  }, [enabled]);

  if (!enabled || !report) return null;

  const rows: [string, string][] = [
    ["prefers-reduced-motion", report.reducedMotion ? "reduce (đang bật)" : "no-preference"],
    ["Smooth scroll (Lenis)", lenis ? "đang chạy" : "đang tắt"],
    ["Khung hình / giây", report.fps ? String(report.fps) : "đang đo..."],
    ["GPU", report.renderer],
    ["Số nhân CPU", String(report.cores)],
    ["Trình duyệt", report.userAgent],
  ];
  const summary = [...rows.map(([key, value]) => `${key}: ${value}`), ...verdicts(report)].join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <aside
      role="status"
      className="fixed bottom-4 left-4 z-[100] w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-white/15 bg-ink/95 p-4 text-xs leading-relaxed text-white shadow-2xl backdrop-blur"
    >
      <p className="mb-2 font-semibold text-gold">Chẩn đoán animation</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        {rows.map(([key, value]) => (
          <div key={key} className="contents">
            <dt className="text-muted">{key}</dt>
            <dd className="break-words">{value}</dd>
          </div>
        ))}
      </dl>
      <ul className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
        {verdicts(report).map((item) => (
          <li key={item} className={report.reducedMotion || report.softwareRendering ? "text-[#ffb4a8]" : "text-sky"}>
            {item}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={copy}
        className="mt-3 rounded-full bg-gold px-4 py-1.5 text-xs font-medium text-ink transition-opacity hover:opacity-90"
      >
        {copied ? "Đã sao chép" : "Sao chép kết quả"}
      </button>
    </aside>
  );
}
