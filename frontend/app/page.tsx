import Layout from "@/components/layout/Layout";
import Shop from "@/components/sections/Shop";
import { getCarousel } from "@/lib/data/carousel";
import Slider1 from "@/components/sections/Slider1";
import { filterProducts } from "@/lib/data/products";
import DealProduct1 from "@/components/sections/DealProduct1";
import ProductCatalog from "@/components/sections/ProductCatalog";
import Search from "@/components/store-front/search";
import { listProductsWithSort } from "@/lib/data/product";

export const metadata = {
  title: "Reliable Creations - Premium E-commerce Store",
  description:
    "Discover high-quality products at Reliable Creations. Shop our curated collection of premium items with fast shipping and excellent customer service.",
};

export default async function Home() {
  const carousel = await getCarousel();
  // const categories = await listCategories();

  const initialProducts = await filterProducts({
    q: "",
    minPrice: "0",
    maxPrice: "10000",
    category_handle: "all",
    pageParam: 1,
  });

  const products = await listProductsWithSort({
    page: 1,
    queryParams: {
      limit: 10,
    },
    countryCode: "in",
  });

  return (
    <>
      <Layout headerStyle={1} footerStyle={1}>
        <Search mobileonly />
        <Slider1 carousels={carousel} />
        <ProductCatalog
          initialProducts={[
            ...products.response.products,
            ...products.response.products,
            ...products.response.products,
            ...products.response.products,
            ...products.response.products,
          ]}
        />
        <DealProduct1 />
        <Shop />
      </Layout>
    </>
  );
}
