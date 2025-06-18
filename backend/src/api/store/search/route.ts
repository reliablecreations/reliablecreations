// src/api/store/search/products/route.ts
import queryWorkflow from "../../../workflows/query"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

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

    const { result } = await queryWorkflow(req.scope)
        .run({
            input: {
                q,
                region_id,
                currency_code,
                limit,
                offset,
                price_min,
                price_max,
                collection_id,
                category_handle,
                sort_by,
                sort_order,
            } as any
        })
    res.json({ result })
}
