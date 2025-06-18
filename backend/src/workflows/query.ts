import { QueryContext } from "@medusajs/framework/utils";
import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

interface QueryInput {
  q: string;
  region_id: string;
  currency_code: string;
  limit: number;
  offset: number;
  price_min: number;
  price_max: number;
  collection_id: string;
  category_handle: string;
  sort_by: string;
  sort_order: string;
}

const filterProductsStep = createStep(
  "filter-products",
  async (
    {
      q,
      region_id,
      currency_code = "inr",
      limit,
      offset,
      price_min,
      price_max,
      collection_id,
      category_handle,
      sort_by = "title",
      sort_order = "ASC",
    }: QueryInput,
    { container },
  ) => {
    // Resolve your product module service
    const query = container.resolve("query");

    // Build filters object
    const filters: any = {
      ...(q && { q }),
    };

    // Add collection_id filter if provided
    if (collection_id) {
      filters.collection_id = collection_id;
    }

    if (category_handle) {
      filters["categories"] = {
        handle: category_handle,
      };
    }

    const { data } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "subtitle",
        // "is_giftcard",
        // "discountable",
        // "type_id",
        // "weight",
        // "length",
        // "height",
        // "width",
        // "hs_code",
        // "origin_country",
        // "mid_code",
        // "material",
        // "metadata",
        "handle",
        "status",
        "thumbnail",
        // "images.*",
        "collection_id",
        // "categories.*",
        "variants.*",
        "variants.inventory.*",
        "variants.options.*",
        "variants.prices.*",
        "variants.inventory_items.*",
        "variants.calculated_price.*",
        "variants.inventory_quantity",
      ],
      filters,
      context: {
        variants: {
          calculated_price: QueryContext({
            region_id: region_id as string,
            currency_code: currency_code as string,
          }),
        },
      },
      pagination: {
        skip: Number(offset),
        take: Number(limit),
        order: {
          [sort_by as string]: sort_order,
        },
      },
    });

    // filter based on `calculated_price.calculated_amount`
    const filteredProducts = data
      .map((product) => {
        // Filter variants of each product
        const filteredVariants = product.variants.filter((variant) => {
          // @ts-ignore
          const amount = variant.calculated_price?.calculated_amount;
          return (
            (price_min === undefined || amount >= price_min) &&
            (price_max === undefined || amount <= price_max)
          );
        });

        if (filteredVariants.length > 0) {
          return {
            ...product,
            variants: filteredVariants,
          };
        }

        return null;
      })
      .filter((p) => p !== null);

    return new StepResponse({
      limit: limit,
      offset: offset,
      products: filteredProducts,
      count: filteredProducts.length,
    });
  },
);

const queryWorkflow = createWorkflow("product-query", (input: QueryInput) => {
  const products = filterProductsStep(input);
  return new WorkflowResponse(products);
});

export default queryWorkflow;
