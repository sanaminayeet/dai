"use client"


import { useState, useRef, useCallback } from "react";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;


const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });


const generatePostcardMessage = async (imageBase64, mimeType, userContext = "", recipient = "") => {
    if (!API_KEY) {
        throw new Error("API Key is missing. Check your .env.local file and restart your server.");
    }
    
    const audienceClause = recipient
        ? `You are writing to ${recipient}. Match your tone to the relationship — casual for friends, warm for family, etc.`
        : "You are writing this as a personal journal entry — reflective, first-person, like a travel diary.";


    const contextClause = userContext
        ? `The sender also shared this context: "${userContext}".`
        : "Base the message entirely on what you see in the photo.";


    const prompt = `Look at this photo carefully. Write a short, heartfelt postcard message (2-3 sentences).
${audienceClause}
${contextClause}
Be specific to what you see — the place, mood, or activity. Keep it casual and natural, not overly poetic. Write in first person as the photo taker. Do not add any preamble or sign-off — just the message body.`;


    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { inline_data: { mime_type: mimeType, data: imageBase64 } },
                            { text: prompt },
                        ],
                    },
                ],
                generationConfig: { temperature: 0.9, maxOutputTokens: 150 },
            }),
        }
    );


    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Gemini API error");
    }


    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
};


const STYLES = [
    { id: "classic", label: "Classic", bg: "#fef9f0", accent: "#c8a96e", border: "#e8d5a0" },
    { id: "polaroid", label: "Polaroid", bg: "#f8f8f8", accent: "#333", border: "#ddd" },
    { id: "vintage", label: "Vintage", bg: "#f5ede0", accent: "#8b4513", border: "#c4956a" },
    { id: "minimal", label: "Minimal", bg: "#ffffff", accent: "#000", border: "#e0e0e0" },
];


export default function PostcardCreator() {
    const [step, setStep] = useState(1);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [recipient, setRecipient] = useState("");
    const [context, setContext] = useState("");
    const [message, setMessage] = useState("");
    const [style, setStyle] = useState(STYLES[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef();
    const postcardRef = useRef();


    const handleFile = useCallback((file) => {
        if (!file || !file.type.startsWith("image/")) return;
        setImageFile(file);
        // Convert to data URL instead of blob URL — works better with html2canvas
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
        setError("");
    }, []);


    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };


    const handleGenerate = async () => {
        if (!imageFile) return;
        setLoading(true);
        setError("");
        try {
            const base64 = await fileToBase64(imageFile);
            const msg = await generatePostcardMessage(base64, imageFile.type, context, recipient);
            setMessage(msg);
            setStep(3);
        } catch (e) {
            setError(e.message || "Something went wrong. Check your API key.");
        } finally {
            setLoading(false);
        }
    };


    const handleDownload = async () => {
        const cardWidth = 1200;
        const photoHeight = 480;
        const bodyHeight = 400;
        const totalHeight = photoHeight + bodyHeight;

        const canvas = document.createElement("canvas");
        canvas.width = cardWidth;
        canvas.height = totalHeight;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = style.bg;
        ctx.fillRect(0, 0, cardWidth, totalHeight);

        const img = new Image();
        img.src = imagePreview;
        await new Promise((res) => { img.onload = res; });

        const imgAspect = img.width / img.height;
        const targetAspect = cardWidth / photoHeight;
        let sx, sy, sw, sh;
        if (imgAspect > targetAspect) {
            sh = img.height; sw = sh * targetAspect;
            sx = (img.width - sw) / 2; sy = 0;
        } else {
            sw = img.width; sh = sw / targetAspect;
            sx = 0; sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cardWidth, photoHeight);

        ctx.strokeStyle = "rgba(0,0,0,0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, photoHeight); ctx.lineTo(cardWidth, photoHeight);
        ctx.stroke();

        ctx.fillStyle = style.accent;
        ctx.font = "22px sans-serif";
        ctx.globalAlpha = 0.4;
        ctx.fillText("MESSAGE", 40, photoHeight + 40);
        ctx.globalAlpha = 1;
        ctx.font = "26px sans-serif";
        const words = message.split(" ");
        let line = ""; let y = photoHeight + 80;
        for (const word of words) {
            const test = line + word + " ";
            if (ctx.measureText(test).width > 500 && line !== "") {
            ctx.fillText(line, 40, y); line = word + " "; y += 40;
            } else { line = test; }
        }
        ctx.fillText(line, 40, y);

        ctx.setLineDash([10, 8]);
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.beginPath();
        ctx.moveTo(cardWidth / 2, photoHeight); ctx.lineTo(cardWidth / 2, totalHeight);
        ctx.stroke();
        ctx.setLineDash([]);

        const rx = cardWidth / 2 + 40;
        ctx.font = "22px sans-serif";
        ctx.globalAlpha = 0.4;
        ctx.fillText(recipient ? "To" : "Journal", rx, photoHeight + 100);
        ctx.globalAlpha = 1;
        ctx.font = "bold 34px sans-serif";
        ctx.fillText(recipient || "My memories", rx, photoHeight + 150);
        ctx.font = "22px sans-serif";
        ctx.globalAlpha = 0.5;
        ctx.fillText(recipient ? "with love ♥" : "", rx, photoHeight + 185);
        ctx.globalAlpha = 1;

        const link = document.createElement("a");
        link.download = "postcard.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        };


    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@400;500&family=Lato:wght@300;400;700&display=swap');


    * { box-sizing: border-box; margin: 0; padding: 0; }


    .app {
      min-height: 100vh;
      background: #1a1612;
      font-family: 'Lato', sans-serif;
      color: #f0ebe3;
      padding: 2rem 1rem;
    }


    .header {
      text-align: center;
      margin-bottom: 2.5rem;
    }


    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 2.2rem;
      font-weight: 600;
      letter-spacing: -0.5px;
      color: #e8d5a0;
    }


    .tagline {
      font-size: 13px;
      color: #8a7e6e;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 4px;
      font-family: 'DM Mono', monospace;
    }


    .steps {
      display: flex;
      justify-content: center;
      gap: 0;
      margin-bottom: 2rem;
    }


    .step-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #5a5044;
      font-family: 'DM Mono', monospace;
      letter-spacing: 1px;
      text-transform: uppercase;
    }


    .step-item.active { color: #e8d5a0; }
    .step-item.done { color: #8a7e6e; }


    .step-num {
      width: 24px; height: 24px;
      border-radius: 50%;
      border: 1px solid currentColor;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px;
    }


    .step-item.active .step-num {
      background: #e8d5a0;
      color: #1a1612;
    }


    .step-divider {
      width: 40px; height: 1px;
      background: #3a3028;
      margin: 0 8px;
      align-self: center;
    }


    .card {
      background: #221e19;
      border: 1px solid #3a3028;
      border-radius: 16px;
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto 1.5rem;
    }


    .card-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.3rem;
      color: #e8d5a0;
      margin-bottom: 1.5rem;
    }


    .upload-zone {
      border: 1.5px dashed #3a3028;
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      background: #1a1612;
    }


    .upload-zone:hover, .upload-zone.dragging {
      border-color: #c8a96e;
      background: #201c17;
    }


    .upload-icon {
      width: 48px; height: 48px;
      border-radius: 50%;
      background: #2a2520;
      border: 1px solid #3a3028;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1rem;
    }


    .upload-text { color: #8a7e6e; font-size: 14px; line-height: 1.6; }
    .upload-text strong { color: #c8a96e; }


    .preview-img {
      width: 100%; max-height: 280px;
      object-fit: cover;
      border-radius: 10px;
      border: 1px solid #3a3028;
      display: block;
      margin-bottom: 1rem;
    }


    .change-btn {
      background: none;
      border: 1px solid #3a3028;
      color: #8a7e6e;
      font-size: 12px;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-family: 'DM Mono', monospace;
      letter-spacing: 0.5px;
      transition: border-color 0.2s, color 0.2s;
    }


    .change-btn:hover { border-color: #c8a96e; color: #c8a96e; }


    label {
      display: block;
      font-size: 11px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #8a7e6e;
      font-family: 'DM Mono', monospace;
      margin-bottom: 8px;
    }


    .field-group { margin-bottom: 1.25rem; }


    input[type="text"], textarea {
      width: 100%;
      background: #1a1612;
      border: 1px solid #3a3028;
      border-radius: 8px;
      padding: 10px 14px;
      color: #f0ebe3;
      font-size: 14px;
      font-family: 'Lato', sans-serif;
      outline: none;
      transition: border-color 0.2s;
      resize: none;
    }


    input[type="text"]:focus, textarea:focus {
      border-color: #c8a96e;
    }


    input::placeholder, textarea::placeholder { color: #5a5044; }


    .hint { font-size: 12px; color: #5a5044; margin-top: 6px; }


    .style-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-top: 8px;
    }


    .style-chip {
      padding: 8px 6px;
      border-radius: 8px;
      border: 1px solid #3a3028;
      cursor: pointer;
      text-align: center;
      font-size: 12px;
      color: #8a7e6e;
      transition: all 0.15s;
      font-family: 'DM Mono', monospace;
    }


    .style-chip:hover { border-color: #c8a96e; color: #c8a96e; }
    .style-chip.selected { border-color: #c8a96e; color: #e8d5a0; background: #2a2217; }


    .style-dot {
      width: 20px; height: 20px;
      border-radius: 50%;
      margin: 0 auto 6px;
      border: 1px solid rgba(255,255,255,0.1);
    }


    .btn-row { display: flex; gap: 10px; margin-top: 1.5rem; }


    .btn-primary {
      flex: 1;
      background: #c8a96e;
      color: #1a1612;
      border: none;
      border-radius: 8px;
      padding: 12px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      font-family: 'Lato', sans-serif;
      letter-spacing: 0.5px;
      transition: background 0.2s, transform 0.1s;
    }


    .btn-primary:hover { background: #d9bb7f; }
    .btn-primary:active { transform: scale(0.98); }
    .btn-primary:disabled { background: #3a3028; color: #5a5044; cursor: not-allowed; }


    .btn-ghost {
      background: none;
      border: 1px solid #3a3028;
      color: #8a7e6e;
      border-radius: 8px;
      padding: 12px 20px;
      font-size: 14px;
      cursor: pointer;
      font-family: 'Lato', sans-serif;
      transition: border-color 0.2s, color 0.2s;
    }


    .btn-ghost:hover { border-color: #8a7e6e; color: #f0ebe3; }


    .error {
      background: #2a1515;
      border: 1px solid #5a2020;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 13px;
      color: #e07070;
      margin-top: 1rem;
      font-family: 'DM Mono', monospace;
    }


    .loader {
      display: flex; align-items: center; gap: 10px;
      color: #8a7e6e; font-size: 13px;
      font-family: 'DM Mono', monospace;
      justify-content: center;
      padding: 0.5rem 0;
    }


    .spin {
      width: 16px; height: 16px;
      border: 2px solid #3a3028;
      border-top-color: #c8a96e;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }


    @keyframes spin { to { transform: rotate(360deg); } }


    /* Postcard preview */
    .postcard {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #3a3028;
      margin-bottom: 1.5rem;
      font-family: 'Lato', sans-serif;
    }


    .pc-photo {
        width: 100%;
        height: 240px;
        object-fit: cover;
        object-position: center;
        display: block;
        max-width: 100%;
    }


    .pc-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }


    .pc-left {
      padding: 1.25rem;
      border-right: 1px dashed rgba(0,0,0,0.15);
    }


    .pc-label {
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.4;
      margin-bottom: 8px;
      font-family: 'DM Mono', monospace;
    }


    .pc-message-text {
      font-size: 13px;
      line-height: 1.7;
      width: 100%;
      border: none;
      outline: none;
      resize: none;
      background: transparent;
      font-family: 'Lato', sans-serif;
    }


    .pc-right {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
    }


    .pc-stamp {
      width: 48px; height: 58px;
      border-radius: 4px;
      display: flex; align-items: center; justify-content: center;
      font-size: 9px;
      text-align: center;
      font-family: 'DM Mono', monospace;
      letter-spacing: 0.5px;
      margin-left: auto;
      margin-bottom: 12px;
      border: 1px dashed rgba(0,0,0,0.2);
      line-height: 1.4;
      opacity: 0.7;
    }


    .pc-to { font-size: 11px; opacity: 0.4; margin-bottom: 4px; font-family: 'DM Mono', monospace; }
    .pc-recipient { font-size: 15px; font-weight: 700; margin-bottom: 2px; }
    .pc-subtitle { font-size: 12px; opacity: 0.5; }


    .pc-lines {
      margin-top: auto;
      padding-top: 12px;
    }


    .pc-line {
      height: 1px;
      background: rgba(0,0,0,0.1);
      margin-bottom: 10px;
    }
  `;


    return (
        <>
            <style>{css}</style>
            <div className="app">
                <div className="header">
                    <div className="logo">Postly</div>
                    <div className="tagline">turn moments into postcards</div>
                </div>


                <div className="steps">
                    {["Upload", "Compose", "Preview"].map((s, i) => (
                        <div key={s} style={{ display: "flex", alignItems: "center" }}>
                            {i > 0 && <div className="step-divider" />}

                            <div
                                className={`step-item ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""
                                    }`}
                            >
                                <div className="step-num">
                                    {step > i + 1 ? "✓" : i + 1}
                                </div>
                                {s}
                            </div>
                        </div>
                    ))}
                </div>


                {/* Step 1 — Upload */}
                {step === 1 && (
                    <div className="card">
                        <div className="card-title">Choose your photo</div>


                        {!imagePreview ? (
                            <div
                                className={`upload-zone ${dragging ? "dragging" : ""}`}
                                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <div className="upload-icon">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#c8a96e" strokeWidth="1.5" />
                                        <circle cx="8.5" cy="8.5" r="1.5" stroke="#c8a96e" strokeWidth="1.5" />
                                        <path d="M3 15l5-5 4 4 3-3 6 6" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div className="upload-text">
                                    <strong>Drop a photo here</strong><br />
                                    or click to browse your files
                                </div>
                            </div>
                        ) : (
                            <>
                                <img src={imagePreview} alt="preview" className="preview-img" />
                                <button className="change-btn" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                                    ← change photo
                                </button>
                            </>
                        )}


                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => handleFile(e.target.files[0])}
                        />


                        <div className="btn-row">
                            <button
                                className="btn-primary"
                                disabled={!imageFile}
                                onClick={() => setStep(2)}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}


                {/* Step 2 — Compose */}
                {step === 2 && (
                    <div className="card">
                        <div className="card-title">Compose your postcard</div>


                        <div className="field-group">
                            <label>Who are you writing to?</label>
                            <input
                                type="text"
                                placeholder="e.g. Mom, my best friend Jake, Grandma Rose…"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                            />
                            <div className="hint">Leave blank to write a personal journal entry instead</div>
                        </div>


                        <div className="field-group">
                            <label>Any context? (optional)</label>
                            <textarea
                                rows={3}
                                placeholder="e.g. We just hiked the trail and it was exhausting but worth it. The sunset was incredible…"
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                            />
                            <div className="hint">Leave blank and Gemini will write based on the photo alone</div>
                        </div>


                        <div className="field-group">
                            <label>Postcard style</label>
                            <div className="style-grid">
                                {STYLES.map((s) => (
                                    <div
                                        key={s.id}
                                        className={`style-chip ${style.id === s.id ? "selected" : ""}`}
                                        onClick={() => setStyle(s)}
                                    >
                                        <div className="style-dot" style={{ background: s.bg, borderColor: s.border }} />
                                        {s.label}
                                    </div>
                                ))}
                            </div>
                        </div>


                        {error && <div className="error">{error}</div>}


                        <div className="btn-row">
                            <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
                            <button
                                className="btn-primary"
                                disabled={loading}
                                onClick={handleGenerate}
                            >
                                {loading
                                    ? <span className="loader"><span className="spin" /> Gemini is writing…</span>
                                    : "Generate with Gemini ✦"}
                            </button>
                        </div>
                    </div>
                )}


                {/* Step 3 — Preview */}
                {step === 3 && (
                    <div className="card">
                        <div className="card-title">Your postcard</div>


                        <div
                            className="postcard"
                            ref={postcardRef}
                            style={{ background: style.bg }}
                        >
                            <img 
                                src={imagePreview} 
                                alt="postcard" 
                                className="pc-photo"
                                style={{ imageRendering: "auto" }}
                            />
                            <div className="pc-body">
                                <div className="pc-left" style={{ color: style.accent }}>
                                    <div className="pc-label" style={{ color: style.accent }}>Message</div>
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={(e) => setMessage(e.currentTarget.textContent)}
                                        className="pc-message-text"
                                        style={{ color: style.accent, minHeight: "80px", outline: "none", whiteSpace: "pre-wrap" }}
                                    >
                                        {message}
                                    </div>
                                </div>
                                <div className="pc-right" style={{ color: style.accent }}>
                                    <div
                                        className="pc-stamp"
                                        style={{ background: style.border, color: style.accent }}
                                    >
                                        Postly<br />2026
                                    </div>
                                    {recipient ? (
                                        <>
                                            <div className="pc-to" style={{ color: style.accent }}>To</div>
                                            <div className="pc-recipient" style={{ color: style.accent }}>{recipient}</div>
                                            <div className="pc-subtitle" style={{ color: style.accent }}>with love ♥</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="pc-to" style={{ color: style.accent }}>Journal</div>
                                            <div className="pc-recipient" style={{ color: style.accent }}>My memories</div>
                                        </>
                                    )}
                                    <div className="pc-lines">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="pc-line" style={{ background: style.border }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="hint" style={{ marginBottom: "1rem" }}>
                            You can edit the message directly on the postcard above ↑
                        </div>


                        <div className="btn-row">
                            <button className="btn-ghost" onClick={() => setStep(2)}>← Edit</button>
                            <button
                                className="btn-ghost"
                                onClick={handleGenerate}
                            >
                                Regenerate ↺
                            </button>
                            <button className="btn-primary" onClick={handleDownload}>
                                Download / Print
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
