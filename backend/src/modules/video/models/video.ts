import { model } from "@medusajs/framework/utils"

export const Video = model.define("video", {
    id: model.id().primaryKey(),
    url: model.text(),
    product_id: model.text(),
})