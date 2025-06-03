import { Context } from 'koa';

import { factories } from '@strapi/strapi';
import { userDataPublic } from '../../../extensions/users-permissions/services/user'; 

interface ICreatePostBody {
    title: string;
}

export default factories.createCoreController('api::post.post', ({strapi}) => ({
    async createPost(ctx: Context){
        try {

            const { body, files } = ctx.request;
            const image = files?.image ? files.image : null;

            const { title } = body as ICreatePostBody;

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

            if(!title){
                return ctx.badRequest("Post title is required")
            }

            let imageId: string | null = null;

            if (image) {
                const uploadedFiles = await strapi.plugins['upload'].services.upload.upload({
                    data: {},
                    files: image,
                });

                imageId = uploadedFiles[0].id;
            }

            const data = {
                title: title ? title : "",
                image: imageId,
                user: user,
            }

            const newPost = await strapi.service('api::post.post').createPost(data);

            ctx.send({
                message: "Post created successfully",
                data: newPost,
            }, 200)

        } catch (error) {
            console.error("Error", error.message);
            ctx.internalServerError("An unexpected error occurred" )
        }
    },

    async updatePost(ctx: Context){
        try {

            
        } catch (error) {
            console.error("Error", error.message);
            ctx.internalServerError("An unexpected error occurred" )
        }
    },

    async getPost(ctx: Context){
        try {
            const { postId} = ctx.params;
            
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

            const post = await strapi.service('api::post.post').getPostById(postId);

            if(!post){
                return ctx.notFound("Post not found");
            }

            ctx.send({
                data: post,
            }, 200)
        } catch (error) {
            console.error("Error", error.message);
            ctx.internalServerError("An unexpected error occurred" )
        }
    },

    async getList(ctx: Context) {
        try{
            const pageSize = Array.isArray(ctx.query.pageSize) ? ctx.query.pageSize[0] : ctx.query.pageSize || "10";
            const lastPostId = Array.isArray(ctx.query.lastPostId) ? ctx.query.lastPostId[0] : ctx.query.lastPostId || null;

            const user = await strapi.plugin("users-permissions").service("user-service").getUserByRequest(ctx);
    
            if (!user) {
                return ctx.notFound("User not found");
            }
    
            if (!user.confirmed) {
                return ctx.badRequest("User account is not confirmed.");
            }
    
            if (user.blocked) {
                return ctx.badRequest("User account is blocked.");
            }

            const data = await strapi.service('api::post.post').getPostsWithPagination(lastPostId, pageSize, null);

            const friendIdsArray = await strapi.plugin("users-permissions").service("user-service").getUserFriendsIds(user.id);

            const friendIds = new Set(friendIdsArray);

            const postsWithIsFriend = data.posts.map(post => ({
                ...post,
                isFriend: friendIds.has(post.user.id),
            }));
    
            ctx.send({
                message: "Posts retrieved successfully",
                data: {
                    posts: postsWithIsFriend,
                    hasMore: data.hasMore,
                },
            }, 200);
        } catch (error) {
            console.error("Error", error.message);
            ctx.internalServerError("An unexpected error occurred" )
        }
    },

    async getPostsList(ctx: Context) {
        try {
            const getParam = (q: any) => {
                const value = Array.isArray(q) ? q[0] : q;
                return (value === 'null' || value === 'undefined') ? null : value;
            };
            const pageSize = parseInt(getParam(ctx.query.pageSize) || "10", 10);
            const lastPostIdRaw = getParam(ctx.query.lastPostId);
            const userIdRaw = getParam(ctx.query.userId);

            const lastPostId = lastPostIdRaw ? parseInt(lastPostIdRaw, 10) : null;
            const userId = userIdRaw ? parseInt(userIdRaw, 10) : null;

            const user = await strapi.plugin("users-permissions").service("user-service").getUserByRequest(ctx);
    
            if (!user) {
                return ctx.notFound("User not found");
            }
    
            if (!user.confirmed) {
                return ctx.badRequest("User account is not confirmed.");
            }
    
            if (user.blocked) {
                return ctx.badRequest("User account is blocked.");
            }

            const data = await strapi.service('api::post.post').getPostsWithPagination(lastPostId, pageSize, userId);

            const friendIdsArray = await strapi.plugin("users-permissions").service("user-service").getUserFriendsIds(user.id);

            const friendIds = new Set(friendIdsArray);

            const postsWithIsFriend = data.posts.map(post => ({
                ...post,
                isFriend: friendIds.has(post.user.id),
            }));

            ctx.send({
                message: "Posts retrieved successfully",
                data: {
                    posts: postsWithIsFriend,
                    hasMore: data.hasMore,
                },
            }, 200);
    
        } catch (error) {
            console.error("Error", error.message);
            ctx.internalServerError("An unexpected error occurred" )
        }
    },
    async likePost(ctx: Context) {
        try {
            const { postId } = ctx.params;

            const user = await strapi.plugin("users-permissions").service("user-service").getUserByRequest(ctx);

            if (!user) {
                return ctx.notFound("User not found");
            }

            if (!user.confirmed) {
                return ctx.badRequest("User account is not confirmed.");
            }

            if (user.blocked) {
                return ctx.badRequest("User account is blocked.");
            }

            const post = await strapi.service('api::post.post').getPostById(postId);

            if (!post) {
                return ctx.notFound("Post not found");
            }

            const response = await strapi.service('api::post.post').likePost(post, user);

            ctx.send({
                message: response.message,
                data: response.updatedPost,
            }, 200);
        } catch (error) {
            console.error("Error", error.message);
            ctx.internalServerError("An unexpected error occurred")
        }
    },

    async deletePost(ctx: Context) {
        try {
            const { postId } = ctx.params;

            const user = await strapi.plugin("users-permissions").service("user-service").getUserByRequest(ctx);

            if (!user) {
                return ctx.notFound("User not found");
            }

            if (!user.confirmed) {
                return ctx.badRequest("User account is not confirmed.");
            }

            if (user.blocked) {
                return ctx.badRequest("User account is blocked.");
            }

            const post = await strapi.service('api::post.post').getPostById(postId);

            if (!post) {
                return ctx.notFound("Post not found");
            }

            // Check if the user is the owner of the post
            if (post.user.id !== user.id) {
                return ctx.forbidden("You are not allowed to delete this post");
            }

            // Delete the post
            const deletedPost = await strapi.entityService.delete('api::post.post', postId);

            ctx.send({
                message: 'Post deleted successfully',
                data: deletedPost,
            }, 200);
        } catch (error) {
            console.error("Error", error.message);
            ctx.internalServerError("An unexpected error occurred")
        }
    }

}));
