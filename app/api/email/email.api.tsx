import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_id: "your_service_id",
            template_id: "your_template_id",
            user_id: "your_user_id",
            template_params: {
              name,
              email,
              message,
            },
          }),
        }
      );

      if (response.ok) {
        return res.status(200).json({ message: "Email sent successfully!" });
      } else {
        const errorData = await response.json();
        console.error("Error sending email:", errorData);
        return res.status(500).json({ error: "Failed to send email." });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send email." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
