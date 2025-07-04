export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const MODE = req.query.mode || req.body?.mode;

  console.log("METHOD:", req.method);
  console.log("MODE:", MODE);
  console.log("BODY:", req.body);
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyKFIK5HRD64NhDfxutqOSR-kDZ9y3mP585BznAxrt8DW_anTDHbtpEG7r09oDKcaZ19Q/exec";

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

// GET: Ambil data reparasi
if (req.method === "GET" && MODE === "listreparasi") {
  try {
    const response = await fetch(SCRIPT_URL + "?mode=listreparasi");
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Gagal ambil data reparasi", detail: err.message });
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
    const response = await fetch(SCRIPT_URL + "?mode=reparasi", {
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

// ✅ POST: Kembalikan stok barang aman — HARUS DI LUAR blok `updatepembayaran`
if (req.method === "POST" && MODE === "kembalistok") {
  try {
    const response = await fetch(SCRIPT_URL + "?mode=kembalistok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Gagal kembalikan stok", detail: err.message });
  }
}

    // Jika tidak cocok
return res.status(405).json({ error: "Method not allowed" });





