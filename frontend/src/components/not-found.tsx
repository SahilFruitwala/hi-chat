import { useEffect, useState } from "react";

const glitchFrames = ["404", "4Ø4", "█04", "4O4", "4 4", "404"];

const LOG_LINES = [
    { text: "[INFO]  Searched all known directories........... FAIL", style: "text-muted-foreground" },
    { text: "[INFO]  Checked cache and temp stores............ FAIL", style: "text-muted-foreground" },
    { text: "[WARN]  Resource map corrupted or missing", style: "text-yellow-500 dark:text-yellow-400" },
    { text: "[HINT]  Try returning to the home directory", style: "text-primary" },
];

export default function NotFound404() {
    const [glitchIndex, setGlitchIndex] = useState(0);
    const [typed, setTyped] = useState("");
    const [showCursor, setShowCursor] = useState(true);

    const message = "PAGE_NOT_FOUND :: The resource you requested does not exist.";

    // Typewriter
    useEffect(() => {
        let i = 0;
        const id = setInterval(() => {
            if (i <= message.length) setTyped(message.slice(0, i++));
            else clearInterval(id);
        }, 30);
        return () => clearInterval(id);
    }, []);

    // Glitch bursts
    useEffect(() => {
        function burst() {
            let g = 0;
            const id = setInterval(() => {
                setGlitchIndex((p) => (p + 1) % glitchFrames.length);
                if (++g > 6) clearInterval(id);
            }, 110);
        }
        burst();
        const id = setInterval(burst, 4000);
        return () => clearInterval(id);
    }, []);

    // Cursor blink
    useEffect(() => {
        const id = setInterval(() => setShowCursor((c) => !c), 530);
        return () => clearInterval(id);
    }, []);

    const label = glitchFrames[glitchIndex];

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground px-4 overflow-hidden relative">
            <style>{injectedCss}</style>

            {/* Subtle animated scanline */}
            <div className="nf-scan pointer-events-none fixed inset-0 z-10" />

            {/* Card */}
            <div className="relative z-20 w-full max-w-2xl border border-border bg-card text-card-foreground rounded-lg p-8 shadow-xl">

                {/* Status bar */}
                <div className="flex items-center gap-2.5 mb-8 pb-4 border-b border-border text-[11px] tracking-widest text-muted-foreground font-sans uppercase">
                    <span className="nf-dot w-2 h-2 rounded-full bg-destructive shrink-0" />
                    <span className="flex-1">System Error — Terminal v2.1.4</span>
                    <span className="text-destructive tracking-[0.15em]">ERR::0x404</span>
                </div>

                {/* Big 404 */}
                <div
                    className="nf-glitch font-heading font-black leading-none select-none mb-4 text-primary"
                    style={{ fontSize: "clamp(80px,18vw,136px)", letterSpacing: "-4px" }}
                    data-text={label}
                >
                    {label}
                </div>

                {/* Divider */}
                <div className="text-border text-[13px] mb-5 tracking-tight">
                    {"─".repeat(44)}
                </div>

                {/* Typewriter output */}
                <p className="font-mono text-[13px] leading-relaxed tracking-wide text-foreground mb-7 min-h-[22px]">
                    <span className="text-primary font-bold">&gt;&gt; </span>
                    {typed}
                    <span className={`text-primary transition-opacity ${showCursor ? "opacity-100" : "opacity-0"}`}>█</span>
                </p>

                {/* Log lines */}
                <div className="flex flex-col gap-1.5 mb-8 font-mono text-[12px] tracking-wide">
                    {LOG_LINES.map((line, i) => (
                        <div
                            key={i}
                            className={`nf-fadein opacity-0 ${line.style}`}
                            style={{ animationDelay: `${1.2 + i * 0.2}s` }}
                        >
                            {line.text}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div
                    className="nf-fadein opacity-0 flex flex-wrap gap-3 mb-8"
                    style={{ animationDelay: "2.1s" }}
                >
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="nf-btn border border-primary text-primary bg-transparent px-5 py-2.5 text-[12px] tracking-[0.12em] uppercase font-mono rounded-sm hover:bg-primary/10 transition-all"
                    >
                        ← Go Home
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="nf-btn border border-border text-muted-foreground bg-transparent px-5 py-2.5 text-[12px] tracking-[0.12em] uppercase font-mono rounded-sm hover:bg-muted hover:text-foreground transition-all"
                    >
                        ↩ Go Back
                    </button>
                </div>

                {/* Footer */}
                <div
                    className="nf-fadein opacity-0 flex flex-wrap gap-3 text-[10px] tracking-widest text-muted-foreground border-t border-border pt-3 font-mono"
                    style={{ animationDelay: "2.4s" }}
                >
                    <span>Uptime: 99.97%</span>
                    <span>|</span>
                    <span>Node: #7 Offline</span>
                    <span>|</span>
                    <span>{new Date().toISOString().slice(0, 19).replace("T", " ")} UTC</span>
                </div>
            </div>
        </div>
    );
}

const injectedCss = `
  @keyframes nf-blink { 0%,100%{opacity:1} 50%{opacity:0.15} }
  @keyframes nf-fadein { to { opacity: 1; } }
  @keyframes nf-scan { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }

  .nf-dot { animation: nf-blink 1.2s ease-in-out infinite; }

  .nf-scan::after {
    content: '';
    position: absolute;
    left: 0; top: 0; width: 100%; height: 3px;
    background: oklch(from var(--primary) l c h / 0.12);
    animation: nf-scan 6s linear infinite;
    pointer-events: none;
  }

  .nf-fadein { animation: nf-fadein 0.35s ease forwards; }

  /* Glitch */
  .nf-glitch { position: relative; display: inline-block; }
  .nf-glitch::before,
  .nf-glitch::after {
    content: attr(data-text);
    position: absolute; top: 0; left: 0;
    width: 100%; overflow: hidden; pointer-events: none;
  }
  .nf-glitch::before {
    color: var(--destructive);
    clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
    transform: translateX(-3px);
    opacity: 0.65;
  }
  .nf-glitch::after {
    color: oklch(0.75 0.18 220);
    clip-path: polygon(0 62%, 100% 62%, 100% 78%, 0 78%);
    transform: translateX(3px);
    opacity: 0.65;
  }
`;