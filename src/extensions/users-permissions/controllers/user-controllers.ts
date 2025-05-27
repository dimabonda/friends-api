import { Context } from 'koa';
import { userDataPublic } from '../services/user';
import _ from "lodash";


export const me = async (ctx: Context) => {
    try {
        const user = await strapi.plugin("users-permissions").service("user-service").getUserByRequest(ctx);

        if(!user){
            return ctx.notFound("User not found")
        }

        if(!user.confirmed){
            return ctx.badRequest("User account is not confirmed.");
        }

        if(user.blocked){
            return ctx.badRequest("User account is blocked.");
        }

        const jwt = strapi.plugin('users-permissions').service('jwt').issue({id: user.id});

        ctx.send({
            jwt,
            user: userDataPublic(user),
        }, 200)

    } catch (error) {
        console.error("Error", error.message);
        ctx.internalServerError("An unexpected error occurred" )
    }
}

export const getUserProfile = async (ctx: Context) => {
    try {
        const userId = ctx.params.userId ? Number(ctx.params.userId) : null;

        const currentUser = await strapi.plugin("users-permissions").service("user-service").getUserByRequest(ctx);

        if(!currentUser){
            return ctx.notFound("User not found")
        }

        if(!currentUser.confirmed){
            return ctx.badRequest("User account is not confirmed.");
        }

        if(currentUser.blocked){
            return ctx.badRequest("User account is blocked.");
        }

        if(!userId){
            return ctx.badRequest("User ID is required");
        }

        const user = await strapi.plugin("users-permissions").service("user-service").getUserById(userId);

        if(!user){
            return ctx.notFound("User not found")
        }

        if(!user.confirmed){
            return ctx.badRequest("User account is not confirmed.");
        }

        if(user.blocked){
            return ctx.badRequest("User account is blocked.");
        }

        ctx.send({
            user: userDataPublic(user),
        }, 200)

    } catch (error) {
        console.error("Error", error.message);
        ctx.internalServerError("An unexpected error occurred" )
    }
}

export const followFriend = async (ctx: Context) => {
    try {
        const friendId = ctx.params.userId ? Number(ctx.params.userId) : null;
        const user = await strapi.plugin("users-permissions").service("user-service").getUserByRequest(ctx);

        if(!user){
            return ctx.notFound("User not found")
        }

        if(!user.confirmed){
            return ctx.badRequest("User account is not confirmed.");
        }

        if(user.blocked){
            return ctx.badRequest("User account is blocked.");
        }

        const friend = await strapi.plugin("users-permissions").service("user-service").getUserById(friendId);

        if(!friend){
            return ctx.notFound("Friend not found")
        }

        if(!friend.confirmed){
            return ctx.badRequest("Friend account is not confirmed.");
        }

        if(friend.blocked){
            return ctx.badRequest("Friend account is blocked.");
        }

        if(friend.id === user.id){
            return ctx.badRequest("You can't follow yourself");
        }

        const {cursor, ...res} = await strapi.plugin("users-permissions").service("user-service").followFriend(user.id, friendId);

        const friendData = {
            id: friend.id,
            firstName: friend.firstName,
            lastName: friend.lastName,
            location: friend.location,
            photo: friend.photo,
            cursor,
        }

        ctx.send({
            ...res,
            friend: friendData,
        }, 200)


    } catch (error) {
        console.error("Error", error.message);
        ctx.internalServerError("An unexpected error occurred" )
    }
}

export const getUserFriendsList = async (ctx: Context) => {
    try {
        const userId = ctx.params.userId
        const pageSize = Array.isArray(ctx.query.pageSize) ? ctx.query.pageSize[0] : ctx.query.pageSize || "10";
        const lastFriendLinkId = Array.isArray(ctx.query.lastCursor) ? ctx.query.lastCursor[0] : ctx.query.lastCursor || null;

        const user = await strapi.plugin("users-permissions").service("user-service").getUserByRequest(ctx);

        if(!user){
            return ctx.notFound("User not found")
        }

        if(!user.confirmed){
            return ctx.badRequest("User account is not confirmed.");
        }

        if(user.blocked){
            return ctx.badRequest("User account is blocked.");
        }

        const friends = await strapi.plugin("users-permissions").service("user-service").getUserFriendsWithPagination(lastFriendLinkId, pageSize, userId);

        ctx.send({
            ...friends,
        }, 200)

    } catch (error) {
        console.error("Error", error.message);
        ctx.internalServerError("An unexpected error occurred" )
    }
}