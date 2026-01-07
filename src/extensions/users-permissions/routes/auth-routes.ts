
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
    {
        method: "POST",
        path: "/auth/reset-pin-request",
        handler: "auth.resetPinRequest",
        config: {
            prefix: "",
        },
    },
    {
        method: "POST",
        path: "/auth/reset-pin-submit",
        handler: "auth.resetPinSubmit",
        config: {
            prefix: "",
        },
    },
];