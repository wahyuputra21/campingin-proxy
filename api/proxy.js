export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Cek apakah ini permintaan GET untuk ambil stok
  if (req.method === "GET" && req.query.mode === "getstok") {
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycby3w-pzV00THn9AxiXlXPI-qX7I1J0OiE05-VRaQ0C-Kx18sdvE09S71FRI3K6PJldMxQ/exec");
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Gagal ambil data stok", detail: err.message });
    }
  }

  // Tangani POST (pengiriman pesanan)
  if (req.method === "POST") {
    const {
      nama,
      no_wa,
      alamat,
      barang,
      detail_pesanan,
      tanggal_ambil,
      tanggal_kembali,
      lama_sewa,
      total_harga
    } = req.body;

    // Validasi data
    if (!nama || !no_wa || !alamat || !barang || !detail_pesanan || !tanggal_ambil || !tanggal_kembali || !lama_sewa || !total_harga) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby3w-pzV00THn9AxiXlXPI-qX7I1J0OiE05-VRaQ0C-Kx18sdvE09S71FRI3K6PJldMxQ/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama,
            no_wa,
            alamat,
            barang,
            detail_pesanan,
            tanggal_ambil,
            tanggal_kembali,
            lama_sewa,
            total_harga
          }),
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        return res.status(502).json({ error: "Invalid response dari Apps Script", detail: text });
      }

      const result = await response.json();
      return res.status(200).json({ status: "success", result });

    } catch (error) {
      return res.status(500).json({ error: "Internal server error", detail: error.message });
    }
  }

  // Kalau method bukan POST atau GET mode=getstok
  return res.status(405).json({ error: "Method not allowed" });
}
