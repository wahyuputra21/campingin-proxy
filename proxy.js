export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbzeODg7HvieHRT_fplwaSI_tgcU3uXNht7MdKj9cZ0j/dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text(); // bisa juga .json() tergantung output GAS
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({ error: "Proxy failed", details: err.message });
  }
}
