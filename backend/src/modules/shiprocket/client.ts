import axios from "axios";

class Shiprocket {
  protected client_: any;
  protected token_: string;
  protected orders: any;
  protected shipments: any;
  protected couriers: any;
  protected company: any;
  protected returns: any;
  protected wrapper: any;
  protected auth: any;

  constructor() {
    //this.account_ = account
    this.fetchToken_()
      .then((token) => {
        console.log("token", token);
        this.token_ = token;
        this.client_ = this.initializeClient_(token);
        this.orders = this.buildOrderEndpoints_();
        this.shipments = this.buildShipmentEndpoints_();
        this.couriers = this.buildCourierEndpoints_();
        this.company = this.buildCompanyEndpoints_();
        this.returns = this.buildReturnEndpoints_();
        this.wrapper = this.buildWrapperEndpoints_();
        this.auth = this.buildAuthEndpoints_();
      })
      .catch((error) => {
        console.error("Failed to fetch Shiprocket token:", error);
      });
    // this.documents = this.buildDocumentEndpoints_()
    // this.shippingRates = this.buildShippingRateEndpoints_()
  }

  private initializeClient_(token: string) {
    return (this.client_ = axios.create({
      baseURL: "https://apiv2.shiprocket.in/v1/external",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }));
  }

  private async fetchToken_(): Promise<string> {
    const path = "https://apiv2.shiprocket.in/v1/external/auth/login";
    const email = process.env.SHIPROCKET_EMAIL_ID;
    const password = process.env.SHIPROCKET_PASS;

    if (!email || !password) {
      throw new Error("Shiprocket email or password not set in environment.");
    }

    const response = await axios.post(
      path,
      { email, password },
      {
        headers: {
          "content-type": "application/json",
        },
      },
    );

    console.log("data", response.data);

    return response.data.token;
  }

  buildAuthEndpoints_ = () => {
    return {
      authToken: async () => {
        const path = `https://apiv2.shiprocket.in/v1/external/auth/login`;
        const email = process.env.SHIPROCKET_EMAIL_ID;
        const password = process.env.SHIPROCKET_PASS;
        return axios
          .post(
            path,
            { email, password },
            {
              headers: {
                "content-type": "application/json",
              },
            },
          )
          .then(({ data }) => data);
      },
    };
  };

  buildOrderEndpoints_ = () => {
    return {
      // retrieveAll: async () => {
      //   const path = `/orders`
      //   return this.client_({
      //     method: 'GET',
      //     url: path,
      //   }).then(({ data: {data:actualData} }) => actualData)
      // },
      retrieveById: async (id) => {
        const path = `/orders/show/${id}`;
        return this.client_({
          method: "GET",
          url: path,
        })
          .then(({ data: { data: actualData } }) => actualData)
          .catch((err) => {
            console.log(err.response.data);
            throw new Error("Shiprocket Order: Failed to retrieveById");
          });
      },
      // exportCSV: async (data) => {
      //   const path = `/v2/orders/export`
      //   return this.client_({
      //     method: 'POST',
      //     url: path,
      //   }).then(({data}) => data)
      // },
      createCustom: async (data) => {
        console.log("\n\n\n\n\ncreateCustom\n\n\n\n")
        const path = `/orders/create/adhoc`;
        return this.client_({
          method: "POST",
          url: path,
          data: {
            ...data,
          },
        })
          .then(({ data }) => data)
          .catch((err) => {
            console.log(err.response.data);
            throw new Error("Shiprocket Order: Failed to createCustom");
          });
      },
      createForChannel: async (data) => {
        const path = `/orders/create`;
        return this.client_({
          method: "POST",
          url: path,
          data: {
            ...data,
          },
        })
          .then(({ data }) => data)
          .catch((err) => {
            console.log(err.response.data);
            throw new Error("Shiprocket Order: Failed to createForChannel");
          });
      },
      // updatePickup: async (data) => {
      //   const path = `/orders/address/pickup`
      //   return this.client_({
      //     method: 'PATCH',
      //     url: path,
      //     data: {
      //       data,
      //     },
      //   }).then(({ message }) => message)
      // },
      // updateDelivery: async (data) => {
      //   const path = `/orders/address/update`
      //   return this.client_({
      //     method: 'POST',
      //     url: path,
      //     data: {
      //       data,
      //     },
      //   }).then(() => {}) //This request doesn't return any response body
      // },
      // updateOrder: async (data) => {
      //   const path = `/orders/update/adhoc`
      //   return this.client_({
      //     method: 'POST',
      //     url: path,
      //     data: {
      //       data,
      //     },
      //   }).then(({data}) => data)
      // },
      cancelOrder: async (data) => {
        const path = `/orders/cancel`;
        return this.client_({
          method: "POST",
          url: path,
          data: {
            ...data,
          },
        })
          .then(() => {}) //This request doesn't return any response body
          .catch((err) => {
            console.log(err.response.data);
            throw new Error("Shiprocket Order: Failed to cancelOrder");
          });
      },
      // //Inventory sync mush be enabled to use this
      // addInventoryForOrdered: async (data) => {
      //   const path = `/orders/fulfill`
      //   return this.client_({
      //     method: 'PATCH',
      //     url: path,
      //     data: {
      //       data,
      //     },
      //   }).then(({data}) => data)
      // },
      // mapUnmapped: async (data) => {
      //   const path = `/orders/fulfill`
      //   return this.client_({
      //     method: 'PATCH',
      //     url: path,
      //     data: {
      //       data,
      //     },
      //   }).then(({data}) => data)
      // },
      // bulkImport: async (data) => {
      //   const path = `/orders/import`
      //   return this.client_({
      //     method: 'POST',
      //     url: path,
      //     data: {
      //       data,
      //     },
      //   }).then(({data}) => data)
      // },
      cancelShipment: async (data) => {
        const path = `orders/cancel/shipment/awbs`;
        return this.client_({
          method: "POST",
          url: path,
          data: {
            ...data,
          },
        })
          .then(({ message }) => message)
          .catch((err) => {
            console.log(err.response.data);
            throw new Error("Shiprocket Order: Failed to cancelShipment");
          });
      },
    };
  };

  buildShipmentEndpoints_ = () => {
    return {
      retrieveById: async (id) => {
        const path = `/shipments/${id}`;
        return this.client_({
          method: "GET",
          url: path,
        })
          .then(({ data: { data: actualData } }) => actualData)
          .catch((err) => {
            console.log(err.response.data);
            throw new Error("Shiprocket Shipment: Failed to retrieveById");
          });
      },
      // retrieveAll: async () => {
      //   const path = `/shipments`
      //   return this.client_({
      //     method: 'GET',
      //     url: path,
      //   }).then(({ data: {data:actualData} }) => actualData)
      // },
    };
  };

  buildCourierEndpoints_ = () => {
    return {
      // createAWB: async (data) => {
      //   const path = `/courier/assign/awb`
      //   return this.client_({
      //     method: 'POST',
      //     url: path,
      //     data: {
      //       data,
      //     },
      //   }).then(({data}) => data)
      // },
      retrieveAll: async (type) => {
        const path = `/courier/courierListWithCounts?type=${type}`;
        return this.client_({
          method: "GET",
          url: path,
        })
          .then(({ data: { courier_data } }) => courier_data)
          .catch((err) => {
            console.log(err.response.data);
            throw new Error("Shiprocket Courier: Failed to retrieveAll");
          });
      },
      getServiceability: async (data) => {
        const path = `/courier/serviceability`;
        return this.client_({
          method: "GET",
          url: path,
          data: {
            ...data,
          },
        })
          .then(({ data: { data: actualData } }) => actualData)
          .catch((err) => {
            console.log(err.response.data);
            throw new Error("Shiprocket Courier: Failed to getServiceability");
          });
      },
      // getIntServiceability: async (data) => {
      //   const path = `/courier/international/serviceability`
      //   return this.client_({
      //     method: 'GET',
      //     url: path,
      //     data: {
      //       data,
      //     },
      //   }).then(({ data: {data:actualData} }) => actualData)
      // },
      // createPickup: async (data) => {
      //   const path = `/courier/generate/pickup`
      //   return this.client_({
      //     method: 'POST',
      //     url: path,
      //     data: {
      //       data,
      //     },
      //   }).then(({data}) => data)
      // },
    };
  };

  buildCompanyEndpoints_ = () => {
    return {
      retrieveAll: async () => {
        console.log("\n\n\nretrieveAll\n\n\n");
        const path = `/settings/company/pickup`;
        return this.client_({
          method: "GET",
          url: path,
        })
          .then(({ data: { data: actualData } }) => actualData)
          .catch((err) => {
            console.log(err.response.data);
            throw new Error(
              "Shiprocket Company: Failed to retrieveAll pickup locations",
            );
          });
      },
      // createLocation: async (data) => {
      //   const path = `/settings/company/addpickup`
      //   return this.client_({
      //     method: 'POST',
      //     url: path,
      //     data: {
      //       data,
      //     },
      //   }).then(({data}) => data)
      // },
    };
  };

  buildReturnEndpoints_ = () => {
    return {
      createReturn: async (data) => {
        const path = `/orders/create/return`;
        return this.client_({
          method: "POST",
          url: path,
          data: {
            ...data,
          },
        })
          .then(({ data }) => data)
          .catch((err) => {
            console.log(err.response.data);
            throw new Error("Shiprocket Return: Failed to createReturn");
          });
      },
      // retrieveAll: async () => {
      //   const path = `/orders/processing/return`
      //   return this.client_({
      //     method: 'GET',
      //     url: path,
      //   }).then(({ data: {data:actualData} }) => actualData)
      // },
    };
  };

  buildWrapperEndpoints_ = () => {
    return {
      forward: async (data) => {
        const path = `/shipments/create/forward-shipment`;
        return this.client_({
          method: "POST",
          url: path,
          data: {
            ...data,
          },
        })
          .then(({ data: { payload } }) => payload)
          .catch((err) => {
            console.log(err.response.data);
            throw new Error(
              "Shiprocket Wrapper: Failed to create forward shipment",
            );
          });
      },
      reverse: async (data) => {
        const path = `/shipments/create/return-shipment`;
        return this.client_({
          method: "POST",
          url: path,
          data: {
            ...data,
          },
        })
          .then(({ data: { payload } }) => payload)
          .catch((err) => {
            console.log(err.response.data);
            throw new Error(
              "Shiprocket Wrapper: Failed to create reverse shipment",
            );
          });
      },
    };
  };
}

export default Shiprocket;
