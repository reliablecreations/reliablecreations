import "server-only";
import { cookies as nextCookies } from "next/headers";

export const getAuthHeaders = async () => {
  const cookies = await nextCookies();
  const token = cookies.get("_medusa_jwt")?.value;

  if (!token) {
    return {};
  }

  return { authorization: `Bearer ${token}` };
};

export const getCacheTag = async (tag) => {
  try {
    const cookies = await nextCookies();
    const cacheId = cookies.get("_medusa_cache_id")?.value;

    if (!cacheId) {
      return "";
    }

    return `${tag}-${cacheId}`;
  } catch (error) {
    return "";
  }
};

export const getCacheOptions = async (tag) => {
  if (typeof window !== "undefined") {
    return {};
  }

  const cacheTag = await getCacheTag(tag);

  if (!cacheTag) {
    return {};
  }

  return { tags: [`${cacheTag}`] };
};

export const setAuthToken = async (token) => {
  const cookies = await nextCookies();
  cookies.set("_medusa_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

export const removeAuthToken = async () => {
  const cookies = await nextCookies();
  cookies.set("_medusa_jwt", "", {
    maxAge: -1,
  });
};

export const getCartId = async () => {
  const cookies = await nextCookies();
  return cookies.get("_medusa_cart_id")?.value;
};

export const setCartId = async (cartId) => {
  const cookies = await nextCookies();
  cookies.set("_medusa_cart_id", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

export const removeCartId = async () => {
  const cookies = await nextCookies();
  cookies.set("_medusa_cart_id", "", {
    maxAge: -1,
  });
};
