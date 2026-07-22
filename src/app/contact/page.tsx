"use client";

import { useState } from "react";
import { Check, Mail, MapPin, Clock } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import SelectMenu from "@/components/forms/SelectMenu";
import { services } from "@/content/services";
import { company } from "@/content/site";

const SERVICE_OPTIONS = [...services.map((s) => s.title), "Something else"];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [service, setService] = useState("");
  const fieldClass =
    "w-full rounded-lg border border-hairline-strong bg-elevated/60 px-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle outline-none transition-colors focus:border-accent";

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's build something that lasts"
        description="Tell us about your project. A member of our team will respond within one business day."
      />

      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-5 lg:px-12">
          <div className="lg:col-span-3">
            {sent ? (
              <div className="flex flex-col items-start rounded-2xl border border-hairline bg-elevated/60 p-10">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check size={28} />
                </div>
                <h2 className="text-2xl font-semibold">Thank you</h2>
                <p className="mt-2 text-fg-muted">
                  We have received your request and will be in touch within one
                  business day.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-fg-muted">
                      Full name
                    </label>
                    <input id="name" required className={fieldClass} placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-fg-muted">
                      Work email
                    </label>
                    <input id="email" type="email" required className={fieldClass} placeholder="jane@company.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="mb-1.5 block text-xs font-medium text-fg-muted">
                    Company
                  </label>
                  <input id="company" className={fieldClass} placeholder="Acme Inc." />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-fg-muted">
                    Service interest
                  </label>
                  <SelectMenu
                    value={service}
                    onChange={setService}
                    options={SERVICE_OPTIONS}
                    placeholder="Select a service"
                    ariaLabel="Service interest"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-fg-muted">
                    How can we help?
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    className={`${fieldClass} resize-none`}
                    placeholder="A few lines about your goals."
                  />
                </div>
                <button
                  type="submit"
                  className="cursor-pointer rounded-xl bg-accent px-7 py-3 text-sm font-medium text-on-accent transition-all duration-200 hover:bg-accent-hover active:scale-[0.99]"
                >
                  Send request
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-7 rounded-2xl border border-hairline bg-elevated/60 p-8">
              {[
                { icon: Mail, label: "Email", value: company.email },
                { icon: MapPin, label: "Offices", value: "London · New York · Singapore" },
                { icon: Clock, label: "Response time", value: "Within one business day" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-hairline bg-base text-accent">
                      <Icon size={18} strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-fg-subtle">
                        {item.label}
                      </div>
                      <div className="mt-1 text-sm text-fg">{item.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
