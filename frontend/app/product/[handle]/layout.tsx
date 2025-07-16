import Layout from "@/components/layout/Layout";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // @ts-ignore
    <Layout headerStyle={1} footerStyle={1}>
      {children}
    </Layout>
  );
}
