import Layout from "@/components/layout/Layout";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout
      headerStyle={1}
      footerStyle={1}
      headTitle="Search"
      breadcrumbTitle="Search"
    >
      {children}
    </Layout>
  );
}
