// src/api/admin/products/bulk-upload/route.ts
import multer from "multer"
import { parse } from "csv-parse/sync"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { fetchBulkInfoWorkflow } from "../../../../workflows/fetch-bulk-req"
import { getVariantInventoryDetailsWorkflow } from "../../../../workflows/bulk-quantity-update"
import { batchProductsWorkflow, createInventoryLevelsWorkflow } from "@medusajs/medusa/core-flows"


// Configure multer middleware for file uploads
const upload = multer({ storage: multer.memoryStorage() })

// Add this to your middlewares.ts file
export const config = {
    matcher: "/admin/products/bulk-upload",
    middlewares: [upload.single("csvFile")]
}

function convertGoogleDriveUrl(url: string): string {
    const match = url.match(/\/file\/d\/([^\/]+)/)
    if (!match) return url

    const fileId = match[1]
    return `https://drive.usercontent.google.com/download?id=${fileId}&export=view&authuser=0`
}

function isGoogleDriveUrl(url: string): boolean {
    return url.includes("drive.google.com")
}

function fixParenthesisSpacing(input) {
    return input
        .replace(/\(\s+/g, '(')  // Remove space(s) after '('
        .replace(/\s+\)/g, ')'); // Remove space(s) before ')'
}

// Helper function to download and upload an image
async function uploadImageFromUrl(url, container) {
    try {
        const processedUrl = isGoogleDriveUrl(url) ? convertGoogleDriveUrl(url) : url
        const response = await fetch(processedUrl);
        if (!response.ok) {
            throw new Error(`Failed to download image from ${processedUrl}`);
        }
        const buffer = await response.arrayBuffer();
        const fileName = `${+new Date()}.jpg`;
        // const filePath = `/static/${fileName}`;

        // Write file to static directory
        const fs = require('fs');
        const path = require('path');

        // Ensure static directory exists
        const staticDir = path.join(process.cwd(), 'static');
        if (!fs.existsSync(staticDir)) {
            fs.mkdirSync(staticDir, { recursive: true });
        }
        // Write file
        fs.writeFileSync(path.join(staticDir, fileName), Buffer.from(buffer));

        const localised_path = `${process.env.MEDUSA_BACKEND_URL}/static/${fileName}`

        return localised_path;

    } catch (error) {
        console.error("Error uploading image:", error)
        return null
    }
}

// Process CSV data and prepare product data
async function processCSVData(csvBuffer, container, shipping_profile_id, sales_channel_id) {
    // Parse CSV data
    const records = parse(csvBuffer, {
        columns: true,
        skip_empty_lines: true
    })

    console.log("records", records)

    // Group records by product
    const productMap = new Map()

    for (const record of records) {
        const productId = record["Product Id"] || null
        const productHandle = record["Product Handle"] || null

        // Use product_id or handle as key
        const key = productId || productHandle || record["Product Title"]

        if (!productMap.has(key)) {
            productMap.set(key, {
                product: {
                    id: productId || undefined,
                    handle: productHandle || undefined,
                    title: `${fixParenthesisSpacing(record["Product Title"])}`,
                    subtitle: record["Product Subtitle"] || undefined,
                    thumbnail: record["Product Thumbnail"] || undefined,
                    shipping_profile_id: shipping_profile_id || undefined,
                    description: record["Product Description"] || undefined,
                    status: record["Product Status"]?.toLowerCase()?.trim() || "draft",
                    width: parseInt(record["Product Width"]) || 0,
                    weight: parseInt(record["Product Weight"]) || 0,
                    length: parseInt(record["Product Length"]) || 0,
                    height: parseInt(record["Product Height"]) || 0,
                    origin_country: record["Product Origin Country"] || undefined,
                    hs_code: record["Product HS Code"] || undefined,
                    mid_code: record["Product MID Code"] || undefined,
                    material: record["Product Material"] || undefined,
                    options: [],
                    variants: [],
                    images: [],
                    categories: record["Product Categories"] && record["Product Categories"]?.split(",").length > 0
                        ? record["Product Categories"]?.split(",").map(category => ({
                            id: category,
                        }))
                        : [],
                    sales_channels: [{
                        id: sales_channel_id
                    }]
                },
                variantMap: new Map(),
                optionMap: new Map(),
                variant_inventory_quantity: record["Variant Inventory Quantity"],
            })
        }


        const productData = productMap.get(key)

        // Process images if present
        if (record["Product Thumbnail"] && record["Product Thumbnail"].startsWith("http")) {
            const uploadedImage = await uploadImageFromUrl(record["Product Thumbnail"], container)
            if (uploadedImage) {
                productData.product.thumbnail = uploadedImage
            } else {
                console.warn(`Thumbnail upload failed for product "${productData.product.title}" — setting status to draft.`)
                productData.product.status = "draft"
            }
        }

        // Process product images
        for (let i = 1; i <= 10; i++) {
            const imageKey = `Image ${i} Url`
            if (record[imageKey] && record[imageKey].startsWith("http")) {
                const uploadedImage = await uploadImageFromUrl(record[imageKey], container)
                if (uploadedImage && !productData.product.images.some(img => img.url === uploadedImage)) {
                    productData.product.images.push({ url: uploadedImage })
                } else if (!uploadedImage) {
                    console.warn(`Product image ${imageKey} upload failed for product "${productData.product.title}" — setting status to draft.`)
                    productData.product.status = "draft"
                }
            }
        }

        // Process variant data if present
        if (record["Variant Id"] || record["Variant Title"]) {
            const variantKey = record["Variant Id"] || record["Variant Title"]

            if (!productData.variantMap.has(variantKey)) {
                const variant = {
                    id: record["Variant Id"] || undefined,
                    title: record["Variant Title"] || undefined,
                    sku: record["Variant SKU"] || undefined,
                    barcode: record["Variant Barcode"] || undefined,
                    ean: record["Variant EAN"] || undefined,
                    upc: record["Variant UPC"] || undefined,
                    weight: parseInt(record["Variant Weight"]) || undefined,
                    length: parseInt(record["Variant Length"]) || undefined,
                    width: parseInt(record["Variant Width"]) || undefined,
                    height: parseInt(record["Variant Height"]) || undefined,
                    hs_code: record["Variant HS Code"] || undefined,
                    origin_country: record["Variant Origin Country"] || undefined,
                    mid_code: record["Variant MID Code"] || undefined,
                    inventory_quantity: record["Variant Inventory Quantity"] || 0,
                    allow_backorder: record["Variant Allow Backorder"].toLowerCase() === "true",
                    manage_inventory: record["Variant Manage Inventory"].toLowerCase() === "true",
                    options: {},
                    prices: []
                }

                productData.variantMap.set(variantKey, variant)
                productData.product.variants.push(variant)
            }

            const variant = productData.variantMap.get(variantKey)

            // Process variant options
            for (let i = 1; i <= 3; i++) {
                const optionNameKey = `Option ${i} Name`
                const optionValueKey = `Option ${i} Value`

                if (record[optionNameKey] && record[optionValueKey]) {
                    const optionName = record[optionNameKey]
                    const optionValue = record[optionValueKey]

                    console.log("optionName", optionName)
                    console.log("optionValue", optionValue)

                    // Add option to product if not exists
                    if (!productData.optionMap.has(optionName)) {
                        productData.optionMap.set(optionName, true)
                        productData.product.options.push({
                            title: optionName,
                            values: [optionValue]
                        })
                    }

                    // Add option value to variant
                    variant.options[optionName] = optionValue
                }
            }

            // Process variant prices
            if (record["Price INR"]) {
                const price = {
                    amount: parseInt(record["Price INR"]), // Convert to cents
                    currency_code: "inr"
                }
                variant.prices.push(price)
            }
        }
    }

    // Prepare data for batch workflow
    const productsToCreate: any[] = []
    const productsToUpdate: any[] = []
    const productsToStock: any[] = []

    for (const [_, data] of productMap) {
        if (data.product.id) {
            productsToUpdate.push(data.product)
        } else {
            productsToCreate.push(data.product)
            productsToStock.push(data)
        }
    }

    console.log("productsToCreate", productsToCreate)
    console.log("productsToUpdate", productsToUpdate)

    return {
        create: productsToCreate,
        update: productsToUpdate,
        stocks: productsToStock
    }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    try {
        // @ts-ignore
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "CSV file is required"
            })
        }

        const { result: bulk_info } = await fetchBulkInfoWorkflow(req.scope).run({
            input: {}
        })

        console.log("bulk_info", bulk_info)
        // Process CSV data
        // @ts-ignore
        const batchData = await processCSVData(req.file.buffer, req.scope, bulk_info.shipping_profile_id, bulk_info.sales_channel_id)
        // console.log("batchData", JSON.stringify(batchData, null, 2))

        // // Execute batch product workflow
        const { result: batchProductResult } = await batchProductsWorkflow(req.scope)
            .run({
                input: batchData
            })

        // console.log("batchData", batchData)
        // console.log("batchProductResult", batchProductResult)
        const { result: inventoryDetailsResult } = await getVariantInventoryDetailsWorkflow(req.scope)
            .run({
                input: {
                    products: batchProductResult.created as any,
                }
            })

        // console.log("results", JSON.stringify(inventoryDetailsResult))
        const { } = await createInventoryLevelsWorkflow(req.scope).run({
            input: {
                inventory_levels: inventoryDetailsResult.map((res, index) => {
                    return {
                        location_id: bulk_info.shipping_location_id,
                        //@ts-ignore
                        inventory_item_id: res.inventory_items?.at(0)?.inventory_item_id as any,
                        stocked_quantity: batchData.stocks.at(index).variant_inventory_quantity ?? 10
                    }
                })
            }
        })
        return res.status(200).json({
            success: true,
            message: "Products imported successfully",
            result: {
                created: batchProductResult.created.length,
                updated: batchProductResult.updated.length
            }
        })
    } catch (error) {
        console.error("Error in bulk upload:", error)
        return res.status(500).json({
            success: false,
            message: "An error occurred during product import",
            error: error.message
        })
    }
}