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
            // const page = Array.isArray(ctx.query.page) ? ctx.query.page[0] : ctx.query.page || "1";
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
    
            ctx.send({
                message: "Posts retrieved successfully",
                data: {
                    posts: data.posts,
                    hasMore: data.hasMore,
                },
            }, 200);
        } catch (error) {
            console.error("Error", error.message);
            ctx.internalServerError("An unexpected error occurred" )
        }
    },

    async getListByUser(ctx: Context) {
        try {
            const page = Array.isArray(ctx.query.page) ? ctx.query.page[0] : ctx.query.page || "1";
            const pageSize = Array.isArray(ctx.query.pageSize) ? ctx.query.pageSize[0] : ctx.query.pageSize || "10";

            const { userId } = ctx.params;

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

            const userWithPost = await strapi.plugin("users-permissions").service("user-service").getUserById(userId);

            if (!userWithPost) {
                return ctx.notFound("User not found");
            }
    
            if (!userWithPost.confirmed) {
                return ctx.badRequest("User account is not confirmed.");
            }
    
            if (userWithPost.blocked) {
                return ctx.badRequest("User account is blocked.");
            }

            const posts = await strapi.service('api::post.post').getPostsWithPagination(page, pageSize, userWithPost.id);
    
            const totalPosts = await strapi.service('api::post.post').getCoutPosts(userWithPost.id);
    
            ctx.send({
                message: "Posts retrieved successfully",
                data: {
                    posts,
                    meta: {
                        totalPosts,
                        currentPage: parseInt(page, 10),
                        totalPages: Math.ceil(totalPosts / parseInt(pageSize, 10)),
                    },
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
