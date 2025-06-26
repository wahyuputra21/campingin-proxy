export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const MODE = req.query.mode;
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5FwfuO-fI1OqjudskMhuAvsdjJ4o5m8YRyQKY-yAtQgJwbvG83E6ctZfjRihG3Yay9g/exec";

  // GET: Ambil data stok
  if (req.method === "GET" && MODE === "getstok") {
    try {
      const response = await fetch(SCRIPT_URL + "?mode=getstok");
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Gagal ambil data stok", detail: err.message });
    }
  }

// GET: Ambil data pelanggan
if (req.method === "GET" && req.query.mode === "listpelanggan") {
  try {
    const response = await fetch(SCRIPT_URL + "?mode=listpelanggan");
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Gagal ambil data pelanggan", detail: err.message });
  }
}


  // POST: Pengiriman pesanan dari customer
  if (req.method === "POST" && MODE === undefined) {
    const {
      nama,
      no_wa,
      alamat,
      barang,
      detail_pesanan,
      tanggal_ambil,
      tanggal_kembali,
      lama_sewa,
      total_harga,
      catatan 
    } = req.body;

    if (!nama || !no_wa || !alamat || !barang || !detail_pesanan || !tanggal_ambil || !tanggal_kembali || !lama_sewa || !total_harga) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }

    try {
      const response = await fetch(SCRIPT_URL, {
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
          total_harga,
          catatan 
        })
      });

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

  // POST: Update status alur (misal ke "Cuci", "Selesai", dll)
  if (req.method === "POST" && MODE === "updatealur") {
    try {
      const response = await fetch(SCRIPT_URL + "?mode=updatealur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
  
      const result = await response.json();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: "Gagal update status alur", detail: err.message });
    }
  }

// POST: Barang rusak → kirim ke tab Reparasi
if (req.method === "POST" && MODE === "reparasi") {
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxybQukCHsCn4hQ37-DSoumrGAU30sIz0S5QgXmDm2PED-08WjAOYZS3GdlgyNfHGTXoQ/exec?mode=reparasi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Gagal kirim data reparasi", detail: err.message });
  }
}

  // POST: Admin input pembayaran
  if (req.method === "POST" && MODE === "updatepembayaran") {
    try {
      const response = await fetch(SCRIPT_URL + "?mode=updatepembayaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
      });

      const result = await response.json();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: "Gagal input pembayaran", detail: err.message });
    }
  }

  // Jika tidak cocok
  return res.status(405).json({ error: "Method not allowed" });
}
