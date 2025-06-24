import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "./src/modules/review",
    },
    {
      resolve: "./src/modules/carousel",
    },
    {
      resolve: "./src/modules/brand",
    },
    {
      resolve: "./src/modules/video",
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            // if module provider is in a plugin, use plugin-name/providers/my-payment
            resolve: "./src/modules/payment-razorpay",
            id: "my-custom-payment",
            options: {
              key_id:
                process?.env?.RAZORPAY_TEST_KEY_ID ?? process?.env?.RAZORPAY_ID,
              key_secret:
                process?.env?.RAZORPAY_TEST_KEY_SECRET ??
                process?.env?.RAZORPAY_SECRET,
              razorpay_account:
                process?.env?.RAZORPAY_TEST_ACCOUNT ??
                process?.env?.RAZORPAY_ACCOUNT,
              automatic_expiry_period: 30 /* any value between 12minuts and 30 days expressed in minutes*/,
              manual_expiry_period: 20,
              refund_speed: "normal",
              webhook_secret:
                process?.env?.RAZORPAY_TEST_WEBHOOK_SECRET ??
                process?.env?.RAZORPAY_WEBHOOK_SECRET,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",

            options: {
              // provider options...
              backend_url: `${process.env.MEDUSA_BACKEND_URL}/static`,
            },
          },
          // {
          //   resolve: "@medusajs/medusa/file-s3",
          //   id: "s3",
          //   options: {
          //     file_url: process.env.VITE_S3_FILE_URL,
          //     access_key_id: process.env.VITE_S3_ACCESS_KEY_ID,
          //     secret_access_key: process.env.VITE_S3_SECRET_ACCESS_KEY,
          //     region: process.env.VITE_S3_REGION,
          //     bucket: process.env.VITE_S3_BUCKET,
          //     endpoint: process.env.VITE_S3_ENDPOINT,
          //     // other options...
          //   },
          // },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/fulfillment-manual",
            id: "manual",
          },
          {
            resolve: "./src/modules/shiprocket",
            id: "shiprocket",
            options: {
              // provider options...
              channel_id: process.env.SHIPROCKET_CHANNEL_ID, //(required)
              email: process.env.SHIPROCKET_EMAIL, //(required)
              password: process.env.SHIPROCKET_PASSWORD, //(required)
              token: process.env.SHIPROCKET_TOKEN, //(required. leave empty)
              pricing: "calculated", //"flat_rate" or "calculated" (required)
              length_unit: "cm", //"mm", "cm" or "inches" (required)
              multiple_items: "split_shipment", //"single_shipment" or "split_shipment"(default) (required)
              inventory_sync: false, //true or false(default) (required)
              forward_action: "create_order", //'create_fulfillment' or 'create_order'(default) (required)
              return_action: "create_order", //'create_fulfillment' or 'create_order'(default) (required)
            },
          },
        ],
      },
    },

  ]

})
