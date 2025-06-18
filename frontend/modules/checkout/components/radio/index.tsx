import styles from "./radio.module.css";

const Radio = ({
  checked,
  "data-testid": dataTestId,
}: {
  checked: boolean;
  "data-testid"?: string;
}) => {
  return (
    <>
      <button
        type="button"
        role="radio"
        aria-checked="true"
        data-state={checked ? "checked" : "unchecked"}
        className={styles.radioButton}
        data-testid={dataTestId || "radio-button"}
      >
        <div className={styles.radioCircle}>
          {checked && (
            <span
              data-state={checked ? "checked" : "unchecked"}
              className={styles.radioDot}
            >
              <div className={styles.radioDotInner}></div>
            </span>
          )}
        </div>
      </button>
    </>
  );
};

export default Radio;
