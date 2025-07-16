import React, { useEffect, useImperativeHandle, useState } from "react";
import styles from "./input.module.css";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string;
  errors?: Record<string, unknown>;
  touched?: Record<string, unknown>;
  name: string;
  topLabel?: string;
  variant?: "default" | "outlined" | "filled";
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      name,
      label,
      touched,
      errors,
      required,
      topLabel,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [inputType, setInputType] = useState(type);

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text");
      }

      if (type === "password" && !showPassword) {
        setInputType("password");
      }
    }, [type, showPassword]);

    useImperativeHandle(ref, () => inputRef.current!);

    return (
      <div className={`${styles.container} ${styles[variant]}`}>
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
        <div className={styles.inputWrapper}>
          <input
            type={inputType}
            name={name}
            id={name}
            placeholder={props.placeholder}
            required={required}
            className={styles.input}
            {...props}
            ref={inputRef}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.passwordButton}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
        {touched && touched[name] && errors && errors[name] && (
          <div className={styles.errorMessage}>{String(errors[name])}</div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

const Eye: React.FC<{
  size?: string;
  color?: string;
  className?: string;
}> = ({ size = "20", color = "currentColor", className, ...attributes }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...attributes}
    >
      <path
        d="M2.5 9.99992C2.5 9.99992 5.22727 4.58325 10 4.58325C14.7727 4.58325 17.5 9.99992 17.5 9.99992C17.5 9.99992 14.7727 15.4166 10 15.4166C5.22727 15.4166 2.5 9.99992 2.5 9.99992Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99965 12.074C11.145 12.074 12.0735 11.1455 12.0735 10.0001C12.0735 8.85477 11.145 7.92627 9.99965 7.92627C8.85428 7.92627 7.92578 8.85477 7.92578 10.0001C7.92578 11.1455 8.85428 12.074 9.99965 12.074Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const EyeOff: React.FC<{
  size?: string;
  color?: string;
  className?: string;
}> = ({ size = "20", color = "currentColor", className, ...attributes }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...attributes}
    >
      <path
        d="M8.56818 4.70906C9.0375 4.59921 9.518 4.54429 10 4.54543C14.7727 4.54543 17.5 9.99997 17.5 9.99997C17.0861 10.7742 16.5925 11.5032 16.0273 12.175M11.4455 11.4454C11.2582 11.6464 11.0324 11.8076 10.7815 11.9194C10.5306 12.0312 10.2597 12.0913 9.98506 12.0961C9.71042 12.101 9.43761 12.0505 9.18292 11.9476C8.92822 11.8447 8.69686 11.6916 8.50262 11.4973C8.30839 11.3031 8.15527 11.0718 8.05239 10.8171C7.94952 10.5624 7.899 10.2896 7.90384 10.0149C7.90869 9.74027 7.9688 9.46941 8.0806 9.2185C8.19239 8.9676 8.35358 8.74178 8.55455 8.55452M14.05 14.05C12.8845 14.9384 11.4653 15.4306 10 15.4545C5.22727 15.4545 2.5 9.99997 2.5 9.99997C3.34811 8.41945 4.52441 7.03857 5.95 5.94997L14.05 14.05Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 2.5L17.5 17.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
