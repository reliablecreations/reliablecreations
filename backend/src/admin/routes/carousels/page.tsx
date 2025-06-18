import { defineRouteConfig } from "@medusajs/admin-sdk";
import { CircleSliders } from "@medusajs/icons";
import { Button, Container, FocusModal } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Check, Upload, X } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { sdk } from "../../lib/config";
import { UploadImageOnAWS } from "../../lib/image-uploader";
import { toast } from "@medusajs/ui";
type ImageType = "large" | "small"
const CustomPage = () => {

  const [largeImage, setLargeImage] = useState<File | null>(null)
  const [smallImage, setSmallImage] = useState<File | null>(null)
  const [largePreview, setLargePreview] = useState<string | null>(null)
  const [smallPreview, setSmallPreview] = useState<string | null>(null)
  const [draggingOver, setDraggingOver] = useState<ImageType | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [isUploading, setIsUploading] = useState(false)
  const largeInputRef = useRef<HTMLInputElement>(null)
  const smallInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: ImageType) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type.startsWith("image/")) {
        handleImageUpload(file, type)
      }
    }
  }

  const handleImageUpload = (file: File, type: ImageType) => {
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)

    if (type === "large") {
      // Revoke previous object URL to prevent memory leaks
      if (largePreview) URL.revokeObjectURL(largePreview)
      setLargeImage(file)
      setLargePreview(previewUrl)
    } else {
      if (smallPreview) URL.revokeObjectURL(smallPreview)
      setSmallImage(file)
      setSmallPreview(previewUrl)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>, type: ImageType) => {
    e.preventDefault()
    setDraggingOver(type)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDraggingOver(null)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, type: ImageType) => {
    e.preventDefault()
    setDraggingOver(null)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        handleImageUpload(file, type)
      }
    }
  }

  const removeImage = (type: ImageType) => {
    if (type === "large") {
      if (largePreview) URL.revokeObjectURL(largePreview)
      setLargeImage(null)
      setLargePreview(null)
    } else {
      if (smallPreview) URL.revokeObjectURL(smallPreview)
      setSmallImage(null)
      setSmallPreview(null)
    }
  }

  const triggerFileInput = (type: ImageType) => {
    if (type === "large") {
      largeInputRef.current?.click()
    } else {
      smallInputRef.current?.click()
    }
  }

  /* -------------------------------------------------------------------------- */
  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => {
      return sdk.client.fetch("/carousels", {
        method: "GET",
      }) as any;
    },
    queryKey: ["carousels"],
  });

  const handleAdd = async () => {
    try {
      setIsUploading(true)
      setUploadStatus("uploading");
      let largeImageUrl;
      if (largeImage) {
        const res = await UploadImageOnAWS(largeImage)
        const url = res?.url || ""
        largeImageUrl = url
      }
      let smallImageUrl;
      if (smallImage) {
        const res = await UploadImageOnAWS(smallImage)
        const url = res?.url || ""
        smallImageUrl = url
      }
      if (!smallImageUrl && !largeImageUrl) {
        return setUploadStatus("error")
      }
      await sdk.client.fetch("/carousels", {
        method: "POST",
        body: {
          url: smallImageUrl,
          url2: largeImageUrl,
        },
      });
      setUploadStatus("success")
      setModalOpen(false)
      refetch()
      setLargeImage(null)
      setLargePreview(null)
      setSmallImage(null);
      setSmallPreview(null)
    } catch (error) {
      setUploadStatus("error")
    } finally {
      setIsUploading(false)
    }
  };
  const [loading, setLoading] = useState(false);

  const handleDeleteCarousel = async (Id: string) => {
    setLoading(true);
    try {
      // Send request to your custom API endpoint
      await sdk.client.fetch(`/carousels`, {
        method: "DELETE",
        body: {
          id: Id,
        },
      });
      toast.success("Image deleted successfully");
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
    <Container className="divide-y p-0">
      <button className="my-2 mx-4" onClick={handleAdd}>Carousel</button>
      <div className="flex items-center justify-between px-6 py-4">
        {
          isLoading ? <div>Loading...</div> : <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
              {data?.carousels && data?.carousels.map((caro: any, index: any) => (
                <div key={index} className="flex justify-center flex-col items-center gap-2 border-[2px] border-gray-500 rounded-[10px] p-4">
                  <div className="flex justify-between w-full h-full items-center gap-2">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                      <img
                        src={caro.url2 || "/placeholder.svg"}
                        alt={`Media item ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                      <img
                        src={caro.url || "/placeholder.svg"}
                        alt={`Media item ${index + 1}`}
                        className="w-full h-full  object-contain"
                      />
                    </div>
                  </div>
                  <Button
                    size="small"
                    variant="danger"
                    disabled={loading}
                    onClick={() => handleDeleteCarousel(caro.id)}
                  >
                    {loading ? "..." : "Delete"}
                  </Button>
                </div>
              ))}
            </div>
          </>
        }

        {/*     {JSON.stringify({
          carousels: data?.carousels,
          isLoading,
        })} */}
      </div>

      <FocusModal open={modalOpen} >
        <FocusModal.Trigger asChild>
          <Button onClickCapture={() => {
            setModalOpen(true)
          }} className="m-4">Upload Carousel images</Button>
        </FocusModal.Trigger>
        <FocusModal.Content>
          <FocusModal>
            <div className="flex justify-between items-center p-4">
              <Button onClick={() => setModalOpen(false)} disabled={isUploading}>
                Close
              </Button>
              <Button onClick={handleAdd} disabled={!largeImage || !smallImage || isUploading}>
                {isUploading ? "Save..." : "Save"}
              </Button>
            </div>
          </FocusModal>
          <FocusModal.Body className="flex flex-col items-center overflow-auto">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-2">
                <div className="w-full max-w-3xl mx-auto p-6">
                  <h2 className="text-2xl font-bold mb-6">Image Upload</h2>

                  {/* Large Image Upload */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-3">Large Image</h3>

                    {!largePreview ? (
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${draggingOver === "large" ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/70"
                          }`}
                        onDragOver={(e) => handleDragOver(e, "large")}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, "large")}
                        onClick={() => triggerFileInput("large")}
                      >
                        <input
                          type="file"
                          ref={largeInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "large")}
                        />

                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <Upload className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-medium">Upload large image</h3>
                          <p className="text-muted-foreground text-sm mb-2">Drag and drop or click to browse</p>
                          <p className="text-xs text-muted-foreground">Recommended size: 1500px x 500px</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden border">
                        <img
                          src={largePreview || "/placeholder.svg"}
                          alt="Large image preview"
                          className="w-full h-64 object-cover"
                        />
                        <button
                          onClick={() => removeImage("large")}
                          className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Small Image Upload */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Small Image</h3>

                    {!smallPreview ? (
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${draggingOver === "small" ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/70"
                          }`}
                        onDragOver={(e) => handleDragOver(e, "small")}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, "small")}
                        onClick={() => triggerFileInput("small")}
                      >
                        <input
                          type="file"
                          ref={smallInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "small")}
                        />

                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            <Upload className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-medium">Upload small image</h3>
                          <p className="text-muted-foreground text-sm mb-2">Drag and drop or click to browse</p>
                          <p className="text-xs text-muted-foreground">Recommended size: 1920px x 1080px</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden border w-48">
                        <img
                          src={smallPreview || "/placeholder.svg"}
                          alt="Small image preview"
                          className="w-full h-48 object-cover"
                        />
                        <button
                          onClick={() => removeImage("small")}
                          className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Upload Status */}
                  {uploadStatus === "uploading" && (
                    <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-700 border-t-transparent rounded-full"></div>
                      <span>Uploading images...</span>
                    </div>
                  )}

                  {uploadStatus === "success" && (
                    <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      <span>Images uploaded successfully!</span>
                    </div>
                  )}

                  {uploadStatus === "error" && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Error uploading images. Please try again.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Carousels",
  icon: CircleSliders,
});

export default CustomPage;
