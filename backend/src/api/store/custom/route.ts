import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import filterCustomerFlow from "../../../workflows/find-customer";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.sendStatus(200);
}


export async function POST(
  req: MedusaRequest<any>,
  res: MedusaResponse
) {
  const body = req.body
  const { result } = await filterCustomerFlow(req.scope).run({
    input: body
  })
  res.send({
    data: result?.customer
  })
}