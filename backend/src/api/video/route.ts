// src/api/product-videos/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
    filterProductStoriesWorkflow,
    createProductStoryWorkflow,
    deleteProductStoriesWorkflow
} from "../../workflows/video"

// GET endpoint to retrieve product videos by product ID
export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const productId = req.query.product_id as string ?? null

    // if (!productId) {
    //     return res.status(400).json({
    //         message: "product_id is required"
    //     })
    // }

    const { result } = await filterProductStoriesWorkflow(req.scope)
        .run({
            input: {
                product_id: productId
            }
        })

    res.json({
        videos: result.productVideos
    })
}

// POST endpoint to create a new product video
export async function POST(
    req: MedusaRequest<{
        product_id: string,
        url: string
    }>,
    res: MedusaResponse
) {
    const { product_id, url } = req.body

    if (!product_id || !url) {
        return res.status(400).json({
            message: "product_id and url are required"
        })
    }

    const { result } = await createProductStoryWorkflow(req.scope)
        .run({
            input: {
                product_id,
                url
            }
        })

    res.status(201).json({
        video: result.productVideo
    })
}


export async function DELETE(
    req: MedusaRequest<{
        id: string,
    }>,
    res: MedusaResponse
) {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({
            message: "id is required"
        })
    }

    const { result } = await deleteProductStoriesWorkflow(req.scope)
        .run({
            input: {
                id
            }
        })

    res.status(201).json({
        video: result
    })
}



