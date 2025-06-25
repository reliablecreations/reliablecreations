import { ChevronUpDown } from "@medusajs/icons";
import { clx } from "@medusajs/ui";
import {
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styles from "./native-select.module.css";

export type NativeSelectProps = {
  placeholder?: string;
  errors?: Record<string, unknown>;
  touched?: Record<string, unknown>;
} & SelectHTMLAttributes<HTMLSelectElement>;

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    { placeholder = "Select...", defaultValue, className, children, ...props },
    ref
  ) => {
    const innerRef = useRef<HTMLSelectElement>(null);
    const [isPlaceholder, setIsPlaceholder] = useState(false);

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    );

    useEffect(() => {
      if (innerRef.current && innerRef.current.value === "") {
        setIsPlaceholder(true);
      } else {
        setIsPlaceholder(false);
      }
    }, [innerRef.current?.value]);

    return (
      <div>
        <div
          onFocus={() => innerRef.current?.focus()}
          onBlur={() => innerRef.current?.blur()}
          className={clx(styles.container, className, {
            [styles.placeholder]: isPlaceholder,
          })}
        >
          <select
            ref={innerRef}
            defaultValue={defaultValue}
            {...props}
            className={styles.select}
          >
            <option disabled value="">
              {placeholder}
            </option>
            {children}
          </select>
          <span className={styles.chevron}>
            <ChevronUpDown />
          </span>
        </div>
      </div>
    );
  }
);

NativeSelect.displayName = "NativeSelect";

export default NativeSelect;
