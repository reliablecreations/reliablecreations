import Layout from "@/components/layout/Layout";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // @ts-ignore
    <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Shop Details">
      {children}
    </Layout>
  );
}
