"use client";

import { useId } from "react";
import { Truck } from "lucide-react";

export interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface ShippingFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface ShippingFormProps {
  formData: ShippingFormData;
  errors: ShippingFormErrors;
  onChange: (field: keyof ShippingFormData, value: string) => void;
}

/**
 * ShippingForm
 *
 * Shipping & delivery address form section for the /checkout page.
 * Occupies the left column in the 2-column desktop checkout layout.
 *
 * Features:
 * - Controlled form inputs with explicit label-to-input pairing using React's useId().
 * - Inline validation error messaging for required and formatted fields.
 * - Required indicator (*), optional badge for Address Line 2, and clear format hints.
 * - Responsive grid layout (stacks to 1 column on mobile, 2 columns on larger screens).
 */
export default function ShippingForm({ formData, errors, onChange }: ShippingFormProps) {
  const fullNameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const addressLine1Id = useId();
  const addressLine2Id = useId();
  const cityId = useId();
  const stateId = useId();
  const pincodeId = useId();

  const getFieldClasses = (hasError?: boolean) =>
    `h-[52px] w-full rounded-base border bg-white px-4 text-body text-navy-900 ` +
    `placeholder:text-navy-900/40 transition-colors duration-fast ` +
    `focus:outline-none focus:ring-2 ` +
    (hasError
      ? `border-red-500 focus:border-red-500 focus:ring-red-500/30`
      : `border-navy-900/15 focus:border-gold-500 focus:ring-gold-500/30`);

  const labelClasses = "text-small font-medium text-navy-950 flex items-center justify-between";

  return (
    <section aria-labelledby="shipping-details-heading" className="w-full">
      <div className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-xs sm:p-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-navy-900/10 pb-4 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 border border-navy-900/10 text-gold-600">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="shipping-details-heading"
              className="font-heading text-h4 font-medium text-navy-950"
            >
              Shipping & Delivery Details
            </h2>
            <p className="text-body-sm text-navy-900/60">
              Where should we deliver your energised spiritual products?
            </p>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div className="flex flex-col gap-2 sm:col-span-2" id="field-fullName">
            <label htmlFor={fullNameId} className={labelClasses}>
              <span>
                Full Name <span className="text-red-500" aria-hidden="true">*</span>
              </span>
            </label>
            <input
              id={fullNameId}
              name="fullName"
              type="text"
              required
              autoComplete="name"
              value={formData.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              placeholder="e.g. Ananya Sharma"
              className={getFieldClasses(!!errors.fullName)}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? `${fullNameId}-error` : undefined}
            />
            {errors.fullName && (
              <span id={`${fullNameId}-error`} className="text-caption font-medium text-red-600">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-2 sm:col-span-1" id="field-email">
            <label htmlFor={emailId} className={labelClasses}>
              <span>
                Email Address <span className="text-red-500" aria-hidden="true">*</span>
              </span>
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="you@example.com"
              className={getFieldClasses(!!errors.email)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? `${emailId}-error` : undefined}
            />
            {errors.email && (
              <span id={`${emailId}-error`} className="text-caption font-medium text-red-600">
                {errors.email}
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2 sm:col-span-1" id="field-phone">
            <label htmlFor={phoneId} className={labelClasses}>
              <span>
                Phone Number <span className="text-red-500" aria-hidden="true">*</span>
              </span>
            </label>
            <input
              id={phoneId}
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="10-digit mobile number"
              className={getFieldClasses(!!errors.phone)}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
            />
            {errors.phone && (
              <span id={`${phoneId}-error`} className="text-caption font-medium text-red-600">
                {errors.phone}
              </span>
            )}
          </div>

          {/* Address Line 1 */}
          <div className="flex flex-col gap-2 sm:col-span-2" id="field-addressLine1">
            <label htmlFor={addressLine1Id} className={labelClasses}>
              <span>
                Address Line 1 <span className="text-red-500" aria-hidden="true">*</span>
              </span>
            </label>
            <input
              id={addressLine1Id}
              name="addressLine1"
              type="text"
              required
              autoComplete="address-line1"
              value={formData.addressLine1}
              onChange={(e) => onChange("addressLine1", e.target.value)}
              placeholder="House / Flat No., Building, Street Name"
              className={getFieldClasses(!!errors.addressLine1)}
              aria-invalid={!!errors.addressLine1}
              aria-describedby={errors.addressLine1 ? `${addressLine1Id}-error` : undefined}
            />
            {errors.addressLine1 && (
              <span id={`${addressLine1Id}-error`} className="text-caption font-medium text-red-600">
                {errors.addressLine1}
              </span>
            )}
          </div>

          {/* Address Line 2 (Optional) */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor={addressLine2Id} className={labelClasses}>
              <span>Address Line 2</span>
              <span className="text-caption font-normal text-navy-900/40">Optional</span>
            </label>
            <input
              id={addressLine2Id}
              name="addressLine2"
              type="text"
              autoComplete="address-line2"
              value={formData.addressLine2}
              onChange={(e) => onChange("addressLine2", e.target.value)}
              placeholder="Apartment, Suite, Unit, Landmark (optional)"
              className={getFieldClasses(false)}
            />
          </div>

          {/* City */}
          <div className="flex flex-col gap-2 sm:col-span-1" id="field-city">
            <label htmlFor={cityId} className={labelClasses}>
              <span>
                City / Town <span className="text-red-500" aria-hidden="true">*</span>
              </span>
            </label>
            <input
              id={cityId}
              name="city"
              type="text"
              required
              autoComplete="address-level2"
              value={formData.city}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder="City or Town"
              className={getFieldClasses(!!errors.city)}
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? `${cityId}-error` : undefined}
            />
            {errors.city && (
              <span id={`${cityId}-error`} className="text-caption font-medium text-red-600">
                {errors.city}
              </span>
            )}
          </div>

          {/* State */}
          <div className="flex flex-col gap-2 sm:col-span-1" id="field-state">
            <label htmlFor={stateId} className={labelClasses}>
              <span>
                State <span className="text-red-500" aria-hidden="true">*</span>
              </span>
            </label>
            <input
              id={stateId}
              name="state"
              type="text"
              required
              autoComplete="address-level1"
              value={formData.state}
              onChange={(e) => onChange("state", e.target.value)}
              placeholder="State"
              className={getFieldClasses(!!errors.state)}
              aria-invalid={!!errors.state}
              aria-describedby={errors.state ? `${stateId}-error` : undefined}
            />
            {errors.state && (
              <span id={`${stateId}-error`} className="text-caption font-medium text-red-600">
                {errors.state}
              </span>
            )}
          </div>

          {/* Pincode */}
          <div className="flex flex-col gap-2 sm:col-span-2" id="field-pincode">
            <label htmlFor={pincodeId} className={labelClasses}>
              <span>
                Pincode / Postal Code <span className="text-red-500" aria-hidden="true">*</span>
              </span>
            </label>
            <input
              id={pincodeId}
              name="pincode"
              type="text"
              required
              autoComplete="postal-code"
              value={formData.pincode}
              onChange={(e) => onChange("pincode", e.target.value)}
              placeholder="6-digit Pincode (e.g. 700091)"
              className={getFieldClasses(!!errors.pincode)}
              aria-invalid={!!errors.pincode}
              aria-describedby={errors.pincode ? `${pincodeId}-error` : undefined}
            />
            {errors.pincode && (
              <span id={`${pincodeId}-error`} className="text-caption font-medium text-red-600">
                {errors.pincode}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
