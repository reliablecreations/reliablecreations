import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"


interface WorkflowInput {
    email: string
}

const filterCustomer = createStep(
    "filter-customer",
    async ({ email }: { email: string }, { container }) => {
        const customerModuleService = container.resolve("customer");

        const [customer] = await customerModuleService.listCustomers({
            email: email,
        },)

        return new StepResponse({
            customer: customer,
        })
    }
)

const filterCustomerFlow = createWorkflow(
    "filter-customer-flow",
    function (params: WorkflowInput) {
        const customer = filterCustomer(params)
        return new WorkflowResponse({
            customer,
        })
    }
)

export default filterCustomerFlow