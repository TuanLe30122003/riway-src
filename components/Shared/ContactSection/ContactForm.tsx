"use client";

import { submitContact } from "@/app/actions/contact";
import CustomButton from "@/components/Common/CustomButton";
import { StaggerGroup, StaggerItem } from "@/components/Animation/Reveal";
import { contactSchema, type ContactValues } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { gsap, useGSAP } from "@/lib/gsap";
import { CircleCheck, LoaderCircle, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const fieldClass =
  "w-full border border-gold bg-gold-ink/80 px-4 text-base font-light text-white placeholder:text-muted outline-none transition-[box-shadow,border-color,background-color] duration-300 focus:border-sky focus:bg-gold-ink focus:shadow-[0_0_0_3px_rgba(97,212,255,0.15)]";

export default function ContactForm() {
  const t = useTranslations("ContactSection");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const statusRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (status === "idle" || !statusRef.current) return;
      gsap.fromTo(statusRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" });
    },
    { dependencies: [status] },
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), mode: "onTouched" });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("idle");
    const result = await submitContact(values);
    if (result.ok) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  });

  const errorText = (field: keyof ContactValues) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-1.5 px-1 text-xs text-[#ff8a7a]">
        {t(`errors.${field}`)}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 md:gap-[11px]">
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <StaggerGroup className="flex flex-col gap-3 md:gap-[11px]" stagger={0.1}>
        <StaggerItem className="grid gap-3 sm:grid-cols-2 sm:gap-[13px]">
          <div>
            <label htmlFor="contact-name" className="sr-only">
              {t("name")}
            </label>
            <input
              id="contact-name"
              type="text"
              autoComplete="organization"
              placeholder={t("name")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={cn(fieldClass, "h-[49px] rounded-[13px]", errors.name && "border-[#ff8a7a]")}
              {...register("name")}
            />
            {errorText("name")}
          </div>
          <div>
            <label htmlFor="contact-email" className="sr-only">
              {t("email")}
            </label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              placeholder={t("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={cn(fieldClass, "h-[49px] rounded-[13px]", errors.email && "border-[#ff8a7a]")}
              {...register("email")}
            />
            {errorText("email")}
          </div>
        </StaggerItem>
        <StaggerItem>
          <label htmlFor="contact-message" className="sr-only">
            {t("message")}
          </label>
          <textarea
            id="contact-message"
            rows={7}
            placeholder={t("message")}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={cn(
              fieldClass,
              "min-h-[180px] resize-none rounded-[20px] py-3 md:min-h-[229px]",
              errors.message && "border-[#ff8a7a]",
            )}
            {...register("message")}
          />
          {errorText("message")}
        </StaggerItem>
        <StaggerItem className="mt-2 flex flex-col items-center gap-3 md:mt-[7px]">
          <CustomButton
            type="submit"
            variant="solid"
            disabled={isSubmitting}
            className="spin-border min-w-[240px] md:min-w-[274px]"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <LoaderCircle className="size-4 animate-spin" />
                {t("sending")}
              </span>
            ) : (
              t("submit")
            )}
          </CustomButton>
          {status !== "idle" && (
            <p
              ref={statusRef}
              role="status"
              className={cn("flex items-center gap-2 text-sm", status === "success" ? "text-sky" : "text-[#ff8a7a]")}
            >
              {status === "success" ? <CircleCheck className="size-4" /> : <TriangleAlert className="size-4" />}
              {t(status)}
            </p>
          )}
        </StaggerItem>
      </StaggerGroup>
    </form>
  );
}
