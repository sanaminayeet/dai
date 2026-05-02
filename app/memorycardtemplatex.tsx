"use client";

import React, { forwardRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TemplateId =
  | "solo"
  | "diptych"
  | "triptych"
  | "polaroid"
  | "filmstrip"
  | "postcard";

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

// ─── Registry ─────────────────────────────────────────────────────────────────

export const TEMPLATES: {
  id: TemplateId;
  label: string;
  description: string;
  slots: number;
  component: React.ForwardRefExoticComponent<MemoryCardProps & React.RefAttributes<HTMLDivElement>>;
}[] = [
  { id: "solo",      label: "Solo",       description: "1 hero photo, full bleed",      slots: 1, component: TemplateSolo },
  { id: "diptych",   label: "Diptych",    description: "2 photos side by side",         slots: 2, component: TemplateDiptych },
  { id: "triptych",  label: "Triptych",   description: "3 photos — 1 big + 2 small",    slots: 3, component: TemplateTriptych },
  { id: "polaroid",  label: "Polaroid",   description: "1 photo, classic white border", slots: 1, component: TemplatePolaroid },
  { id: "filmstrip", label: "Film Strip", description: "4 frames like 35mm film",       slots: 4, component: TemplateFilmstrip },
  { id: "postcard",  label: "Postcard",   description: "Photo + ruled writing area",    slots: 1, component: TemplatePostcard },
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