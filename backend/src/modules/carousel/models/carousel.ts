import { model } from "@medusajs/framework/utils"

export const Carousel = model.define("carousel", {
    id: model.id().primaryKey(),
    url: model.text(),
    url2: model.text(),
})