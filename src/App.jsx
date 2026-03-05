import { useState } from "react";

const NICHES = [
  { id: "lifestyle", label: "Lifestyle", emoji: "✨" },
  { id: "tech", label: "Tech", emoji: "⚡" },
  { id: "finance", label: "Finance", emoji: "💰" },
  { id: "fitness", label: "Fitness", emoji: "🔥" },
  { id: "food", label: "Food", emoji: "🍜" },
  { id: "travel", label: "Travel", emoji: "🌍" },
  { id: "humor", label: "Comedy", emoji: "😂" },
  { id: "edu", label: "Education", emoji: "📚" },
  { id: "beauty", label: "Beauty", emoji: "💄" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
];

const PLATFORMS = ["TikTok", "YouTube Shorts", "Instagram Reels", "YouTube"];

function ScoreBadge({ score }) {
  const color = score >= 85 ? "#ff2d2d" : score >= 70 ? "#ff8800" : "#00e676";
  const label = score >= 85 ? "🔥 FIRE" : score >= 70 ? "⚡ Strong" : "✅ Solid";
  return (
    <span style={{
      background: color + "18", color,
      border: `1px solid ${color}40`,
      borderRadius: "4px", padding: "3px 10px",
      fontFamily: "'DM Mono', monospace",
      fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.06em"
    }}>
      {label} {score}%
    </span>
  );
}

export default function App() {
  const [niche, setNiche] = useState(null);
  const [platform, setPlatform] = useState("TikTok");
  const [custom, setCustom] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("ideas");
  const [expanded, setExpanded] = useState(null);
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState(null);
  const [scriptIdea, setScriptIdea] = useState(null);
  const [script, setScript] = useState(null);
  const [scriptLoading, setScriptLoading] = useState(false);

  const selectedNicheLabel = niche ? NICHES.find(n => n.id === niche)?.label : custom.trim();
  const canGenerate = !loading && (niche || custom.trim());

  const generate = async () => {
    if (!selectedNicheLabel) return;
    setLoading(true); setResults(null); setError(null); setExpanded(null); setScript(null); setScriptIdea(null);

    const prompt = `You are a viral content strategist for ${platform}. Niche: "${selectedNicheLabel}".

Generate 4 viral video ideas. Reply ONLY with valid JSON, no markdown, no explanation:

{"trend_summary":"2-3 sentences about the biggest trend in this niche right now","ideas":[{"title":"Catchy video title under 60 chars","hook":"Exact words/action for the first 3 seconds","structure":["Step 1","Step 2","Step 3","CTA ending"],"viral_score":88,"why_viral":"One sentence why this will blow up","format":"listicle","duration":"30s"},{"title":"...","hook":"...","structure":["...","...","...","..."],"viral_score":76,"why_viral":"...","format":"story","duration":"60s"},{"title":"...","hook":"...","structure":["...","...","...","..."],"viral_score":82,"why_viral":"...","format":"challenge","duration":"15s"},{"title":"...","hook":"...","structure":["...","...","...","..."],"viral_score":79,"why_viral":"...","format":"tutorial","duration":"45s"}],"hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6"],"posting_time":"Best days and times to post for maximum reach"}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const raw = (data.content || []).map(b => b.text || "").join("");
      const clean = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      setResults(JSON.parse(clean));
      setTab("ideas");
    } catch (e) {
      setError("Something went wrong: " + e.message);
    }
    setLoading(false);
  };

  const generateScript = async (idea) => {
    setScriptIdea(idea); setScript(null); setScriptLoading(true); setTab("script");
    const prompt = `You are a viral content scriptwriter for ${platform}.

Write a full video script for this idea:
Title: "${idea.title}"
Hook: "${idea.hook}"
Format: ${idea.format}
Duration: ${idea.duration}
Niche: ${selectedNicheLabel}

Reply ONLY with valid JSON:
{"script":{"hook":{"text":"Exact hook script (first 3 seconds)","duration":"3s"},"sections":[{"title":"Section name","text":"Exact words to say","duration":"10s","visual":"What to show on screen"}],"cta":{"text":"Exact call to action words","duration":"5s"}},"tips":["Tip 1 for filming","Tip 2","Tip 3"],"b_roll":["B-roll shot 1","B-roll shot 2","B-roll shot 3"]}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const raw = (data.content || []).map(b => b.text || "").join("");
      const clean = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      setScript(JSON.parse(clean));
    } catch (e) {
      setError("Script generation failed: " + e.message);
    }
    setScriptLoading(false);
  };

  const toggleSave = (idea) => setSaved(p => p.find(s => s.title === idea.title) ? p.filter(s => s.title !== idea.title) : [...p, idea]);
  const isSaved = (idea) => !!saved.find(s => s.title === idea.title);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#060608;--surface:#0e0e12;--border:#1c1c24;--border2:#252530;
          --red:#ff2d2d;--orange:#ff7700;--yellow:#ffd000;
          --text:#f0f0f8;--muted:#52525e;--subtle:#8888a0;
        }
        body{background:var(--bg);min-height:100vh;}
        .app{min-height:100vh;background:var(--bg);color:var(--text);font-family:'DM Mono',monospace;}
        .grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;
          background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);
          background-size:60px 60px;}
        .glow{position:fixed;top:-200px;left:50%;transform:translateX(-50%);width:600px;height:400px;
          background:radial-gradient(ellipse,rgba(255,45,45,0.08) 0%,transparent 70%);pointer-events:none;z-index:0;}
        .wrap{max-width:780px;margin:0 auto;padding:48px 20px 100px;position:relative;z-index:1;}
        .header{margin-bottom:52px;}
        .logo-row{display:flex;align-items:baseline;gap:12px;}
        .logo{font-family:'Syne',sans-serif;font-size:clamp(2.4rem,7vw,4rem);font-weight:800;
          letter-spacing:-0.04em;color:var(--text);line-height:1;}
        .logo span{color:var(--red);}
        .badge{background:var(--red);color:#fff;font-size:0.6rem;font-weight:500;
          padding:3px 8px;border-radius:3px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;}
        .tagline{margin-top:12px;color:var(--muted);font-size:0.78rem;letter-spacing:0.05em;max-width:420px;line-height:1.6;}
        .card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:22px;margin-bottom:14px;}
        .label{font-size:0.62rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--red);margin-bottom:14px;font-weight:500;}
        .niche-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;}
        @media(max-width:500px){.niche-grid{grid-template-columns:repeat(4,1fr);}}
        .niche-btn{background:transparent;border:1px solid var(--border2);border-radius:8px;
          padding:11px 6px;cursor:pointer;text-align:center;transition:all 0.15s;
          color:var(--muted);font-family:'DM Mono',monospace;font-size:0.65rem;}
        .niche-btn:hover{border-color:rgba(255,45,45,0.35);color:var(--text);}
        .niche-btn.on{border-color:var(--red);color:var(--text);background:rgba(255,45,45,0.06);}
        .emoji{font-size:1.25rem;display:block;margin-bottom:5px;}
        .pill-row{display:flex;gap:6px;flex-wrap:wrap;}
        .pill{background:transparent;border:1px solid var(--border2);border-radius:100px;
          padding:7px 16px;cursor:pointer;color:var(--muted);font-family:'DM Mono',monospace;
          font-size:0.72rem;transition:all 0.15s;}
        .pill:hover{color:var(--text);border-color:#444;}
        .pill.on{border-color:var(--orange);color:var(--orange);background:rgba(255,119,0,0.06);}
        .inp{width:100%;background:transparent;border:1px solid var(--border2);border-radius:8px;
          padding:11px 14px;color:var(--text);font-family:'DM Mono',monospace;font-size:0.78rem;
          outline:none;transition:border-color 0.2s;margin-top:10px;}
        .inp:focus{border-color:rgba(255,45,45,0.4);}
        .inp::placeholder{color:var(--muted);}
        .gen-btn{width:100%;background:linear-gradient(135deg,var(--red),var(--orange));
          border:none;border-radius:10px;padding:17px;color:#fff;
          font-family:'Syne',sans-serif;font-weight:700;font-size:0.95rem;
          letter-spacing:0.04em;cursor:pointer;transition:all 0.2s;
          text-transform:uppercase;margin-bottom:22px;}
        .gen-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 32px rgba(255,45,45,0.25);}
        .gen-btn:disabled{opacity:0.35;cursor:not-allowed;transform:none;}
        .tabs{display:flex;gap:3px;background:var(--surface);border:1px solid var(--border);
          border-radius:10px;padding:3px;margin-bottom:14px;}
        .tab{flex:1;background:transparent;border:none;border-radius:8px;padding:9px 5px;
          cursor:pointer;color:var(--muted);font-family:'DM Mono',monospace;font-size:0.7rem;transition:all 0.15s;}
        .tab.on{background:#18181f;color:var(--text);}
        .trend{background:linear-gradient(135deg,rgba(255,119,0,0.05),rgba(255,208,0,0.03));
          border:1px solid rgba(255,119,0,0.15);border-radius:10px;padding:16px;margin-bottom:14px;}
        .trend-text{color:#ccc;font-size:0.8rem;line-height:1.8;}
        .idea{background:var(--surface);border:1px solid var(--border);border-radius:12px;
          margin-bottom:10px;overflow:hidden;transition:border-color 0.2s;}
        .idea:hover{border-color:var(--border2);}
        .idea-head{padding:16px 18px;cursor:pointer;display:flex;align-items:flex-start;gap:12px;}
        .idx{font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;color:#1a1a22;
          line-height:1;min-width:32px;transition:color 0.2s;}
        .idea:hover .idx{color:rgba(255,45,45,0.15);}
        .ititle{font-family:'Syne',sans-serif;font-size:0.88rem;font-weight:700;
          line-height:1.45;color:var(--text);flex:1;}
        .imeta{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;align-items:center;}
        .mtag{background:#141418;border:1px solid var(--border2);border-radius:4px;
          padding:2px 8px;font-size:0.63rem;color:var(--subtle);}
        .chev{color:#2a2a35;font-size:0.7rem;transition:transform 0.2s;margin-left:4px;margin-top:3px;}
        .chev.open{transform:rotate(180deg);color:var(--red);}
        .ibody{padding:2px 18px 16px;border-top:1px solid #111116;}
        .hook{background:#0a0a0f;border-left:2px solid var(--red);border-radius:0 6px 6px 0;
          padding:11px 14px;margin:12px 0;font-size:0.78rem;color:#ddd;line-height:1.7;}
        .hlabel{font-size:0.6rem;color:var(--red);text-transform:uppercase;letter-spacing:0.12em;
          margin-bottom:4px;font-weight:500;}
        .steps{list-style:none;display:flex;flex-direction:column;gap:5px;margin-top:10px;}
        .step{display:flex;align-items:flex-start;gap:9px;font-size:0.78rem;color:#aaa;line-height:1.55;}
        .snum{min-width:20px;height:20px;background:#141418;border:1px solid var(--border2);
          border-radius:50%;display:flex;align-items:center;justify-content:center;
          font-size:0.58rem;color:var(--muted);flex-shrink:0;}
        .why{margin-top:10px;padding:9px 12px;background:rgba(0,230,118,0.04);
          border:1px solid rgba(0,230,118,0.12);border-radius:7px;font-size:0.76rem;color:#00e676;}
        .iactions{display:flex;gap:7px;margin-top:12px;flex-wrap:wrap;}
        .ibtn{background:#111116;border:1px solid var(--border2);border-radius:7px;
          padding:7px 13px;cursor:pointer;color:var(--muted);font-family:'DM Mono',monospace;
          font-size:0.68rem;transition:all 0.15s;}
        .ibtn:hover{color:var(--text);border-color:#3a3a48;}
        .ibtn.saved{border-color:var(--red);color:var(--red);background:rgba(255,45,45,0.06);}
        .ibtn.script-btn{border-color:rgba(255,119,0,0.4);color:var(--orange);}
        .ibtn.script-btn:hover{background:rgba(255,119,0,0.06);}
        .tags{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px;}
        .htag{background:rgba(100,100,255,0.06);border:1px solid rgba(100,100,255,0.15);
          border-radius:5px;padding:5px 11px;font-size:0.72rem;color:#7070ee;}
        .ptime{margin-top:12px;padding:11px 14px;background:var(--surface);
          border:1px solid var(--border);border-radius:8px;font-size:0.76rem;color:var(--subtle);}
        .ptime strong{color:var(--yellow);}
        .script-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:12px;}
        .script-section{margin-bottom:16px;}
        .script-label{font-size:0.6rem;letter-spacing:0.16em;text-transform:uppercase;
          color:var(--orange);margin-bottom:8px;font-weight:500;}
        .script-text{font-size:0.82rem;color:var(--text);line-height:1.75;background:#0a0a0f;
          border-radius:7px;padding:12px 14px;border-left:2px solid var(--orange);}
        .script-visual{font-size:0.72rem;color:var(--muted);margin-top:5px;padding-left:4px;}
        .script-dur{display:inline-block;background:rgba(255,208,0,0.08);color:var(--yellow);
          border-radius:4px;padding:2px 8px;font-size:0.65rem;margin-bottom:6px;}
        .tips-list{list-style:none;display:flex;flex-direction:column;gap:6px;}
        .tip{font-size:0.78rem;color:#bbb;line-height:1.55;padding-left:16px;position:relative;}
        .tip::before{content:"→";position:absolute;left:0;color:var(--red);}
        .loading{text-align:center;padding:52px 20px;color:var(--muted);}
        .spin{display:inline-block;font-size:2rem;animation:spin 1s linear infinite;margin-bottom:14px;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .err{background:rgba(255,45,45,0.06);border:1px solid rgba(255,45,45,0.2);
          border-radius:9px;padding:13px 16px;color:#ff7070;font-size:0.76rem;
          margin-bottom:14px;line-height:1.65;word-break:break-word;}
        .empty{text-align:center;padding:40px;color:var(--muted);font-size:0.8rem;line-height:1.8;}
        .fade{animation:fade 0.3s ease forwards;}
        @keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div className="app">
        <div className="grid-bg" />
        <div className="glow" />
        <div className="wrap">
          <div className="header">
            <div className="logo-row">
              <div className="logo">Hook<span>r</span></div>
              <div className="badge">Beta</div>
            </div>
            <div className="tagline">Find viral ideas. Write scripts. Blow up. — AI-powered for content creators.</div>
          </div>

          <div className="card">
            <div className="label">01 — Pick your niche</div>
            <div className="niche-grid">
              {NICHES.map(n => (
                <button key={n.id} className={`niche-btn ${niche === n.id ? "on" : ""}`}
                  onClick={() => { setNiche(n.id); setCustom(""); }}>
                  <span className="emoji">{n.emoji}</span>{n.label}
                </button>
              ))}
            </div>
            <input className="inp" placeholder="or type your own: crypto, anime, cars, skincare..."
              value={custom} onChange={e => { setCustom(e.target.value); setNiche(null); }} />
          </div>

          <div className="card">
            <div className="label">02 — Platform</div>
            <div className="pill-row">
              {PLATFORMS.map(p => (
                <button key={p} className={`pill ${platform === p ? "on" : ""}`} onClick={() => setPlatform(p)}>{p}</button>
              ))}
            </div>
          </div>

          <button className="gen-btn" onClick={generate} disabled={!canGenerate}>
            {loading ? "⏳ Finding viral ideas..." : "⚡ Find Viral Ideas"}
          </button>

          {error && <div className="err fade">⚠️ {error}</div>}
          {loading && <div className="loading fade"><div className="spin">⚡</div><div>Analyzing trends...</div></div>}

          {results && (
            <div className="fade">
              <div className="tabs">
                <button className={`tab ${tab === "ideas" ? "on" : ""}`} onClick={() => setTab("ideas")}>🔥 Ideas ({results.ideas?.length || 0})</button>
                <button className={`tab ${tab === "script" ? "on" : ""}`} onClick={() => setTab("script")}>📝 Script {scriptIdea ? "✓" : ""}</button>
                <button className={`tab ${tab === "hashtags" ? "on" : ""}`} onClick={() => setTab("hashtags")}># Tags</button>
                <button className={`tab ${tab === "saved" ? "on" : ""}`} onClick={() => setTab("saved")}>★ Saved ({saved.length})</button>
              </div>

              {tab === "ideas" && <>
                {results.trend_summary && (
                  <div className="trend">
                    <div className="label" style={{ color: "#ff7700", marginBottom: "8px" }}>Trend right now</div>
                    <div className="trend-text">{results.trend_summary}</div>
                  </div>
                )}
                {(results.ideas || []).map((idea, i) => (
                  <div key={i} className="idea">
                    <div className="idea-head" onClick={() => setExpanded(expanded === i ? null : i)}>
                      <div className="idx">0{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div className="ititle">{idea.title}</div>
                        <div className="imeta">
                          {idea.viral_score && <ScoreBadge score={idea.viral_score} />}
                          {idea.format && <span className="mtag">{idea.format}</span>}
                          {idea.duration && <span className="mtag">{idea.duration}</span>}
                        </div>
                      </div>
                      <span className={`chev ${expanded === i ? "open" : ""}`}>▼</span>
                    </div>
                    {expanded === i && (
                      <div className="ibody fade">
                        {idea.hook && <div className="hook"><div className="hlabel">🎣 Hook — first 3 seconds</div>{idea.hook}</div>}
                        {idea.structure?.length > 0 && <>
                          <div className="label" style={{ marginTop: "12px", marginBottom: "6px" }}>Video structure</div>
                          <ul className="steps">{idea.structure.map((s, j) => <li key={j} className="step"><span className="snum">{j + 1}</span>{s}</li>)}</ul>
                        </>}
                        {idea.why_viral && <div className="why">💡 {idea.why_viral}</div>}
                        <div className="iactions">
                          <button className={`ibtn ${isSaved(idea) ? "saved" : ""}`} onClick={() => toggleSave(idea)}>{isSaved(idea) ? "★ Saved" : "☆ Save"}</button>
                          <button className="ibtn script-btn" onClick={() => generateScript(idea)}>📝 Write Full Script</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>}

              {tab === "script" && (
                scriptLoading ? <div className="loading fade"><div className="spin">📝</div><div>Writing your script...</div></div>
                : script ? (
                  <div className="fade">
                    <div className="script-card">
                      <div className="label" style={{ marginBottom: "4px" }}>Script for:</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: "18px" }}>{scriptIdea?.title}</div>
                      <div className="script-section">
                        <div className="script-label">🎣 Hook</div>
                        <div className="script-dur">{script.script?.hook?.duration}</div>
                        <div className="script-text">{script.script?.hook?.text}</div>
                      </div>
                      {(script.script?.sections || []).map((sec, i) => (
                        <div key={i} className="script-section">
                          <div className="script-label">{sec.title}</div>
                          <div className="script-dur">{sec.duration}</div>
                          <div className="script-text">{sec.text}</div>
                          {sec.visual && <div className="script-visual">📸 {sec.visual}</div>}
                        </div>
                      ))}
                      <div className="script-section">
                        <div className="script-label">🎯 Call to Action</div>
                        <div className="script-dur">{script.script?.cta?.duration}</div>
                        <div className="script-text">{script.script?.cta?.text}</div>
                      </div>
                    </div>
                    {script.tips?.length > 0 && <div className="script-card"><div className="label">Filming tips</div><ul className="tips-list">{script.tips.map((t, i) => <li key={i} className="tip">{t}</li>)}</ul></div>}
                    {script.b_roll?.length > 0 && <div className="script-card"><div className="label">B-roll shots</div><ul className="tips-list">{script.b_roll.map((b, i) => <li key={i} className="tip">{b}</li>)}</ul></div>}
                  </div>
                ) : <div className="empty">Click <strong style={{ color: "var(--orange)" }}>📝 Write Full Script</strong> on any idea<br />to generate a complete script here.</div>
              )}

              {tab === "hashtags" && (
                <div className="card">
                  <div className="label">Hashtags</div>
                  <div className="tags">{(results.hashtags || []).map((t, i) => <span key={i} className="htag">{t}</span>)}</div>
                  {results.posting_time && <div className="ptime" style={{ marginTop: "16px" }}>🕐 Best time to post: <strong>{results.posting_time}</strong></div>}
                </div>
              )}

              {tab === "saved" && (
                saved.length === 0
                  ? <div className="empty">No saved ideas yet.<br />Hit ☆ Save on any idea you like.</div>
                  : saved.map((idea, i) => (
                    <div key={i} className="idea">
                      <div className="idea-head">
                        <div className="idx" style={{ color: "rgba(255,45,45,0.3)" }}>★</div>
                        <div style={{ flex: 1 }}>
                          <div className="ititle">{idea.title}</div>
                          <div className="imeta">{idea.viral_score && <ScoreBadge score={idea.viral_score} />}</div>
                        </div>
                        <button className="ibtn saved" onClick={() => toggleSave(idea)}>Remove</button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
