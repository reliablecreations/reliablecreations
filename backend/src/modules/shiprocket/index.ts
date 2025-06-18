import MyShiproketProviders from "./service"
import {
    ModuleProvider,
    Modules
} from "@medusajs/framework/utils"

export default ModuleProvider(Modules.FULFILLMENT, {
    services: [MyShiproketProviders],
})  
