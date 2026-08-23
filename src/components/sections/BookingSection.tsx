"use client";

import { useId, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Clock, MapPin, Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { Select, type SelectOption } from "@/components/ui/Select";
import { SERVICES } from "@/data/services";
import {
  OPENING_HOURS,
  OPENING_HOURS_VERIFIED,
  OPENING_HOURS_FALLBACK_MESSAGE,
} from "@/data/openingHours";
import { cn } from "@/lib/utils";

function BookingSectionContent() {
  const shouldReduceMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const serviceParam = searchParams ? searchParams.get("service") : null;

  const validInitialService = SERVICES.some(
    (s) => s.enabled && s.id === serviceParam
  )
    ? (serviceParam as string)
    : serviceParam === "course-enrollment" || serviceParam === "report-request"
    ? (serviceParam as string)
    : "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    tob: "",
    pob: "",
    service: validInitialService,
    preferredDate: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (serviceParam) {
      setFormData((prev) => ({ ...prev, service: serviceParam }));
      // If on homepage with service param, scroll to booking section
      const timer = setTimeout(() => {
        const bookingEl = document.getElementById("booking");
        if (bookingEl) {
          bookingEl.scrollIntoView({
            behavior: shouldReduceMotion ? "auto" : "smooth",
            block: "start",
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [serviceParam, shouldReduceMotion]);

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const dobId = useId();
  const tobId = useId();
  const pobId = useId();
  const serviceId = useId();
  const dateId = useId();
  const messageId = useId();

  const serviceOptions: SelectOption[] = [
    { value: "course-enrollment", label: "🎓 Course Enrollment / Academy Masterclass" },
    { value: "report-request", label: "📄 Personalized Numerology & Vastu Report Request" },
    ...SERVICES.filter((service) => service.enabled).map((service) => ({
      value: service.id,
      label: service.name,
    })),
  ];

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

  const fadeUp = (delay: number) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.6, delay, ease: [0, 0, 0.2, 1] as const },
        };

  const formPanelMotion = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.3 },
      }
    : {
        initial: { opacity: 0, x: 32 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
      };

  const baseFieldClasses =
    "h-[52px] w-full rounded-base border bg-white/[0.06] px-4 text-body text-white " +
    "placeholder:text-white/40 transition-all duration-fast " +
    "focus:outline-none focus:ring-2 [color-scheme:dark] ";

  const getFieldClass = (hasError: boolean) =>
    cn(
      baseFieldClasses,
      hasError
        ? "border-rose-400 bg-rose-500/[0.08] focus:border-rose-400 focus:ring-rose-400/40"
        : "border-white/[0.15] focus:border-gold-500 focus:ring-gold-500/40"
    );

  const labelClasses =
    "text-small font-medium text-white/90 flex items-center justify-between";

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
    if (!formData.dob) newErrors.dob = "Date of Birth is required for chart analysis";
    if (!formData.tob) newErrors.tob = "Time of Birth is required";
    if (!formData.pob.trim()) newErrors.pob = "Place of Birth (City, State) is required";
    if (!formData.service) newErrors.service = "Please select a service or consultation type";
    if (!formData.preferredDate) newErrors.preferredDate = "Please select your preferred session date";
    if (!formData.message.trim()) newErrors.message = "Please share your notes or questions";

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
    <section id="booking" className="relative overflow-hidden py-12 md:py-16 lg:py-20 scroll-mt-24">
      {/* BOOKING BACKGROUND ATMOSPHERE LAYER */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-navy-900)_0%,var(--color-navy-800)_45%,var(--color-indigo-900)_100%)]" />
        <div className="absolute right-[10%] top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.12] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-warm-white)_1px,transparent_0)] bg-[length:24px_24px] opacity-[0.03]" />
        <div className="absolute inset-0 bg-navy-950/40" />
      </div>

      <Container size="wide" className="relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Left ~40% — intro, opening hours, verified location */}
          <div className="flex flex-col gap-8">
            <motion.div {...fadeUp(0)} className="flex flex-col gap-6">
              <span className="text-small font-semibold uppercase tracking-[0.08em] text-gold-500">
                Book a Consultation
              </span>
              <h2 className="font-heading text-h3 font-medium text-white md:text-h2">
                Take the First Step Toward Greater Clarity
              </h2>
              <p className="max-w-narrow text-body-lg text-white/70">
                Schedule a personalized consultation for Numerology or
                Vastu guidance, at a pace that feels comfortable for you.
                Share your birth details below and we&apos;ll be in touch to
                confirm a time that works.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp(0.15)}
              className="flex flex-col gap-4 border-t border-white/[0.12] pt-8"
            >
              <div className="flex items-start gap-3">
                <Clock
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-gold-500"
                  strokeWidth={1.75}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-h6 font-medium text-white">
                    Consultation Hours
                  </span>
                  {OPENING_HOURS_VERIFIED ? (
                    <ul className="flex flex-col gap-1">
                      {OPENING_HOURS.map(({ days, hours }) => (
                        <li
                          key={days}
                          className="flex items-baseline justify-between gap-4 text-small text-white/70"
                        >
                          <span>{days}</span>
                          <span>{hours}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-small text-white/70">
                      {OPENING_HOURS_FALLBACK_MESSAGE}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-gold-500"
                  strokeWidth={1.75}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-h6 font-medium text-white">
                    Location
                  </span>
                  <span className="text-small text-white/70">
                    Salt Lake City, Kolkata
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right ~60% — booking form panel or UI-only success state */}
          <motion.div {...formPanelMotion}>
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center gap-6 rounded-xl border border-gold-400/30 bg-white/[0.08] p-8 text-center backdrop-blur-md sm:p-12 shadow-[0_20px_50px_rgba(8,20,35,0.3)]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/50 bg-gold-500/20 text-gold-400 shadow-[0_0_24px_rgba(212,175,55,0.3)]">
                  <Check className="h-8 w-8 text-gold-300" strokeWidth={2.5} />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-small font-semibold uppercase tracking-[0.08em] text-gold-400">
                    Request Received
                  </span>
                  <h3 className="font-display text-h3 font-medium text-white">
                    Thank You for Reaching Out
                  </h3>
                  <p className="max-w-md text-body-lg text-white/80 leading-relaxed">
                    We&apos;ll analyze your birth details and contact you shortly to confirm your consultation time and session details.
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
                      service: "",
                      preferredDate: "",
                      message: "",
                    });
                  }}
                  className="mt-2 rounded-full border-white/20 bg-white/5 text-white hover:border-gold-400/60 hover:bg-white/10 hover:text-gold-300 transition-all duration-300"
                >
                  Submit Another Request
                </Button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-6 rounded-xl border border-white/[0.12] bg-white/[0.06] p-6 backdrop-blur-md sm:p-8"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2 group">
                    <label htmlFor={nameId} className={labelClasses}>
                      <span>Full Name <span className="text-rose-400">*</span></span>
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
                      <span className="text-[12px] font-medium text-rose-400">{errors.name}</span>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-2 group">
                    <label htmlFor={emailId} className={labelClasses}>
                      <span>Email Address <span className="text-rose-400">*</span></span>
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
                      <span className="text-[12px] font-medium text-rose-400">{errors.email}</span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-2 group">
                    <label htmlFor={phoneId} className={labelClasses}>
                      <span>Phone Number <span className="text-rose-400">*</span></span>
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
                      <span className="text-[12px] font-medium text-rose-400">{errors.phone}</span>
                    )}
                  </div>

                  {/* Preferred Date */}
                  <div className="flex flex-col gap-2 group">
                    <label htmlFor={dateId} className={labelClasses}>
                      <span>Preferred Date <span className="text-rose-400">*</span></span>
                    </label>
                    <input
                      id={dateId}
                      name="preferredDate"
                      type="date"
                      required
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                      className={getFieldClass(!!errors.preferredDate)}
                    />
                    {errors.preferredDate && (
                      <span className="text-[12px] font-medium text-rose-400">{errors.preferredDate}</span>
                    )}
                  </div>

                  {/* Birth Details Divider */}
                  <div className="sm:col-span-2 pt-2 border-t border-white/[0.10]">
                    <span className="text-caption font-bold uppercase tracking-wider text-gold-400">
                      Birth Details (Required for Numerology &amp; Astrology)
                    </span>
                  </div>

                  {/* Date of Birth */}
                  <div className="flex flex-col gap-2 group">
                    <label htmlFor={dobId} className={labelClasses}>
                      <span>Date of Birth <span className="text-rose-400">*</span></span>
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
                      <span className="text-[12px] font-medium text-rose-400">{errors.dob}</span>
                    )}
                  </div>

                  {/* Time of Birth */}
                  <div className="flex flex-col gap-2 group">
                    <label htmlFor={tobId} className={labelClasses}>
                      <span>Time of Birth <span className="text-rose-400">*</span></span>
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
                      <span className="text-[12px] font-medium text-rose-400">{errors.tob}</span>
                    )}
                  </div>

                  {/* Place of Birth */}
                  <div className="flex flex-col gap-2 sm:col-span-2 group">
                    <label htmlFor={pobId} className={labelClasses}>
                      <span>Place of Birth (City, State / Country) <span className="text-rose-400">*</span></span>
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
                      <span className="text-[12px] font-medium text-rose-400">{errors.pob}</span>
                    )}
                  </div>

                  {/* Service Dropdown */}
                  <div className="flex flex-col gap-2 sm:col-span-2 group">
                    <label htmlFor={serviceId} className={labelClasses}>
                      <span>Service / Consultation Type <span className="text-rose-400">*</span></span>
                    </label>
                    <Select
                      id={serviceId}
                      name="service"
                      required
                      options={serviceOptions}
                      value={formData.service}
                      onChange={(val) => handleInputChange("service", val)}
                      placeholder="Select consultation or course"
                      className={errors.service ? "border-rose-400 ring-rose-400/40" : undefined}
                    />
                    {errors.service && (
                      <span className="text-[12px] font-medium text-rose-400">{errors.service}</span>
                    )}
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2 sm:col-span-2 group">
                    <label htmlFor={messageId} className={labelClasses}>
                      <span>Message / Notes <span className="text-rose-400">*</span></span>
                    </label>
                    <textarea
                      id={messageId}
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Share anything that will help us prepare for your consultation."
                      className={cn(
                        getFieldClass(!!errors.message),
                        "h-auto resize-none py-3"
                      )}
                    />
                    {errors.message && (
                      <span className="text-[12px] font-medium text-rose-400">{errors.message}</span>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                  className="rounded-full shadow-[0_0_24px_rgba(212,175,55,0.25)] hover:shadow-[0_0_36px_rgba(212,175,55,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin text-navy-950" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Request Consultation"
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

const BookingSection = () => (
  <Suspense fallback={null}>
    <BookingSectionContent />
  </Suspense>
);

export default BookingSection;