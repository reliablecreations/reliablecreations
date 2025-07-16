import React from "react";
import styles from "./checkbox.module.css";

type CheckboxProps = {
  checked?: boolean;
  onChange?: () => void;
  label: string;
  name?: string;
  "data-testid"?: string;
  disabled?: boolean;
  id?: string;
};

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
  name,
  "data-testid": dataTestId,
  disabled = false,
  id = "checkbox",
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        className={`${styles.checkbox} ${checked ? styles.checked : ""} ${
          disabled ? styles.disabled : ""
        }`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        name={name}
        data-testid={dataTestId}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        <div className={styles.checkboxInner}>
          {checked && (
            <svg
              className={styles.checkmark}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </button>
      <label
        htmlFor={id}
        className={`${styles.label} ${disabled ? styles.labelDisabled : ""}`}
        onClick={!disabled ? handleClick : undefined}
      >
        {label}
      </label>
    </div>
  );
};

export default CheckboxWithLabel;
