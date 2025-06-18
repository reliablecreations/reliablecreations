import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRegion } from "@/lib/data/regions";
import { listProducts } from "@/lib/data/product";
import ProductTemplate from "@/modules/product/templates/product-detail";

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const country_code = "in";
  const params = await props.params;
  const { handle } = params;
  const region = await getRegion(country_code);

  if (!region) {
    notFound();
  }

  const product = await listProducts({
    countryCode: country_code,
    // @ts-ignore
    queryParams: { handle },
  }).then(({ response }) => response.products[0]);

  if (!product) {
    notFound();
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

export default async function Product(props: Props) {
  const country_code = "in";
  const params = await props.params;
  const region = await getRegion(country_code);

  if (!region) {
    notFound();
  }

  const pricedProduct = await listProducts({
    regionId: region.id,
    countryCode: country_code,
    // @ts-ignore
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0]);

  if (!pricedProduct) {
    notFound();
  }

  return (
    <div>
      <ProductTemplate data={pricedProduct} />
      {/* <Suspense fallback={null}>
        <RelatedProducts data={pricedProduct as any} />
      </Suspense> */}
    </div>
  );
}
