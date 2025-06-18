
import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { createCarouselWorkflow, getCarouselWorkflow, deleteCarouselWorkflow, updateCarouselWorkflow } from "../../../workflows/carousel"

export const GET = async (
    req: MedusaRequest<any>,
    res: MedusaResponse
) => {
    const { result } = await getCarouselWorkflow(req.scope)
        .run({
            input: {}
        })

    res.json({ carousels: result })
}

export const POST = async (
    req: MedusaRequest<any>,
    res: MedusaResponse
) => {
    const { result } = await createCarouselWorkflow(req.scope)
        .run({
            input: req.body
        })
    res.json({ carousel: result })
}

export const PUT = async (
    req: MedusaRequest<any>,
    res: MedusaResponse
) => {
    const { result } = await updateCarouselWorkflow(req.scope)
        .run({
            input: req.body
        })
    res.json({ brand: result })
}

export const DELETE = async (
    req: MedusaRequest<any>,
    res: MedusaResponse
) => {
    const { result } = await deleteCarouselWorkflow(req.scope)
        .run({
            input: req.body
        })
    res.json({ brand: result })
}