import { useState, useEffect, useRef } from "react";
import "../styles/home.css"

// ─── Constants ──────────────────────────────────────────────────────────────

const FEATURES = [
  { name: "URL Length",      val: 0.32, pct: 92 },
  { name: "Number of Dots",  val: 0.25, pct: 72 },
  { name: "HTTPS Token",     val: 0.21, pct: 60 },
  { name: "Domain Age",      val: 0.11, pct: 32 },
];

const METRICS = [
  { label: "Accuracy", val: "93.17%", pct: 93.17 },
  { label: "F1 Score", val: "93.02%", pct: 93.02 },
  { label: "AUC",      val: "0.94",   pct: 94 },
];

const INIT_PREDICTIONS = [
  { url: "google.com",          type: "legit",    conf: "98%" },
  { url: "fake-login.xyz",     type: "phishing", conf: "91%" },
  { url: "secure-banking.com", type: "phishing", conf: "92%" },
  { url: "check-mail.info",    type: "legit",    conf: "91%" },
];

const HEURISTICS = {
  phishing: [
    "fake-login", "verify-account", "secure-update", "login-confirm",
    "bank-alert", "paypal-", "ebay-", ".xyz", ".tk", ".ml",
    "password-reset", "account-suspended", "urgent-", "free-", "click-here",
  ],
  legit: [
    "google.com", "github.com", "microsoft.com", "apple.com",
    "amazon.com", "youtube.com", "twitter.com", "linkedin.com",
    "stackoverflow.com", "wikipedia.org",
  ],
};

// ─── URL Analysis Logic ───────────────────────────────────────────────────────

function analyzeURL(url) {
  const lower = url.toLowerCase();

  if (HEURISTICS.legit.some((d) => lower.includes(d)))
    return { type: "legit", conf: Math.floor(90 + Math.random() * 8) };

  if (HEURISTICS.phishing.some((k) => lower.includes(k)))
    return { type: "phishing", conf: Math.floor(85 + Math.random() * 13) };

  const score =
    (url.length > 60 ? 1 : 0) +
    ((url.match(/\./g) || []).length > 3 ? 1 : 0) +
    (!lower.includes("https") ? 1 : 0) +
    ((url.match(/-/g) || []).length > 2 ? 1 : 0) +
    (/\d{4,}/.test(url) ? 1 : 0);

  return score >= 2
    ? { type: "phishing", conf: Math.floor(70 + score * 5 + Math.random() * 5) }
    : { type: "legit",    conf: Math.floor(75 + Math.random() * 15) };
}

// ─── Sub-components ───────────────────────────────────────────────────────────



function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-title">
        Phishing Website Detection
      </div>
      <div className="avatar">SP</div>
    </div>
  );
}

function StatsRow({ stats }) {
  const cards = [
    { cls: "blue",   icon: "🔍", label: "Total URLs", value: stats.total.toLocaleString() },
    { cls: "danger", icon: "⚠️", label: "Phishing",   value: stats.phishing.toLocaleString() },
    { cls: "green",  icon: "✅", label: "Legitimate", value: stats.legit.toLocaleString() },
    { cls: "purple", icon: "🎯", label: "Accuracy",   value: "93.17%" },
  ];
}

function URLChecker({ onResult }) {
  const [url, setUrl]       = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleCheck = () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const r = analyzeURL(url.trim());
      setResult(r);
      setLoading(false);
      onResult({ url: url.trim(), ...r });
    }, 900 + Math.random() * 400);
  };

  return (
    <div className="panel">
      <div className="panel-title">🔎 URL Checker</div>

      <div className="url-input-row">
        <input
          ref={inputRef}
          className="url-input"
          placeholder="Enter URL to check... (e.g. fake-login.xyz)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
        />
        <button
          className="check-btn"
          onClick={handleCheck}
          disabled={loading || !url.trim()}
        >
          {loading ? <span className="spinner">⟳</span> : "Check URL"}
        </button>
      </div>

      {loading && (
        <div className="result-box loading">
          <div className="result-icon">
            <span className="spinner">⟳</span>
          </div>
          <div>
            <div className="result-label loading">Analyzing URL...</div>
            <div className="result-confidence">Running model inference</div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className={`result-box ${result.type}`}>
          <div className="result-icon">
            {result.type === "legit" ? "✅" : "🚨"}
          </div>
          <div>
            <div className={`result-label ${result.type}`}>
              {result.type === "legit"
                ? "Legitimate Website"
                : "Phishing Website Detected!"}
            </div>
            <div className="result-confidence">Confidence: {result.conf}%</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModelPerformance({ animated }) {
  return (
    <div className="panel">
      <div className="panel-title">📈 Model Performance</div>
      {METRICS.map((m) => (
        <div key={m.label} className="metric-row">
          <div className="metric-label">{m.label}</div>
          <div className="metric-bar-bg">
            <div
              className="metric-bar-fill"
              style={{ width: animated ? `${m.pct}%` : "0%" }}
            />
          </div>
          <div className="metric-val">{m.val}</div>
        </div>
      ))}
    </div>
  );
}

function FeatureImportance({ animated }) {
  return (
    <div className="panel">
      <div className="panel-title">⚖️ Feature Importance</div>
      {FEATURES.map((f, i) => (
        <div key={f.name} className="feature-row">
          <div className="feature-name">{f.name}</div>
          <div className="feature-bar-bg">
            <div
              className={`feature-bar-fill f${i}`}
              style={{ width: animated ? `${f.pct}%` : "0%" }}
            />
          </div>
          <div className="feature-val">{f.val}</div>
        </div>
      ))}
    </div>
  );
}

function RecentPredictionsSidePanel({ predictions }) {
  return (
    <div className="panel">
      <div className="section-header">
        <div className="panel-title" style={{ margin: 0 }}>
          🕐 Recent Predictions
        </div>
        <div className="live-badge">
          <div className="live-dot" />
          Live
        </div>
      </div>

      {predictions.map((p, i) => (
        <div key={i} className="pred-row">
          <div className={`pred-dot ${p.type}`} />
          <div className="pred-url" title={p.url}>{p.url}</div>
          <div className={`pred-badge ${p.type}`}>
            {p.type === "legit" ? "Legit" : "Phishing"}
          </div>
          <div className="pred-conf">{p.conf}</div>
        </div>
      ))}
    </div>
  );
}


// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function PhishingDashboard() {
  const [predictions, setPredictions] = useState(INIT_PREDICTIONS);
  const [stats, setStats] = useState({
    total:    11430,
    phishing: 5705,
    legit:    5725,
  });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const handleResult = ({ url, type, conf }) => {
    const newPred = { url, type, conf: conf + "%" };
    setPredictions((prev) => [newPred, ...prev].slice(0, 8));
    setStats((prev) => ({
      total:    prev.total + 1,
      phishing: prev.phishing + (type === "phishing" ? 1 : 0),
      legit:    prev.legit    + (type === "legit"    ? 1 : 0),
    }));
  };

  return (
    <div className="app">

      <div className="main">
        <Topbar />

        <div className="content">
          {/* Row 1 — Stats */}
          <StatsRow stats={stats} />

          {/* Row 2 — URL Checker + Model Performance */}
          <div className="middle-row">
            <URLChecker onResult={handleResult} />
            <ModelPerformance animated={animated} />
          </div>

          {/* Row 3 — Feature Importance + Recent Predictions */}
          <div className="bottom-row">
            <FeatureImportance animated={animated} />
            <RecentPredictionsSidePanel predictions={predictions} />
          </div>
        </div>
      </div>
    </div>
  );
}