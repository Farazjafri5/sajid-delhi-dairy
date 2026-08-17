"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Mail, MessageSquare, Check } from "lucide-react";
import Button from "@/components/Button";
import { WEB3FORMS_ACCESS_KEY } from "@/config/email";

export default function ContactPage() {
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
          subject: `New Lead from Delhi Diaries Official - ${formState.brandName}`,
          from_name: "Delhi Diaries Webmaster",
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
    <main className="flex-1 bg-studio-bg pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-studio-muted">
            Get In Touch
          </span>
          <h1 className="mt-4 heading-serif-hero text-primary uppercase">
            Let's create something.
          </h1>
          <p className="mt-6 text-base md:text-lg text-studio-muted font-normal max-w-xl">
            We are always excited to collaborate with restaurants, cafes, lifestyle boutiques, and D2C brands. Tell us about your project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-8 text-xs tracking-wider uppercase text-studio-muted border-t border-primary/10 pt-12">
              {/* <div className="flex items-start gap-4">
                <MapPin size={16} className="text-primary mt-0.5" />
                <div>
                  <span className="block font-bold text-primary">HQ Office</span>
                  <span className="block mt-2 font-normal">Champa Gali, Saket, New Delhi, India</span>
                </div>
              </div> */}

              <div className="flex items-start gap-4">
                <Mail size={16} className="text-primary mt-0.5" />
                <div>
                  <span className="block font-bold text-primary">Direct Email</span>
                  <a href="mailto:kunwarsajid2@gmail.com" className="block mt-2 font-normal hover:text-primary transition-colors">
                    kunwarsajid2@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MessageSquare size={16} className="text-primary mt-0.5" />
                <div>
                  <span className="block font-bold text-primary">WhatsApp & Call</span>
                  <a href="https://wa.me/917668487182" target="_blank" rel="noopener noreferrer" className="block mt-2 font-normal hover:text-primary transition-colors">
                    +91 76684 87182
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-16 text-xs text-studio-muted leading-relaxed font-normal">
              <p>Looking for career opportunities or internships?</p>
              <a href="mailto:kunwarsajid2@gmail.com" className="text-primary font-bold underline mt-2 block">
                kunwarsajid2@gmail.com
              </a>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-primary/10 p-8 md:p-12 relative shadow-sm">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
                  <Check size={28} />
                </div>
                <h3 className="font-serif text-2xl font-bold uppercase text-primary">
                  Message Sent!
                </h3>
                <p className="mt-3 max-w-sm text-sm text-studio-muted leading-relaxed font-normal">
                  Thank you for reaching out. We will audit your Instagram and contact you via email or WhatsApp within 24 hours.
                </p>
                <Button variant="secondary" onClick={() => setIsSubmitted(false)} className="mt-8">
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="border-b border-primary/20 py-2 text-sm bg-transparent outline-none focus:border-primary transition-colors text-primary font-normal"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Brand Name */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="brandName" className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      name="brandName"
                      id="brandName"
                      required
                      value={formState.brandName}
                      onChange={handleChange}
                      className="border-b border-primary/20 py-2 text-sm bg-transparent outline-none focus:border-primary transition-colors text-primary font-normal"
                      placeholder="Enter your brand name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="border-b border-primary/20 py-2 text-sm bg-transparent outline-none focus:border-primary transition-colors text-primary font-normal"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={formState.phone}
                      onChange={handleChange}
                      className="border-b border-primary/20 py-2 text-sm bg-transparent outline-none focus:border-primary transition-colors text-primary font-normal"
                      placeholder="Enter your phone number"
                    />
                    {phoneError && (
                      <span className="text-[9px] text-red-500 font-bold tracking-wider uppercase mt-1">
                        {phoneError}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Instagram Handle */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="instagramHandle" className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
                      Instagram Handle *
                    </label>
                    <input
                      type="text"
                      name="instagramHandle"
                      id="instagramHandle"
                      required
                      value={formState.instagramHandle}
                      onChange={handleChange}
                      className="border-b border-primary/20 py-2 text-sm bg-transparent outline-none focus:border-primary transition-colors text-primary font-normal"
                      placeholder="Enter your Instagram handle"
                    />
                  </div>

                  {/* Business Type */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="businessType" className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
                      Business Type
                    </label>
                    <select
                      name="businessType"
                      id="businessType"
                      value={formState.businessType}
                      onChange={handleChange}
                      className="border-b border-primary/20 py-2 text-sm bg-transparent outline-none focus:border-primary transition-colors text-primary font-normal cursor-pointer"
                    >
                      <option value="Restaurant">Restaurant</option>
                      <option value="Cafe">Cafe</option>
                      <option value="Hospitality">Hospitality</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="D2C">D2C</option>
                      <option value="Event">Event</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label htmlFor="serviceNeeded" className="text-[10px] font-bold tracking-widest uppercase text-studio-muted">
                    What do you need help with?
                  </label>
                  <select
                    name="serviceNeeded"
                    id="serviceNeeded"
                    value={formState.serviceNeeded}
                    onChange={handleChange}
                    className="border-b border-primary/20 py-2 text-sm bg-transparent outline-none focus:border-primary transition-colors text-primary font-normal cursor-pointer"
                  >
                    <option value="Full Social Media Management">Full Social Media Management</option>
                    <option value="Reels & Short-form Content">Reels & Short-form Content</option>
                    <option value="Content Shoot (Photo/Video)">Content Shoot (Photo/Video)</option>
                    <option value="Influencer & Brand Collaboration">Influencer & Brand Collaboration</option>
                    <option value="Content Strategy Planning">Content Strategy Planning</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending Audit Request..." : "Let's Create →"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
