// src/workflows/product-video-workflows.ts
import {
    createWorkflow,
    createStep,
    StepResponse,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

// Define input types for the workflows
export type FilterProductStoriesInput = {
    product_id?: string
}

export type CreateProductStoryInput = {
    product_id: string
    url: string
}

import { VIDEO_MODULE } from "../modules/video"
import VideoModuleService from "../modules/video/service"

// Create a step to filter product stories
const filterProductStoriesStep = createStep(
    "filter-product-stories",
    async (input: FilterProductStoriesInput, { container }) => {
        // Resolve your product-video module service
        const productVideoService: any = container.resolve(VIDEO_MODULE)

        // Query the product videos by product_id
        const productVideos = await productVideoService.listVideos(input.product_id ? {
            product_id: input.product_id
        } : {})

        return new StepResponse({ productVideos })
    }
)

const deleteProductStoriesStep = createStep(
    "delete-product-stories",
    async (input: { id: string }, { container }) => {
        // Resolve your product-video module service
        const productVideoService: any = container.resolve(VIDEO_MODULE)

        // Query the product videos by product_id
        const productVideos = await productVideoService.deleteVideos({
            id: input.id
        })

        return new StepResponse({ productVideos })
    }
)

// Create a step to create a product story
const createProductStoryStep = createStep(
    "create-product-story",
    async (input: CreateProductStoryInput, { container }) => {
        // Resolve your product-video module service
        const productVideoService: any = container.resolve(VIDEO_MODULE)

        // Create the product video
        const productVideo = await productVideoService.createVideos({
            product_id: input.product_id,
            url: input.url
        })

        return new StepResponse({ productVideo }, productVideo.id)
    },
    // Compensation function to handle rollbacks
    async (productVideoId, { container }) => {
        if (!productVideoId) {
            return
        }

        const productVideoService: any = container.resolve(VIDEO_MODULE)
        await productVideoService.deleteVideos(productVideoId)
    }
)




// Create the filter workflow
export const filterProductStoriesWorkflow = createWorkflow(
    "filter-product-stories",
    function (input: FilterProductStoriesInput) {
        const { productVideos } = filterProductStoriesStep(input)

        return new WorkflowResponse({
            productVideos
        })
    }
)

// Create the create workflow
export const createProductStoryWorkflow = createWorkflow(
    "create-product-story",
    function (input: CreateProductStoryInput) {
        const { productVideo } = createProductStoryStep(input)

        return new WorkflowResponse({
            productVideo
        })
    }
)

// Create the delete workflow

export const deleteProductStoriesWorkflow = createWorkflow(
    "delete-product-stories",
    function (input: { id: string }) {
        const { productVideos } = deleteProductStoriesStep(input)

        return new WorkflowResponse({
            productVideos
        })
    }
)