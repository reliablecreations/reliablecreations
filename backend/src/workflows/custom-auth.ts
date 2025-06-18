import { generateJwtToken } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

interface WorkflowInput {
    phone: string
}

const handleCustomer = createStep(
    "handle-customer",
    async ({ phone }: { phone: string }, { container }) => {
        const cutomized_mail = `${phone}@gmail.com`

        const AuthModule = container.resolve("auth")
        const customerModuleService = container.resolve("customer");

        const [customer] = await customerModuleService.listCustomers({
            email: cutomized_mail,
        })

        console.log(customer)

        if (!customer) {
            const customer = await customerModuleService.createCustomers({
                email: cutomized_mail,
                phone: phone
            })

            const authIdentities = await AuthModule.createAuthIdentities([
                {
                    provider_identities: [{
                        provider: "emailpass",
                        entity_id: cutomized_mail
                    }]
                },
            ])

            const tokenPayload = {
                "actor_id": customer.id,
                "actor_type": "customer",
                // @ts-ignore
                "auth_identity_id": authIdentities[0]?.id,
                "app_metadata": { "customer_id": customer.id },
            }

            const token = generateJwtToken(tokenPayload, {
                secret: process.env.JWT_SECRET,
                expiresIn: "7d",
            })

            const data = {
                ...customer,
                token,
            }

            return new StepResponse({
                customer: data,
            })
        }
        // const retrivedAuthIdentities = await AuthModule.listAuthIdentities({
        //     app_metadata: {
        //         customer_id: customer.id
        //     }
        // })
        // console.log(retrivedAuthIdentities)

        const tokenPayload = {
            "actor_id": customer.id,
            "actor_type": "customer",
            // @ts-ignore
            "auth_identity_id": "auth",
            "app_metadata": { "customer_id": customer.id },
        }

        const token = generateJwtToken(tokenPayload, {
            secret: process.env.JWT_SECRET,
            expiresIn: "7d",
        })

        const data = {
            ...customer,
            token,
        }

        return new StepResponse({
            customer: data
        })
    })

const customAuth = createWorkflow(
    "custom-auth",
    function (params: WorkflowInput) {
        const customer = handleCustomer(params)

        return new WorkflowResponse({
            customer,
        })
    }
)

export default customAuth