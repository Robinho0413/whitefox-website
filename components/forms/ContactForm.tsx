"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
  createdAt: number;
};

const INITIAL_VALUES: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
  createdAt: Date.now(),
};

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field: keyof ContactFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = await response.json();

      if (!response.ok) {
        const message =
          typeof payload?.error === "string"
            ? payload.error
            : "Impossible d'envoyer votre message pour le moment.";
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      toast.success("Votre message a bien ete envoye.");
      setValues({ ...INITIAL_VALUES, createdAt: Date.now() });
    } catch {
      const fallbackError = "Une erreur reseau est survenue. Merci de reessayer.";
      setErrorMessage(fallbackError);
      toast.error(fallbackError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="contact-name">Nom complet</FieldLabel>
          <Input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Votre nom"
            value={values.name}
            onChange={(event) => handleChange("name", event.target.value)}
            required
            minLength={2}
            maxLength={120}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            value={values.email}
            onChange={(event) => handleChange("email", event.target.value)}
            required
            maxLength={120}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-subject">Sujet</FieldLabel>
          <Input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="Sujet de votre message"
            value={values.subject}
            onChange={(event) => handleChange("subject", event.target.value)}
            required
            minLength={3}
            maxLength={160}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea
            id="contact-message"
            name="message"
            placeholder="Ecrivez votre message ici..."
            value={values.message}
            onChange={(event) => handleChange("message", event.target.value)}
            required
            minLength={10}
            maxLength={4000}
            className="min-h-36"
          />
        </Field>

        <input
          type="text"
          name="website"
          value={values.website}
          onChange={(event) => handleChange("website", event.target.value)}
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          className="hidden"
        />

        {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}

        <Button type="submit" disabled={isSubmitting} className="w-fit">
          {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
        </Button>
      </FieldGroup>
    </form>
  );
}
