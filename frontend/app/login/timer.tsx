import { useEffect, useState } from "react";
import { BiTime } from "react-icons/bi";
import styles from "./form.module.css";

interface TimerProps {
  loading: boolean;
  otpTimeout: boolean;
  handleResend: () => void;
  setOtpTimeout: (otpTimeout: boolean) => void;
}

const Timer: React.FC<TimerProps> = ({
  loading,
  otpTimeout,
  setOtpTimeout,
  handleResend,
}) => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (otpTimeout) {
      const interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else {
          setOtpTimeout(false);
          setSeconds(60);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [otpTimeout, seconds]);

  return (
    <div className={styles.timerContainer}>
      {otpTimeout ? (
        <div className={styles.timerDisplay}>
          <i className="fal fa-clock"></i>
          <span>Resend OTP in {seconds}s</span>
        </div>
      ) : (
        <button
          type="button"
          className={`${styles.resendButton} tptrack__submition`}
          onClick={handleResend}
          disabled={loading}
        >
          {loading ? "Sending..." : "Resend OTP"}
          <i className="fal fa-redo" />
        </button>
      )}
    </div>
  );
};

export default Timer;
