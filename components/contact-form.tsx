"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [feedback, setFeedback] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (status === "submitting") return

    setStatus("submitting")
    setFeedback("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setStatus("error")
        setFeedback(data.error || "Unable to send your message. Please try again.")
        return
      }

      setStatus("success")
      setFeedback(data.message || "Thank you. Your message has been sent.")
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch {
      setStatus("error")
      setFeedback("Unable to send your message. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={200}
            required
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
            required
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
          Subject - What is this regarding?
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={200}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          placeholder="What is this regarding?"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={5000}
          required
          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-foreground"
          placeholder="Tell us more about your inquiry..."
        />
      </div>

      {feedback && (
        <p
          role="status"
          className={`text-center text-sm ${
            status === "success" ? "text-emerald-600" : "text-destructive"
          }`}
        >
          {feedback}
        </p>
      )}

      <div className="text-center">
        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-10"
        >
          {status === "submitting" ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  )
}
