import { Disclosure } from "@headlessui/react";
import { Badge, Button, clx } from "@medusajs/ui";
import { useEffect } from "react";
import styles from "./styles.module.css";

import useToggleState from "@/lib/hooks/use-toggle-state";
import { useFormStatus } from "react-dom";

type AccountInfoProps = {
  label: string;
  currentInfo: string | React.ReactNode;
  isSuccess?: boolean;
  isError?: boolean;
  errorMessage?: string;
  clearState: () => void;
  children?: React.ReactNode;
  "data-testid"?: string;
};

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  "data-testid": dataTestid,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState();

  const { pending } = useFormStatus();

  const handleToggle = () => {
    clearState();
    setTimeout(() => toggle(), 100);
  };

  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess, close]);

  return (
    <div className={styles.container} data-testid={dataTestid}>
      <div className={styles.header}>
        <div className={styles.infoContainer}>
          <span className={styles.label}>{label}</span>
          <div className={styles.currentInfo}>
            {typeof currentInfo === "string" ? (
              <span
                className={styles.currentInfoText}
                data-testid="current-info"
              >
                {currentInfo}
              </span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <div>
          <Button
            variant="secondary"
            className={styles.editButton}
            onClick={handleToggle}
            type={state ? "reset" : "button"}
            data-testid="edit-button"
            data-active={state}
          >
            {state ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Success state */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(styles.panel, {
            [styles.panelVisible]: isSuccess,
            [styles.panelHidden]: !isSuccess,
          })}
          data-testid="success-message"
        >
          <Badge className={styles.badge} color="green">
            <span>{label} updated succesfully</span>
          </Badge>
        </Disclosure.Panel>
      </Disclosure>

      {/* Error state  */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(styles.panel, {
            [styles.panelVisible]: isError,
            [styles.panelHidden]: !isError,
          })}
          data-testid="error-message"
        >
          <Badge className={styles.badge} color="red">
            <span>{errorMessage}</span>
          </Badge>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(styles.panel, styles.panelOverflow, {
            [styles.panelVisible]: state,
            [styles.panelHidden]: !state,
          })}
        >
          <div className={styles.formContainer}>
            <div>{children}</div>
            <div className={styles.buttonContainer}>
              <button
                disabled={pending}
                className={styles.saveButton}
                type="submit"
                data-testid="save-button"
              >
                Save changes
              </button>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  );
};

export default AccountInfo;
