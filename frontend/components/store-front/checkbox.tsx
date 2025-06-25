import { Checkbox, Label } from "@medusajs/ui";
import React from "react";
import styles from "./checkbox.module.css";

type CheckboxProps = {
  checked?: boolean;
  onChange?: () => void;
  label: string;
  name?: string;
  "data-testid"?: string;
};

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
  name,
  "data-testid": dataTestId,
}) => {
  return (
    <div className={styles.container}>
      <Checkbox
        className={styles.checkbox}
        id="checkbox"
        role="checkbox"
        type="button"
        checked={checked}
        aria-checked={checked}
        onClick={onChange}
        name={name}
        data-testid={dataTestId}
      />
      <Label htmlFor="checkbox" className={styles.label} size="large">
        {label}
      </Label>
    </div>
  );
};

export default CheckboxWithLabel;
