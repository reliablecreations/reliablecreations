import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk"

import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

interface Input {
    products: {
        variants: {
            id: string
        }[]
    }[],
}

export const getVariantInventoryDetailsStep = createStep(
    "get-inventory-details",
    async (input: Input, { container }) => {
        const variantsIds = input.products.map(i => i.variants.map(v => v.id))
        const flattenVarientsIds = variantsIds.flat()
        console.log("flatten", flattenVarientsIds)
        const query = container.resolve("query");
        const { data } = await query.graph({
            entity: "variant",
            fields: [
                "id",
                "inventory_items.inventory_item_id",
                "inventory_items.id"
            ],
            filters: {
                id: flattenVarientsIds
            }
        })
        return new StepResponse(
            data)
    }
)

export const getVariantInventoryDetailsWorkflow = createWorkflow(
    "updateQty",
    (input: Input) => {
        const response = getVariantInventoryDetailsStep(input)
        return new WorkflowResponse(response)
    })
