"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("email");
  const [outputs, setOutputs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setOutputs([]);

    for (let i = 0; i < 3; i++) {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input + "\n\nGive a different version than before.",
          mode
        })
      });

      const data = await res.json();
      setOutputs(prev => [...prev, data.result]);
    }

    setLoading(false);
  }

  function copy(text) {
    navigator.clipboard.writeText(text);
    alert("Copied");
  }

  function download(text, i) {
    const blob = new Blob([text], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `output_v${i + 1}.doc`;
    a.click();
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2>PM Workbench</h2>

      <select value={mode} onChange={e => setMode(e.target.value)}>
        <option value="email">Email Writer</option>
        <option value="brd">BRD Generator</option>
        <option value="prd">PRD Generator</option>
        <option value="chat">Free Chat</option>
      </select>

      <textarea
        rows={8}
        placeholder="Enter context here..."
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ width: "100%", marginTop: 10 }}
      />

      <button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate 3 Versions"}
      </button>

      {outputs.map((text, i) => (
        <div key={i} style={{ marginTop: 30 }}>
          <h4>Version {i + 1}</h4>
          <button onClick={() => copy(text)}>Copy</button>
          <button onClick={() => download(text, i)} style={{ marginLeft: 10 }}>
            Download
          </button>
          <pre>{text}</pre>
        </div>
      ))}
    </div>
  );
}
