"use client";

import { useQuery } from "react-query";
import { getCarousel } from "@/lib/data/carousel";

const TestPage = () => {
  const { data, isLoading, error } = useQuery("carousel", getCarousel);
  return <div>{JSON.stringify(data)}</div>;
};

export default TestPage;
