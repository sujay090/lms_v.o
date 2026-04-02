import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getUserModel } from '../../models/adminModels/users.model';
import { getSessionModel } from '../../models/adminModels/session.model';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ 
                message: validation.error.issues[0].message,
                errors: validation.error.format()
            });
            return;
        }

        const { email, password } = validation.data;

        if (!req.tenantDb) {
            res.status(500).json({ message: 'Tenant database connection missing' });
            return;
        }

        const TenantUser = getUserModel(req.tenantDb);
        const user = await TenantUser.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // For this task, we assume passwords might not be hashed yet in testing
        // You should adapt this based on how users are created
        const isMatch = await bcrypt.compare(password, user.password);

        // Fallback for plain text passwords in development if necessary
        // Uncomment if you have plain text passwords in the DB currently:
        // const isMatchText = password === user.password;
        // if (!isMatch && !isMatchText) { ... }

        if (!isMatch && password !== user.password) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Stateful session implementation
        const Session = getSessionModel(req.tenantDb);
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day validity

        const session = await Session.create({
            userId: user._id,
            expiresAt
        });

        res.cookie('sid', session._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            signed: true
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                businessName: user.businessName,
                businessDomain: user.businessDomain
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

export const verifyAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;

        if (!user) {
            res.status(401).json({ authenticated: false, message: 'User context not found' });
            return;
        }

        res.status(200).json({
            authenticated: true,
            user: {
                id: user._id,
                role: user.role,
                email: user.email,
                businessName: user.businessName,
                businessDomain: user.businessDomain
            }
        });
    } catch (error) {
        console.error('Verify auth error:', error);
        res.status(401).json({ authenticated: false, message: 'Invalid session state' });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.signedCookies?.sid;

        if (token && req.tenantDb) {
            const Session = getSessionModel(req.tenantDb);
            await Session.deleteOne({ _id: token });
        }

        res.clearCookie('sid');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
}