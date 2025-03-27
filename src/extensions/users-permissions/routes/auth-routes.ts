
export const authRoutes = [
    {
        method: 'POST',
        path: '/auth/local/register',
        handler: 'auth.register',
        config: {
            prefix: "",
        },
    },
    {
        method: 'POST',
        path: '/auth/local/login',
        handler: 'auth.login',
        config: {
            prefix: "",
        },
    },
    {
        method: "POST",
        path: "/auth/pinRequest",
        handler: "auth.pinRequest",
        config: {
            // middlewares: ["plugin::users-permissions.rateLimit"],
            prefix: "",
        },
    },
    {
        method: "POST",
        path: "/auth/pinSubmit",
        handler: "auth.pinSubmit",
        config: {
            prefix: "",
        },
    },
];