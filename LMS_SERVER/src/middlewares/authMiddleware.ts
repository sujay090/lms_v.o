import { Request, Response, NextFunction } from 'express';
import { getSessionModel } from '../models/adminModels/session.model';
import { getUserModel } from '../models/adminModels/users.model';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.signedCookies?.sid;

        if (!token) {
            res.status(401).json({ success: false, message: 'Authentication required. No session token provided.' });
            return;
        }

        if (!req.tenantDb) {
            res.status(500).json({ success: false, message: 'Tenant database connection missing' });
            return;
        }

        const Session = getSessionModel(req.tenantDb);
        const session = await Session.findOne({
            _id: token,
            expiresAt: { $gt: new Date() }
        });

        if (!session) {
            res.status(401).json({ success: false, message: 'Session expired or invalid. Please log in again.' });
            return;
        }

        const TenantUser = getUserModel(req.tenantDb);
        const user = await TenantUser.findById(session.userId);

        if (!user) {
            res.status(401).json({ success: false, message: 'User associated with session not found.' });
            return;
        }

        // Attach user object to the request for downstream controllers to use
        (req as any).user = user;

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ success: false, message: 'Server error during authentication check' });
    }
};
