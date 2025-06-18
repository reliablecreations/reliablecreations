import { useEffect, useState } from "react";
import { BiTime } from "react-icons/bi";

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
    <button
      type="submit"
      className="w-full"
      onClick={handleResend}
      disabled={otpTimeout || loading}
    >
      Resent Otp in{" "}
      {otpTimeout && (
        <>
          <BiTime /> {seconds}
        </>
      )}
    </button>
  );
};

export default Timer;
