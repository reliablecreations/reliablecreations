import { Metadata } from "next";
import { retrieveCart } from "@/lib/data/cart";
import CartTemplate from "@/modules/cart/templates";
import { retrieveCustomer } from "@/lib/data/customer";
import EmptyCartMessage from "@/modules/cart/components/empty-cart-message";
import Layout from "@/components/layout/Layout";

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
};

export default async function Cart() {
  const cart = await retrieveCart();
  const customer = await retrieveCustomer();

  if (!cart) {
    return (
      <Layout
        headerStyle={1}
        footerStyle={1}
        headTitle="Cart"
        breadcrumbTitle="Cart"
      >
        <EmptyCartMessage />
      </Layout>
    );
  }

  return (
    <Layout
      headerStyle={1}
      footerStyle={1}
      headTitle="Cart"
      breadcrumbTitle="Cart"
    >
      <CartTemplate cart={cart} customer={customer} />
    </Layout>
  );
}
