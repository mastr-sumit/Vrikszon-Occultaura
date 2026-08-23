"use client";

import { useId, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Clock, MapPin, CheckCircle2, FileText, Check, Calendar, MapPin as LocationIcon, Sparkles } from "lucide-react";
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

function BookingFormContent() {
  const shouldReduceMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const serviceParam = searchParams ? searchParams.get("service") : null;
  const nameParam = searchParams ? searchParams.get("name") : null;
  const numberParam = searchParams ? searchParams.get("number") : null;
  const topicParam = searchParams ? searchParams.get("topic") : null;

  const validInitialService = SERVICES.some(
    (s) => s.enabled && s.id === serviceParam
  )
    ? (serviceParam as string)
    : serviceParam === "course-enrollment" || serviceParam === "report-request"
    ? (serviceParam as string)
    : "";

  const initialMessage = numberParam || topicParam
    ? `Inquiry regarding Vedic Numerology (Life Path Number: ${numberParam || "N/A"}). Interested in: ${topicParam || "General Consultation"}.`
    : "";

  const [formData, setFormData] = useState({
    name: nameParam || "",
    email: "",
    phone: "",
    dob: "",
    tob: "",
    pob: "",
    service: validInitialService,
    preferredDate: "",
    message: initialMessage,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (nameParam) setFormData((prev) => ({ ...prev, name: nameParam }));
    if (numberParam || topicParam) {
      setFormData((prev) => ({
        ...prev,
        message: `Inquiry regarding Vedic Numerology (Life Path Number: ${numberParam || "N/A"}). Interested in: ${topicParam || "General Consultation"}.`,
      }));
    }
  }, [nameParam, numberParam, topicParam]);

  useEffect(() => {
    if (serviceParam) {
      setFormData((prev) => ({ ...prev, service: serviceParam }));

      // Auto-scroll smoothly to booking form when service query param is present
      const timer = setTimeout(() => {
        const formEl = document.getElementById("booking-form");
        if (formEl) {
          formEl.scrollIntoView({
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
    if (!formData.dob) newErrors.dob = "Date of Birth is required for chart analysis";
    if (!formData.tob) newErrors.tob = "Time of Birth is required";
    if (!formData.pob.trim()) newErrors.pob = "Place of Birth (City, State) is required";
    if (!formData.service) newErrors.service = "Please select a service or consultation type";
    if (!formData.preferredDate) newErrors.preferredDate = "Please select your preferred session date";
    if (!formData.message.trim()) newErrors.message = "Please share your questions or notes";

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
      id="booking-form"
      aria-label="Book your consultation form"
      className="bg-warm-white py-16 md:py-20 lg:py-24 xl:py-30 scroll-mt-28 md:scroll-mt-32"
    >
      <Container size="wide">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 items-start">
          {/* Left Column (~40%) — Trust-building info, turnaround, opening hours, location */}
          <div className="flex flex-col gap-8">
            <motion.div {...fadeUp(0)} className="flex flex-col gap-5">
              <span className="text-small font-semibold uppercase tracking-[0.08em] text-gold-600">
                Schedule Your Session
              </span>
              <h2 className="font-heading text-h3 font-medium text-navy-950 md:text-h2">
                Personalized Guidance Tailored to Your Life Path
              </h2>
              <p className="max-w-narrow text-body-lg text-navy-800/80">
                When you request a consultation with Vrikszon Occultaura, every detail of your numerological profile, birth time, name alignment, and energetic space is meticulously evaluated. With a confirmed 4–5 days turnaround time, all your queries will be thoroughly discussed in your private session.
              </p>
            </motion.div>

            {/* Key Trust Highlights */}
            <motion.div
              {...fadeUp(0.1)}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1"
            >
              <div className="flex items-start gap-3 rounded-lg border border-navy-900/10 bg-white p-4 shadow-sm">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" strokeWidth={1.75} />
                <div>
                  <h3 className="text-small font-semibold text-navy-950">4–5 Days Turnaround</h3>
                  <p className="text-small text-navy-700">Detailed preparation and in-depth birth chart analysis before your session.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-navy-900/10 bg-white p-4 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" strokeWidth={1.75} />
                <div>
                  <h3 className="text-small font-semibold text-navy-950">All Queries Addressed</h3>
                  <p className="text-small text-navy-700">Dedicated time to discuss career, health, relationships, courses, and remedies.</p>
                </div>
              </div>
            </motion.div>

            {/* Opening Hours & Location */}
            <motion.div
              {...fadeUp(0.15)}
              className="flex flex-col gap-6 border-t border-navy-900/10 pt-8"
            >
              <div className="flex items-start gap-3">
                <Clock
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-gold-600"
                  strokeWidth={1.75}
                />
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-h6 font-medium text-navy-950">
                    Consultation Hours
                  </span>
                  {OPENING_HOURS_VERIFIED ? (
                    <ul className="flex flex-col gap-1">
                      {OPENING_HOURS.map(({ days, hours }) => (
                        <li
                          key={days}
                          className="flex items-baseline justify-between gap-4 text-small text-navy-800/80"
                        >
                          <span>{days}</span>
                          <span>{hours}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-small text-navy-800/80">
                      {OPENING_HOURS_FALLBACK_MESSAGE}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-gold-600"
                  strokeWidth={1.75}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-h6 font-medium text-navy-950">
                    Location
                  </span>
                  <span className="text-small text-navy-800/80">
                    Salt Lake City, Kolkata
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column (~60%) — Booking Form Panel or Success State */}
          <motion.div {...formPanelMotion}>
            {isSubmitted ? (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={shouldReduceMotion ? { duration: 0.2 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center gap-6 rounded-xl border border-navy-900/10 bg-white p-8 text-center shadow-md sm:p-12"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-600 shadow-sm">
                  <Check className="h-8 w-8 text-gold-600" strokeWidth={2.5} />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-small font-semibold uppercase tracking-[0.08em] text-gold-600">
                    Request Received
                  </span>
                  <h3 className="font-heading text-h3 font-medium text-navy-950">
                    Thank You for Reaching Out
                  </h3>
                  <p className="max-w-md text-body-lg text-navy-800/80 leading-relaxed">
                    We&apos;ll analyze your birth details and contact you shortly to confirm your consultation time and session link.
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
                  className="mt-2 rounded-full border-navy-900/20 bg-navy-900/5 text-navy-900 hover:border-gold-500 hover:bg-gold-500/10 hover:text-gold-700 transition-all duration-300"
                >
                  Submit Another Request
                </Button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-6 rounded-xl border border-navy-900/10 bg-white p-6 shadow-md sm:p-8"
              >
                <div className="flex flex-col gap-1 border-b border-navy-900/10 pb-4">
                  <h3 className="text-h4 font-medium text-navy-950">
                    Request Your Session
                  </h3>
                  <p className="text-small text-navy-700">
                    All fields below are mandatory for accurate astrological and numerological calculation.
                  </p>
                </div>

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

                  {/* Preferred Date */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor={dateId} className={labelClasses}>
                      <span>Preferred Session Date <span className="text-rose-500">*</span></span>
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
                      <span className="text-[12px] font-medium text-rose-600">{errors.preferredDate}</span>
                    )}
                  </div>

                  {/* Birth Details Section Divider */}
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

                  {/* Service / Consultation Type Dropdown */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor={serviceId} className={labelClasses}>
                      <span>Service / Consultation Type <span className="text-rose-500">*</span></span>
                    </label>
                    <Select
                      id={serviceId}
                      name="service"
                      required
                      options={serviceOptions}
                      value={formData.service}
                      onChange={(val) => handleInputChange("service", val)}
                      placeholder="Select consultation or course"
                      className={errors.service ? "border-rose-500 ring-rose-500/30" : undefined}
                    />
                    {errors.service && (
                      <span className="text-[12px] font-medium text-rose-600">{errors.service}</span>
                    )}
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor={messageId} className={labelClasses}>
                      <span>Message / Specific Concerns <span className="text-rose-500">*</span></span>
                    </label>
                    <textarea
                      id={messageId}
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us what you would like guidance on (Career, Relationships, Health, Vastu, Course details, etc.)..."
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
                      Submitting Request...
                    </span>
                  ) : (
                    "Submit Consultation Request"
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

export default function BookingForm() {
  return (
    <Suspense
      fallback={
        <div className="bg-warm-white py-16 text-center text-body text-navy-900/60">
          Loading booking form...
        </div>
      }
    >
      <BookingFormContent />
    </Suspense>
  );
}
