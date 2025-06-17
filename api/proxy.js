export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method is allowed" });
  }

  const {
    nama,
    no_wa,
    barang,
    tanggal_ambil,
    tanggal_kembali,
    lama_sewa,
    total_harga
  } = req.body;

  // Validasi sederhana
  if (!nama || !no_wa || !barang || !tanggal_ambil || !tanggal_kembali || !lama_sewa || !total_harga) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbzbohp0zoJ2Tdp594tI6Qq31GLHmmoGHgGvGYKlNw2JyKgKT1CS1mAsxfRlT_0fCtlY4Q/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama,
        no_wa,
        barang,
        tanggal_ambil,
        tanggal_kembali,
        lama_sewa,
        total_harga
      }),
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return res.status(502).json({
        error: "Invalid response from Apps Script",
        detail: text
      });
    }

    const result = await response.json();
    return res.status(200).json({
      status: "success",
      result
    });

  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({
      error: "Internal server error",
      detail: error.message
    });
  }
}
