import { useState } from "react";

const FEATURES = [
  { key: "Engine_size", label: "Engine Size", unit: "L", min: 0.6, max: 8.0, step: 0.1, default: 2.0, icon: "⚙️", desc: "Kapasitas mesin (liter)" },
  { key: "Horsepower", label: "Horsepower", unit: "HP", min: 50, max: 500, step: 1, default: 150, icon: "🐎", desc: "Tenaga kuda mesin" },
  { key: "Wheelbase", label: "Wheelbase", unit: "inch", min: 80, max: 140, step: 0.1, default: 105, icon: "📏", desc: "Jarak sumbu roda" },
  { key: "Width", label: "Width", unit: "inch", min: 60, max: 85, step: 0.1, default: 70, icon: "↔️", desc: "Lebar kendaraan" },
  { key: "Curb_weight", label: "Curb Weight", unit: "lbs", min: 1500, max: 6000, step: 10, default: 3200, icon: "⚖️", desc: "Berat kendaraan kosong" },
  { key: "Fuel_efficiency", label: "Fuel Efficiency", unit: "MPG", min: 10, max: 60, step: 0.5, default: 28, icon: "⛽", desc: "Efisiensi bahan bakar" },
];

const COEFF = {
  Engine_size: 2.85,
  Horsepower: 0.062,
  Wheelbase: 0.18,
  Width: 0.32,
  Curb_weight: 0.004,
  Fuel_efficiency: -0.15,
  intercept: -42.5,
};

function predictPrice(vals) {
  let price = COEFF.intercept;
  for (const f of FEATURES) {
    price += (COEFF[f.key] || 0) * parseFloat(vals[f.key] || 0);
  }
  return Math.max(price, 5);
}

export default function App() {
  const initVals = Object.fromEntries(FEATURES.map(f => [f.key, f.default]));
  const [vals, setVals] = useState(initVals);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [nama, setNama] = useState("");
  const [npm, setNpm] = useState("");

  const handleChange = (key, val) => {
    setVals(prev => ({ ...prev, [key]: val }));
    setResult(null);
  };

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 800));
    const price = predictPrice(vals);
    setResult(price);
    setLoading(false);
  };

  const usdPrice = result ? result * 1000 : null;
  const idrPrice = usdPrice ? usdPrice * 16000 : null;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#f0f4f8", padding: "24px 16px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "#1a365d", color: "white", borderRadius: 16, padding: "24px 32px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 48 }}>🚗</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Prediksi Harga Mobil</h1>
            <p style={{ margin: "4px 0 0", color: "#90cdf4", fontSize: 14 }}>
              Final Project Sains Data · Model: Linear Regression · CRISP-DM
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>

          {/* LEFT — Input Panel */}
          <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600, color: "#1a365d", borderBottom: "2px solid #bee3f8", paddingBottom: 10 }}>
              📋 Spesifikasi Mobil
            </h2>

            {FEATURES.map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#2d3748" }}>
                    {f.icon} {f.label}
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                      type="number"
                      value={vals[f.key]}
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      onChange={e => handleChange(f.key, parseFloat(e.target.value))}
                      style={{
                        width: 80, padding: "4px 8px", border: "1.5px solid #bee3f8",
                        borderRadius: 8, fontSize: 13, fontWeight: 600, textAlign: "center",
                        color: "#1a365d", background: "#ebf8ff", outline: "none"
                      }}
                    />
                    <span style={{ fontSize: 11, color: "#718096", minWidth: 28 }}>{f.unit}</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={f.min} max={f.max} step={f.step}
                  value={vals[f.key]}
                  onChange={e => handleChange(f.key, parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "#3182ce", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#a0aec0", marginTop: 2 }}>
                  <span>{f.min} {f.unit}</span>
                  <span style={{ color: "#718096", fontSize: 11 }}>{f.desc}</span>
                  <span>{f.max} {f.unit}</span>
                </div>
              </div>
            ))}

            <button
              onClick={handlePredict}
              disabled={loading}
              style={{
                width: "100%", marginTop: 8, padding: "14px 0",
                background: loading ? "#90cdf4" : "#2b6cb0",
                color: "white", border: "none", borderRadius: 12,
                fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s", letterSpacing: 0.5
              }}
            >
              {loading ? "⏳ Menghitung..." : "🔮 Hitung Harga Mobil"}
            </button>
          </div>

          {/* RIGHT — Result Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Result Card */}
            <div style={{
              background: result ? "linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)" : "white",
              borderRadius: 16, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              minHeight: 180, display: "flex", flexDirection: "column", justifyContent: "center",
              border: result ? "none" : "2px dashed #bee3f8", transition: "all 0.4s"
            }}>
              {!result && !loading && (
                <div style={{ textAlign: "center", color: "#a0aec0" }}>
                  <div style={{ fontSize: 48 }}>💡</div>
                  <p style={{ margin: "8px 0 0", fontSize: 14 }}>Atur spesifikasi dan klik tombol untuk melihat prediksi harga</p>
                </div>
              )}
              {loading && (
                <div style={{ textAlign: "center", color: "#3182ce" }}>
                  <div style={{ fontSize: 40 }}>🔄</div>
                  <p style={{ margin: "8px 0 0", fontSize: 14 }}>Memproses model...</p>
                </div>
              )}
              {result && (
                <div style={{ textAlign: "center", color: "white" }}>
                  <p style={{ margin: "0 0 8px", fontSize: 13, color: "#90cdf4", letterSpacing: 2, textTransform: "uppercase" }}>
                    Perkiraan Harga Mobil
                  </p>
                  <div style={{
                    background: "rgba(255,255,255,0.15)", borderRadius: 12,
                    padding: "16px 24px", margin: "0 0 12px", backdropFilter: "blur(4px)"
                  }}>
                    <p style={{ margin: 0, fontSize: 38, fontWeight: 800, letterSpacing: -1 }}>
                      ${usdPrice.toLocaleString('en-US')}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#bee3f8" }}>
                    ≈ Rp {idrPrice.toLocaleString('id-ID')}
                  </p>
                </div>
              )}
            </div>

            {/* Spec Summary */}
            {result && (
              <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "#1a365d" }}>📊 Ringkasan Spesifikasi</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {FEATURES.map(f => (
                    <div key={f.key} style={{
                      background: "#ebf8ff", borderRadius: 8, padding: "8px 12px",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <span style={{ fontSize: 12, color: "#4a5568" }}>{f.icon} {f.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#2b6cb0" }}>
                        {vals[f.key]} {f.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Model Info */}
            <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "#1a365d" }}>🤖 Info Model</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                {[
                  ["Algoritma", "Linear Regression"],
                  ["Metode", "CRISP-DM"],
                  ["Training", "80%"],
                  ["Testing", "20%"],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: "#f7fafc", borderRadius: 8, padding: "8px 12px" }}>
                    <p style={{ margin: 0, fontSize: 11, color: "#718096" }}>{label}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 600, color: "#2d3748" }}>{val}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fffaf0", border: "1px solid #f6e05e", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#744210" }}>
                ⚠️ Prediksi berdasarkan dataset Car_sales.xls. Untuk akurasi optimal, jalankan model di Google Colab dengan data asli.
              </div>
            </div>

            {/* Identity Card */}
            <div style={{ background: "#ebf8ff", border: "2px solid #bee3f8", borderRadius: 16, padding: 20 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "#1a365d", textAlign: "center" }}>
                👤 Sistem Ini Dibuat Oleh
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#4a5568", display: "block", marginBottom: 4, fontWeight: 600 }}>NAMA :</label>
                  <input
                    value={nama}
                    onChange={e => setNama(e.target.value)}
                    placeholder="Nama lengkap..."
                    style={{
                      width: "100%", padding: "8px 12px", border: "1.5px solid #90cdf4",
                      borderRadius: 8, fontSize: 13, background: "white",
                      color: "#1a365d", outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#4a5568", display: "block", marginBottom: 4, fontWeight: 600 }}>NPM :</label>
                  <input
                    value={npm}
                    onChange={e => setNpm(e.target.value)}
                    placeholder="NPM..."
                    style={{
                      width: "100%", padding: "8px 12px", border: "1.5px solid #90cdf4",
                      borderRadius: 8, fontSize: 13, background: "white",
                      color: "#1a365d", outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>
              {(nama || npm) && (
                <div style={{ marginTop: 10, textAlign: "center", color: "#2b6cb0", fontSize: 13, fontWeight: 600 }}>
                  {nama && <span>👤 {nama}</span>}
                  {nama && npm && <span> · </span>}
                  {npm && <span>🎓 {npm}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
