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

export const followFriend = async (ctx: Context) => {
    try {
        const friendId = ctx.params.userId;
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

        const response = await strapi.plugin("users-permissions").service("user-service").followFriend(user.id, friendId);

        ctx.send({
            ...response,
            friend: userDataPublic(friend),
        }, 200)


    } catch (error) {
        console.error("Error", error.message);
        ctx.internalServerError("An unexpected error occurred" )
    }
}