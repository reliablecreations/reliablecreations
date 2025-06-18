import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

const step1 = createStep(
    "step-1",
    async () => {
        return new StepResponse(`Hello from step one!`)
    }
)

type WorkflowInput = {
    name: string
}

const step2 = createStep(
    "step-2",
    async ({ name }: WorkflowInput) => {
        return new StepResponse(`Hello ${name} from step two!`)
    }
)

const getProductCountStep = createStep(
    "get-product-count",
    async (_, { container }) => {
        const productModuleService = container.resolve("customer")

        const [, count] = await productModuleService.listCustomers()

        // const [] = await productModuleService.

        return new StepResponse(count)
    }
)




import {
    // other imports...
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

// ...

const myWorkflow = createWorkflow(
    "hello-world",
    function (input: WorkflowInput) {
        const str1 = step1()
        // to pass input
        const str2 = step2(input)

        const count = getProductCountStep()

        return new WorkflowResponse({
            message: str2,
            count,
        })
    }
)

export default myWorkflow