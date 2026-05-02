"use client";

import React, { forwardRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TemplateId =
  | "solo"
  | "diptych"
  | "triptych"
  | "polaroid"
  | "filmstrip"
  | "postcard"
  | "scrapbook"
  | "journal"
  | "corkboard"
  | "pile";

export interface CardImage {
  src: string; // data URL or remote URL
  alt?: string;
}

export interface MemoryCardProps {
  templateId: TemplateId;
  images: CardImage[]; // pass as many as the template needs
  caption?: string;
  date?: string; // e.g. "June 2024"
  tag?: string; // e.g. "Lisbon" or "Mia's Birthday"
}

// ─── Shared design tokens ─────────────────────────────────────────────────────

const CARD_W = 640; // px — fixed width for html-to-image export
const fonts = {
  serif: "'Playfair Display', Georgia, serif",
  sans: "'DM Sans', 'Helvetica Neue', sans-serif",
  mono: "'DM Mono', 'Courier New', monospace",
};

const palette = {
  cream: "#F7F2EA",
  warmWhite: "#FBF8F3",
  tan: "#E8DFD0",
  brown: "#7A5C3E",
  espresso: "#3B2A1A",
  warmGray: "#9E8E7E",
  goldAccent: "#C9A96E",
};

// ─── Shared sub-components ────────────────────────────────────────────────────

const ImageSlot = ({
  image,
  style,
}: {
  image?: CardImage;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: palette.tan,
      overflow: "hidden",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
  >
    {image ? (
      <img
        src={image.src}
        alt={image.alt ?? "memory"}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    ) : (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: 0.4,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={palette.brown} strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <span style={{ fontFamily: fonts.mono, fontSize: 10, color: palette.brown, letterSpacing: "0.1em" }}>
          drop photo
        </span>
      </div>
    )}
  </div>
);

const Caption = ({
  text,
  style,
  align = "left",
}: {
  text: string;
  style?: React.CSSProperties;
  align?: "left" | "center" | "right";
}) => (
  <p
    style={{
      fontFamily: fonts.serif,
      fontSize: 15,
      fontStyle: "italic",
      color: palette.espresso,
      margin: 0,
      lineHeight: 1.55,
      textAlign: align,
      ...style,
    }}
  >
    {text}
  </p>
);

const Meta = ({
  date,
  tag,
  style,
  align = "left",
}: {
  date?: string;
  tag?: string;
  style?: React.CSSProperties;
  align?: "left" | "center" | "right";
}) => (
  <div
    style={{
      display: "flex",
      gap: 12,
      justifyContent:
        align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
      ...style,
    }}
  >
    {tag && (
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: palette.goldAccent,
        }}
      >
        {tag}
      </span>
    )}
    {date && (
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 10,
          letterSpacing: "0.12em",
          color: palette.warmGray,
        }}
      >
        {date}
      </span>
    )}
  </div>
);

// Decorative grain overlay — gives that film photo warmth
const GrainOverlay = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      pointerEvents: "none",
      zIndex: 10,
      mixBlendMode: "multiply",
    }}
  />
);

// ─── Template 1 · Solo — single full-bleed hero ───────────────────────────────
// Best for: 1 stunning photo. Caption overlays bottom with a dark vignette.

const TemplateSolo = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ images, caption, date, tag }, ref) => {
    const h = 420;
    return (
      <div
        ref={ref}
        style={{
          width: CARD_W,
          height: h,
          position: "relative",
          overflow: "hidden",
          fontFamily: fonts.serif,
          background: palette.espresso,
        }}
      >
        <GrainOverlay />
        <ImageSlot image={images[0]} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
        {/* vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(30,18,8,0.85) 0%, rgba(30,18,8,0.1) 50%, transparent 100%)",
            zIndex: 2,
          }}
        />
        {/* bottom text */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 32,
            right: 32,
            zIndex: 3,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Meta date={date} tag={tag} style={{ marginBottom: 4 }} />
          {caption && (
            <Caption
              text={caption}
              style={{ color: "#F7F2EA", fontSize: 18, maxWidth: 480 }}
            />
          )}
        </div>
        {/* corner mark */}
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 24,
            zIndex: 3,
            width: 28,
            height: 28,
            border: `1px solid rgba(247,242,234,0.4)`,
            borderRadius: "50%",
          }}
        />
      </div>
    );
  }
);
TemplateSolo.displayName = "TemplateSolo";

// ─── Template 2 · Diptych — two photos side by side ─────────────────────────
// Best for: before/after, two moments, two people.

const TemplateDiptych = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ images, caption, date, tag }, ref) => {
    const h = 380;
    return (
      <div
        ref={ref}
        style={{
          width: CARD_W,
          background: palette.cream,
          padding: "28px 28px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GrainOverlay />
        <div style={{ display: "flex", gap: 10, height: h - 28 - 24 - 16 - 48 }}>
          <ImageSlot image={images[0]} style={{ flex: 1, borderRadius: 3 }} />
          <ImageSlot image={images[1]} style={{ flex: 1, borderRadius: 3 }} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
            minHeight: 40,
          }}
        >
          {caption && <Caption text={caption} style={{ flex: 1 }} />}
          <Meta date={date} tag={tag} align="right" />
        </div>
        {/* thin bottom rule */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 28,
            right: 28,
            height: 1,
            background: palette.goldAccent,
            opacity: 0.4,
          }}
        />
      </div>
    );
  }
);
TemplateDiptych.displayName = "TemplateDiptych";

// ─── Template 3 · Triptych — three photos ────────────────────────────────────
// Best for: story in three frames — morning / afternoon / evening.

const TemplateTriptych = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ images, caption, date, tag }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: CARD_W,
          background: palette.warmWhite,
          padding: "24px 24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GrainOverlay />
        {/* Top: big photo */}
        <ImageSlot image={images[0]} style={{ width: "100%", height: 220, borderRadius: 3 }} />
        {/* Bottom: two smaller */}
        <div style={{ display: "flex", gap: 10, height: 140 }}>
          <ImageSlot image={images[1]} style={{ flex: 1, borderRadius: 3 }} />
          <ImageSlot image={images[2]} style={{ flex: 1, borderRadius: 3 }} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 4,
          }}
        >
          <Meta date={date} tag={tag} />
          {caption && (
            <Caption text={caption} align="right" style={{ maxWidth: 300, fontSize: 13 }} />
          )}
        </div>
      </div>
    );
  }
);
TemplateTriptych.displayName = "TemplateTriptych";

// ─── Template 4 · Polaroid — single photo with white border & handwritten feel
// Best for: 1 precious photo. Classic, timeless.

const TemplatePolaroid = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ images, caption, date, tag }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: CARD_W,
          background: "#EDEBE6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 0 36px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GrainOverlay />
        <div
          style={{
            background: "#FDFCFA",
            padding: "14px 14px 36px",
            boxShadow: "0 2px 18px rgba(58,38,18,0.14), 0 0 0 0.5px rgba(58,38,18,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            width: 320,
            transform: "rotate(-1.2deg)",
          }}
        >
          <ImageSlot image={images[0]} style={{ width: "100%", height: 280 }} />
          <div style={{ paddingTop: 16, paddingBottom: 4, display: "flex", flexDirection: "column", gap: 6 }}>
            {caption && (
              <Caption
                text={caption}
                align="center"
                style={{ fontSize: 14, color: palette.brown }}
              />
            )}
            <Meta date={date} tag={tag} align="center" style={{ marginTop: 2 }} />
          </div>
        </div>
      </div>
    );
  }
);
TemplatePolaroid.displayName = "TemplatePolaroid";

// ─── Template 5 · Filmstrip — 4 photos in a horizontal strip ─────────────────
// Best for: sequences, action shots, a series of moments.

const TemplateFilmstrip = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ images, caption, date, tag }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: CARD_W,
          background: palette.espresso,
          padding: "20px 20px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GrainOverlay />
        {/* sprocket holes row */}
        <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 4, paddingRight: 4 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 8,
                borderRadius: 2,
                background: "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>
        {/* 4 frames */}
        <div style={{ display: "flex", gap: 6, height: 200 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                border: "2px solid rgba(255,255,255,0.06)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <ImageSlot image={images[i]} style={{ width: "100%", height: "100%" }} />
            </div>
          ))}
        </div>
        {/* bottom sprocket holes */}
        <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 4, paddingRight: 4 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 8,
                borderRadius: 2,
                background: "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 2,
          }}
        >
          <Meta date={date} tag={tag} />
          {caption && (
            <Caption
              text={caption}
              align="right"
              style={{ color: "rgba(247,242,234,0.75)", fontSize: 13, maxWidth: 300 }}
            />
          )}
        </div>
      </div>
    );
  }
);
TemplateFilmstrip.displayName = "TemplateFilmstrip";

// ─── Template 6 · Postcard — landscape layout with ruled caption area ─────────
// Best for: travel, places, scenic shots.

const TemplatePostcard = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ images, caption, date, tag }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: CARD_W,
          height: 380,
          background: palette.warmWhite,
          display: "flex",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
          border: `1px solid ${palette.tan}`,
        }}
      >
        <GrainOverlay />
        {/* Left: photo */}
        <ImageSlot image={images[0]} style={{ width: "58%", height: "100%", flexShrink: 0 }} />
        {/* Right: writing area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "24px 22px 20px",
            position: "relative",
          }}
        >
          {/* stamp placeholder */}
          <div
            style={{
              alignSelf: "flex-end",
              width: 52,
              height: 62,
              border: `1px solid ${palette.tan}`,
              borderRadius: 2,
              background: palette.cream,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <span style={{ fontFamily: fonts.mono, fontSize: 8, color: palette.warmGray, letterSpacing: "0.05em" }}>
              stamp
            </span>
          </div>
          {/* dividing line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 24,
              bottom: 20,
              width: 0.5,
              background: palette.tan,
            }}
          />
          {/* ruled lines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 1,
                background: palette.tan,
                marginBottom: 22,
                opacity: 0.7,
              }}
            />
          ))}
          {/* caption overlay on ruled area */}
          <div style={{ position: "absolute", left: 22, right: 22, top: 106, bottom: 48 }}>
            {caption && (
              <Caption text={caption} style={{ fontSize: 13, color: palette.brown, lineHeight: 1.7 }} />
            )}
          </div>
          {/* bottom meta */}
          <div style={{ position: "absolute", bottom: 16, left: 22, right: 22 }}>
            <Meta date={date} tag={tag} />
          </div>
        </div>
      </div>
    );
  }
);
TemplatePostcard.displayName = "TemplatePostcard";
// ─── Template 7 · Scrapbook — 5 photos, torn edges, tape, overlapping ────────
// Best for: birthday parties, group trips, chaotic fun days.
 
const TemplateScrapbook = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ images, caption, date, tag }, ref) => {
    // Each photo card: [top, left, rotate, width, height, zIndex]
    const slots: [number, number, number, number, number, number][] = [
      [18,  16,  -3.5, 240, 180, 1],
      [12, 230,   2.2, 210, 165, 2],
      [26, 412,  -1.8, 200, 170, 1],
      [200,  30,  2.8, 200, 160, 3],
      [195, 240, -2.0, 230, 165, 2],
    ];
    // tape strip colours
    const tapes = ["rgba(255,235,180,0.55)", "rgba(200,220,255,0.45)", "rgba(255,200,200,0.45)", "rgba(200,255,210,0.45)", "rgba(230,210,255,0.45)"];
    return (
      <div
        ref={ref}
        style={{
          width: CARD_W,
          height: 420,
          background: "#F0EBE1",
          position: "relative",
          overflow: "hidden",
          fontFamily: fonts.serif,
        }}
      >
        {/* graph paper lines */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(180,160,130,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(180,160,130,0.13) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <GrainOverlay />
 
        {slots.map(([top, left, rotate, w, h, z], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top, left,
              width: w, height: h + 28,
              background: "#FDFAF5",
              transform: `rotate(${rotate}deg)`,
              zIndex: z,
              boxShadow: "1px 2px 8px rgba(50,30,10,0.13)",
              padding: "6px 6px 22px",
            }}
          >
            {/* tape strip */}
            <div style={{
              position: "absolute",
              top: -10, left: "50%",
              transform: "translateX(-50%)",
              width: 52, height: 20,
              background: tapes[i % tapes.length],
              borderRadius: 2,
              zIndex: 10,
            }} />
            <ImageSlot image={images[i]} style={{ width: "100%", height: h, display: "block" }} />
          </div>
        ))}
 
        {/* caption sticker */}
        <div style={{
          position: "absolute", bottom: 16, right: 20, zIndex: 10,
          background: "rgba(255,245,200,0.92)",
          padding: "8px 14px",
          transform: "rotate(1.5deg)",
          boxShadow: "1px 2px 6px rgba(50,30,10,0.10)",
          maxWidth: 200,
        }}>
          {caption && <Caption text={caption} style={{ fontSize: 12, color: palette.espresso }} />}
          <Meta date={date} tag={tag} style={{ marginTop: 4 }} />
        </div>
      </div>
    );
  }
);
TemplateScrapbook.displayName = "TemplateScrapbook";
 
// ─── Template 8 · Journal — ruled page, 3 photos, handwritten annotations ────
// Best for: everyday moments, travel diary, reflective mood.
 
const TemplateJournal = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ images, caption, date, tag }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: CARD_W,
          background: "#FAF7F0",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          gap: 0,
        }}
      >
        {/* Red margin line */}
        <div style={{ position: "absolute", left: 52, top: 0, bottom: 0, width: 1, background: "rgba(200,80,80,0.25)", zIndex: 2 }} />
        {/* Hole punches */}
        {[48, 140, 232, 324].map((y) => (
          <div key={y} style={{
            position: "absolute", left: 14, top: y,
            width: 16, height: 16, borderRadius: "50%",
            background: "#E8E0D0", border: "1px solid #D0C8B8",
            zIndex: 3,
          }} />
        ))}
 
        <div style={{ flex: 1, padding: "28px 28px 24px 64px", display: "flex", flexDirection: "column", gap: 0 }}>
          <GrainOverlay />
 
          {/* ruled lines background */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: 0, right: 0,
              top: 28 + i * 22,
              height: 1,
              background: "rgba(150,170,210,0.18)",
            }} />
          ))}
 
          {/* date header */}
          <div style={{ fontFamily: fonts.mono, fontSize: 10, color: palette.warmGray, letterSpacing: "0.1em", marginBottom: 16, zIndex: 2 }}>
            {date ?? "—"} {tag ? `· ${tag}` : ""}
          </div>
 
          {/* Main layout: big photo left, two stacked right */}
          <div style={{ display: "flex", gap: 14, zIndex: 2, marginBottom: 16 }}>
            <div style={{
              background: "#FDFAF5",
              padding: "5px 5px 20px",
              boxShadow: "1px 2px 8px rgba(50,30,10,0.10)",
              transform: "rotate(-1.8deg)",
              flexShrink: 0,
            }}>
              <ImageSlot image={images[0]} style={{ width: 240, height: 190 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              <div style={{
                background: "#FDFAF5",
                padding: "5px 5px 16px",
                boxShadow: "1px 2px 8px rgba(50,30,10,0.10)",
                transform: "rotate(1.5deg)",
              }}>
                <ImageSlot image={images[1]} style={{ width: "100%", height: 110 }} />
              </div>
              <div style={{
                background: "#FDFAF5",
                padding: "5px 5px 16px",
                boxShadow: "1px 2px 8px rgba(50,30,10,0.10)",
                transform: "rotate(-0.8deg)",
              }}>
                <ImageSlot image={images[2]} style={{ width: "100%", height: 100 }} />
              </div>
            </div>
          </div>
 
          {/* handwritten-style caption */}
          {caption && (
            <div style={{ zIndex: 2, paddingLeft: 4 }}>
              <Caption text={caption} style={{
                fontFamily: fonts.serif,
                fontSize: 14,
                color: "#4A3828",
                lineHeight: 1.8,
              }} />
            </div>
          )}
        </div>
      </div>
    );
  }
);
TemplateJournal.displayName = "TemplateJournal";
 
// ─── Template 9 · Corkboard — 6 photos pinned at angles with pushpins ────────
// Best for: group photos, event recaps, holiday memories.
 
const TemplateCorkboard = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ images, caption, date, tag }, ref) => {
    const slots: [number, number, number, number, number][] = [
      [20,  14, -4.0, 175, 140],
      [14, 210,  3.2, 165, 130],
      [18, 392, -2.1, 220, 150],
      [185,  30,  2.5, 190, 145],
      [180, 238, -3.5, 165, 140],
      [178, 422,  1.8, 185, 138],
    ];
    const pinColors = ["#C94040", "#4060C9", "#40A060", "#C9A030", "#8040C9", "#C94090"];
    return (
      <div
        ref={ref}
        style={{
          width: CARD_W,
          height: 390,
          position: "relative",
          overflow: "hidden",
          background: "#C4A882",
          backgroundImage: [
            "radial-gradient(ellipse at 20% 30%, rgba(180,140,90,0.4) 0%, transparent 60%)",
            "radial-gradient(ellipse at 80% 70%, rgba(140,100,60,0.3) 0%, transparent 50%)",
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23B8966A'/%3E%3Ccircle cx='1' cy='1' r='0.8' fill='%23C4A070' opacity='0.6'/%3E%3Ccircle cx='3' cy='3' r='0.6' fill='%23A88050' opacity='0.5'/%3E%3C/svg%3E\")",
          ].join(", "),
        }}
      >
        <GrainOverlay />
 
        {slots.map(([top, left, rotate, w, h], i) => (
          <div key={i} style={{ position: "absolute", top, left, zIndex: i + 1 }}>
            {/* pushpin */}
            <div style={{
              position: "absolute",
              top: -8, left: "50%",
              transform: "translateX(-50%)",
              width: 12, height: 12,
              borderRadius: "50%",
              background: pinColors[i % pinColors.length],
              boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
              zIndex: 10,
            }} />
            <div style={{
              background: "#FDFAF5",
              padding: "5px 5px 18px",
              boxShadow: "2px 3px 10px rgba(50,30,10,0.22)",
              transform: `rotate(${rotate}deg)`,
              width: w,
            }}>
              <ImageSlot image={images[i]} style={{ width: "100%", height: h }} />
            </div>
          </div>
        ))}
 
        {/* sticky note caption */}
        {(caption || date || tag) && (
          <div style={{
            position: "absolute", bottom: 18, right: 16, zIndex: 20,
            background: "rgba(255,248,180,0.96)",
            padding: "10px 14px",
            transform: "rotate(-2deg)",
            boxShadow: "1px 3px 8px rgba(50,30,10,0.18)",
            maxWidth: 180,
            minWidth: 120,
          }}>
            {caption && <Caption text={caption} style={{ fontSize: 11, color: "#3B2A1A", lineHeight: 1.6 }} />}
            <Meta date={date} tag={tag} style={{ marginTop: 6 }} />
          </div>
        )}
      </div>
    );
  }
);
TemplateCorkboard.displayName = "TemplateCorkboard";
 
// ─── Template 10 · Pile — photos loosely stacked/scattered, fan-out feel ─────
// Best for: a single dump of memories, "the whole roll" energy.
 
const TemplatePile = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ images, caption, date, tag }, ref) => {
    // back cards first (low z), front card last (high z, centered)
    const back: [number, number, number, number, number][] = [
      [30,  60,  -12, 280, 210],
      [25, 300,   10, 270, 205],
      [40,  20,    6, 265, 200],
      [35, 330,   -8, 275, 205],
    ];
    return (
      <div
        ref={ref}
        style={{
          width: CARD_W,
          height: 390,
          background: "#2A221A",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* subtle felt texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 50% 50%, #2E261E 0%, #1E1610 100%)",
        }} />
        <GrainOverlay />
 
        {/* back scattered photos */}
        {back.map(([top, left, rotate, w, h], i) => (
          <div key={i} style={{
            position: "absolute",
            top, left,
            background: "#FDFAF5",
            padding: "5px 5px 22px",
            boxShadow: "2px 4px 14px rgba(0,0,0,0.5)",
            transform: `rotate(${rotate}deg)`,
            zIndex: i + 1,
            width: w,
          }}>
            <ImageSlot image={images[i + 1]} style={{ width: "100%", height: h }} />
          </div>
        ))}
 
        {/* front hero photo — centered, slight tilt */}
        <div style={{
          position: "relative",
          background: "#FDFAF5",
          padding: "8px 8px 36px",
          boxShadow: "4px 8px 28px rgba(0,0,0,0.65)",
          transform: "rotate(-1.5deg)",
          zIndex: 10,
          width: 300,
        }}>
          <ImageSlot image={images[0]} style={{ width: "100%", height: 230 }} />
          <div style={{ paddingTop: 10, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
            {caption && <Caption text={caption} align="center" style={{ fontSize: 12, color: palette.brown }} />}
            <Meta date={date} tag={tag} align="center" />
          </div>
        </div>
      </div>
    );
  }
);
TemplatePile.displayName = "TemplatePile";

// ─── Registry ─────────────────────────────────────────────────────────────────
 
export type TemplateEntry = {
  id: TemplateId;
  label: string;
  description: string;
  slots: number;
  component: React.ForwardRefExoticComponent<MemoryCardProps & React.RefAttributes<HTMLDivElement>>;
};
 
export const TEMPLATES: TemplateEntry[] = [
  { id: "solo",       label: "Solo",        description: "1 hero photo, full bleed",           slots: 1, component: TemplateSolo },
  { id: "diptych",    label: "Diptych",     description: "2 photos side by side",              slots: 2, component: TemplateDiptych },
  { id: "triptych",   label: "Triptych",    description: "3 photos — 1 big + 2 small",         slots: 3, component: TemplateTriptych },
  { id: "polaroid",   label: "Polaroid",    description: "1 photo, classic white border",      slots: 1, component: TemplatePolaroid },
  { id: "filmstrip",  label: "Film Strip",  description: "4 frames like 35mm film",            slots: 4, component: TemplateFilmstrip },
  { id: "postcard",   label: "Postcard",    description: "Photo + ruled writing area",         slots: 1, component: TemplatePostcard },
  { id: "scrapbook",  label: "Scrapbook",   description: "5 photos, tape, graph paper chaos",  slots: 5, component: TemplateScrapbook },
  { id: "journal",    label: "Journal",     description: "3 photos on a ruled diary page",     slots: 3, component: TemplateJournal },
  { id: "corkboard",  label: "Corkboard",   description: "6 photos pinned with pushpins",      slots: 6, component: TemplateCorkboard },
  { id: "pile",       label: "Pile",        description: "5 photos scattered on a dark table", slots: 5, component: TemplatePile },
];

// ─── Main export: MemoryCard dispatcher ───────────────────────────────────────

export const MemoryCard = forwardRef<HTMLDivElement, MemoryCardProps>(
  (props, ref) => {
    const entry = TEMPLATES.find((t) => t.id === props.templateId);
    if (!entry) return null;
    const Component = entry.component;
    return <Component {...props} ref={ref} />;
  }
);
MemoryCard.displayName = "MemoryCard";