export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' });
  }

  try {
    const googleScriptURL = "https://script.google.com/macros/s/AKfycbzeODg7HvieHRT_fplwaSI_tgcU3uXNht7MdKj9cZ0j/dev";

    const response = await fetch(googleScriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error forwarding request to Google Script:", error);
    res.status(500).json({ error: "Something went wrong in the proxy." });
  }
}

