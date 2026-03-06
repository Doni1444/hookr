import { useState } from "react";

const NICHES = [
  "Lifestyle",
  "Tech",
  "Finance",
  "Fitness",
  "Food",
  "Travel",
  "Beauty",
  "Gaming"
];

export default function App() {
  const [niche, setNiche] = useState("Tech");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchIdeas = async () => {
    if (!niche.trim()) {
      setError("Введите нишу перед генерацией.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Ошибка ${response.status}`);
      }

      setResult(data);
    } catch (e) {
      setError(`Не удалось получить идеи: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Hookr</h1>
        <p style={styles.subtitle}>AI-ассистент для блогеров: тренды, Reels и заголовки.</p>

        <label style={styles.label}>Ниша</label>
        <input
          style={styles.input}
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="Например: косметика, финансы, фитнес"
        />

        <div style={styles.chips}>
          {NICHES.map((item) => (
            <button key={item} style={styles.chip} onClick={() => setNiche(item)}>
              {item}
            </button>
          ))}
        </div>

        <button style={styles.button} onClick={fetchIdeas} disabled={loading}>
          {loading ? "Генерируем..." : "Найти идеи"}
        </button>

        {loading && <p style={styles.loading}>⏳ Идет генерация контента...</p>}
        {error && <p style={styles.error}>⚠️ {error}</p>}

        {result && (
          <div style={styles.results}>
            <section>
              <h2 style={styles.sectionTitle}>Тренды</h2>
              <p style={styles.text}>{result.trends}</p>
            </section>

            <section>
              <h2 style={styles.sectionTitle}>Идеи для Reels</h2>
              <ul style={styles.list}>
                {result.reelsIdeas.map((idea, index) => (
                  <li key={index}>{idea}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 style={styles.sectionTitle}>Идеи заголовков</h2>
              <ul style={styles.list}>
                {result.headlineIdeas.map((idea, index) => (
                  <li key={index}>{idea}</li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0c10",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    color: "#f4f4f5",
    fontFamily: "Inter, system-ui, Arial"
  },
  card: {
    width: "100%",
    maxWidth: "760px",
    background: "#111218",
    border: "1px solid #2d2f3a",
    borderRadius: "16px",
    padding: "24px"
  },
  title: { margin: 0, fontSize: "2rem" },
  subtitle: { marginTop: "8px", color: "#adb0bb" },
  label: { display: "block", marginTop: "18px", marginBottom: "6px", fontWeight: 600 },
  input: {
    width: "100%",
    background: "#171922",
    border: "1px solid #323545",
    color: "#fff",
    borderRadius: "10px",
    padding: "12px"
  },
  chips: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" },
  chip: {
    background: "transparent",
    color: "#c8c9d1",
    border: "1px solid #3b3f55",
    borderRadius: "999px",
    padding: "6px 10px",
    cursor: "pointer"
  },
  button: {
    marginTop: "16px",
    width: "100%",
    background: "#ff4f1f",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "12px",
    fontWeight: 700,
    cursor: "pointer"
  },
  loading: { marginTop: "12px", color: "#f2c44d" },
  error: {
    marginTop: "12px",
    background: "#3a1d24",
    border: "1px solid #8e2f45",
    borderRadius: "8px",
    padding: "10px"
  },
  results: {
    marginTop: "18px",
    borderTop: "1px solid #2d2f3a",
    paddingTop: "14px",
    display: "grid",
    gap: "12px"
  },
  sectionTitle: { margin: "0 0 6px", fontSize: "1.05rem" },
  text: { margin: 0, color: "#ddd" },
  list: { margin: 0, paddingLeft: "20px", color: "#ddd" }
};
