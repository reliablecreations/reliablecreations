import { ChangeEvent, useState } from "react";
import { sdk } from "../lib/config";
import { toast } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { AdminProduct, DetailWidgetProps } from "@medusajs/types";
import { Button, Container, Divider, Heading, Input } from "@medusajs/ui";
import { X } from "lucide-react";
import { UploadImageOnAWS } from "../lib/image-uploader";

const StoryProductWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const {
    data: video_response,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: async () => {
      return sdk.client.fetch(`/video?product_id=${data.id}`, {
        method: "GET",
      }) as any;
    },
    queryKey: ["videos"],
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null)

  const handleAddStory = async () => {
    try {
      setIsSubmitting(true);
      if (!file) {
        return toast.error("Please select file")
      }
      const res = await UploadImageOnAWS(file)
      const url = res?.url || ""
      await sdk.client.fetch(`/video`, {
        method: "POST",
        body: {
          url: url,
          product_id: data.id,
        },
      });
      toast.success("Video added successfully");
      setFile(null);
      setFilePreview(null)
      refetch();
      // You might want to refresh the list of stories here
    } catch (error) {
      toast.error("Failed to add video");
      console.error("Failed to add story:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const previewUrl = URL.createObjectURL(file)
      setFile(file)
      setFilePreview(previewUrl)
    }
  }

  return (
    <Container>
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Product Videos</Heading>
      </div>
      <div className="px-6 pb-6">
        <div className="flex gap-2 mb-4">
          {
            !filePreview ? <> <Input
              type="file"
              // className="hidden"
              accept="video/*"
              onChange={(e) => handleFileChange(e)}
            /></> : <div className="flex flex-col gap-2 w-full items-center">
              <div>
                <video
                  src={filePreview || "/placeholder.svg"}
                  controls
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => {
                    setFile(null);
                    setFilePreview(null)
                    URL.revokeObjectURL(filePreview)
                  }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Button
                variant="primary"
                size="small"
                onClick={handleAddStory}
                isLoading={isSubmitting}
              >
                Upload Story
              </Button>
            </div>
          }

        </div>
        <Divider />
        {!isLoading && (
          <div className="grid grid-cols-2 gap-5 mt-5">
            {video_response?.videos?.map((video: any, index: number) => {
              return (
                <VideoComponent key={index} video={video} refetch={refetch} />
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
};

const VideoComponent = ({ video, refetch }: any) => {
  const [loading, setLoading] = useState(false);
  const handleDeleteStory = async (videoId: string) => {
    setLoading(true);
    try {
      // Send request to your custom API endpoint
      await sdk.client.fetch(`/video`, {
        method: "DELETE",
        body: {
          id: videoId,
        },
      });
      toast.success("Video deleted successfully");
      refetch();
      // You might want to refresh the list of stories here
    } catch (error) {
      toast.error("Failed to delete video");
      console.error("Failed to delete story:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="relative p-5 border space-y-2">
      <video className="w-full h-auto" src={video?.url} controls></video>
      <Button
        size="small"
        variant="danger"
        disabled={loading}
        onClick={() => handleDeleteStory(video.id)}
      >
        {loading ? "..." : "Delete"}
      </Button>
    </Container>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default StoryProductWidget;
