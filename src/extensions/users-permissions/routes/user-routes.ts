export const userRoutes = [
    {
        method: "GET",
        path: "/user/me",
        handler: "user.me",
        config: {
            prefix: "",
        },
    },
    {
        method: "POST",
        path: "/user/:userId/follow",
        handler: "user.followFriend",
        config: {
            prefix: "",
        },
    },
]