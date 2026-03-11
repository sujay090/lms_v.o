import axios from 'axios';



// ─── Helper: Get Tenant ID ───────────────────────────────────────────────────
export const getTenantId = (): string => {
    let tenantId = '';

    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;

        // 0. Highest priority for local dev: use NEXT_PUBLIC_TENANT_ID if on localhost
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            const defaultTenant = process.env.NEXT_PUBLIC_TENANT_ID;
            if (defaultTenant) {
                return defaultTenant;
            }
        }

        // 1. Try to get tenant from subdomain (e.g. greenwood.lms.com → greenwood)
        const parts = hostname.split('.');
        if (parts.length >= 3 && hostname !== 'localhost' && hostname !== '127.0.0.1') {
            const subdomain = parts[0];
            if (['www', 'api', 'admin'].includes(subdomain)) {
                tenantId = parts.length >= 4 ? parts[1] : '';
            } else {
                tenantId = subdomain;
            }
        }

        // 2. Try localhost subdomain (e.g. greenwood.localhost)
        if (!tenantId && hostname.endsWith('.localhost') && hostname !== 'localhost') {
            tenantId = hostname.replace('.localhost', '');
        }

        // 3. Check user in localStorage (for logged-in users)
        if (!tenantId) {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.tenantSlug) {
                        tenantId = user.tenantSlug;
                    }
                }
            } catch (e) {
                // ignore JSON parse error
            }
        }

        // 4. Default for localhost if still no tenant
        if (!tenantId && (hostname === 'localhost' || hostname === '127.0.0.1')) {
            tenantId = process.env.NEXT_PUBLIC_TENANT_ID || '';
        }

    } else {
        // SSR fallback
        tenantId = process.env.NEXT_PUBLIC_TENANT_ID || '';
    }

    return tenantId;
};

// ─── Create Axios Instance ───────────────────────────────────────────────────
const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Request Interceptor: attach x-tenant-id on every request ────────────────
api.interceptors.request.use((config) => {
    const tenantId = getTenantId();
    if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
    }
    return config;
});

export default api;
