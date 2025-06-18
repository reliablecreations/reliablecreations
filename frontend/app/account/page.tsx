import { Metadata } from "next";

// import Overview from "@/app/account/components/overview"
import { notFound } from "next/navigation";
import { listOrders } from "@/lib/data/orders";
import { retrieveCustomer } from "@/lib/data/customer";
import Overview from "@/modules/account/components/overview";

export const metadata: Metadata = {
  title: "Account",
  description: "Overview of your account activity.",
};

export default async function OverviewTemplate() {
  const customer = await retrieveCustomer().catch(() => null);
  const orders = (await listOrders().catch(() => null)) || null;

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <Overview customer={customer} orders={orders} />
    </div>
  );
}
