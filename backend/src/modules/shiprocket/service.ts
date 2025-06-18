import ShiprocketClient from "./client";
import {
  CalculateShippingOptionPriceDTO,
  CalculatedShippingOptionPrice,
  CreateFulfillmentResult,
  CreateShippingOptionDTO,
  Logger,
} from "@medusajs/framework/types";
import { FulfillmentOption } from "@medusajs/framework/types";
import {
  AbstractFulfillmentProviderService,
  defaultCountries,
} from "@medusajs/framework/utils";
import config from "./config.json";
// https://github.com/Hemann55/medusa-fulfillment-shiprocket/blob/main/src/services/shiprocket-fulfillment.js

function getCountryDisplayName(alpha2) {
  const countryObj = defaultCountries.find(
    (val) => val.alpha2 === alpha2.toUpperCase(),
  );
  return countryObj?.name;
}

type InjectedDependencies = {
  logger: Logger;
};

type Options = {
  email: string;
  token: string;
  pricing: string;
  password: string;
  channel_id: string;
  length_unit: string;
  inventory_sync: boolean;
  multiple_items: "single_shipment" | "split_shipment";
  forward_action: "create_fulfillment" | "create_order";
  return_action: "create_return_fulfillment" | "create_return_order";
};

class MyShiproketProviders extends AbstractFulfillmentProviderService {
  static identifier = "my-shiproket-provider";
  // other properties...
  protected logger_: Logger;
  protected options_: Options;
  // assuming you're initializing a client
  protected client: any;

  constructor({ logger }: InjectedDependencies, options: Options) {
    super();
    this.logger_ = logger;
    this.options_ = options;
    this.client = new ShiprocketClient();
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    console.log(">> getFulfillmentOptions()");
    // assuming you have a client
    // const services = await this.client.couriers.retrieveAll('active')
    // console.log(">> getFulfillmentOptions()", services)
    return config.courier_data.map((service) => ({
      name: service.name,
      service_code: service.id,
      id: service.id.toString(),
    }));
    // return services.map((service) => ({
    //     id: service.service_id,
    //     name: service.name,
    //     service_code: service.code,
    //     // can add other relevant data for the provider to later process the shipping option.
    // }))
  }

  async validateFulfillmentData(
    optionData: any,
    data: any,
    context: any,
  ): Promise<any> {
    console.log(">> getFulfillmentOptions()");
    console.log(">> getFulfillmentOptions()", {
      optionData,
      data,
      context,
    });
    // assuming your client retrieves an ID from the
    // third-party service
    // const externalId = await this.client.getId()
    return {
      ...data,
      // externalId
    };
  }

  async validateOption(data: any): Promise<boolean> {
    console.log(">> validateOption()");
    console.log(">> validateOption()", {
      data,
    });
    return data.external_id !== undefined;
  }

  async canCalculate(data: CreateShippingOptionDTO): Promise<boolean> {
    console.log(">> canCalculate()");
    console.log(">> canCalculate()", {
      data,
    });
    // assuming you have a
    // @ts-ignore
    // return await this.client.hasRates(data.id)
    if (this.options_.pricing === "calculated") {
      return true;
    } else {
      return false;
    }
  }
  async calculatePrice(
    optionData: CalculateShippingOptionPriceDTO["optionData"],
    data: CalculateShippingOptionPriceDTO["data"],
    context: CalculateShippingOptionPriceDTO["context"],
  ): Promise<CalculatedShippingOptionPrice> {
    // assuming the client can calculate the price using
    // the third-party service

    console.log(">> calculatePrice()");
    console.log(">> calculatePrice()", {
      optionData,
      data,
      context,
    });
    if (this.options_.pricing === "flat_rate") {
      throw Error("Cannot calculate. Pricing strategy is set to flat_rate");
    }
    return {
      calculated_amount: 0,
      is_calculated_price_tax_inclusive: true,
    };
  }

  //   {
  //   message: 'Unauthorized! You do not have the required permissions.',
  //   status_code: 403
  // }
  async createFulfillment(
    data: any,
    items: any,
    order: any,
    fulfillment: any,
  ): Promise<CreateFulfillmentResult> {
    console.log(">> createFulfillment()");

    const { billing_address, shipping_address, metadata } = order;

    // wait 1 second for token call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pickupLocations = await this.client.company.retrieveAll();

    let newOrder = {
      order_id: order.id,
      order_date: new Date().toISOString().split("T")[0],
      pickup_location: pickupLocations.shipping_address[0].pickup_location,
      billing_customer_name: shipping_address.first_name,
      billing_last_name: shipping_address.last_name,
      billing_address: shipping_address.address_1,
      billing_address_2: shipping_address.address_1,
      billing_city: shipping_address.city,
      billing_state: shipping_address.province,
      billing_country: getCountryDisplayName(
        order.shipping_address.country_code,
      ),
      billing_pincode: parseInt(shipping_address.postal_code),
      billing_email: order.email,
      billing_phone: parseInt(shipping_address.phone),
      shipping_is_billing: true,
      shipping_pincode: parseInt(shipping_address.postal_code),
      shipping_email: order.email,
      shipping_phone: parseInt(shipping_address.phone),
      order_items: order.items.map((item) => {
        // const totals = await this.totalsService.getLineItemTotals(
        //   item,
        //   order,
        //   {
        //     include_tax: true,
        //     use_tax_lines: true,
        //   },
        // );
        //console.log(`totals for ${item.title}`, totals)

        return {
          name: item.title,
          sku: item.variant_sku,
          units: item.quantity,
          selling_price: item.unit_price,
          // discount: humanizeAmount(
          //   totals.discount_total,
          //   fromOrder.currency_code
          // ),
          // tax: totals.tax_lines.reduce((acc, next) => acc + next.rate, 0),
          // hsn: parseInt(item.variant.hs_code),
        };
      }),
      payment_method: "Prepaid",
      shipping_charges: order.shipping_methods[0].price,
      sub_total: order.items.reduce((acc, item) => acc + item.unit_price, 0),
      length: order.items[0].variant.length,
      breadth: order.items[0].variant.width,
      height: order.items.reduce((acc, item) => acc + item.variant.height, 0),
      weight:
        order.items.reduce((acc, item) => acc + item.variant.weight, 0) / 100,
    };
    //
    // console.log(newOrder)
    // console.log("Order.items", order.items)

    // wait 1 second for token call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await this.client.orders.createCustom(newOrder);

    console.log("Shiprocket: createFulfillment response:", response);
    // assuming the client creates a fulfillment
    // in the third-party service
    // const externalData = await this.client.(
    //   fulfillment,
    //   items
    // )
    // const externalData = {
    //     order_id: fulfillment.order_id,
    //     shipment_id: fulfillment.shipment_id,
    //     shipment_status: fulfillment.shipment_status,
    //     shipment_status_code: fulfillment.shipment_status_code,
    //     shipment_status_message: fulfillment.shipment_status_message,
    // }
    return {
      data: {
        ...((fulfillment.data as object) || {}),
        ...response,
      },
      labels: [],
    };
  }
  async cancelFulfillment(data: Record<string, unknown>): Promise<any> {
    // assuming the client cancels a fulfillment
    // in the third-party service
    const { shipment_id } = data as {
      shipment_id: string;
    };

    if (!shipment_id) {
      console.log("Shiprocket: cancelFulfillment data:", data);
      throw new Error(
        "Shiprocket: Unable to cancel shipment. shipment_id not found in the data received",
      );
    }
    // wait 1 second for token call
    new Promise((resolve) => setTimeout(resolve, 1000));

    const shipmentDetails =
      await this.client.shipments.retrieveById(shipment_id);

    if (shipmentDetails.status > 5 && shipmentDetails.status !== 11) {
      //shipment has already been shipped, cannot be cancelled
      console.log("shipment has already been shipped, cannot be cancelled");
      throw new Error(
        "Shiprocket: Shipment has already been shipped, cannot be cancelled",
      );
    } else {
      await this.client.orders.cancelShipment({
        awbs: [data.awb_code],
      });

      await this.client.orders.cancelOrder({
        ids: [data.order_id],
      });
    }
  }

  async getFulfillmentDocuments(data: any): Promise<never[]> {
    // assuming the client retrieves documents
    // from a third-party service
    return await this.client.documents(data);
  }

  async createReturnFulfillment(
    fulfillment: Record<string, unknown>,
  ): Promise<CreateFulfillmentResult> {
    // assuming the client creates a fulfillment for a return
    // in the third-party service
    const externalData = await this.client.createReturn(fulfillment);
    return {
      data: {
        ...((fulfillment.data as object) || {}),
        ...externalData,
      },
      labels: [],
    };
  }

  async getReturnFulfillmentDocuments(data: any): Promise<never[]> {
    // assuming the client retrieves documents
    // from a third-party service
    return await this.client.returnDocuments(data);
  }

  async getReturnFulfillmentOptions(): Promise<FulfillmentOption[]> {
    // assuming the client retrieves options
    // from a third-party service
    return await this.client.returnOptions();
  }

  async retrieveDocuments(
    fulfillmentData: any,
    documentType: any,
  ): Promise<void> {
    // assuming the client retrieves documents
    // from a third-party service
    return await this.client.documents(fulfillmentData, documentType);
  }
}

export default MyShiproketProviders;
