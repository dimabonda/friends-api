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
    {
        method: "GET",
        path: "/user/:userId/friends",
        handler: "user.getUserFriendsList",
        config: {
            prefix: "",
        },
    },
    {
        method: "GET",
        path: "/user/:userId/profile",
        handler: "user.getUserProfile",
        config: {
            prefix: "",
        },
    },
     {
        method: "GET",
        path: "/user/search/all-users",
        handler: "user.getUserListSearch",
        config: {
            prefix: "",
        },
    },
]