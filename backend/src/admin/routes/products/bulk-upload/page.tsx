// src/admin/routes/products/bulk-upload/page.tsx
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Button, Text, toast } from "@medusajs/ui";
import { useState, useRef } from "react";
import { ArrowUpTray } from "@medusajs/icons";

const BulkUploadPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("csvFile", files[0]);

      const response = await fetch("/admin/products/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.result);
        toast.success("Products imported successfully");
      } else {
        toast.error(data.message || "Import failed");
      }
    } catch (error) {
      toast.error("An error occurred during import");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Container className="p-6 max-w-4xl">
      <div className="flex flex-col gap-6">
        <Heading level="h1">Bulk Upload Products</Heading>

        <div className="bg-white p-8 border rounded-lg">
          <div className="flex flex-col gap-4">
            <Heading level="h2">Upload CSV File</Heading>
            <Text>
              Upload a CSV file containing product data. You can include
              external image URLs that will be downloaded and stored in Medusa.
            </Text>

            <div
              className="py-8 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <ArrowUpTray />
                <Text>
                  Drag and drop your CSV file here, or click to browse
                </Text>
              </div>
            </div>

            {isUploading && <Text>Uploading and processing file...</Text>}

            {result && (
              <div className="mt-4 p-4 bg-green-50 rounded">
                <Heading level="h3">Import Results</Heading>
                {/* <Text>Created: {result?.created} products</Text> */}
                {/* <Text>Updated: {result?.updated} products</Text> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Bulk Upload",
  icon: ArrowUpTray,
});

export default BulkUploadPage;
