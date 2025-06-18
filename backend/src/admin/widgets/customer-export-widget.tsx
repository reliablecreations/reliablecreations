import React, { useEffect, useState } from "react";
import { sdk } from "../lib/config"; // Adjust the path as needed
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Button, Container, Heading } from "@medusajs/ui";

const CustomerExportWidget = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { customers } = await sdk.admin.customer.list();
        setCustomers(customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const exportToCSV = () => {
    const headers = ["ID", "First Name", "Last Name", "Email", "Phone Number"];
    const rows = customers.map((customer) => [
      customer.id,
      customer.first_name,
      customer.last_name,
      customer.email,
      customer.phone,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Container className="p-6">
        <Heading level="h2">Loading Customers...</Heading>
      </Container>
    );
  }

  return (
    <Container className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Heading level="h2">Download Customer details</Heading>
        <Button variant="primary" onClick={exportToCSV}>
          Export to CSV
        </Button>
      </div>
    </Container>
  );
};

export default CustomerExportWidget;

export const config = defineWidgetConfig({
  zone: "customer.list.before",
});
