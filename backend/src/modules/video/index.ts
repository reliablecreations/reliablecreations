import { Module } from "@medusajs/framework/utils"
import VideoModuleService from "./service"
export const VIDEO_MODULE = "video"
export default Module(VIDEO_MODULE, {
    service: VideoModuleService,
})