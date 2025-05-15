
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
        path: "/auth/pin-request",
        handler: "auth.pinRequest",
        config: {
            prefix: "",
        },
    },
    {
        method: "POST",
        path: "/auth/pin-submit",
        handler: "auth.pinSubmit",
        config: {
            prefix: "",
        },
    },
];