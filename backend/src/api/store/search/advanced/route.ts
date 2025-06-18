// src/api/store/search/products/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, QueryContext } from "@medusajs/framework/utils"

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const {
        q,
        limit = 20,
        offset = 0,
        price_min,
        price_max,
        collection_id,
        category_handle,
        region_id,
        currency_code = "inr", // Still needed for price filtering
        sort_by = "title",
        sort_order = "ASC",
    } = req.query || {}

    if (!region_id && !currency_code) {
        return res.status(400).json({
            message: "Region ID and currency code are required for price filtering"
        })
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Build filters object
    const filters: any = {
        ...(q && { q }),
    }

    // Add collection_id filter if provided
    if (collection_id) {
        filters.collection_id = collection_id
    }

    if (category_handle) {
        filters["categories"] = {
            handle: category_handle,
        }
    }

    const {
        data: products,
    } = await query.graph({
        entity: "product",
        fields: [
            "id",
            "title",
            "subtitle",
            "is_giftcard",
            "discountable",
            "type_id",
            "weight",
            "length",
            "height",
            "width",
            "hs_code",
            "origin_country",
            "mid_code",
            "material",
            "metadata",
            "handle",
            "status",
            "thumbnail",
            "options.*",
            "images.*",
            "options.values.*",
            "collection_id",
            "categories.*",
            "variants.sku",
            "variants.id",
            "variants.options.*",
            "variants.prices.*",
            "variants.calculated_price.*",
            "variants.inventory_quantity",
            "metadata.*",
            "tags.*"
        ],
        filters,
        context: {
            variants: {
                calculated_price: QueryContext({
                    region_id: region_id as string,
                    currency_code: currency_code as string,
                }),
            }
        },
        pagination: {
            skip: Number(offset),
            take: Number(limit),
            order: {
                [sort_by as string]: sort_order,
            },
        },
    })

    // Filter products by price range if price_min or price_max is provided
    let filteredProducts = products
    if (price_min || price_max) {
        filteredProducts = products.filter(product => {
            // Find variants with prices in the specified currency
            const variantPrices = product.variants.flatMap((variant: any) =>
                variant.prices.filter(price =>
                    price.currency_code === currency_code
                )
            )

            if (variantPrices.length === 0) return false

            // Find the lowest price among all variants for this currency
            const lowestPrice = Math.min(
                ...variantPrices.map(price => price.amount || Infinity)
            )

            // Apply price filters
            if (price_min && price_max) {
                return lowestPrice >= Number(price_min) && lowestPrice <= Number(price_max)
            } else if (price_min) {
                return lowestPrice >= Number(price_min)
            } else if (price_max) {
                return lowestPrice <= Number(price_max)
            }

            return true
        })
    }

    res.json({
        products: filteredProducts,
        count: filteredProducts.length,
        limit: Number(limit),
        offset: Number(offset),
    })
}