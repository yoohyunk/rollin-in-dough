import type { NextApiRequest, NextApiResponse } from "next";
//main function to handle api requests - only sends data(post) uses email.js service
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // all fields are required
  if (req.method === "POST") {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      //try to post info
      const response = await fetch(
        //api end point
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST", //sending message
          headers: {
            "Content-Type": "application/json",
          },
          //information that is sent to email.js
          body: JSON.stringify({
            template_params: {
              name,
              email,
              message,
            },
          }),
        }
      );
      //notification if it sent
      if (response.ok) {
        return res.status(200).json({ message: "Email sent successfully!" });
      } else {
        //error handling
        const errorData = await response.json();
        console.error("Error sending email:", errorData);
        return res.status(500).json({ error: "Failed to send email." });
      }
      //more error handling very basic
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send email." });
    }
  } else {
    //error handling to handle any other request other than post
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
