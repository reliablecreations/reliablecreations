import { Video } from "./models/video"
import { MedusaService } from "@medusajs/framework/utils"

class VideoModuleService extends MedusaService({
    Video,
}) {

}

export default VideoModuleService