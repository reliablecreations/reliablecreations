import { Metadata } from "next";
import LoginForm from "./form";
import { redirect } from "next/navigation";
import { retrieveCustomer } from "@/lib/data/customer";
export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const Login = async () => {
  const customer = await retrieveCustomer();
  if (customer) {
    redirect("/account");
  }
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <LoginForm />
    </div>
  );
};

export default Login;
