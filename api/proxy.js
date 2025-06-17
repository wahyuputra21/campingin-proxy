export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Preflight OK
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method is allowed" });
  }

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxadkxflGurvCHlqIbwlkFR2cpwQYCtMKrgi_8lwRLXUAUw0pd0zp5vioG7513ERQD7Rw/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req body),
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return res.status(500).json({ error: "Invalid response from Apps Script", responseText: text });
    }

    const result = await response.json();
    res.status(200).json(result);

  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Internal server error", detail: error.message });
  }
}
