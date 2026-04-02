import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db";
import tenantRouter from "./routes/tenantsRoutes/tenants.routes";
import { tenantResolver } from "./middlewares/tenantResolver";
import formTemplateRoutes from "./routes/superAdmin/formTemplate.routes";
import studentRoutes from "./routes/admin/student.routes";
import authRoutes from "./routes/admin/auth.routes";
import fileRoutes, { publicFileRouter } from "./routes/admin/file.routes";
import { isAuthenticated } from "./middlewares/authMiddleware";


const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"], // Match frontend ports
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET!));

connectDB();

app.use("/api/health", (req: Request, res: Response) => {
    res.status(200).json({ message: "server is running " });
})

// tenants routes
app.use("/api/tenants", tenantRouter);



// client routes ****************************************************************
// admin routes*******************************************************************
app.use("/api/admin/auth", tenantResolver, authRoutes);
app.use("/api/admin/students", tenantResolver, isAuthenticated, studentRoutes);
app.use("/api/admin/files", publicFileRouter);
app.use("/api/admin/files", tenantResolver, fileRoutes);

// super admin routes*****************************************************************
app.use("/api/superadmin/forms", tenantResolver, isAuthenticated, formTemplateRoutes);


export default app;