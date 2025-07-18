import { sdk } from "../config"

const currency_code = "inr"

export const filterProducts = async ({
    q,
    minPrice = "0",
    maxPrice = "1000000000",
    category_handle,
    pageParam = 1,
}: {
    q: string
    minPrice?: string
    maxPrice?: string
    category_handle: string
    pageParam: number
}) => {
    const region_id = process.env.NEXT_PUBLIC_REGION_ID
    const response = await sdk.client.fetch<any>(
        `/store/search?region_id=${region_id}&currency_code=${currency_code}&q=${q}&price_min=${minPrice}&price_max=${maxPrice}&category_handle=${category_handle}&offset=${(pageParam - 1) * 20
        }`,
        {
            cache: "no-cache",
        }
    )
    return response?.result?.products as any
}
