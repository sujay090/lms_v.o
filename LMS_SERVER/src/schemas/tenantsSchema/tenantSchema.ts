import z from "zod";

const tenantSchema = z.object({
    tenantName: z.string().min(3).max(100),
    tenantDomainName: z.string().min(3).max(100),
    tenantEmail: z.email(),
    tenantExpireDate: z.string().min(3).max(100),
    tenantStatus: z.string().min(3).max(100)
})

export default tenantSchema;    