/**
 * comment service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::comment.comment', ({strapi}) =>({
    async createComment(data: any): Promise<any>{
        return new Promise(async (resolve, reject) => {
            try {
                const comment = await strapi.entityService.create('api::comment.comment', {
                    data,
                    populate: {
                        user: {
                            fields: ['firstName', 'lastName'],
                            populate: {
                                photo: {
                                    fields: ['url']
                                }
                            }
                        },
                        post: {
                            fields: ['id'],
                        },
                        likes: {
                            fields: ['firstName', 'lastName'],
                            populate: {
                                photo: {
                                    fields: ['url']
                                }
                            }
                        },
                    }
                });
                resolve(comment)  
            } catch (error) {
                reject(error)
            }
        })
    },
    async getComments(lastId: string | null, pageSize: string, postId: string | null): Promise<any>{
        try {
            const filters = {}
            if(postId){
                filters['post'] = postId
            }

            if (lastId) {
                const lastComment = await strapi.entityService.findOne('api::comment.comment', lastId, { fields: ['createdAt'] });
    
                if (lastComment) {
                    filters['createdAt'] = { $lt: lastComment.createdAt };
                }
            }

            const comments = await strapi.entityService.findMany('api::comment.comment',{
                filters: filters,
                limit: parseInt(pageSize, 10) + 1,       
                sort: [{ createdAt: 'desc' }],
                populate: {
                    user: {
                        fields: ['firstName', 'lastName'],
                        populate: {
                            photo: {
                                fields: ['url', 'id']
                            }
                        }
                    },
                    post: {
                        fields: ['id']
                    },
                    likes: {
                        fields: ['firstName', 'lastName'],
                        populate: {
                            photo: {
                                fields: ['url']
                            }
                        }
                    },
                },
            });

            const hasMore = comments.length > parseInt(pageSize, 10);

            if (hasMore) {
                comments.pop();
            }

            return { hasMore, comments}
        } catch (error) {
            console.error('getPostsWithPagination error: ', error)
            throw error;
        }
    },

    async getCommentById(commentId: string): Promise<any>{
        try {
            const comment = await strapi.entityService.findOne('api::comment.comment', commentId, {
                populate: {
                    user: {
                        fields: ['firstName', 'lastName'],
                        populate: {
                            photo: {
                                fields: ['url', 'id']
                            }
                        }
                    },
                    post: {
                        fields: ['id']
                    },
                    likes: {
                        fields: ['firstName', 'lastName'],
                        populate: {
                            photo: {
                                fields: ['url']
                            }
                        }
                    },
                },
            });

            return comment
        } catch (error) {
            console.error('getCommentById error: ', error)
            throw error;
        }
    },

    async likeComment(comment: any, user: any): Promise<any>{
        try {
            const isLiked = comment.likes.some((like) => like.id === user.id);


            const updatedComment = await strapi.db.query("api::comment.comment").update({
                where: { id: comment.id },
                data: {
                    likes: isLiked
                        ? { disconnect: [{ id: user.id }] }
                        : { connect: [{ id: user.id }] },
                },
                populate: {
                    user: {
                        select: ['firstName', 'lastName'],
                        populate: {
                            photo: {
                                select: ['url']
                            }
                        }
                    },
                    post: {
                        select: ['id']
                    },
                    likes: {
                        select: ['firstName', 'lastName'],
                        populate: {
                            photo: {
                                select: ['url']
                            }
                        }
                    },
                },
            });


            return {
                message: isLiked ? "Post unliked" : "Post liked",
                updatedComment,
            };
        } catch (error) {
            console.error('likeComment error: ', error)
            throw error;
        }
    }
}));
