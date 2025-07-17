import { Metadata } from "next";
import LoginForm from "./form";
import { redirect } from "next/navigation";
import { retrieveCustomer } from "@/lib/data/customer";
import Layout from "@/components/layout/Layout";

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
    <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Login">
      <section className="track-area pt-80 pb-40">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-sm-12">
              <div className="tptrack__product mb-40">
                <div className="tptrack__thumb">
                  <img src="/assets/img/banner/login-bg.jpg" alt="" />
                </div>
                <div className="tptrack__content grey-bg-3">
                  <div className="tptrack__item d-flex mb-20">
                    <div className="tptrack__item-icon">
                      <img src="/assets/img/icon/lock.png" alt="" />
                    </div>
                    <div className="tptrack__item-content">
                      <h4 className="tptrack__item-title">Login Here</h4>
                      <p>
                        Your personal data will be used to support your
                        experience throughout this website, to manage access to
                        your account.
                      </p>
                    </div>
                  </div>
                  <LoginForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
