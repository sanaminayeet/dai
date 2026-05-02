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
      width: "100%",
      height: "100%",
      ...style,
    }}
  >
    {image ? (
      <img
        src={image.src}
        alt={image.alt ?? "memory"}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",        // ✅ consistent scaling
          objectPosition: "center",  // 🔥 fixes "cut off right side"
          display: "block",
        }}
      />
    ) : (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          opacity: 0.4,
          width: "100%",
          height: "100%",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={palette.brown} strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 10,
            color: palette.brown,
            letterSpacing: "0.1em",
          }}
        >
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
          width: '100%',
          maxWidth: CARD_W,
          height: h,
          position: "relative",
          overflow: "hidden",
          fontFamily: fonts.serif,
          background: palette.espresso,
        }}
      >
        <GrainOverlay />
        <ImageSlot image={images[0]} style={{ width: "100%", height: "100%", position: "absolute", inset: 0, objectFit: "cover" }} />
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
          width: '100%',
          maxWidth: CARD_W,
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
          <ImageSlot image={images[0]} style={{ flex: 1, borderRadius: 3, objectFit: "cover"  }} />
          <ImageSlot image={images[1]} style={{ flex: 1, borderRadius: 3, objectFit: "cover"  }} />
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
          width: '100%',
          maxWidth: CARD_W,
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
        <ImageSlot image={images[0]} style={{ width: "100%", height: 220, borderRadius: 3, objectFit: "cover"  }} />
        {/* Bottom: two smaller */}
        <div style={{ display: "flex", gap: 10, height: 140 }}>
          <ImageSlot image={images[1]} style={{ flex: 1, borderRadius: 3, objectFit: "cover"  }} />
          <ImageSlot image={images[2]} style={{ flex: 1, borderRadius: 3, objectFit: "cover"  }} />
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
          width: '100%',
          maxWidth: CARD_W,
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
          <ImageSlot image={images[0]} style={{ width: "100%", height: 280, objectFit: "cover"  }} />
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
          width: '100%',
          maxWidth: CARD_W,
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
              <ImageSlot image={images[i]} style={{ width: "100%", height: "100%", objectFit: "cover"  }} />
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
          width: '100%',
          maxWidth: CARD_W,
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
        <ImageSlot image={images[0]} style={{ width: "58%", height: "100%", flexShrink: 0, objectFit: "cover"  }} />
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
          width: '100%',
          maxWidth: CARD_W,
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
            <ImageSlot image={images[i]} style={{ width: "100%", height: h, display: "block", objectFit: "cover"  }} />
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
          width: '100%',
          maxWidth: CARD_W,
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
              <ImageSlot image={images[0]} style={{ width: 240, height: 190, objectFit: "cover"  }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              <div style={{
                background: "#FDFAF5",
                padding: "5px 5px 16px",
                boxShadow: "1px 2px 8px rgba(50,30,10,0.10)",
                transform: "rotate(1.5deg)",
              }}>
                <ImageSlot image={images[1]} style={{ width: "100%", height: 110, objectFit: "cover"  }} />
              </div>
              <div style={{
                background: "#FDFAF5",
                padding: "5px 5px 16px",
                boxShadow: "1px 2px 8px rgba(50,30,10,0.10)",
                transform: "rotate(-0.8deg)",
              }}>
                <ImageSlot image={images[2]} style={{ width: "100%", height: 100, objectFit: "cover" }} />
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
          width: '100%',
          maxWidth: CARD_W,
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
              <ImageSlot image={images[i]} style={{ width: "100%", height: h, objectFit: "cover"  }} />
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
          width: '100%',
          maxWidth: CARD_W,
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
            <ImageSlot image={images[i + 1]} style={{ width: "100%", height: h, objectFit: "cover"  }} />
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
          <ImageSlot image={images[0]} style={{ width: "100%", height: 200, objectFit: "cover"  }} />
          <div style={{ paddingTop: 10, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
            {caption && <Caption text={caption} align="center" style={{ fontSize: 12, color: palette.brown }} />}
            <Meta date={date} tag={tag} align="center" />
          </div>
        </div>
      </div>
    );
    }
    );
// ─── Decorative SVG elements ──────────────────────────────────────────────────

const Deco = {
  // tiny pressed flower (anemone)
  Flower: ({ x, y, color = "#D4A0B0", size = 1 }: { x: number; y: number; color?: string; size?: number }) => (
    <svg style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }} width={32 * size} height={32 * size} viewBox="0 0 32 32">
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <ellipse key={i} cx={16} cy={16} rx={4.5} ry={9} fill={color} opacity={0.75}
          transform={`rotate(${deg} 16 16) translate(0 -6)`} />
      ))}
      <circle cx={16} cy={16} r={4} fill="#F7E8A0" />
    </svg>
  ),

  // small leaf sprig
  Leaf: ({ x, y, color = "#7AAF7A", rotate = 0 }: { x: number; y: number; color?: string; rotate?: number }) => (
    <svg style={{ position: "absolute", left: x, top: y, transform: `rotate(${rotate}deg)`, pointerEvents: "none" }} width={28} height={38} viewBox="0 0 28 38">
      <path d="M14 36 C14 36 2 24 2 14 C2 4 14 2 14 2 C14 2 26 4 26 14 C26 24 14 36 14 36Z" fill={color} opacity={0.7} />
      <line x1="14" y1="4" x2="14" y2="34" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <line x1="14" y1="14" x2="8" y2="20" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      <line x1="14" y1="20" x2="20" y2="26" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
    </svg>
  ),

  // washi tape strip (horizontal)
  WashiH: ({ x, y, w = 80, color = "rgba(255,210,180,0.5)", pattern = "dots" }: { x: number; y: number; w?: number; color?: string; pattern?: string }) => (
    <svg style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }} width={w} height={18} viewBox={`0 0 ${w} 18`}>
      <rect width={w} height={18} fill={color} />
      {pattern === "dots" && Array.from({ length: Math.floor(w / 12) }).map((_, i) => (
        <circle key={i} cx={8 + i * 12} cy={9} r={2.5} fill="rgba(255,255,255,0.35)" />
      ))}
      {pattern === "lines" && Array.from({ length: Math.floor(w / 8) }).map((_, i) => (
        <line key={i} x1={4 + i * 8} y1={4} x2={4 + i * 8} y2={14} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
      ))}
      {pattern === "zigzag" && (
        <polyline points={Array.from({ length: Math.floor(w / 8) + 1 }).map((_, i) => `${i*8},${i%2===0?4:14}`).join(" ")} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
      )}
    </svg>
  ),

  // washi tape strip (vertical)
  WashiV: ({ x, y, h = 80, color = "rgba(180,210,255,0.5)" }: { x: number; y: number; h?: number; color?: string }) => (
    <svg style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }} width={18} height={h} viewBox={`0 0 18 ${h}`}>
      <rect width={18} height={h} fill={color} />
      {Array.from({ length: Math.floor(h / 12) }).map((_, i) => (
        <circle key={i} cx={9} cy={8 + i * 12} r={2.5} fill="rgba(255,255,255,0.35)" />
      ))}
    </svg>
  ),

  // little star cluster
  Stars: ({ x, y, color = "#C9A96E" }: { x: number; y: number; color?: string }) => (
    <svg style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }} width={40} height={30} viewBox="0 0 40 30">
      {[[8,8,6],[22,5,4],[32,14,5],[15,20,3],[28,22,4]].map(([cx,cy,r],i) => (
        <polygon key={i} points={Array.from({length:5}).map((_,j)=>{
          const a = (j*72-90)*Math.PI/180; const b = (j*72-90+36)*Math.PI/180;
          return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)} ${cx+(r*0.4)*Math.cos(b)},${cy+(r*0.4)*Math.sin(b)}`;
        }).join(" ")} fill={color} opacity={0.6+i*0.06} />
      ))}
    </svg>
  ),

  // paperclip
  Paperclip: ({ x, y, color = "#A0A8B8", rotate = 0 }: { x: number; y: number; color?: string; rotate?: number }) => (
    <svg style={{ position: "absolute", left: x, top: y, transform: `rotate(${rotate}deg)`, pointerEvents: "none" }} width={16} height={42} viewBox="0 0 16 42">
      <path d="M8 2 C4 2 2 5 2 8 L2 34 C2 38 4 40 8 40 C12 40 14 38 14 34 L14 10 C14 7 12 6 10 6 C8 6 6 7 6 10 L6 32 C6 34 10 34 10 32 L10 12" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  ),

  // tiny mushroom
  Mushroom: ({ x, y }: { x: number; y: number }) => (
    <svg style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }} width={24} height={28} viewBox="0 0 24 28">
      <ellipse cx={12} cy={14} rx={11} ry={9} fill="#C94040" opacity={0.8} />
      <ellipse cx={7} cy={13} rx={2} ry={1.5} fill="rgba(255,255,255,0.6)" />
      <ellipse cx={14} cy={11} rx={2.5} ry={2} fill="rgba(255,255,255,0.6)" />
      <ellipse cx={17} cy={15} rx={1.5} ry={1.2} fill="rgba(255,255,255,0.5)" />
      <path d="M8 22 C8 22 9 28 12 28 C15 28 16 22 16 22" fill="#F5D5A0" opacity={0.9} />
      <line x1={12} y1={23} x2={12} y2={27} stroke="#C4A070" strokeWidth={0.8} />
    </svg>
  ),

  // tiny sun / sunny doodle
  Sun: ({ x, y, color = "#F0C040" }: { x: number; y: number; color?: string }) => (
    <svg style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }} width={32} height={32} viewBox="0 0 32 32">
      <circle cx={16} cy={16} r={6} fill={color} opacity={0.85} />
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i) => {
        const r = Math.PI * deg / 180;
        return <line key={i} x1={16+9*Math.cos(r)} y1={16+9*Math.sin(r)} x2={16+13*Math.cos(r)} y2={16+13*Math.sin(r)} stroke={color} strokeWidth={1.8} strokeLinecap="round" opacity={0.7} />;
      })}
    </svg>
  ),

  // small heart
  Heart: ({ x, y, color = "#D47090" }: { x: number; y: number; color?: string }) => (
    <svg style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }} width={20} height={18} viewBox="0 0 20 18">
      <path d="M10 16 C10 16 1 10 1 5 C1 2 3 0 6 0 C8 0 10 2 10 2 C10 2 12 0 14 0 C17 0 19 2 19 5 C19 10 10 16 10 16Z" fill={color} opacity={0.75} />
    </svg>
  ),

  // small moon
  Moon: ({ x, y, color = "#A090C8" }: { x: number; y: number; color?: string }) => (
    <svg style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }} width={22} height={22} viewBox="0 0 22 22">
      <path d="M12 2 C6 2 2 7 2 12 C2 17 6 20 11 20 C8 17 7 14 8 10 C9 6 11 4 14 3 C13.3 2.4 12.7 2 12 2Z" fill={color} opacity={0.8} />
    </svg>
  ),

  // ruled lines section
  RuledLines: ({ x, y, w, lines, color = "rgba(150,170,210,0.2)" }: { x: number; y: number; w: number; lines: number; color?: string }) => (
    <svg style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }} width={w} height={lines * 22} viewBox={`0 0 ${w} ${lines * 22}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <line key={i} x1={0} y1={i * 22 + 21} x2={w} y2={i * 22 + 21} stroke={color} strokeWidth={1} />
      ))}
    </svg>
  ),

  // small envelope / letter deco
  Envelope: ({ x, y, color = "#C4A882" }: { x: number; y: number; color?: string }) => (
    <svg style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }} width={32} height={24} viewBox="0 0 32 24">
      <rect x={1} y={1} width={30} height={22} rx={2} fill={color} opacity={0.4} stroke={color} strokeWidth={1} />
      <polyline points="1,1 16,14 31,1" fill="none" stroke={color} strokeWidth={1} opacity={0.6} />
    </svg>
  ),
};

// ─── Template 11 · Morning Pages — wide-ruled full-text journal, 1 small photo
// Best for: reflective captions, travel writing, emotional days.

const TemplateMorningPages = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ images, caption, date, tag }, ref) => {
    const loremLines = [
      "woke up slow, sun already cutting through the curtains",
      "the kind of morning that asks nothing of you",
      "coffee went cold before I remembered it was there",
      "wrote three pages and none of them made sense",
      "that's okay. some days are for feeling, not for keeping",
    ];
    return (
      <div ref={ref} style={{
        width: '100%', maxWidth: CARD_W, background: "#FAF7F0",
        position: "relative", overflow: "hidden",
        minHeight: 420, fontFamily: fonts.serif,
      }}>
        {/* page texture */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #FAF7F0 0%, #F5F0E6 100%)" }} />
        <GrainOverlay />

        {/* red margin */}
        <div style={{ position: "absolute", left: 58, top: 0, bottom: 0, width: 1, background: "rgba(195,70,70,0.3)", zIndex: 2 }} />

        {/* ruled lines */}
        <Deco.RuledLines x={0} y={0} w={CARD_W} lines={19} />

        {/* hole punches */}
        {[50, 150, 250, 350].map(y => (
          <div key={y} style={{ position: "absolute", left: 12, top: y, width: 18, height: 18, borderRadius: "50%", background: "#EDE6D8", border: "1px solid #D8CFC0", zIndex: 3 }} />
        ))}

        {/* decorative elements */}
        <Deco.Flower x={490} y={12} color="#D4A0B0" size={0.85} />
        <Deco.Leaf x={528} y={10} color="#7AAF7A" rotate={20} />
        <Deco.Stars x={470} y={55} color="#C9A96E" />
        <Deco.Heart x={582} y={22} color="#D47090" />
        <Deco.Moon x={556} y={50} color="#A090C8" />

        {/* washi tape on photo */}
        <Deco.WashiH x={370} y={98} w={90} color="rgba(200,230,200,0.55)" pattern="dots" />

        {/* photo — tucked in top right */}
        <div style={{
          position: "absolute", top: 108, right: 28,
          background: "#FDFAF5", padding: "5px 5px 18px",
          boxShadow: "1px 2px 10px rgba(50,30,10,0.12)",
          transform: "rotate(2.5deg)", zIndex: 4, width: 160,
        }}>
          <ImageSlot image={images[0]} style={{ width: "100%", height: 120, objectFit: "cover"  }} />
        </div>

        {/* content area */}
        <div style={{ position: "relative", zIndex: 5, padding: "18px 28px 24px 72px" }}>
          {/* date + tag header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ fontFamily: fonts.mono, fontSize: 11, color: palette.warmGray, letterSpacing: "0.1em" }}>{date ?? "———"}</span>
            {tag && <><span style={{ color: palette.tan }}>·</span><span style={{ fontFamily: fonts.mono, fontSize: 11, color: palette.goldAccent, letterSpacing: "0.08em", textTransform: "uppercase" }}>{tag}</span></>}
          </div>

          {/* caption as the "writing" — large and prominent */}
          {caption && (
            <p style={{ fontFamily: fonts.serif, fontSize: 16, color: "#3B2A1A", lineHeight: 2.0, margin: "0 0 14px 0", maxWidth: 340, fontStyle: "italic" }}>
              {caption}
            </p>
          )}

          {/* filler lines to feel like a full journal page */}
          {loremLines.map((line, i) => (
            <p key={i} style={{ fontFamily: fonts.serif, fontSize: 13.5, color: `rgba(90,65,45,${0.22 - i * 0.03})`, lineHeight: 2.0, margin: 0, fontStyle: "italic" }}>
              {line}
            </p>
          ))}
        </div>

        {/* bottom corner deco */}
        <Deco.Mushroom x={42} y={360} />
        <Deco.Sun x={18} y={330} color="#F0C040" />
      </div>
    );
  }
);
TemplateMorningPages.displayName = "TemplateMorningPages";

// ─── Template 12 · Field Notes — compact, 2-col, 2 photos, lots of typed text
// Best for: travel, nature walks, exploring a new city.

const TemplateFieldNotes = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ images, caption, date, tag }, ref) => {
    return (
      <div ref={ref} style={{
        width: '100%', maxWidth: CARD_W, background: "#F2EDE3",
        position: "relative", overflow: "hidden",
        minHeight: 420,
      }}>
        <GrainOverlay />

        {/* top orange band — field notes style */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#D4601A" }} />

        {/* grid background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(160,140,110,0.10) 1px,transparent 1px),linear-gradient(90deg,rgba(160,140,110,0.10) 1px,transparent 1px)",
          backgroundSize: "20px 20px",
        }} />

        {/* decorative elements */}
        <Deco.WashiH x={0} y={6} w={120} color="rgba(212,96,26,0.15)" pattern="lines" />
        <Deco.Paperclip x={600} y={20} color="#A0A8B8" rotate={10} />
        <Deco.Stars x={10} y={380} color="#D4601A" />
        <Deco.Leaf x={580} y={370} color="#7AAF7A" rotate={-30} />
        <Deco.Envelope x={8} y={14} color="#D4601A" />

        <div style={{ padding: "20px 24px 20px 24px", position: "relative", zIndex: 2 }}>
          {/* header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, borderBottom: "1.5px solid rgba(212,96,26,0.3)", paddingBottom: 8 }}>
            <div>
              <div style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#D4601A", marginBottom: 3 }}>Field Notes</div>
              <div style={{ fontFamily: fonts.mono, fontSize: 13, color: palette.espresso, letterSpacing: "0.05em" }}>{tag ?? "untitled"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: fonts.mono, fontSize: 9, color: palette.warmGray, letterSpacing: "0.1em" }}>{date ?? "——"}</div>
              <div style={{ fontFamily: fonts.mono, fontSize: 9, color: palette.warmGray, opacity: 0.6, marginTop: 2 }}>pg. 01</div>
            </div>
          </div>

          {/* two column layout */}
          <div style={{ display: "flex", gap: 18 }}>
            {/* left col — text heavy */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              {/* photo with tape */}
              <div style={{ position: "relative" }}>
                <Deco.WashiH x={20} y={-8} w={70} color="rgba(212,96,26,0.3)" pattern="zigzag" />
                <div style={{ background: "#FDFAF5", padding: "4px 4px 14px", boxShadow: "1px 2px 6px rgba(50,30,10,0.10)", transform: "rotate(-1deg)" }}>
                  <ImageSlot image={images[0]} style={{ width: "100%", height: 140, objectFit: "cover"  }} />
                </div>
              </div>

              {/* observations list */}
              <div style={{ fontFamily: fonts.mono, fontSize: 10, color: palette.espresso, lineHeight: 1.9, letterSpacing: "0.02em" }}>
                <div style={{ color: "#D4601A", marginBottom: 4, fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase" }}>observations</div>
                {["light: golden, late afternoon", "temp: warm, hint of breeze", "mood: unhurried, present", "sounds: birds + distant traffic"].map((obs, i) => (
                  <div key={i} style={{ display: "flex", gap: 6 }}>
                    <span style={{ color: "#D4601A", opacity: 0.6 }}>—</span>
                    <span style={{ opacity: 0.75 }}>{obs}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* right col */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              {/* caption / entry */}
              <div>
                <div style={{ fontFamily: fonts.mono, fontSize: 9, color: "#D4601A", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>entry</div>
                {caption && (
                  <p style={{ fontFamily: fonts.serif, fontSize: 13.5, fontStyle: "italic", color: palette.espresso, lineHeight: 1.75, margin: 0 }}>
                    {caption}
                  </p>
                )}
                {/* ruled filler lines */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ height: 1, background: "rgba(150,130,100,0.2)", marginTop: 22 }} />
                ))}
              </div>

              {/* second photo */}
              <div style={{ position: "relative", marginTop: 4 }}>
                <Deco.WashiH x={30} y={-8} w={60} color="rgba(122,175,122,0.4)" pattern="dots" />
                <div style={{ background: "#FDFAF5", padding: "4px 4px 14px", boxShadow: "1px 2px 6px rgba(50,30,10,0.10)", transform: "rotate(1.2deg)" }}>
                  <ImageSlot image={images[1]} style={{ width: "100%", height: 110, objectFit: "cover"  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
TemplateFieldNotes.displayName = "TemplateFieldNotes";

// ─── Template 13 · Weekly Spread — bullet journal 2-page spread, 3 photos ────
// Best for: week recap, multiple events, full-life snapshot.

const TemplateWeeklySpread = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ images, caption, date, tag }, ref) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const highlights = ["quiet morning walk", "coffee with K.", "", "finished the book", "", "farmers market", "slow afternoon"];
    const moods = ["🌤", "☕", "", "📖", "", "🌿", "🌙"];
    return (
      <div ref={ref} style={{
        width: '100%', maxWidth: CARD_W, background: "#F8F4EE",
        position: "relative", overflow: "hidden", minHeight: 440,
      }}>
        <GrainOverlay />

        {/* dot grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(150,130,100,0.25) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }} />

        {/* center spine */}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(180,160,130,0.3)", zIndex: 2 }} />

        {/* decorative elements */}
        <Deco.Flower x={8} y={8} color="#C8A0C0" size={0.7} />
        <Deco.WashiH x={0} y={0} w={60} color="rgba(200,160,190,0.4)" pattern="dots" />
        <Deco.WashiV x={0} y={60} h={80} color="rgba(200,160,190,0.3)" />
        <Deco.Stars x={540} y={6} color="#C9A96E" />
        <Deco.Sun x={580} y={400} color="#F0C040" />
        <Deco.Leaf x={590} y={8} color="#90BF90" rotate={15} />
        <Deco.Heart x={24} y={400} color="#D47090" />
        <Deco.Moon x={52} y={398} color="#A090C8" />

        <div style={{ display: "flex", position: "relative", zIndex: 3 }}>
          {/* LEFT PAGE */}
          <div style={{ flex: 1, padding: "20px 16px 20px 20px" }}>
            {/* week header */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: fonts.mono, fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: palette.warmGray }}>week of</div>
              <div style={{ fontFamily: fonts.serif, fontSize: 20, color: palette.espresso, marginTop: 2 }}>{date ?? "this week"}</div>
              {tag && <div style={{ fontFamily: fonts.mono, fontSize: 9, color: palette.goldAccent, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{tag}</div>}
            </div>

            {/* daily tracker */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {days.map((day, i) => (
                <div key={day} style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(180,160,130,0.2)", paddingTop: 5, paddingBottom: 5 }}>
                  <span style={{ fontFamily: fonts.mono, fontSize: 9, color: palette.warmGray, width: 24, letterSpacing: "0.05em" }}>{day}</span>
                  <span style={{ fontSize: 11 }}>{moods[i]}</span>
                  <span style={{ fontFamily: fonts.serif, fontSize: 11, fontStyle: "italic", color: "rgba(59,42,26,0.55)", flex: 1 }}>{highlights[i]}</span>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", border: `1px solid ${highlights[i] ? palette.goldAccent : "rgba(180,160,130,0.4)"}`, background: highlights[i] ? "rgba(201,169,110,0.3)" : "transparent" }} />
                </div>
              ))}
            </div>

            {/* photo at bottom left */}
            <div style={{ marginTop: 14, position: "relative" }}>
              <Deco.WashiH x={40} y={-8} w={65} color="rgba(212,160,176,0.5)" pattern="dots" />
              <div style={{ background: "#FDFAF5", padding: "4px 4px 16px", boxShadow: "1px 2px 8px rgba(50,30,10,0.10)", transform: "rotate(-1.5deg)", width: "fit-content" }}>
                <ImageSlot image={images[0]} style={{ width: 200, height: 110, objectFit: "cover"  }} />
              </div>
            </div>
          </div>

          {/* RIGHT PAGE */}
          <div style={{ flex: 1, padding: "20px 20px 20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {/* photos */}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ position: "relative" }}>
                <Deco.WashiH x={10} y={-8} w={55} color="rgba(144,191,144,0.5)" pattern="zigzag" />
                <div style={{ background: "#FDFAF5", padding: "4px 4px 16px", boxShadow: "1px 2px 8px rgba(50,30,10,0.10)", transform: "rotate(2deg)" }}>
                  <ImageSlot image={images[1]} style={{ width: 118, height: 100, objectFit: "cover"  }} />
                </div>
              </div>
              <div style={{ position: "relative", marginTop: 10 }}>
                <Deco.WashiH x={15} y={-8} w={55} color="rgba(160,144,200,0.45)" pattern="lines" />
                <div style={{ background: "#FDFAF5", padding: "4px 4px 16px", boxShadow: "1px 2px 8px rgba(50,30,10,0.10)", transform: "rotate(-2.5deg)" }}>
                  <ImageSlot image={images[2]} style={{ width: 118, height: 100, objectFit: "cover"  }} />
                </div>
              </div>
            </div>

            {/* gratitude / notes section */}
            <div style={{ marginTop: 4 }}>
              <div style={{ fontFamily: fonts.mono, fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: palette.warmGray, marginBottom: 8 }}>this week i'm grateful for</div>
              {["the light in the afternoon", "good conversations", "being exactly here"].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: palette.goldAccent, opacity: 0.7, marginTop: 5, flexShrink: 0 }} />
                  <span style={{ fontFamily: fonts.serif, fontSize: 12, fontStyle: "italic", color: "rgba(59,42,26,0.7)", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* caption */}
            {caption && (
              <div style={{ marginTop: "auto", borderTop: "1px solid rgba(180,160,130,0.25)", paddingTop: 10 }}>
                <Caption text={caption} style={{ fontSize: 12.5, color: palette.brown, lineHeight: 1.7 }} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
TemplateWeeklySpread.displayName = "TemplateWeeklySpread";

// ─── Template 14 · Letterpress — cream card, 1 photo, large editorial text ───
// Best for: a single meaningful quote or memory, elegant & minimal-cozy.

const TemplateLetterpress = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ images, caption, date, tag }, ref) => {
    return (
      <div ref={ref} style={{
        width: '100%', maxWidth: CARD_W, background: "#F5F0E6",
        position: "relative", overflow: "hidden", minHeight: 400,
        border: "1px solid #E2D8C8",
      }}>
        <GrainOverlay />

        {/* letterpress border — double rule */}
        <div style={{ position: "absolute", inset: 12, border: "1px solid rgba(180,155,115,0.35)", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 16, border: "0.5px solid rgba(180,155,115,0.2)", pointerEvents: "none", zIndex: 1 }} />

        {/* corner ornaments */}
        {[{t:8,l:8,r:0,tr:0},{t:8,l:0,r:8,tr:0},{t:0,l:8,r:0,tr:8,b:8},{t:0,l:0,r:8,tr:0,b:8}].map((pos,i) => (
          <svg key={i} style={{ position:"absolute", top: pos.t||undefined, left: pos.l||undefined, right: pos.r||undefined, bottom: pos.b||undefined, zIndex:2 }} width={20} height={20} viewBox="0 0 20 20">
            <path d="M2 2 L10 2 Q10 2 10 10" fill="none" stroke="rgba(180,155,115,0.5)" strokeWidth={1}
              transform={i===1?"scale(-1,1) translate(-20,0)":i===2?"scale(1,-1) translate(0,-20)":i===3?"scale(-1,-1) translate(-20,-20)":""} />
          </svg>
        ))}

        {/* decorative elements */}
        <Deco.Flower x={24} y={26} color="#C8A8B8" size={0.75} />
        <Deco.Flower x={555} y={26} color="#A8B8C8" size={0.65} />
        <Deco.Leaf x={60} y={24} color="#8AAF8A" rotate={-10} />
        <Deco.Leaf x={520} y={20} color="#8AAF8A" rotate={30} />
        <Deco.Stars x={276} y={8} color="rgba(201,169,110,0.5)" />
        <Deco.Heart x={300} y={370} color="rgba(212,112,144,0.5)" />
        <Deco.Mushroom x={590} y={355} />
        <Deco.Sun x={22} y={355} color="rgba(240,192,64,0.6)" />

        {/* washi tape on photo */}
        <Deco.WashiH x={158} y={74} w={80} color="rgba(200,168,184,0.5)" pattern="dots" />
        <Deco.WashiH x={362} y={74} w={80} color="rgba(168,200,200,0.5)" pattern="dots" />

        <div style={{ position: "relative", zIndex: 3, padding: "30px 40px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          {/* photo — centered with polaroid border */}
          <div style={{ background: "#FDFAF5", padding: "6px 6px 24px", boxShadow: "0 2px 16px rgba(50,30,10,0.10)", marginBottom: 24 }}>
            <ImageSlot image={images[0]} style={{ width: 320, height: 200, objectFit: "cover"  }} />
          </div>

          {/* ornamental divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, width: "100%" }}>
            <div style={{ flex: 1, height: 0.5, background: "rgba(180,155,115,0.4)" }} />
            <svg width={16} height={16} viewBox="0 0 16 16">
              <circle cx={8} cy={8} r={2} fill="rgba(201,169,110,0.6)" />
              <circle cx={4} cy={8} r={1.2} fill="rgba(201,169,110,0.4)" />
              <circle cx={12} cy={8} r={1.2} fill="rgba(201,169,110,0.4)" />
            </svg>
            <div style={{ flex: 1, height: 0.5, background: "rgba(180,155,115,0.4)" }} />
          </div>

          {/* large caption */}
          {caption && (
            <p style={{
              fontFamily: fonts.serif, fontSize: 19, fontStyle: "italic",
              color: palette.espresso, lineHeight: 1.65, textAlign: "center",
              margin: "0 0 18px 0", maxWidth: 480,
              letterSpacing: "0.01em",
            }}>
              "{caption}"
            </p>
          )}

          {/* meta */}
          <Meta date={date} tag={tag} align="center" />
        </div>
      </div>
    );
  }
);
TemplateLetterpress.displayName = "TemplateLetterpress";


// ─── Updated Registry ─────────────────────────────────────────────────────────

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