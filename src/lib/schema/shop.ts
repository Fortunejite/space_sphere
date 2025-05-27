import { z } from "zod";

export const createShopSchema = z.object({
  name: z.string(),
  subdomain: z.string(),
})