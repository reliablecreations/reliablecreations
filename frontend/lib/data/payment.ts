"use server"

import { sdk } from "@/lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"



export const FetchlistCartPaymentMethods = async (regionId: string) => {
    const headers = {
        ...(await getAuthHeaders()),
    }

    const next = {
        ...(await getCacheOptions("payment_providers")),
    }

    // return fetch(
    //   `${process.env.MEDUSA_BACKEND_URL}/store/payment-providers?region_id=${regionId}`,
    //   {
    //     method: "GET",
    //     headers,
    //     next,
    //     cache: "force-cache",
    //   }
    // )
    //   .then(({ payment_providers }: any) =>
    //     payment_providers.sort((a: any, b: any) => {
    //       return a.id > b.id ? 1 : -1
    //     })
    //   )
    //   .catch(() => {
    //     return null
    //   })

    const response = await sdk.client
        .fetch<HttpTypes.StorePaymentProviderListResponse>(
            `/store/payment-providers`,
            {
                method: "GET",
                query: { region_id: regionId },
                headers,
                next,
                cache: "force-cache",
            }
        )

    return response.payment_providers
}

export const listCartPaymentMethods = async (regionId: string) => {
    const headers = {
        ...(await getAuthHeaders()),
    }

    const next = {
        ...(await getCacheOptions("payment_providers")),
    }

    return sdk.client
        .fetch<HttpTypes.StorePaymentProviderListResponse>(
            `/store/payment-providers`,
            {
                method: "GET",
                query: { region_id: regionId },
                headers,
                next,
                cache: "force-cache",
            }
        )
        .then(({ payment_providers }) =>
            payment_providers.sort((a, b) => {
                return a.id > b.id ? 1 : -1
            })
        )
        .catch(() => {
            return null
        })
}
