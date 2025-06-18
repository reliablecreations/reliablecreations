import styles from "./error-message.module.css";

const ErrorMessage = ({
  error,
  "data-testid": dataTestid,
}: {
  error?: string | null;
  "data-testid"?: string;
}) => {
  if (!error) {
    return null;
  }

  return (
    <div className={styles.error} data-testid={dataTestid}>
      <span>{error}</span>
    </div>
  );
};

export default ErrorMessage;
