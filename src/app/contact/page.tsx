"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { WEB3FORMS_ACCESS_KEY } from "@/config/email";
import { ContactSettings } from "@/types/siteContent";

// Inline Instagram Icon for clean luxury rendering
function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactSettings>({
    email: "kunwarsajid2@gmail.com",
    phone: "+91 76684 87182",
    whatsapp: "+91 76684 87182",
    instagramHandle: "@socialdiariesagency.co",
    instagramUrl: "https://www.instagram.com/socialdiariesagency.co/",
    businessTypes: [
      "Restaurant",
      "Cafe",
      "Hotel / Hospitality",
      "Fashion / Lifestyle",
      "Beauty / Skincare",
      "D2C Brand",
      "Events",
      "Other"
    ],
    serviceOptions: [
      "Social Media Management",
      "Reels & Short-form Content",
      "Full Brand Campaign",
      "Product Photography",
      "Influencer Strategy",
      "Content Strategy & Consulting"
    ]
  });

  React.useEffect(() => {
    try {
      const cached = localStorage.getItem("dd_site_content");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.contactSettings) {
          setContactInfo((prev) => ({
            ...prev,
            ...parsed.contactSettings,
          }));
        }
      }
    } catch (e) {}
  }, []);

  const [formState, setFormState] = useState({
    name: "",
    brandName: "",
    email: "",
    phone: "",
    instagramHandle: "",
    businessType: "Restaurant",
    serviceNeeded: "Social Media Management",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
      return;
    }
    setPhoneError("");
    setIsSubmitting(true);

    if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
      alert("Notice: To receive actual emails in your Gmail inbox, please request a free Access Key from web3forms.com and configure it in src/config/email.ts. Showing mock success screen for now!");
      setTimeout(() => {
        setIsSubmitted(true);
        setIsSubmitting(false);
        setFormState({
          name: "",
          brandName: "",
          email: "",
          phone: "",
          instagramHandle: "",
          businessType: "Restaurant",
          serviceNeeded: "Social Media Management",
        });
      }, 800);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New Lead from Social Diaries Official - ${formState.brandName}`,
          from_name: "Social Diaries Webmaster",
          ...formState
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
        setFormState({
          name: "",
          brandName: "",
          email: "",
          phone: "",
          instagramHandle: "",
          businessType: "Restaurant",
          serviceNeeded: "Social Media Management",
        });
      } else {
        alert(result.message || "Something went wrong. Please check your Access Key and try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please check your network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormState((prev) => ({
          ...prev,
          phone: digitsOnly,
        }));
        if (digitsOnly.length === 10) {
          setPhoneError("");
        } else if (digitsOnly.length > 0) {
          setPhoneError("Phone number must be exactly 10 digits.");
        } else {
          setPhoneError("");
        }
      }
      return;
    }
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <main className="flex-1 bg-gradient-to-b from-[#FAF8F5] via-[#FFFFFF] to-[#FAF8F5] pt-32 pb-24 md:pt-40 md:pb-32 relative overflow-hidden">
      {/* Subtle Ambient Gold Spotlights */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-[#C5A880]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#DD2A7B]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16 text-left">
          {/* Back Navigation Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#0A1628]/70 hover:text-[#0A1628] bg-white/80 border border-[#C5A880]/35 hover:border-[#C5A880] px-4 py-2 rounded-full mb-6 transition-all duration-300 shadow-sm hover:shadow group w-fit cursor-pointer backdrop-blur-md"
          >
            <ArrowLeft size={14} className="text-[#C5A880] transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 bg-[#0A1628]/5 border border-[#C5A880]/40 px-4 py-1.5 rounded-full mb-4 backdrop-blur-md shadow-sm">
              <span className="text-[#C5A880] text-xs">✦</span>
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#0A1628]">Get In Touch</span>
            </div>
          </div>
          <h1 className="heading-serif-hero text-[#0A1628] uppercase tracking-tight">
            Let's create <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#91724B] via-[#C5A880] to-[#91724B] drop-shadow-[0_2px_15px_rgba(197,168,128,0.25)]">
              something iconic.
            </span>
          </h1>
          <p className="mt-6 text-sm sm:text-base md:text-lg text-[#0A1628]/70 font-medium max-w-2xl leading-relaxed">
            We are always excited to collaborate with restaurants, cafes, luxury hospitality, lifestyle, and D2C brands. Tell us about your project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start text-left">
          {/* Details Column (Luxury Contact Cards) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-4">
              {/* Card 1: Direct Email */}
              <a 
                href={`mailto:${contactInfo.email || "kunwarsajid2@gmail.com"}`}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-[#C5A880]/30 bg-white/80 hover:border-[#C5A880] hover:bg-[#0A1628] hover:text-white transition-all duration-300 shadow-sm"
              >
                <div className="h-10 w-10 rounded-xl bg-[#0A1628]/5 group-hover:bg-[#C5A880] text-[#0A1628] group-hover:text-[#0A1628] flex items-center justify-center transition-colors shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#C5A880] block">Direct Email</span>
                  <span className="text-sm font-semibold text-[#0A1628] group-hover:text-white transition-colors block mt-0.5">
                    {contactInfo.email || "kunwarsajid2@gmail.com"}
                  </span>
                </div>
              </a>

              {/* Card 2: WhatsApp & Direct Call */}
              <a 
                href={`https://wa.me/${(contactInfo.whatsapp || "+91 76684 87182").replace(/\D/g, "")}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-5 rounded-2xl border border-[#C5A880]/30 bg-white/80 hover:border-[#C5A880] hover:bg-[#0A1628] hover:text-white transition-all duration-300 shadow-sm"
              >
                <div className="h-10 w-10 rounded-xl bg-[#0A1628]/5 group-hover:bg-[#C5A880] text-[#0A1628] group-hover:text-[#0A1628] flex items-center justify-center transition-colors shrink-0">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#C5A880] block">WhatsApp & Call</span>
                  <span className="text-sm font-semibold text-[#0A1628] group-hover:text-white transition-colors block mt-0.5">
                    {contactInfo.whatsapp || "+91 76684 87182"}
                  </span>
                </div>
              </a>              {/* Card 3: Instagram Direct */}
              <a 
                href={contactInfo.instagramUrl || "https://www.instagram.com/socialdiariesagency.co/"}
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-start gap-4 p-5 rounded-2xl border border-[#C5A880]/30 bg-white/80 hover:border-[#C5A880] hover:bg-[#0A1628] hover:text-white transition-all duration-300 shadow-sm"
              >
                <div className="h-10 w-10 rounded-xl bg-[#0A1628]/5 group-hover:bg-[#C5A880] text-[#0A1628] group-hover:text-[#0A1628] flex items-center justify-center transition-colors shrink-0">
                  <InstagramIcon size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#C5A880] block">Instagram</span>
                  <span className="text-sm font-semibold text-[#0A1628] group-hover:text-white transition-colors block mt-0.5">
                    {contactInfo.instagramHandle || "@socialdiariesagency.co"}
                  </span>
                </div>
              </a>
            </div>

            {/* Studio Commitments */}
            <div className="p-6 rounded-2xl border border-[#C5A880]/20 bg-gradient-to-b from-[#FAF6F1] to-[#F3ECE1] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0A1628]">
                <span className="text-[#C5A880]">✦</span>
                <span>24-Hour Guaranteed Response</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0A1628]">
                <span className="text-[#C5A880]">✦</span>
                <span>Complimentary Instagram & Reel Audit</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0A1628]">
                <span className="text-[#C5A880]">✦</span>
                <span>On-Ground Production Across Delhi NCR</span>
              </div>
            </div>
          </div>

          {/* Form Column (Ultra-Luxury Glass Card) */}
          <div className="lg:col-span-7 relative rounded-3xl border border-[#C5A880]/30 bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F1] to-[#F3ECE1] p-8 md:p-12 shadow-[0_24px_55px_rgba(197,168,128,0.22)] overflow-hidden">
            {/* Top Gold Shimmer */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A880] via-[#F3E5D0] to-[#C5A880]" />

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0A1628] text-[#C5A880] mb-6 shadow-xl">
                  <Check size={28} />
                </div>
                <h3 className="font-serif text-2xl font-bold uppercase text-[#0A1628]">
                  Inquiry Received!
                </h3>
                <p className="mt-3 max-w-sm text-sm text-[#0A1628]/70 leading-relaxed font-normal">
                  Thank you for reaching out. We will audit your Instagram and contact you via WhatsApp/Email within 24 hours.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)} 
                  className="mt-8 px-6 py-3 rounded-full bg-[#0A1628] text-[#C5A880] text-xs font-bold uppercase tracking-wider hover:bg-[#111D30] transition-colors cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-[10px] font-extrabold tracking-widest uppercase text-[#0A1628]/60">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="border border-[#0A1628]/10 rounded-xl px-4 py-3 text-sm bg-white/80 outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-[#0A1628] font-medium shadow-sm"
                      placeholder="e.g. Sajid Ali"
                    />
                  </div>

                  {/* Brand Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="brandName" className="text-[10px] font-extrabold tracking-widest uppercase text-[#0A1628]/60">
                      Brand / Restaurant Name *
                    </label>
                    <input
                      type="text"
                      name="brandName"
                      id="brandName"
                      required
                      value={formState.brandName}
                      onChange={handleChange}
                      className="border border-[#0A1628]/10 rounded-xl px-4 py-3 text-sm bg-white/80 outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-[#0A1628] font-medium shadow-sm"
                      placeholder="e.g. Dastan Dining"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-[10px] font-extrabold tracking-widest uppercase text-[#0A1628]/60">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="border border-[#0A1628]/10 rounded-xl px-4 py-3 text-sm bg-white/80 outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-[#0A1628] font-medium shadow-sm"
                      placeholder="name@brand.com"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-[10px] font-extrabold tracking-widest uppercase text-[#0A1628]/60">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={formState.phone}
                      onChange={handleChange}
                      className="border border-[#0A1628]/10 rounded-xl px-4 py-3 text-sm bg-white/80 outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-[#0A1628] font-medium shadow-sm"
                      placeholder="10-digit mobile number"
                    />
                    {phoneError && (
                      <span className="text-[10px] text-red-600 font-bold tracking-wider uppercase mt-0.5">
                        {phoneError}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Instagram Handle */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="instagramHandle" className="text-[10px] font-extrabold tracking-widest uppercase text-[#0A1628]/60">
                      Instagram Handle *
                    </label>
                    <input
                      type="text"
                      name="instagramHandle"
                      id="instagramHandle"
                      required
                      value={formState.instagramHandle}
                      onChange={handleChange}
                      className="border border-[#0A1628]/10 rounded-xl px-4 py-3 text-sm bg-white/80 outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-[#0A1628] font-medium shadow-sm"
                      placeholder="@yourbrand"
                    />
                  </div>

                  {/* Business Type */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="businessType" className="text-[10px] font-extrabold tracking-widest uppercase text-[#0A1628]/60">
                      Industry / Sector
                    </label>
                    <select
                      name="businessType"
                      id="businessType"
                      value={formState.businessType}
                      onChange={handleChange}
                      className="border border-[#0A1628]/10 rounded-xl px-4 py-3 text-sm bg-white/80 outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-[#0A1628] font-medium cursor-pointer shadow-sm"
                    >
                      {(contactInfo.businessTypes || [
                        "Restaurant",
                        "Cafe",
                        "Hotel / Hospitality",
                        "Fashion / Lifestyle",
                        "Beauty / Skincare",
                        "D2C Brand",
                        "Events",
                        "Other"
                      ]).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 pt-1">
                  <label htmlFor="serviceNeeded" className="text-[10px] font-extrabold tracking-widest uppercase text-[#0A1628]/60">
                    Primary Service Requirement
                  </label>
                  <select
                    name="serviceNeeded"
                    id="serviceNeeded"
                    value={formState.serviceNeeded}
                    onChange={handleChange}
                    className="border border-[#0A1628]/10 rounded-xl px-4 py-3 text-sm bg-white/80 outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all text-[#0A1628] font-medium cursor-pointer shadow-sm"
                  >
                    {(contactInfo.serviceOptions || [
                      "Social Media Management",
                      "Reels & Short-form Content",
                      "Full Brand Campaign",
                      "Product Photography",
                      "Influencer Strategy",
                      "Content Strategy & Consulting"
                    ]).map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group flex items-center justify-center gap-3 rounded-full bg-[#0A1628] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0A1628] py-4 text-xs font-bold tracking-widest uppercase shadow-[0_10px_25px_rgba(10,22,40,0.2)] transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "Sending Audit Request..." : "Submit Project Inquiry"}</span>
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
