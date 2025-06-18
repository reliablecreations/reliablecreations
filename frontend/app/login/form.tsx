"use client";
// import "react-phone-number-input/style.css";
import { useState, useEffect } from "react";
import { sdk } from "@/lib/config";
import { directLogin } from "@/lib/data/customer";
import Image from "next/image";
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
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
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

      // if (typeof window !== "undefined") {
      //   const confirmationResult = await signInWithPhoneNumber(
      //     auth,
      //     `+${phoneNumber}`,
      //     window.recaptchaVerifier
      //   );
      //   window.confirmationResult = confirmationResult;
      // }

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

      // if (typeof window !== "undefined") {
      //   // @ts-ignore
      //   await window.confirmationResult.confirm(otp);
      // }
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
        window.location.replace("/");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     // @ts-ignore
  //     window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
  //       size: "invisible",
  //       callback: (response: any) => {
  //         console.log(response);
  //       },
  //     });
  //   }
  // }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <div className={styles.logoContainer}>
            <h3 className={styles.logo}>Yakaawa</h3>
            <p className={styles.tagline}>
              Enjoy hassle free shopping with Yakaawa
            </p>
          </div>

          <h2 className={styles.welcomeText}>
            Welcome to Yakaawa! Register to avail the best deals!
          </h2>

          <div className={styles.features}>
            <div className={styles.featureCard}>
              <div className={styles.star}>★</div>
              <h3>Hassle Free Shopping</h3>
              <p>Enjoy hassle free shopping with Yakaawa</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.star}>★</div>
              <h3>Lowest price guaranteed</h3>
              <p>Explore unbeatable prices and unmatchable value</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.star}>★</div>
              <h3>100% secure & spam free</h3>
              <p>Guaranteed data protection & spam-free inbox</p>
            </div>
          </div>
        </div>

        <div className={styles.rightSide}>
          <h2 className={styles.title}>Unlock</h2>
          <h3 className={styles.subtitle}>Superior Discounts</h3>

          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {!showOtpView ? (
                <div
                  className={`${styles.inputWrapper} ${styles.phoneInputWrapper}`}
                >
                  <PhoneInput
                    inputClass={styles.phoneInput}
                    country="IN"
                    value={phone}
                    onChange={setPhone}
                  />
                </div>
              ) : (
                <div className={styles.inputWrapper}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
              )}

              {!showOtpView ? (
                <button
                  type="button"
                  disabled={loading}
                  onClick={sendOtp}
                  className={styles.button}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={styles.button}
                >
                  {loading ? "Verifying OTP..." : "Verify OTP"}
                </button>
              )}

              {showOtpView && (
                <Timer
                  loading={loading}
                  handleResend={sendOtp}
                  otpTimeout={otpTimeout}
                  setOtpTimeout={setOtpTimeout}
                />
              )}
            </form>
          </div>

          <div className={styles.separator}>
            <Separator />
            <span className={styles.orText}>OR</span>
          </div>

          <p className={styles.terms}>
            I accept that I have read & understood Gokwik's
            <Link href="/privacy-policy" className={styles.link}>
              {" "}
              Privacy Policy
            </Link>
            , and
            <Link href="/terms-and-condition" className={styles.link}>
              {" "}
              T&Cs
            </Link>
            .
          </p>

          <div className={styles.helpLink}>
            <Link href="/contact" className={styles.link}>
              Trouble logging in?
            </Link>
          </div>
        </div>
      </div>
      <div id="sign-in-button"></div>
    </>
  );
}

const Separator = () => {
  return <div className={styles.separator}></div>;
};
