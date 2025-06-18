import { sdk } from "../config"
export const filterProducts = async ({
    q,
    minPrice,
    maxPrice,
    category_handle,
    pageParam = 1,
}: {
    q: string
    minPrice: string
    maxPrice: string
    category_handle: string
    pageParam: number
}) => {
    const region_id = process.env.NEXT_PUBLIC_REGION_ID
    const response = await sdk.client.fetch<any>(
        `/store/search?region_id=${region_id}&currency_code=usd&q=${q}&price_min=${minPrice}&price_max=${maxPrice}&category_handle=${category_handle}&offset=${(pageParam - 1) * 20
        }`,
        {
            cache: "no-cache",
        }
    )
    return response?.result?.products as any
}
