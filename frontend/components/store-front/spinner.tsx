import React from "react";
import styles from "@/styles/spinner.module.css";

const Spinner: React.FC<{
  size?: string;
  color?: string;
  className?: string;
}> = ({
  size = "16",
  color = "currentColor",
  className = "",
  ...attributes
}) => {
  return (
    <svg
      className={`${styles.spinner} ${className}`}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...attributes}
    >
      <circle
        className={styles.circle}
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="4"
      ></circle>
      <path
        className={styles.path}
        fill={color}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export default Spinner;
