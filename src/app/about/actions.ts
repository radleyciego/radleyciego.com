"use server";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

function parseErrors(formData: FormData): FieldErrors {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const errors: FieldErrors = {};
  if (!name) errors.name = "Please enter your name.";
  if (!email) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Please enter a valid email address.";
  if (!message) errors.message = "Please enter a message.";
  return errors;
}

export async function sendContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot. Bots fill this hidden field. Drop silently and report success.
  if (String(formData.get("website") ?? "").length > 0) {
    return {
      status: "success",
      message: "Message sent. I'll get back to you soon.",
    };
  }

  const errors = parseErrors(formData);
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message:
        errors.name ??
        errors.email ??
        errors.message ??
        "Please complete the required fields.",
    };
  }

  const name = String(formData.get("name")).trim();
  const email = String(formData.get("email")).trim();
  const organization = String(formData.get("organization") ?? "").trim();
  const message = String(formData.get("message")).trim();

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      status: "error",
      message:
        "The contact form is not connected to a mail service yet. Please configure RESEND_API_KEY (see README).",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.CONTACT_FROM_EMAIL ??
          "About Form <onboarding@resend.dev>",
        to: process.env.CONTACT_TO_EMAIL ?? "radleykc@gmail.com",
        reply_to: email,
        subject: `Website inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nOrganization: ${
          organization || "Not provided"
        }\n\n${message}`,
      }),
    });
    if (!res.ok) {
      return {
        status: "error",
        message: "The message could not be sent. Please try again later.",
      };
    }
    return {
      status: "success",
      message: "Message sent. I'll get back to you soon.",
    };
  } catch {
    return {
      status: "error",
      message: "The message could not be sent. Please try again later.",
    };
  }
}
