import { sdk } from "@/lib/config";

export const getCarousel = async () => {
  try {
    const res = await sdk.client.fetch(`/store/carousel`, {
      cache: "force-cache",
    });
    console.log(res);
    return res.carousels || [];
  } catch (error) {
    console.log("Carousel fetch ERROR", error);
    return [];
  }
};

// [{"id":"01JW8JS5SB843DGZ2WMD6QJCSA","url":"https://myckc.s3.us-east-1.amazonaws.com/uploads/Sri-Hanuman-uhd-32k-pictures.jpg","url2":"https://myckc.s3.us-east-1.amazonaws.com/uploads/Sri-Hanuman-uhd-32k-pictures.jpg","created_at":"2025-05-27T09:57:04.427Z","updated_at":"2025-05-27T09:57:04.427Z","deleted_at":null}]
