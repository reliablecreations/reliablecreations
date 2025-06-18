import {
    createStep,
    StepResponse,
} from "@medusajs/framework/workflows-sdk"

import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { CAROUSEL_MODULE } from "../modules/carousel"
import BrandModuleService from "../modules/carousel/service"

export const createCarouselStep = createStep(
    "create-carousel-step",
    async (input: any, { container }) => {
        const brandModuleService: BrandModuleService = container.resolve(
            CAROUSEL_MODULE
        )
        const brand = await brandModuleService.createCarousels(input)
        return new StepResponse(brand, brand.id)
    }
)

export const getCarouselStep = createStep(
    "get-carousel-step",
    async (input: any, { container }) => {
        const brandModuleService: BrandModuleService = container.resolve(
            CAROUSEL_MODULE
        )
        const brand = await brandModuleService.listCarousels()
        return new StepResponse(brand)
    }
)

export const updateCarouselStep = createStep(
    "update-carousel-step",
    async (input: any, { container }) => {
        const brandModuleService: BrandModuleService = container.resolve(
            CAROUSEL_MODULE
        )
        const brand = await brandModuleService.updateCarousels(input)
        return new StepResponse(brand, brand.id)
    }
)


export const deleteCarouselStep = createStep(
    "delete-carousel-step",
    async (input: any, { container }) => {
        const brandModuleService: BrandModuleService = container.resolve(
            CAROUSEL_MODULE
        )
        const brand = await brandModuleService.deleteCarousels(input)
        return new StepResponse(brand)
    })

export const createCarouselWorkflow = createWorkflow(
    "create-carousel",
    (input: any) => {
        const brand = createCarouselStep(input)
        return new WorkflowResponse(brand)
    })

export const getCarouselWorkflow = createWorkflow(
    "get-carousel",
    (input: any) => {
        const brand = getCarouselStep(input)
        return new WorkflowResponse(brand)
    })

export const updateCarouselWorkflow = createWorkflow(
    "update-carousel",
    (input: any) => {
        const brand = updateCarouselStep(input)
        return new WorkflowResponse(brand)
    })

export const deleteCarouselWorkflow = createWorkflow(
    "delete-carousel",
    (input: any) => {
        const brand = deleteCarouselStep(input)
        return new WorkflowResponse(brand)
    })
