import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";

import NativeSelect, {
  NativeSelectProps,
} from "@/components/store-front/native-select";
import { HttpTypes } from "@medusajs/types";
import styles from "./country-select.module.css";

const CountrySelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps & {
    region?: HttpTypes.StoreRegion;
    label?: string;
  }
>(({ placeholder = "Country", region, defaultValue, label, ...props }, ref) => {
  const innerRef = useRef<HTMLSelectElement>(null);

  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
    ref,
    () => innerRef.current
  );

  const countryOptions = useMemo(() => {
    if (!region) {
      return [];
    }

    return region.countries?.map((country) => ({
      value: country.iso_2,
      label: country.display_name,
    }));
  }, [region]);

  return (
    <div>
      {label && <label className={styles.label}>{label}</label>}
      <NativeSelect
        ref={innerRef}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...props}
      >
        {countryOptions?.map(({ value, label }, index) => (
          <option key={index} value={value}>
            {label}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
});

CountrySelect.displayName = "CountrySelect";

export default CountrySelect;
