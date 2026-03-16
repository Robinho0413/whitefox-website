import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
  createdAt?: number;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FORM_FILL_MS = 3000;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

type RateLimitEntry = {
  count: number;
  windowStart: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  contactRateLimitStore?: Map<string, RateLimitEntry>;
};

const contactRateLimitStore =
  globalForRateLimit.contactRateLimitStore ?? new Map<string, RateLimitEntry>();

if (!globalForRateLimit.contactRateLimitStore) {
  globalForRateLimit.contactRateLimitStore = contactRateLimitStore;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const validatePayload = (payload: Partial<ContactPayload>) => {
  const website = payload.website?.trim() ?? "";
  const createdAtRaw = typeof payload.createdAt === "number" ? payload.createdAt : Number.NaN;
  const now = Date.now();
  const age = now - createdAtRaw;

  if (website.length > 0) {
    return { blocked: true as const };
  }

  if (!Number.isFinite(createdAtRaw) || age < MIN_FORM_FILL_MS || age > MAX_FORM_AGE_MS) {
    return { blocked: true as const };
  }

  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const subject = payload.subject?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (name.length < 2 || name.length > 120) {
    return { error: "Le nom est invalide." };
  }

  if (!EMAIL_REGEX.test(email) || email.length > 120) {
    return { error: "L'adresse email est invalide." };
  }

  if (subject.length < 3 || subject.length > 160) {
    return { error: "Le sujet est invalide." };
  }

  if (message.length < 10 || message.length > 4000) {
    return { error: "Le message est invalide." };
  }

  return {
    data: {
      name,
      email,
      subject,
      message,
    },
  };
};

const getClientIp = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) {
    return cfIp;
  }

  return "unknown";
};

const checkRateLimit = (key: string) => {
  const now = Date.now();

  if (contactRateLimitStore.size > 2000) {
    contactRateLimitStore.forEach((entry, storedKey) => {
      if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        contactRateLimitStore.delete(storedKey);
      }
    });
  }

  const existing = contactRateLimitStore.get(key);

  if (!existing || now - existing.windowStart > RATE_LIMIT_WINDOW_MS) {
    contactRateLimitStore.set(key, { count: 1, windowStart: now });
    return { allowed: true as const };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterMs = RATE_LIMIT_WINDOW_MS - (now - existing.windowStart);
    return {
      allowed: false as const,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  existing.count += 1;
  contactRateLimitStore.set(key, existing);
  return { allowed: true as const };
};

export async function POST(request: Request) {
  let payload: Partial<ContactPayload>;

  try {
    payload = (await request.json()) as Partial<ContactPayload>;
  } catch {
    return Response.json({ error: "Requete invalide." }, { status: 400 });
  }

  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Trop de tentatives. Merci de reessayer dans quelques minutes." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const validation = validatePayload(payload);

    if ("blocked" in validation) {
      return Response.json({ success: true }, { status: 200 });
    }

    if ("error" in validation) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const destination = process.env.CONTACT_EMAIL;

    if (!destination) {
      return Response.json(
        { error: "CONTACT_EMAIL n'est pas configure dans l'environnement serveur." },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return Response.json(
        { error: "RESEND_API_KEY n'est pas configure dans l'environnement serveur." },
        { status: 500 }
      );
    }

    const safeName = escapeHtml(validation.data.name);
    const safeEmail = escapeHtml(validation.data.email);
    const safeSubject = escapeHtml(validation.data.subject);
    const safeMessage = escapeHtml(validation.data.message).replace(/\n/g, "<br />");

    const { data, error } = await resend.emails.send({
      from: "WhiteFox Contact <contact@mail.whitefoxcheer.fr>",
      to: [destination],
      replyTo: validation.data.email,
      subject: `[Contact Site] ${validation.data.subject}`,
      text: [
        "Nouveau message de contact",
        `Nom: ${validation.data.name}`,
        `Email: ${validation.data.email}`,
        `Sujet: ${validation.data.subject}`,
        "",
        validation.data.message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h1>Nouveau message de contact</h1>
          <p><strong>Nom:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Sujet:</strong> ${safeSubject}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        </div>
      `,
    });

    if (error) {
      const resendMessage =
        "message" in error && typeof error.message === "string"
          ? error.message
          : "Erreur Resend lors de l'envoi.";
      return Response.json({ error: resendMessage }, { status: 500 });
    }

    return Response.json({ success: true, id: data?.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur interne lors de l'envoi.";
    return Response.json({ error: message }, { status: 500 });
  }
}