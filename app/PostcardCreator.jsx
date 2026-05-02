"use client"

import { useState, useRef, useCallback } from "react";
import { TEMPLATES, MemoryCard } from "./memorycardtemplatex";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

const generatePostcardMessage = async (imageFiles, userContext = "", recipient = "", language = "English") => {
    if (!API_KEY) throw new Error("API Key is missing.");

    const imageParts = await Promise.all(
        imageFiles.filter(Boolean).map(async (file) => ({
            inline_data: { mime_type: file.type, data: await fileToBase64(file) }
        }))
    );

    const audienceClause = recipient
        ? `You are writing to ${recipient}. Match your tone to the relationship.`
        : "You are writing this as a personal journal entry.";

    const prompt = `Look at these photos carefully. Write a short, heartfelt postcard message (2-3 sentences) based on the collective mood and content of all images.
${audienceClause}
${userContext ? `Context: ${userContext}` : ""}
Language: ${language}.
Write in first person. Do not add any preamble or sign-off—just the message body.`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [...imageParts, { text: prompt }] }],
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
    const [language, setLanguage] = useState("English");
    const [step, setStep] = useState(1);
    const [template, setTemplate] = useState("solo");
    const [style, setStyle] = useState(STYLES[0]);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [recipient, setRecipient] = useState("");
    const [context, setContext] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRefs = useRef([]);
    const postcardRef = useRef();

    const selectedTemplate = TEMPLATES.find((t) => t.id === template);

    const handleFile = useCallback((file, index) => {
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreviews(prev => { const n = [...prev]; n[index] = e.target.result; return n; });
            setImageFiles(prev => { const n = [...prev]; n[index] = file; return n; });
        };
        reader.readAsDataURL(file);
    }, []);

    const handleGenerate = async () => {
        if (imageFiles.filter(Boolean).length === 0) return;
        setLoading(true);
        setError("");
        try {
            const msg = await generatePostcardMessage(imageFiles, context, recipient, language);
            setMessage(msg);
            setStep(4);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!postcardRef.current) return;
        try {
            const { toPng } = await import("html-to-image");
            const dataUrl = await toPng(postcardRef.current);
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `memory-card-${Date.now()}.png`;
            link.click();
        } catch (err) {
            alert("Export failed: " + err.message);
        }
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

    .header { text-align: center; margin-bottom: 2.5rem; }

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

    .step-item.active .step-num { background: #e8d5a0; color: #1a1612; }

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
      max-width: 700px;
      width: 100%;
      margin: 0 auto 1.5rem;
      display: flex;
      flex-direction: column;
    }

    @media (max-width: 768px) {
      .card { max-width: 100%; padding: 1rem; }
      .template-grid { grid-template-columns: repeat(2, 1fr) !important; }
    }

    @media (max-width: 480px) {
      .card-title { font-size: 1.1rem; }
      .btn-row { flex-direction: column; gap: 8px; }
      .btn-primary, .btn-ghost { width: 100%; }
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
      padding: 2rem 1rem;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      background: #1a1612;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80px;
      color: #5a5044;
      font-size: 14px;
    }

    .upload-zone:hover { border-color: #c8a96e; background: #201c17; color: #c8a96e; }

    .upload-slot { display: flex; flex-direction: column; gap: 8px; }

    .preview-container { display: flex; flex-direction: column; gap: 8px; }

    .remove-btn {
      background: #5a5044;
      color: #f0ebe3;
      border: none;
      padding: 4px 8px;
      font-size: 11px;
      border-radius: 4px;
      cursor: pointer;
      align-self: flex-start;
    }

    .remove-btn:hover { background: #7a6e5e; }

    .preview-img-small {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #3a3028;
      background: #111;
    }

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

    input[type="text"]:focus, textarea:focus { border-color: #c8a96e; }
    input::placeholder, textarea::placeholder { color: #5a5044; }

    .hint { font-size: 12px; color: #5a5044; margin-top: 6px; }

    .template-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-top: 8px;
      align-items: stretch;
    }

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
      min-height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .style-chip:hover { border-color: #c8a96e; color: #c8a96e; }
    .style-chip.selected { border-color: #c8a96e; color: #e8d5a0; background: #2a2217; }

    .template-chip {
      width: 100%;
      height: 100%;
      min-height: 80px;
      padding: 12px 8px;
      border-radius: 8px;
      border: 1px solid #3a3028;
      cursor: pointer;
      text-align: center;
      font-size: 12px;
      color: #8a7e6e;
      transition: all 0.15s;
      font-family: 'DM Mono', monospace;
      background: transparent;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .template-chip:hover { border-color: #c8a96e; color: #c8a96e; }
    .template-chip.selected { border-color: #c8a96e; color: #e8d5a0; background: #2a2217; }

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

    .postcard {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #3a3028;
      margin-bottom: 1.5rem;
      font-family: 'Lato', sans-serif;
    }

    .pc-photo {
      width: 100%; height: 100%;
      display: block;
      object-fit: cover;
      object-position: center;
    }

    .postcard-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow-x: auto;
      border-radius: 12px;
      padding-bottom: 0.5rem;
    }

    .postcard-wrapper > div { width: 100%; max-width: 640px; }

    .pc-body { display: grid; grid-template-columns: 1fr 1fr; }

    .pc-left { padding: 1.25rem; border-right: 1px dashed rgba(0,0,0,0.15); }

    .pc-label {
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.4;
      margin-bottom: 8px;
      font-family: 'DM Mono', monospace;
    }

    .pc-message-text {
      font-size: 13px; line-height: 1.7;
      width: 100%; border: none; outline: none;
      resize: none; background: transparent;
      font-family: 'Lato', sans-serif;
    }

    .pc-right { padding: 1.25rem; display: flex; flex-direction: column; }

    .pc-stamp {
      width: 48px; height: 58px;
      border-radius: 4px;
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; text-align: center;
      font-family: 'DM Mono', monospace;
      letter-spacing: 0.5px;
      margin-left: auto; margin-bottom: 12px;
      border: 1px dashed rgba(0,0,0,0.2);
      line-height: 1.4; opacity: 0.7;
    }

    .pc-to { font-size: 11px; opacity: 0.4; margin-bottom: 4px; font-family: 'DM Mono', monospace; }
    .pc-recipient { font-size: 15px; font-weight: 700; margin-bottom: 2px; }
    .pc-subtitle { font-size: 12px; opacity: 0.5; }

    .pc-lines { margin-top: auto; padding-top: 12px; }
    .pc-line { height: 1px; background: rgba(0,0,0,0.1); margin-bottom: 10px; }
  `;

    return (
        <>
            <style>{css}</style>
            <div className="app">
                <div className="header">
                    <div className="logo">dAI</div>
                    <div className="tagline">how was your dAI?</div>
                </div>

                <div className="steps">
                    {["Template", "Upload", "Compose", "Preview"].map((s, i) => (
                        <div key={s} style={{ display: "flex", alignItems: "center" }}>
                            {i > 0 && <div className="step-divider" />}
                            <div className={`step-item ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
                                <div className="step-num">{step > i + 1 ? "✓" : i + 1}</div>
                                {s}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Step 1 — Template Selection */}
                {step === 1 && (
                    <div className="card">
                        <div className="card-title">Choose a template</div>
                        <div className="template-grid">
                            {TEMPLATES.map((t) => (
                                // ← wrapper div uses display:flex so height:100% works on the button
                                <div key={t.id} style={{ display: "flex" }}>
                                    <button
                                        className={`template-chip ${template === t.id ? "selected" : ""}`}
                                        onClick={() => setTemplate(t.id)}
                                    >
                                        <div style={{ fontWeight: 500, fontSize: "11px", letterSpacing: "0.5px" }}>
                                            {t.label}
                                        </div>
                                        <div style={{ fontSize: "10px", opacity: 0.7 }}>
                                            {t.slots} image{t.slots !== 1 ? "s" : ""}
                                        </div>
                                        <div style={{ fontSize: "9px", opacity: 0.5, textAlign: "center" }}>
                                            {t.description}
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="btn-row">
                            <button className="btn-primary" onClick={() => setStep(2)}>Next →</button>
                        </div>
                    </div>
                )}

                {/* Step 2 — Upload */}
                {step === 2 && (
                    <div className="card">
                        <div className="card-title">Upload photos ({selectedTemplate?.slots} required)</div>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: selectedTemplate?.slots > 1 ? "1fr 1fr" : "1fr",
                            gap: "1rem"
                        }}>
                            {Array.from({ length: selectedTemplate?.slots }).map((_, i) => (
                                <div key={i} className="upload-slot">
                                    <label>Photo {i + 1}</label>
                                    {!imagePreviews[i] ? (
                                        <div
                                            className="upload-zone"
                                            onClick={() => fileInputRefs.current[i].click()}
                                        >
                                            <span>+ Add photo</span>
                                        </div>
                                    ) : (
                                        <div className="preview-container">
                                            <img src={imagePreviews[i]} className="preview-img-small" alt="" />
                                            <button
                                                className="remove-btn"
                                                onClick={() => {
                                                    const nextP = [...imagePreviews]; nextP[i] = null; setImagePreviews(nextP);
                                                    const nextF = [...imageFiles]; nextF[i] = null; setImageFiles(nextF);
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={el => fileInputRefs.current[i] = el}
                                        style={{ display: "none" }}
                                        onChange={(e) => handleFile(e.target.files[0], i)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="btn-row">
                            <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
                            <button
                                className="btn-primary"
                                disabled={imageFiles.filter(Boolean).length < selectedTemplate?.slots}
                                onClick={() => setStep(3)}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3 — Compose */}
                {step === 3 && (
                    <div className="card">
                        <div className="card-title">Compose your {selectedTemplate?.label}</div>

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
                            <label>Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                style={{
                                    width: "100%", background: "#1a1612",
                                    border: "1px solid #3a3028", borderRadius: "8px",
                                    padding: "10px 14px", color: "#f0ebe3",
                                    fontSize: "14px", fontFamily: "Lato, sans-serif", outline: "none",
                                }}
                            >
                                <option value="English">English</option>
                                <option value="French">French</option>
                                <option value="Spanish">Spanish</option>
                                <option value="Japanese">Japanese</option>
                                <option value="Mandarin Chinese">Mandarin Chinese</option>
                                <option value="Arabic">Arabic</option>
                                <option value="Portuguese">Portuguese</option>
                                <option value="Korean">Korean</option>
                                <option value="Italian">Italian</option>
                                <option value="German">German</option>
                            </select>
                        </div>

                        <div className="field-group">
                            <label>Any context? (optional)</label>
                            <textarea
                                rows={3}
                                placeholder="e.g. We just hiked the trail and it was exhausting but worth it…"
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
                            <button className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
                            <button className="btn-primary" disabled={loading} onClick={handleGenerate}>
                                {loading
                                    ? <span className="loader"><span className="spin" /> Gemini is writing…</span>
                                    : "Generate with Gemini ✦"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4 — Preview */}
                {step === 4 && (
                    <div className="card">
                        <div className="card-title">Final Preview</div>
                        <div className="postcard-wrapper">
                            <div ref={postcardRef}>
                                <MemoryCard
                                    templateId={template}
                                    images={imagePreviews.map(src => ({ src }))}
                                    caption={message}
                                    date={new Date().toLocaleDateString("en-US", {
                                        year: "numeric", month: "long", day: "numeric"
                                    })}
                                    tag={recipient || "Memory"}
                                />
                            </div>
                        </div>
                        <div className="btn-row">
                            <button className="btn-ghost" onClick={() => setStep(3)}>← Edit</button>
                            <button className="btn-primary" onClick={handleDownload}>Download Image</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}