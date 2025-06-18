import { Toaster } from "@medusajs/ui";
import { retrieveCustomer } from "@/lib/data/customer";
import AccountLayout from "@/modules/account/templates/account-layout";
import Layout from "@/components/layout/Layout";

export default async function AccountPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await retrieveCustomer().catch(() => null);

  return (
    <Layout
      headerStyle={1}
      footerStyle={1}
      headTitle="Account"
      breadcrumbTitle="Account"
    >
      <AccountLayout customer={customer}>
        {children}
        <Toaster />
      </AccountLayout>
    </Layout>
  );
}
