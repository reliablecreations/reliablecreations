"use client";
// import "react-phone-number-input/style.css";
import { useState, useEffect } from "react";
import { sdk } from "@/lib/config";
import { directLogin } from "@/lib/data/customer";
import styles from "./form.module.css";

// Firebase auth
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import Timer from "./timer";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [otpTimeout, setOtpTimeout] = useState(true);
  const [phone, setPhone] = useState("+911111111111");
  const [otp, setOtp] = useState("111111");
  const [showOtpView, setShowOtpView] = useState(false);

  async function sendOtp() {
    try {
      setLoading(true);
      // remove plus from front
      const phoneNumber = phone.replace("+", "");

      // validate mobile number
      if (phoneNumber.length != 12) {
        alert("Please enter a valid mobile number");
        return;
      }

      if (typeof window !== "undefined") {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          `+${phoneNumber}`,
          window.recaptchaVerifier
        );
        window.confirmationResult = confirmationResult;
      }

      setShowOtpView(true);
    } catch (err) {
      console.log(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);

      if (typeof window !== "undefined") {
        // @ts-ignore
        await window.confirmationResult.confirm(otp);
      }
      const email = `${phone}@gmail.com`;

      const formdata = new FormData();
      formdata.append("email", email);
      formdata.append("phone", phone);

      const customer: any = await sdk.client.fetch(`/store/custom`, {
        method: "POST",
        body: {
          email,
        },
      });
      const state = customer?.data?.customer ? "login" : "register";
      await directLogin(null, formdata, state);

      if (typeof window !== "undefined") {
        window.location.replace("/account");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
        size: "invisible",
        callback: (response: any) => {
          console.log(response);
        },
      });
    }
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        {!showOtpView ? (
          <div className="tptrack__id mb-10">
            <div className={styles.phoneInputWrapper}>
              <PhoneInput
                country="IN"
                value={phone}
                onChange={setPhone}
                inputClass="form-control"
                containerClass="react-tel-input"
                buttonClass="flag-dropdown"
              />
            </div>
          </div>
        ) : (
          <div className={`${styles.otpInputWrapper} tptrack__email mb-10`}>
            <span>
              <i className="fal fa-key" />
            </span>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
          </div>
        )}

        {!showOtpView ? (
          <div className="tptrack__btn">
            <button
              type="button"
              disabled={loading}
              onClick={sendOtp}
              className="tptrack__submition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
              <i className="fal fa-long-arrow-right" />
            </button>
          </div>
        ) : (
          <div className="tptrack__btn">
            <button
              type="submit"
              disabled={loading}
              className="tptrack__submition"
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
              <i className="fal fa-long-arrow-right" />
            </button>
          </div>
        )}

        {showOtpView && (
          <div className="mb-10">
            <Timer
              loading={loading}
              handleResend={sendOtp}
              otpTimeout={otpTimeout}
              setOtpTimeout={setOtpTimeout}
            />
          </div>
        )}
      </form>

      <div className="tpsign__account mb-15">
        <p className="text-center">
          I accept that I have read & understood Gokwik's
          <Link href="/privacy-policy" className="text-primary">
            {" "}
            Privacy Policy
          </Link>
          , and
          <Link href="/terms-and-condition" className="text-primary">
            {" "}
            T&Cs
          </Link>
          .
        </p>
      </div>

      <div className="tpsign__pass text-center">
        <Link href="/contact">Trouble logging in?</Link>
      </div>

      <div id="sign-in-button"></div>
    </>
  );
}
