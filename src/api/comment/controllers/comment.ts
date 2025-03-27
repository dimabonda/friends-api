/**
 * comment controller
 */
import { Context } from 'koa';
import { factories } from '@strapi/strapi'

interface ICreateCommentBody {
    text: string;
    postId: string;
}

export default factories.createCoreController('api::comment.comment', ({ strapi}) => ({
    async createComment(ctx: Context){
        try {
            const { body } = ctx.request;
            const { text, postId } = body as ICreateCommentBody;

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

            if(!postId){
                return ctx.badRequest("Post ID is required")
            }

            const post = await strapi.service('api::post.post').getPostById(postId);

            if(!post){
                return ctx.notFound("Post not found");
            }

            if(!text){
                return ctx.badRequest("Comment text is required")
            }

            const data = {
                text: text,
                user: user,
                post: postId,
            }

            const newComment = await strapi.service('api::comment.comment').createComment(data);

            ctx.send({
                message: "Comment created successfully",
                data: newComment,
            }, 200)
        } catch (error) {
            console.error("Error", error.message);
            ctx.internalServerError("An unexpected error occurred" )
        }
    },

    // async getComments(ctx: Context){
    //     try {
    //         const { postId } = ctx.params;

    //         const comments = await strapi.service('api::comment.comment').getComments(postId);

    //         ctx.send({
    //             message: "Comments retrieved successfully",
    //             data: comments,
    //         }, 200)
    //     } catch (error) {
    //         console.error("Error", error.message);
    //         ctx.internalServerError("An unexpected error occurred" )
    //     }
    // }
}));
