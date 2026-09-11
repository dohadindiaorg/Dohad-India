import { Header } from "@/components/header"
import { LinkedInIcon } from "@/components/linkedin-icon"
import { Mail, MapPin } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { headingStyles } from "@/lib/utils"
import {
  SECRETARIAT_ADDRESS_LINES,
  SECRETARIAT_MAPS_EMBED_URL,
  SECRETARIAT_MAPS_URL,
  SECRETARIAT_ORG_LINES,
} from "@/lib/site-contact"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            For general inquiries, membership questions, and collaboration opportunities reach out to us at{" "}
           <a href="mailto:contact@dohadindia.org" className="text-primary hover:text-primary/80 font-medium">
                    contact@dohadindia.org
                  </a>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12 md:items-stretch">
          <div className="flex flex-col h-full">
            <h2 className={`${headingStyles} mb-6`}>Get in Touch</h2>

            <div className="space-y-5 flex-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base xl:text-xl font-bold text-foreground mb-1">Email</h3>
                  <p className="text-[11px] sm:text-xs xl:text-sm text-muted-foreground mb-2">
                    For general inquiries, membership questions, and collaboration opportunities
                  </p>
                  <a href="mailto:contact@dohadindia.org" className="text-primary hover:text-primary/80 font-medium">
                    contact@dohadindia.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base xl:text-xl font-bold text-foreground mb-1">Secretariat</h3>
                  <p className="text-[11px] sm:text-xs xl:text-sm text-muted-foreground leading-relaxed mb-1">
                    {SECRETARIAT_ORG_LINES.map((line, index) => (
                      <span key={line}>
                        {line}
                        {index < SECRETARIAT_ORG_LINES.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                  <p className="text-[11px] sm:text-xs xl:text-sm text-muted-foreground leading-relaxed">
                    {SECRETARIAT_ADDRESS_LINES.map((line, index) => (
                      <span key={line}>
                        {line}
                        {index < SECRETARIAT_ADDRESS_LINES.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-5 shadow-sm mt-5">
              <h3 className="text-sm sm:text-base xl:text-xl font-bold text-foreground mb-4">Office Hours</h3>
              <div className="space-y-2 text-[11px] sm:text-xs xl:text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="text-foreground text-right">9:00 AM - 6:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <h2 className={`${headingStyles} mb-6`}>Find us</h2>

            <div className="flex flex-col flex-1 gap-5">
              <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
                <h3 className="text-sm sm:text-base xl:text-xl font-bold text-foreground mb-3">Follow Us</h3>
                <p className="text-[11px] sm:text-xs xl:text-sm text-muted-foreground mb-4">
                  Connect with DOHaD India on LinkedIn for the latest updates, research highlights, and community news.
                </p>

                <a
                  href="https://www.linkedin.com/in/dohad-india-regional-society-2b784240b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-4 py-2 bg-background border border-border rounded-full hover:bg-muted/50 transition-colors"
                >
                  <LinkedInIcon className="w-5 h-5 shrink-0 text-[#0A66C2]" />
                  <span className="text-sm font-medium text-foreground">DOHaD India Regional Society</span>
                </a>
              </div>

              <div className="bg-card border border-border rounded-lg p-5 shadow-sm flex flex-col flex-1 min-h-[280px]">
                <h3 className="text-sm sm:text-base xl:text-xl font-bold text-foreground mb-3">Location</h3>
                <div className="relative flex-1 min-h-[200px] rounded-lg overflow-hidden shadow-md">
                  <iframe
                    src={SECRETARIAT_MAPS_EMBED_URL}
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="DOHaD India Secretariat location"
                  />
                </div>
                <a
                  href={SECRETARIAT_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-3"
                >
                  <MapPin className="w-4 h-4" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm mb-12">
          <h2 className={`${headingStyles} text-center mb-6`}>Send Us a Message</h2>

          <ContactForm />
        </div>

      </main>
    </div>
  )
}
