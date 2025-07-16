"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import styles from "./submit-button.module.css";

export function SubmitButton({
  children,
  disabled = false,
  variant = "primary",
  className,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "transparent" | "danger" | null;
  className?: string;
  "data-testid"?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  const buttonClasses = [
    styles.button,
    styles[variant || "primary"],
    pending && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      disabled={disabled || pending}
      className={buttonClasses}
      type="submit"
      data-testid={dataTestId}
    >
      {pending && <span className={styles.spinner}></span>}
      {children}
    </button>
  );
}
