import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Button } from "@medusajs/ui";
import { AdminProduct, DetailWidgetProps } from "@medusajs/types";

import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { sdk } from "../lib/config";
import { toast } from "@medusajs/ui";

// The widget
const ProductWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(data.description || "");

  const handleSave = async () => {
    setLoading(true);
    try {
      // Send request to your custom API endpoint
      await sdk.admin.product.update(data.id, {
        description: value,
      });
      toast.success("Saved successfully");
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="divide-y space-y-5 p-5">
      <div className="flex items-center justify-between">
        <Heading level="h2">QUILL Editor</Heading>
      </div>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <Button disabled={loading} onClick={() => handleSave()}>
        {loading ? "..." : "Save"}
      </Button>
    </Container>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductWidget;
