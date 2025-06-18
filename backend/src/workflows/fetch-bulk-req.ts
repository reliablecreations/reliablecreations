import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk"

import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"


export const fetchBulkInfo = createStep(
    "fetch-bulk-info",
    async (input: any, { container }) => {
        const query = container.resolve("query");

        const { data: stock_locations } = await query.graph({
            entity: "stock_location",
            fields: ["id", "name"],
        })

        const { data: sales_channels } = await query.graph({
            entity: "sales_channel",
            fields: ["id", "name"]
        })

        const { data: shipping_profiles } = await query.graph({
            entity: "shipping_profile",
            fields: ["id", "name"]
        })

        if (stock_locations.length == 0 || sales_channels.length == 0 || shipping_profiles.length == 0) {
            throw Error("error fetching bulk info")
        }
        const sp = shipping_profiles[0]
        const sc = sales_channels[0]
        const sl = stock_locations[0]
        return new StepResponse({
            shipping_profile_id: sp.id,
            shipping_location_id: sl.id,
            sales_channel_id: sc.id
        })
    }
)

export const fetchBulkInfoWorkflow = createWorkflow(
    "fetch-bulk-info-work",
    (input: any) => {
        const response = fetchBulkInfo(input)
        return new WorkflowResponse(response)
    })
