"use client";

import { useId, useState } from "react";
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/**
 * ContactForm
 *
 * Centered, full-width general inquiry and consultation lead-capture form for /contact page.
 * Includes full birth details (DOB, TOB, POB) required for accurate numerological
 * and astrological guidance, with complete required-field validation.
 */
const ContactForm = () => {
  const shouldReduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    tob: "",
    pob: "",
    reason: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Unique React IDs for explicit label-to-input pairing across all form controls
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const dobId = useId();
  const tobId = useId();
  const pobId = useId();
  const reasonId = useId();
  const messageId = useId();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const panelMotion = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.3 },
      }
    : {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
      };

  const baseFieldClasses =
    "h-[52px] w-full rounded-base border bg-white px-4 text-body text-navy-900 " +
    "placeholder:text-navy-900/40 transition-colors duration-fast " +
    "focus:outline-none focus:ring-2 ";

  const getFieldClass = (hasError: boolean) =>
    cn(
      baseFieldClasses,
      hasError
        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
        : "border-navy-900/15 focus:border-gold-500 focus:ring-gold-500/30"
    );

  const labelClasses = "text-small font-medium text-navy-900 flex items-center justify-between";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.tob) newErrors.tob = "Time of Birth is required";
    if (!formData.pob.trim()) newErrors.pob = "Place of Birth (City, State) is required";
    if (!formData.reason) newErrors.reason = "Please select an inquiry / service type";
    if (!formData.message.trim()) newErrors.message = "Message / Query is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  return (
    <section
      aria-label="Send us a message"
      className="bg-warm-white py-16 md:py-20 lg:py-24 xl:py-30"
    >
      <Container size="default">
        {/* Section Intro Heading */}
        <SectionHeading
          eyebrow="Send a Message"
          heading="We'd Love to Hear From You"
          description="Fill out the form below with your inquiry, birth details, or consultation requirements. Our team will get back to you promptly."
          align="center"
        />

        {/* Centered Single-Column Form Layout */}
        <div className="mt-12 max-w-3xl mx-auto w-full">
          <motion.div {...panelMotion}>
            {isSubmitted ? (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={shouldReduceMotion ? { duration: 0.2 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-navy-900/10 bg-white p-8 text-center shadow-md sm:p-12"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-600 shadow-sm">
                  <Check className="h-8 w-8 text-gold-600" strokeWidth={2.5} />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-small font-semibold uppercase tracking-[0.08em] text-gold-600">
                    Message Sent
                  </span>
                  <h3 className="font-heading text-h3 font-medium text-navy-950">
                    Thank You for Reaching Out
                  </h3>
                  <p className="max-w-md text-body-lg text-navy-800/80 leading-relaxed">
                    We&apos;ll review your details and contact you shortly to answer your inquiry and assist you further.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      dob: "",
                      tob: "",
                      pob: "",
                      reason: "",
                      message: "",
                    });
                  }}
                  className="mt-2 rounded-full border-navy-900/20 bg-navy-900/5 text-navy-900 hover:border-gold-500 hover:bg-gold-500/10 hover:text-gold-700 transition-all duration-300"
                >
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-6 rounded-2xl border border-gold-500/30 bg-white p-6 shadow-md sm:p-10 md:p-12"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor={nameId} className={labelClasses}>
                      <span>Full Name <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      id={nameId}
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                      className={getFieldClass(!!errors.name)}
                    />
                    {errors.name && (
                      <span className="text-[12px] font-medium text-rose-600">{errors.name}</span>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor={emailId} className={labelClasses}>
                      <span>Email Address <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      id={emailId}
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="you@example.com"
                      className={getFieldClass(!!errors.email)}
                    />
                    {errors.email && (
                      <span className="text-[12px] font-medium text-rose-600">{errors.email}</span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor={phoneId} className={labelClasses}>
                      <span>Phone Number <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      id={phoneId}
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 00000 00000"
                      className={getFieldClass(!!errors.phone)}
                    />
                    {errors.phone && (
                      <span className="text-[12px] font-medium text-rose-600">{errors.phone}</span>
                    )}
                  </div>

                  {/* Reason for Contact / Service Dropdown */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor={reasonId} className={labelClasses}>
                      <span>Inquiry / Service Type <span className="text-rose-500">*</span></span>
                    </label>
                    <select
                      id={reasonId}
                      name="reason"
                      required
                      value={formData.reason}
                      onChange={(e) => handleInputChange("reason", e.target.value)}
                      className={getFieldClass(!!errors.reason)}
                    >
                      <option value="" disabled className="text-navy-900">
                        Select a category
                      </option>
                      <option value="course-enrollment" className="text-navy-900">
                        🎓 Course Enrollment / Academy Inquiry
                      </option>
                      <option value="report-request" className="text-navy-900">
                        📄 Personalized Report Request
                      </option>
                      <option value="book-consultation" className="text-navy-900">
                        🌟 Book 1-on-1 Consultation
                      </option>
                      <option value="product-question" className="text-navy-900">
                        💎 Sacred Items &amp; Product Question
                      </option>
                      <option value="general-inquiry" className="text-navy-900">
                        💬 General Inquiry
                      </option>
                      <option value="feedback" className="text-navy-900">
                        ⭐ Feedback
                      </option>
                      <option value="other" className="text-navy-900">
                        📌 Other
                      </option>
                    </select>
                    {errors.reason && (
                      <span className="text-[12px] font-medium text-rose-600">{errors.reason}</span>
                    )}
                  </div>

                  {/* Birth Details Divider */}
                  <div className="sm:col-span-2 pt-2 border-t border-navy-900/10">
                    <span className="text-caption font-bold uppercase tracking-wider text-gold-700">
                      Birth Details (Mandatory for Accurate Calculations)
                    </span>
                  </div>

                  {/* Date of Birth */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor={dobId} className={labelClasses}>
                      <span>Date of Birth <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      id={dobId}
                      name="dob"
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                      className={getFieldClass(!!errors.dob)}
                    />
                    {errors.dob && (
                      <span className="text-[12px] font-medium text-rose-600">{errors.dob}</span>
                    )}
                  </div>

                  {/* Time of Birth */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor={tobId} className={labelClasses}>
                      <span>Time of Birth <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      id={tobId}
                      name="tob"
                      type="time"
                      required
                      value={formData.tob}
                      onChange={(e) => handleInputChange("tob", e.target.value)}
                      className={getFieldClass(!!errors.tob)}
                    />
                    {errors.tob && (
                      <span className="text-[12px] font-medium text-rose-600">{errors.tob}</span>
                    )}
                  </div>

                  {/* Place of Birth */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor={pobId} className={labelClasses}>
                      <span>Place of Birth (City, State / Country) <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      id={pobId}
                      name="pob"
                      type="text"
                      required
                      value={formData.pob}
                      onChange={(e) => handleInputChange("pob", e.target.value)}
                      placeholder="e.g. Kolkata, West Bengal, India"
                      className={getFieldClass(!!errors.pob)}
                    />
                    {errors.pob && (
                      <span className="text-[12px] font-medium text-rose-600">{errors.pob}</span>
                    )}
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor={messageId} className={labelClasses}>
                      <span>Message / Query <span className="text-rose-500">*</span></span>
                    </label>
                    <textarea
                      id={messageId}
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="How can we help you? Share your questions or requirements..."
                      className={cn(
                        getFieldClass(!!errors.message),
                        "h-auto resize-none py-3"
                      )}
                    />
                    {errors.message && (
                      <span className="text-[12px] font-medium text-rose-600">{errors.message}</span>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                  className="mt-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin text-navy-950" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending Message...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default ContactForm;
