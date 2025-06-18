"use client";
import { retrieveCart } from "@/lib/data/cart";
import { useQuery } from "react-query";

export default function CartShow() {
  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: () => retrieveCart(),
  });

  const totalItems =
    cart?.items?.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0) || 0;

  return (
    <>
      <span className="tp-product-count">{totalItems}</span>
    </>
  );
}
