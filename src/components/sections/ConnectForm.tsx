"use client";

import { CircleAlert, LoaderCircle, Send } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * GitHub Pages is static, so messages go to a form service instead of a server
 * (set NEXT_PUBLIC_FORM_ENDPOINT, e.g. a Formspree endpoint). Without one, the
 * form opens the visitor's email app with the message pre-filled.
 */
const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

type Status = { state: "idle" } | { state: "sending" } | { state: "sent" } | { state: "error"; message: string };

export function ConnectForm({ email }: { email: string }) {
  const id = useId();
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "message", string>>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (data.get("_gotcha")) return; // honeypot

    const nextErrors: typeof errors = {};
    if (!name) nextErrors.name = "Add your name so I know who's writing.";
    if (!/^\S+@\S+\.\S+$/.test(from)) nextErrors.email = "Enter an email I can reply to.";
    if (message.length < 10) nextErrors.message = "Write a little more, at least a sentence.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      form.querySelector<HTMLElement>(`[aria-invalid="true"]`)?.focus();
      return;
    }

    if (!endpoint) {
      if (!email) {
        setStatus({ state: "error", message: "Messaging isn't set up yet. Use one of the links on this page instead." });
        return;
      }
      const subject = encodeURIComponent(`Hello from ${name}`);
      const body = encodeURIComponent(`${message}\n\n${name}\n${from}`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus({ state: "sending" });
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email: from, message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus({ state: "sent" });
    } catch {
      setStatus({
        state: "error",
        message: email
          ? `Your message didn't send. Try again, or email ${email} directly.`
          : "Your message didn't send. Try again in a moment.",
      });
    }
  }

  if (status.state === "sent") {
    return (
      <div role="status" className="surface rounded-lg p-8">
        <p className="title text-xl font-semibold text-fg">Message sent</p>
        <p className="mt-2 text-muted">Thanks for writing. I&apos;ll reply to the email you gave.</p>
        <Button variant="link" className="mt-4" onClick={() => setStatus({ state: "idle" })}>
          Send another
        </Button>
      </div>
    );
  }

  const field =
    "w-full rounded-md border border-[var(--field-border)] bg-[var(--field-bg)] px-4 py-3 text-base text-fg placeholder:text-subtle transition-[border-color,box-shadow] duration-200 outline-none focus:border-[var(--field-focus-border)] focus:shadow-[var(--field-focus-ring)] aria-[invalid=true]:border-danger";

  const fields = [
    { name: "name", label: "Name", type: "text", autoComplete: "name" },
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
  ] as const;

  return (
    <form noValidate onSubmit={onSubmit} className="surface space-y-5 rounded-lg p-6 sm:p-8">
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={`${id}-${f.name}`} className="mb-2 block text-sm font-medium text-fg">
            {f.label}
          </label>
          <input
            id={`${id}-${f.name}`}
            name={f.name}
            type={f.type}
            autoComplete={f.autoComplete}
            aria-invalid={errors[f.name] ? true : undefined}
            aria-describedby={errors[f.name] ? `${id}-${f.name}-error` : undefined}
            className={field}
          />
          <FieldError id={`${id}-${f.name}-error`} message={errors[f.name]} />
        </div>
      ))}

      <div>
        <label htmlFor={`${id}-message`} className="mb-2 block text-sm font-medium text-fg">
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${id}-message-error` : undefined}
          className={cn(field, "resize-y")}
        />
        <FieldError id={`${id}-message-error`} message={errors.message} />
      </div>

      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {status.state === "error" ? (
        <p role="alert" className="flex items-start gap-2 text-sm text-danger">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {status.message}
        </p>
      ) : null}

      <Button type="submit" disabled={status.state === "sending"} className="w-full sm:w-auto">
        {status.state === "sending" ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Send aria-hidden="true" className="size-4" />
        )}
        {status.state === "sending" ? "Sending…" : endpoint ? "Send message" : "Write email"}
      </Button>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm text-danger">
      <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
      {message}
    </p>
  );
}
