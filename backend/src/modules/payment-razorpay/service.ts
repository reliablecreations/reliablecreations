import { Logger } from "@medusajs/medusa";
import { setTimeout } from "timers/promises";
import {
  Options,
  RazorpayOptions,
  RazorpayProviderConfig,
  WebhookEventData,
} from "../../types";

import Razorpay from "razorpay";
import crypto from "crypto";
import { EOL } from "os";

import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  // CreatePaymentProviderSession,
  CustomerDTO,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  HttpTypes,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  PaymentProviderOutput,
  // any,
  // any,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  StoreCart,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  // UpdatePaymentProviderSession,
  WebhookActionResult,
} from "@medusajs/framework/types";
import {
  AbstractPaymentProvider,
  isBigNumber,
  isDefined,
  MedusaError,
  MedusaErrorCodes,
  MedusaErrorTypes,
  PaymentActions,
  PaymentSessionStatus,
} from "@medusajs/framework/utils";
import { ErrorCodes, PaymentIntentOptions } from "../../types/index";
import { getAmountFromSmallestUnit } from "../../utils/get-smallest-unit";

import { Customers } from "razorpay/dist/types/customers";
import orders, { Orders } from "razorpay/dist/types/orders";
import { Payments } from "razorpay/dist/types/payments";
import { Refunds } from "razorpay/dist/types/refunds";
// import { updateRazorpayCustomerMetadataWorkflow } from "../../workflows/update-razorpay-customer-metadata";
import { updateRazorpayCustomerMetadataWorkflow } from "../../workflows/update-razorpay-customer-metadata";

/**
 * The paymentIntent object corresponds to a razorpay order.
 *
 */

class RazorpayBase extends AbstractPaymentProvider {
  static identifier = "razorpay";

  readonly options_: RazorpayProviderConfig & Options;
  razorpay_: Razorpay;
  logger: Logger;
  container_: any;

  constructor(container: any, options) {
    super(container, options);

    this.options_ = options;
    this.logger = container.logger as Logger;

    this.container_ = container;
    this.options_ = options;

    this.init();
  }

  static validateOptions(options: RazorpayOptions): void {
    if (!isDefined(options.key_id)!) {
      throw new Error("Required option `key_id` is missing in Razorpay plugin");
    } else if (!isDefined(options.key_secret)!) {
      throw new Error(
        "Required option `key_secret` is missing in Razorpay plugin",
      );
    }
  }

  protected init(): void {
    const provider = this.options_.providers?.find(
      (p) => p.id == RazorpayBase.identifier,
    );
    if (!provider && !this.options_.key_id) {
      throw new MedusaError(
        MedusaErrorTypes.INVALID_ARGUMENT,
        "razorpay not configured",
        MedusaErrorCodes.CART_INCOMPATIBLE_STATE,
      );
    }
    this.razorpay_ =
      this.razorpay_ ||
      new Razorpay({
        key_id: this.options_.key_id ?? provider?.options.key_id,
        key_secret: this.options_.key_secret ?? provider?.options.key_secret,
        headers: {
          "Content-Type": "application/json",
          "X-Razorpay-Account":
            this.options_.razorpay_account ??
            provider?.options.razorpay_account ??
            undefined,
        },
      });
  }

  get paymentIntentOptions(): Partial<PaymentIntentOptions> {
    return {
      capture_method: "automatic",
      setup_future_usage: "off_session",
      payment_method_types: ["card"],
    };
  }

  getPaymentIntentOptions(): Partial<Orders.RazorpayOrderBaseRequestBody> {
    const options: Partial<Orders.RazorpayOrderBaseRequestBody> = {};

    // if (this?.paymentIntentOptions?.capture_method) {
    //   options.capture_method = this.paymentIntentOptions.capture_method;
    // }
    //
    // if (this?.paymentIntentOptions?.setup_future_usage) {
    //   options.setup_future_usage = this.paymentIntentOptions.setup_future_usage;
    // }
    //
    // if (this?.paymentIntentOptions?.payment_method_types) {
    //   options.payment_method_types =
    //     this.paymentIntentOptions.payment_method_types;
    // }

    return options;
  }

  // abstract get paymentIntentOptions(): PaymentIntentOptions;
  //
  // getPaymentIntentOptions(): Partial<PaymentIntentOptions> {
  //   const options: Partial<PaymentIntentOptions> = {};
  //
  //   if (this?.paymentIntentOptions?.capture_method) {
  //     options.capture_method = this.paymentIntentOptions.capture_method;
  //   }
  //
  //   if (this?.paymentIntentOptions?.setup_future_usage) {
  //     options.setup_future_usage = this.paymentIntentOptions.setup_future_usage;
  //   }
  //
  //   if (this?.paymentIntentOptions?.payment_method_types) {
  //     options.payment_method_types =
  //       this.paymentIntentOptions.payment_method_types;
  //   }
  //
  //   return options;
  // }

  _validateSignature(
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string,
  ): boolean {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const provider = this.options_.providers?.find(
      (p) => p.id == RazorpayBase.identifier,
    );

    if (!provider && !this.options_.key_id) {
      throw new MedusaError(
        MedusaErrorTypes.INVALID_ARGUMENT,
        "razorpay not configured",
        MedusaErrorCodes.CART_INCOMPATIBLE_STATE,
      );
    }
    const expectedSignature = crypto
      .createHmac(
        "sha256",
        this.options_.key_secret ?? (provider!.options.key_secret as string),
      )
      .update(body.toString())
      .digest("hex");
    return expectedSignature === razorpay_signature;
  }

  async getRazorpayPaymentStatus(
    paymentIntent: Orders.RazorpayOrder,
    attempts: {
      entity: string;
      count: number;
      items: Array<Payments.RazorpayPayment>;
    },
  ): Promise<PaymentSessionStatus> {
    if (!paymentIntent) {
      return PaymentSessionStatus.ERROR;
    } else {
      const authorisedAttempts = attempts.items.filter(
        (i) => i.status == PaymentSessionStatus.AUTHORIZED,
      );
      const totalAuthorised = authorisedAttempts.reduce((p, c) => {
        p += parseInt(`${c.amount}`);
        return p;
      }, 0);
      return totalAuthorised == paymentIntent.amount
        ? PaymentSessionStatus.AUTHORIZED
        : PaymentSessionStatus.REQUIRES_MORE;
    }
  }

  // async getPaymentStatus(
  //   paymentSessionData: Record<string, unknown>,
  // ): Promise<PaymentSessionStatus> {
  //   const id = paymentSessionData.id as string;
  //   const orderId = paymentSessionData.order_id as string;
  //   let paymentIntent: Orders.RazorpayOrder;
  //   let paymentsAttempted: {
  //     entity: string;
  //     count: number;
  //     items: Array<Payments.RazorpayPayment>;
  //   };
  //   try {
  //     paymentIntent = await this.razorpay_.orders.fetch(id);
  //     paymentsAttempted = await this.razorpay_.orders.fetchPayments(id);
  //   } catch (e) {
  //     this.logger.warn("received payment data from session not order data");
  //     paymentIntent = await this.razorpay_.orders.fetch(orderId);
  //     paymentsAttempted = await this.razorpay_.orders.fetchPayments(orderId);
  //   }
  //
  //   switch (paymentIntent.status) {
  //     // created' | 'authorized' | 'captured' | 'refunded' | 'failed'
  //     case "created":
  //       return PaymentSessionStatus.REQUIRES_MORE;
  //
  //     case "paid":
  //       return PaymentSessionStatus.AUTHORIZED;
  //
  //     case "attempted":
  //       return await this.getRazorpayPaymentStatus(
  //         paymentIntent,
  //         paymentsAttempted,
  //       );
  //
  //     default:
  //       return PaymentSessionStatus.PENDING;
  //   }
  // }

  async getPaymentStatus(
    paymentSessionData: GetPaymentStatusInput,
  ): Promise<GetPaymentStatusOutput> {
    // const id = paymentSessionData?.data?.id as string;
    // const orderId = paymentSessionData.order_id as string;
    // let paymentIntent: Orders.RazorpayOrder;
    // let paymentsAttempted: {
    //     entity: string;
    //     count: number;
    //     items: Array<Payments.RazorpayPayment>;
    // };
    // try {
    //     paymentIntent = await this.razorpay_.orders.fetch(id);
    //     paymentsAttempted = await this.razorpay_.orders.fetchPayments(id);
    // } catch (e) {
    //     this.logger.warn(
    //         "received payment data from session not order data"
    //     );
    //     paymentIntent = await this.razorpay_.orders.fetch(orderId);
    //     paymentsAttempted = await this.razorpay_.orders.fetchPayments(
    //         orderId
    //     );
    // }
    //
    // switch (paymentIntent.status) {
    //     // created' | 'authorized' | 'captured' | 'refunded' | 'failed'
    //     case "created":
    //         return PaymentSessionStatus.REQUIRES_MORE;
    //
    //     case "paid":
    return { status: PaymentSessionStatus.AUTHORIZED };

    //     case "attempted":
    //         return await this.getRazorpayPaymentStatus(
    //             paymentIntent,
    //             paymentsAttempted
    //         );
    //
    //     default:
    //         return PaymentSessionStatus.PENDING;
    // }
  }

  // async getPaymentStatus({
  //   data,
  // }: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
  //   const id = data?.id as string;
  //   if (!id) {
  //     throw this.buildError(
  //       "No payment intent ID provided while getting payment status",
  //       new Error("No payment intent ID provided"),
  //     );
  //   }
  //
  //   const paymentIntent = await this.razorpay_.payments.fetch(id);
  //   const dataResponse = paymentIntent as unknown as Record<string, unknown>;
  //
  //   console.log("PaymentIntent: ", paymentIntent);
  //
  //   switch (paymentIntent.status) {
  //     case "failed":
  //       return { status: PaymentSessionStatus.ERROR, data: dataResponse };
  //     case "authorized":
  //       return { status: PaymentSessionStatus.AUTHORIZED, data: dataResponse };
  //     case "captured":
  //       return { status: PaymentSessionStatus.CAPTURED, data: dataResponse };
  //     default:
  //       return { status: PaymentSessionStatus.PENDING, data: dataResponse };
  //   }
  // }

  // async getPaymentStatus(
  //   input: GetPaymentStatusInput,
  // ): Promise<GetPaymentStatusOutput> {
  //   const paymentSessionData = input.data as Record<string, unknown>;
  //   const id = paymentSessionData.id as string;
  //   const orderId = paymentSessionData.order_id as string;
  //
  //   let paymentIntent: Orders.RazorpayOrder;
  //   let paymentsAttempted: {
  //     entity: string;
  //     count: number;
  //     items: Array<Payments.RazorpayPayment>;
  //   };
  //
  //   try {
  //     paymentIntent = await this.razorpay_.orders.fetch(id);
  //     paymentsAttempted = await this.razorpay_.orders.fetchPayments(id);
  //   } catch (e) {
  //     this.logger.warn("received payment data from session not order data");
  //     paymentIntent = await this.razorpay_.orders.fetch(orderId);
  //     paymentsAttempted = await this.razorpay_.orders.fetchPayments(orderId);
  //   }
  //
  //   let status: PaymentSessionStatus;
  //
  //   switch (paymentIntent.status) {
  //     case "created":
  //       status = PaymentSessionStatus.REQUIRES_MORE;
  //       break;
  //
  //     case "paid":
  //       status = PaymentSessionStatus.AUTHORIZED;
  //       break;
  //
  //     case "attempted":
  //       status = await this.getRazorpayPaymentStatus(
  //         paymentIntent,
  //         paymentsAttempted,
  //       );
  //       break;
  //
  //     default:
  //       status = PaymentSessionStatus.PENDING;
  //   }
  //
  //   return {
  //     status,
  //     data: paymentSessionData,
  //   };
  // }

  async updateRazorpayMetadataInCustomer(
    customer: CustomerDTO,
    parameterName: string,
    parameterValue: string,
  ): Promise<CustomerDTO> {
    const metadata = customer.metadata;
    let razorpay = metadata?.razorpay as Record<string, string>;
    if (razorpay) {
      razorpay[parameterName] = parameterValue;
    } else {
      razorpay = {};
      razorpay[parameterName] = parameterValue;
    }
    //
    const x = await updateRazorpayCustomerMetadataWorkflow(this.container_).run(
      {
        input: {
          medusa_customer_id: customer.id,
          razorpay,
        },
      },
    );
    const result = x.result.customer;

    return result;
  }
  // @Todo refactor this function to 3 simple functions to make it more readable
  // 1. check existing customer
  // 2. create customer
  // 3. update customer

  async editExistingRpCustomer(
    customer: CustomerDTO,
    intentRequest,
    extra: HttpTypes.StoreCart,
  ): Promise<Customers.RazorpayCustomer | undefined> {
    let razorpayCustomer: Customers.RazorpayCustomer | undefined;

    const razorpay_id =
      intentRequest.notes?.razorpay_id ||
      (customer.metadata?.razorpay_id as string) ||
      (customer.metadata as any)?.razorpay?.rp_customer_id;
    try {
      razorpayCustomer = await this.razorpay_.customers.fetch(razorpay_id);
    } catch (e) {
      this.logger.warn(
        "unable to fetch customer in the razorpay payment processor",
      );
    }
    // edit the customer once fetched
    if (razorpayCustomer) {
      const editEmail = customer.email;
      const editName = `${customer.first_name} ${customer.last_name}`.trim();
      const editPhone =
        customer?.phone ||
        customer?.addresses.find((v) => v.phone != undefined)?.phone;
      try {
        const updateRazorpayCustomer = await this.razorpay_.customers.edit(
          razorpayCustomer.id,
          {
            email: editEmail ?? razorpayCustomer.email,
            contact: editPhone ?? razorpayCustomer.contact!,
            name: editName != "" ? editName : razorpayCustomer.name,
          },
        );
        razorpayCustomer = updateRazorpayCustomer;
      } catch (e) {
        this.logger.warn(
          "unable to edit customer in the razorpay payment processor",
        );
      }
    }

    if (!razorpayCustomer) {
      try {
        razorpayCustomer = await this.createRazorpayCustomer(
          customer,

          intentRequest,
          extra,
        );
      } catch (e) {
        this.logger.error(
          "something is very wrong please check customer in the dashboard.",
        );
      }
    }
    return razorpayCustomer; // returning un modified razorpay customer
  }

  async createRazorpayCustomer(
    customer: CustomerDTO,
    intentRequest,
    extra: HttpTypes.StoreCart,
  ): Promise<Customers.RazorpayCustomer | undefined> {
    let razorpayCustomer: Customers.RazorpayCustomer;
    const phone =
      customer.phone ??
      extra.billing_address?.phone ??
      customer?.addresses.find((v) => v.phone != undefined)?.phone;

    const gstin = (customer?.metadata?.gstin as string) ?? undefined;
    if (!phone) {
      throw new Error("phone number to create razorpay customer");
    }
    if (!customer.email) {
      throw new Error("email to create razorpay customer");
    }
    const firstName = customer.first_name ?? "";
    const lastName = customer.last_name ?? "";
    try {
      const customerParams: Customers.RazorpayCustomerCreateRequestBody = {
        email: customer.email,
        contact: phone,
        gstin: gstin,
        fail_existing: 0,
        name: `${firstName} ${lastName} `,
        notes: {
          updated_at: new Date().toISOString(),
        },
      };
      razorpayCustomer = await this.razorpay_.customers.create(customerParams);

      intentRequest.notes!.razorpay_id = razorpayCustomer?.id;
      if (customer && customer.id) {
        await this.updateRazorpayMetadataInCustomer(
          customer,
          "rp_customer_id",
          razorpayCustomer.id,
        );
      }
      return razorpayCustomer;
    } catch (e) {
      this.logger.error(
        "unable to create customer in the razorpay payment processor",
      );
      return;
    }
  }

  async pollAndRetrieveCustomer(
    customer: CustomerDTO,
  ): Promise<Customers.RazorpayCustomer> {
    let customerList: Customers.RazorpayCustomer[] = [];
    let razorpayCustomer: Customers.RazorpayCustomer;
    const count = 10;
    let skip = 0;
    do {
      customerList = (
        await this.razorpay_.customers.all({
          count,
          skip,
        })
      )?.items;
      razorpayCustomer =
        customerList?.find(
          (c) => c.contact == customer?.phone || c.email == customer.email,
        ) ?? customerList?.[0];
      if (razorpayCustomer) {
        await this.updateRazorpayMetadataInCustomer(
          customer,
          "rp_customer_id",
          razorpayCustomer.id,
        );
        break;
      }
      if (!customerList || !razorpayCustomer) {
        throw new Error("no customers and cant create customers in razorpay");
      }
      skip += count;
    } while (customerList?.length == 0);

    return razorpayCustomer;
  }

  async fetchOrPollForCustomer(
    customer: CustomerDTO,
  ): Promise<Customers.RazorpayCustomer | undefined> {
    let razorpayCustomer: Customers.RazorpayCustomer | undefined;
    try {
      const rp_customer_id = (
        customer.metadata?.razorpay as Record<string, string>
      )?.rp_customer_id;
      if (rp_customer_id) {
        razorpayCustomer = await this.razorpay_.customers.fetch(rp_customer_id);
      } else {
        razorpayCustomer = await this.pollAndRetrieveCustomer(customer);

        this.logger.debug(
          `updated customer ${razorpayCustomer.email} with RpId :${razorpayCustomer.id}`,
        );
      }
      return razorpayCustomer;
    } catch (e) {
      this.logger.error(
        "unable to poll customer in the razorpay payment processor",
      );
      return;
    }
  }

  async createOrUpdateCustomer(
    intentRequest,
    customer: CustomerDTO,
    extra: HttpTypes.StoreCart,
  ): Promise<Customers.RazorpayCustomer | undefined> {
    let razorpayCustomer: Customers.RazorpayCustomer | undefined;
    try {
      const razorpay_id =
        (customer.metadata as any)?.razorpay?.rp_customer_id ||
        intentRequest.notes.razorpay_id;
      try {
        if (razorpay_id) {
          this.logger.info("the updating  existing customer  in razorpay");

          razorpayCustomer = await this.editExistingRpCustomer(
            customer,
            intentRequest,
            extra,
          );
        }
      } catch (e) {
        this.logger.info("the customer doesn't exist in razopay");
      }
      try {
        if (!razorpayCustomer) {
          this.logger.info("the creating  customer  in razopay");

          razorpayCustomer = await this.createRazorpayCustomer(
            customer,
            intentRequest,
            extra,
          );
        }
      } catch (e) {
        // if customer already exists in razorpay but isn't associated with a customer in medsusa
      }
      if (!razorpayCustomer) {
        try {
          this.logger.info("relinking  customer  in razorpay by polling");

          razorpayCustomer = await this.fetchOrPollForCustomer(customer);
        } catch (e) {
          this.logger.error(
            "unable to poll customer customer in the razorpay payment processor",
          );
        }
      }
      return razorpayCustomer;
    } catch (e) {
      this.logger.error("unable to retrieve customer from cart");
    }
    return razorpayCustomer;
  }

  async executeWithRetry<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
    currentAttempt: number = 1,
  ): Promise<T> {
    try {
      return await apiCall();
    } catch (error) {
      console.log(error);
      const handledError = { retry: false, data: {} };

      if (!handledError.retry) {
        // If retry is false, we know data exists per the type definition
        return handledError.data as T;
      }

      if (handledError.retry && currentAttempt <= maxRetries) {
        // Logic for retrying
        const delay =
          baseDelay *
          Math.pow(2, currentAttempt - 1) *
          (0.5 + Math.random() * 0.5);
        await setTimeout(delay);
        return this.executeWithRetry(
          apiCall,
          maxRetries,
          baseDelay,
          currentAttempt + 1,
        );
      }
      // Retries are exhausted
      throw this.buildError(
        "An error occurred in InitiatePayment during creation of stripe payment intent",
        error,
      );
    }
  }

  async initiatePayment({
    currency_code,
    amount,
    data,
  }: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const newAmount = Math.round(Number(amount) * 100);

    const intentRequest = {
      amount: newAmount,
      currency: currency_code.toUpperCase(),
    };

    const sessionData = await this.executeWithRetry<any>(() =>
      this.razorpay_.orders.create(intentRequest),
    );

    this.logger.info(
      `Created Razorpay payment intent with id ${sessionData.id}, ${JSON.stringify(sessionData)}`,
    );
    const isPaymentIntent = "id" in sessionData;
    return {
      id: isPaymentIntent ? sessionData.id : (data?.session_id as string),
      data: sessionData as unknown as Record<string, unknown>,
    };
  }

  // async initiatePayment2(input: any): Promise<any | any> {
  //   const intentRequestData = this.getPaymentIntentOptions();
  //   const { currency_code, amount } = input;
  //   console.log(input)
  //   const { extra } = input.context;
  //   const cart = extra as unknown as StoreCart;
  //   if (!cart) {
  //     throw new MedusaError(
  //       MedusaError.Types.INVALID_DATA,
  //       "cart not ready",
  //       MedusaError.Codes.CART_INCOMPATIBLE_STATE,
  //     );
  //   }
  //   const provider = this.options_.providers?.find(
  //     (p) => p.id == RazorpayBase.identifier,
  //   );
  //
  //   if (!provider && !this.options_.key_id) {
  //     throw new MedusaError(
  //       MedusaErrorTypes.INVALID_ARGUMENT,
  //       "razorpay not configured",
  //       MedusaErrorCodes.CART_INCOMPATIBLE_STATE,
  //     );
  //   }
  //   const sessionNotes = extra?.notes ?? {};
  //   let toPay = getAmountFromSmallestUnit(
  //     Math.round(parseInt(amount.toString())),
  //     currency_code.toUpperCase(),
  //   );
  //   toPay = currency_code.toUpperCase() == "INR" ? toPay * 100 * 100 : toPay;
  //   const intentRequest: Orders.RazorpayOrderCreateRequestBody = {
  //     amount: toPay,
  //     currency: currency_code.toUpperCase(),
  //     notes: {
  //       ...sessionNotes,
  //       resource_id: (extra?.resource_id as string) ?? "",
  //       session_id: input.context.session_id as string,
  //       cart_id: extra?.id as string,
  //     },
  //     payment: {
  //       capture:
  //         (this.options_.auto_capture ?? provider?.options.auto_capture)
  //           ? "automatic"
  //           : "manual",
  //       capture_options: {
  //         refund_speed:
  //           this.options_.refund_speed ??
  //           provider?.options.refund_speed ??
  //           "normal",
  //         automatic_expiry_period: Math.max(
  //           this.options_.automatic_expiry_period ??
  //             provider?.options.automatic_expiry_period ??
  //             20,
  //           12,
  //         ),
  //         manual_expiry_period: Math.max(
  //           this.options_.manual_expiry_period ??
  //             provider?.options.manual_expiry_period ??
  //             10,
  //           7200,
  //         ),
  //       },
  //     },
  //     ...intentRequestData,
  //   };
  //   let session_data;
  //   const customerDetails = input.context.customer ?? (extra as any).customer;
  //   try {
  //     const razorpayCustomer = await this.createOrUpdateCustomer(
  //       intentRequest,
  //       customerDetails,
  //       extra as unknown as HttpTypes.StoreCart,
  //     );
  //     try {
  //       if (razorpayCustomer) {
  //         this.logger.debug(`the intent: ${JSON.stringify(intentRequest)}`);
  //       } else {
  //         this.logger.error("unable to find razorpay customer");
  //       }
  //       const phoneNumber =
  //         customerDetails.phone ?? cart.billing_address?.phone;
  //       if (!phoneNumber) {
  //         const e = new MedusaError(
  //           MedusaError.Types.INVALID_DATA,
  //           "no phone number",
  //           MedusaError.Codes.CART_INCOMPATIBLE_STATE,
  //         );
  //         return this.buildError(
  //           "An error occurred in InitiatePayment during the " +
  //             "invalid phone number: " +
  //             JSON.stringify(e),
  //           e,
  //         );
  //       }
  //       session_data = await this.razorpay_.orders.create({
  //         ...intentRequest,
  //       });
  //     } catch (e) {
  //       return this.buildError(
  //         "An error occurred in InitiatePayment during the " +
  //           "creation of the razorpay payment intent: " +
  //           JSON.stringify(e),
  //         e,
  //       );
  //     }
  //   } catch (e) {
  //     return this.buildError(
  //       "An error occurred in creating customer request:" + e.message,
  //       e,
  //     );
  //   }
  //   return {
  //     data: { ...session_data, intentRequest: intentRequest },
  //   };
  // }

  // async authorizePayment(
  //   input: AuthorizePaymentInput,
  // ): Promise<AuthorizePaymentOutput> {
  //   const statusResponse = await this.getPaymentStatus(input);
  //   new ReferenceError("statusResponse: " + JSON.stringify(statusResponse));
  //   return statusResponse;
  // }

  async authorizePayment(
    input: AuthorizePaymentInput,
  ): Promise<AuthorizePaymentOutput> {
    // const status = (await this.getPaymentStatus(input)) as unknown as any;

    return {
      data: {
        ...input.data,
      },
      status: "authorized",
    };
  }

  // async authorizePayment(
  //   paymentSessionData:
  // ): Promise<
  //   | any
  //   | {
  //       status: PaymentSessionStatus;
  //       data: any;
  //     }
  // > {
  //   const status = await this.getPaymentStatus(paymentSessionData);
  //   return {
  //     data: {
  //       ...paymentSessionData,
  //     } as any,
  //     status,
  //   };
  // }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<any | any> {
    const error: any = {
      error: "Unable to cancel as razorpay doesn't support cancellation",
      code: ErrorCodes.UNSUPPORTED_OPERATION,
    };
    return error;
  }

  async capturePayment(
    input: CapturePaymentInput,
  ): Promise<CapturePaymentOutput> {
    return {
      data: {
        ...input.data,
        status: "captured",
      },
    };
  }

  // async capturePayment(
  //   paymentSessionData: CapturePaymentInput
  // ): Promise<any | Record<string, unknown>> {
  //   const order_id = (paymentSessionData as unknown as Orders.RazorpayOrder).id;
  //   const paymentsResponse =
  //     await this.razorpay_.orders.fetchPayments(order_id);
  //   const possibleCaptures = paymentsResponse.items?.filter(
  //     (item) => item.status == "authorized",
  //   );
  //   const result = possibleCaptures?.map(async (payment) => {
  //     const { id, amount, currency } = payment;
  //     const toPay =
  //       getAmountFromSmallestUnit(
  //         Math.round(parseInt(amount.toString())),
  //         currency.toUpperCase(),
  //       ) * 100;
  //     const paymentIntent = await this.razorpay_.payments.capture(
  //       id,
  //       toPay,
  //       currency as string,
  //     );
  //     return paymentIntent;
  //   });
  //   if (result) {
  //     const payments = await Promise.all(result);
  //     const res = payments.reduce(
  //       (acc, curr) => ((acc[curr.id] = curr), acc),
  //       {},
  //     );
  //     (paymentSessionData as unknown as Orders.RazorpayOrder).payments = res;
  //   }
  //   return paymentSessionData;
  // }

  async deletePayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<any | any> {
    return await this.cancelPayment(paymentSessionData);
  }

  // async refundPayment(
  //   input:RefundPaymentInput,
  // ): Promise<any | any> {
  //  const externalId = input.data?.id
  //   const refundAmount = input.amount
  //   const id = externalId as string
  //
  //   const paymentList = await this.razorpay_.orders.fetchPayments(id);
  //
  //   const payment_id = paymentList.items?.find((p) => {
  //     return (
  //       p.amount >= refundAmount &&
  //       (p.status == "authorized" || p.status == "captured")
  //     );
  //   })?.id;
  //   if (payment_id) {
  //     const refundRequest = {
  //       amount: refundAmount as number
  //     };
  //     try {
  //       const refundSession = await this.razorpay_.payments.refund(
  //         payment_id,
  //         refundRequest,
  //       );
  //       const refundsIssued =
  //         paymentSessionData.refundSessions as Refunds.RazorpayRefund[];
  //       if (refundsIssued?.length > 0) {
  //         refundsIssued.push(refundSession);
  //       } else {
  //         paymentSessionData.refundSessions = [refundSession];
  //       }
  //     } catch (e) {
  //       return this.buildError("An error occurred in refundPayment", e);
  //     }
  //   }
  //   return paymentSessionData as any;
  // }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const paymentSessionData = input.data as Record<string, unknown>;
    const refundAmount = input.amount;
    const id = paymentSessionData.id as string;

    try {
      // Fetch payments related to the order
      const paymentList = await this.razorpay_.orders.fetchPayments(id);

      // Find the eligible payment for refund
      const paymentId = paymentList.items?.find((p) => {
        return (
          p.amount >= refundAmount &&
          (p.status === "authorized" || p.status === "captured")
        );
      })?.id;

      if (!paymentId) {
        throw new Error("No eligible payment found for refund.");
      }

      // Create refund request
      const refundRequest = { amount: refundAmount as number };

      // Initiate the refund
      const refundSession: Refunds.RazorpayRefund =
        await this.razorpay_.payments.refund(paymentId, refundRequest);

      // Update the payment session data with refund information
      const refundsIssued =
        paymentSessionData.refundSessions as Refunds.RazorpayRefund[];
      if (refundsIssued?.length > 0) {
        refundsIssued.push(refundSession);
      } else {
        paymentSessionData.refundSessions = [refundSession];
      }

      return { data: paymentSessionData };
    } catch (e) {
      this.logger.error("An error occurred in refundPayment:", e);
      return this.buildError("An error occurred in refundPayment", e);
    }
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>,
  ): Promise<any | any> {
    let intent;
    try {
      const id = (paymentSessionData as unknown as Orders.RazorpayOrder)
        .id as string;
      intent = await this.razorpay_.orders.fetch(id);
    } catch (e) {
      const id = (paymentSessionData as unknown as Payments.RazorpayPayment)
        .order_id as string;
      try {
        intent = await this.razorpay_.orders.fetch(id);
      } catch (e) {
        this.buildError("An error occurred in retrievePayment", e);
      }
    }
    return intent as unknown as any;
  }

  // async updatePayment(input: UpdatePaymentInput): Promise<any | any> {
  //   const { amount, currency_code, context } = input;
  //   const { customer, billing_address, extra } = context;
  //   if (!billing_address && customer?.addresses?.length == 0) {
  //     return this.buildError(
  //       "An error occurred in updatePayment during the retrieve of the cart",
  //       new Error(
  //         "An error occurred in updatePayment during the retrieve of the cart",
  //       ),
  //     );
  //   }
  //
  //   let refreshedCustomer: CustomerDTO;
  //   let customerPhone = "";
  //   let razorpayId: string;
  //   if (customer) {
  //     try {
  //       refreshedCustomer = input.context.customer as CustomerDTO;
  //       razorpayId = (refreshedCustomer?.metadata as any)?.razorpay
  //         ?.rp_customer_id;
  //       customerPhone =
  //         refreshedCustomer?.phone ?? billing_address?.phone ?? "";
  //       if (
  //         !refreshedCustomer.addresses.find((v) => v.id == billing_address?.id)
  //       ) {
  //         this.logger.warn("no customer billing found");
  //       }
  //     } catch {
  //       return this.buildError(
  //         "An error occurred in updatePayment during the retrieve of the customer",
  //         new Error(
  //           "An error occurred in updatePayment during the retrieve of the customer",
  //         ),
  //       );
  //     }
  //   }
  //   const isNonEmptyPhone =
  //     customerPhone || billing_address?.phone || customer?.phone || "";
  //
  //   if (!razorpayId!) {
  //     return this.buildError(
  //       "razorpay id not supported",
  //       new Error("the phone number wasn't specified"),
  //     );
  //   }
  //
  //   if (razorpayId !== (extra?.customer as any)?.id) {
  //     const phone = isNonEmptyPhone;
  //
  //     if (!phone) {
  //       this.logger.warn("phone number wasn't specified");
  //       return this.buildError(
  //         "An error occurred in updatePayment during the retrieve of the customer",
  //         new Error("the phone number wasn't specified"),
  //       );
  //     }
  //     const result = await this.initiatePayment(input);
  //     if (isPaymentProviderError(result)) {
  //       return this.buildError(
  //         "An error occurred in updatePayment during the initiate of the new payment for the new customer",
  //         result,
  //       );
  //     }
  //
  //     return result;
  //   } else {
  //     if (!amount) {
  //       return this.buildError(
  //         "amount  not valid",
  //         new MedusaError(
  //           MedusaErrorTypes.INVALID_DATA,
  //           "amount  not valid",
  //           MedusaErrorCodes.CART_INCOMPATIBLE_STATE,
  //         ),
  //       );
  //     }
  //     if (!currency_code) {
  //       return this.buildError(
  //         "currency code not known",
  //         new MedusaError(
  //           MedusaErrorTypes.INVALID_DATA,
  //           "currency code unknown",
  //           MedusaErrorCodes.CART_INCOMPATIBLE_STATE,
  //         ),
  //       );
  //     }
  //
  //     try {
  //       const id = extra?.id as string;
  //       let sessionOrderData: Partial<Orders.RazorpayOrder> = {
  //         currency: "INR",
  //       };
  //       if (id) {
  //         sessionOrderData = (await this.razorpay_.orders.fetch(
  //           id,
  //         )) as Partial<Orders.RazorpayOrder>;
  //         delete sessionOrderData.id;
  //         delete sessionOrderData.created_at;
  //       }
  //       input.currency_code =
  //         currency_code?.toUpperCase() ?? sessionOrderData?.currency ?? "INR";
  //       const newPaymentSessionOrder = (await this.initiatePayment(
  //         input,
  //       )) as any;
  //
  //       return { data: { ...newPaymentSessionOrder.data } };
  //     } catch (e) {
  //       return this.buildError("An error occurred in updatePayment", e);
  //     }
  //   }
  // }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    const { amount, currency_code, context } = input;
    const { customer } = context!;

    if (!customer?.billing_address) {
      return this.buildError(
        "An error occurred in updatePayment during the retrieve of the cart",
        new Error("No billing address or customer address found"),
      );
    }

    let razorpayId: string | undefined;
    let customerPhone = "";

    if (customer) {
      try {
        const refreshedCustomer = input.context?.customer as CustomerDTO;
        razorpayId = (refreshedCustomer?.metadata as any)?.razorpay
          ?.rp_customer_id;
        customerPhone =
          refreshedCustomer?.phone ?? customer.billing_address?.phone ?? "";

        if (
          !refreshedCustomer.addresses.find(
            (v) => v.id === customer.billing_address?.id,
          )
        ) {
          this.logger.warn("No customer billing address found");
        }
      } catch {
        return this.buildError(
          "An error occurred in updatePayment during the retrieve of the customer",
          new Error("Failed to retrieve the customer"),
        );
      }
    }

    const isNonEmptyPhone =
      customerPhone || customer.billing_address?.phone || customer?.phone || "";

    if (!razorpayId) {
      return this.buildError(
        "Razorpay ID not supported",
        new Error("The phone number wasn't specified"),
      );
    }

    // Handle new customer case by initiating a new payment
    if (razorpayId !== customer.id) {
      const phone = isNonEmptyPhone;

      if (!phone) {
        this.logger.warn("Phone number wasn't specified");
        return this.buildError(
          "An error occurred in updatePayment during the retrieve of the customer",
          new Error("The phone number wasn't specified"),
        );
      }

      try {
        const result = await this.initiatePayment(input);

        return result;
      } catch (error) {
        return this.buildError(
          "An error occurred in updatePayment during the initiation of the new payment for the new customer",
          error,
        );
      }
    } else {
      // Validate amount and currency code
      if (!amount) {
        return this.buildError(
          "Amount not valid",
          new MedusaError(
            MedusaErrorTypes.INVALID_DATA,
            "Amount not valid",
            MedusaErrorCodes.CART_INCOMPATIBLE_STATE,
          ),
        );
      }

      if (!currency_code) {
        return this.buildError(
          "Currency code unknown",
          new MedusaError(
            MedusaErrorTypes.INVALID_DATA,
            "Currency code unknown",
            MedusaErrorCodes.CART_INCOMPATIBLE_STATE,
          ),
        );
      }

      try {
        const id = customer?.id as string;
        let sessionOrderData: Partial<Orders.RazorpayOrder> = {
          currency: "INR",
        };

        if (id) {
          sessionOrderData = (await this.razorpay_.orders.fetch(
            id,
          )) as Partial<Orders.RazorpayOrder>;
          delete sessionOrderData.id;
          delete sessionOrderData.created_at;
        }

        input.currency_code =
          currency_code?.toUpperCase() ?? sessionOrderData?.currency ?? "INR";

        // Create a new payment session order
        const newPaymentSessionOrder = (await this.initiatePayment(
          input,
        )) as any;

        return { data: { ...newPaymentSessionOrder.data } };
      } catch (e) {
        return this.buildError("An error occurred in updatePayment", e);
      }
    }
  }

  async updatePaymentData(
    sessionId: string,
    data: Record<string, unknown>,
  ): Promise<any | any> {
    try {
      // Prevent from updating the amount from here as it should go through
      // the updatePayment method to perform the correct logic
      if (data.amount || data.currency) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cannot update amount, use updatePayment instead",
        );
      }
      try {
        const paymentSession = await this.razorpay_.payments.fetch(
          (data.data as Record<string, any>).id as string,
        );
        if (data.notes || (data.data as any)?.notes) {
          const notes = data.notes || (data.data as any)?.notes;
          const result = (await this.razorpay_.orders.edit(sessionId, {
            notes: { ...paymentSession.notes, ...notes },
          })) as unknown as any;
          return result;
        } else {
          this.logger.warn("only notes can be updated in razorpay order");
          return paymentSession as unknown as any;
        }
      } catch (e) {
        return (data as Record<string, any>).data ?? data;
      }
    } catch (e) {
      return this.buildError("An error occurred in updatePaymentData", e);
    }
  }
  /*
/**
 * Constructs Razorpay Webhook event
 * @param {object} data - the data of the webhook request: req.body
 * @param {object} signature - the Razorpay signature on the event, that
 *    ensures integrity of the webhook event
 * @return {object} Razorpay Webhook event
 */

  constructWebhookEvent(data, signature): boolean {
    const provider = this.options_.providers?.find(
      (p) => p.id == RazorpayBase.identifier,
    );

    if (!provider && !this.options_.key_id) {
      throw new MedusaError(
        MedusaErrorTypes.INVALID_ARGUMENT,
        "razorpay not configured",
        MedusaErrorCodes.CART_INCOMPATIBLE_STATE,
      );
    }
    return Razorpay.validateWebhookSignature(
      data,
      signature,
      this.options_.webhook_secret ?? provider?.options.webhook_secret,
    );
  }

  protected buildError(message: string, e: any | Error): any {
    return {
      error: message,
      code: "code" in e ? e.code : "",
      detail: true
        ? `${e.error}${EOL}${e.detail ?? ""}`
        : "detail" in e
          ? e.detail
          : (e.message ?? ""),
    };
  }
  async getWebhookActionAndData(
    webhookData: ProviderWebhookPayload["payload"],
  ): Promise<WebhookActionResult> {
    const webhookSignature = webhookData.headers["x-razorpay-signature"];

    const webhookSecret =
      this.options_?.webhook_secret ||
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_TEST_WEBHOOK_SECRET;

    const logger = this.logger;
    const data = webhookData.data;

    logger.info(
      `Received Razorpay webhook body as object : ${JSON.stringify(
        webhookData.data,
      )}`,
    );
    try {
      const validationResponse = Razorpay.validateWebhookSignature(
        webhookData.rawData.toString(),
        webhookSignature as string,
        webhookSecret!,
      );
      // return if validation fails
      if (!validationResponse) {
        return { action: PaymentActions.FAILED };
      }
    } catch (error) {
      logger.error(`Razorpay webhook validation failed : ${error}`);

      return { action: PaymentActions.FAILED };
    }
    const paymentData = (webhookData.data as unknown as WebhookEventData)
      .payload?.payment?.entity;
    const event = data.event;

    const order = await this.razorpay_.orders.fetch(paymentData.order_id);
    /** sometimes this even fires before the order is updated in the remote system */
    const outstanding = getAmountFromSmallestUnit(
      order.amount_paid == 0 ? paymentData.amount : order.amount_paid,
      paymentData.currency.toUpperCase(),
    );

    switch (event) {
      // payment authorization is handled in checkout flow. webhook not needed

      case "payment.captured":
        return {
          action: PaymentActions.SUCCESSFUL,
          data: {
            session_id: (paymentData.notes as any).session_id as string,
            amount: outstanding,
          },
        };

      case "payment.authorized":
        return {
          action: PaymentActions.AUTHORIZED,
          data: {
            session_id: (paymentData.notes as any).session_id as string,
            amount: outstanding,
          },
        };

      case "payment.failed":
        // TODO: notify customer of failed payment

        return {
          action: PaymentActions.FAILED,
          data: {
            session_id: (paymentData.notes as any).session_id as string,
            amount: outstanding,
          },
        };
        break;

      default:
        return { action: PaymentActions.NOT_SUPPORTED };
    }
  }
}

export default RazorpayBase;
