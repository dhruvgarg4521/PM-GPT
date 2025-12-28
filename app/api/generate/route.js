export async function POST(req) {
  const { prompt, mode } = await req.json();

  const systemPrompt = {
    email: "You are a senior corporate product manager. Write clear, professional emails.",
    brd: "You are a product manager. Generate a structured Business Requirement Document.",
    prd: "You are a product manager. Generate a technical PRD with acceptance criteria.",
    chat: "You are a helpful assistant for a product manager."
  }[mode];

  const finalPrompt = `${systemPrompt}\n\n${prompt}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }]
      })
    }
  );

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

  return Response.json({ result: text });
}
