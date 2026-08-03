"use client";

import { useActionState } from "react";
import { sendContact } from "@/app/about/actions";

const initialState = { status: "idle" as const };

const inputClass =
  "w-full border border-border bg-white px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary";

const labelClass = "block font-mono text-sm text-foreground mb-2";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContact,
    initialState
  );

  return (
    <form action={formAction} className="max-w-xl">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="organization" className={labelClass}>
          Organization <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          autoComplete="organization"
          className={inputClass}
        />
      </div>

      <div className="mt-6">
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className={inputClass + " resize-y"}
        />
      </div>

      {/* Honeypot. Hidden from humans, filled by bots. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center border border-border bg-white px-6 py-3 font-mono text-[12px] uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send inquiry"}
        </button>
      </div>

      {state.status === "success" && (
        <p className="mt-4 font-mono text-sm text-primary" role="status">
          {state.message}
        </p>
      )}
      {state.status === "error" && (
        <p className="mt-4 font-mono text-sm text-red-600" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
