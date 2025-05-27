/**
 * post service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::post.post', ({strapi}) =>({
    async getPostsWithPagination(lastPostId: string | null, pageSize: string, userId: string | null): Promise<any>{
        try {
            const filters = {}
            if(userId){
                filters['user'] = userId
            }

            if (lastPostId) {
                const lastPost = await strapi.entityService.findOne('api::post.post', lastPostId, { fields: ['createdAt'] });
    
                if (lastPost) {
                    filters['createdAt'] = { $lt: lastPost.createdAt };
                }
            }

            const posts = await strapi.entityService.findMany('api::post.post',{
                filters: filters,
                limit: parseInt(pageSize, 10) + 1,       
                sort: [{ createdAt: 'desc' }],
                populate: {
                    user: {
                        fields: ['firstName', 'lastName', 'location'],
                        populate: {
                            photo: {
                                fields: ['url']
                            }
                        }
                    },
                    image: {
                        fields: ['url'] 
                    },
                    likes: {
                        fields: ['firstName', 'lastName'],
                        populate: {
                            photo: {
                                fields: ['url']
                            }
                        }
                    },
                    comments: {
                        fields: ['id']
                    }
                },
            });

            const postsWithCommentCount = posts.map(post => {
                const commentCount = post.comments.length;
                delete post.comments;
                return { ...post, commentCount };
            });

            const hasMore = postsWithCommentCount.length > parseInt(pageSize, 10);

            if (hasMore) {
                postsWithCommentCount.pop();
            }

            return { hasMore, posts: postsWithCommentCount}
        } catch (error) {
            console.error('getPostsWithPagination error: ', error)
            throw error;
        }
    },
    async getCoutPosts(userId: string | null): Promise<number>{
        try {
            const filters = {}
            if(userId){
                filters['user'] = userId
            }
            const count = await strapi.entityService.count('api::post.post', {
                filters: filters
            })

            return count
        } catch (error) {
            console.error('getCoutPosts error: ', error)
            throw error;
        }
    },
    async getPostById(postId: string): Promise<any>{
        try {
            const post = await strapi.entityService.findOne('api::post.post', postId, {
                populate: {
                    user: {
                        fields: ['firstName', 'lastName', 'location'],
                        populate: {
                            photo: {
                                fields: ['url']
                            }
                        }
                    },
                    image: {
                        fields: ['url'] 
                    },
                    likes: {
                        fields: ['firstName', 'lastName'],
                        populate: {
                            photo: {
                                fields: ['url']
                            }
                        }
                    },
                    comments: {
                        fields: ['id']
                    }
                },
            });
            if (!post) return null;
            const commentCount = post.comments.length;
            delete post.comments;
            return { ...post, commentCount }
        } catch (error) {
            console.error('getPostById error: ', error)
            throw error;
        }
    },
    async createPost(data): Promise<any>{
        try {
            const newPost = await strapi.entityService.create('api::post.post', {
                data,
                populate: {
                    user: {
                        fields: ['firstName', 'lastName', 'location'],
                        populate: {
                            photo: {
                                fields: ['url']
                            }
                        }
                    },
                    image: {
                        fields: ['url'] 
                    },
                    likes: {
                        fields: ['firstName', 'lastName'],
                        populate: {
                            photo: {
                                fields: ['url']
                            }
                        }
                    },
                    comments: {
                        fields: ['id']
                    }
                },
            });
            const commentCount = newPost.comments.length;
            delete newPost.comments;

            return { ...newPost, commentCount}
        } catch (error) {
            console.error('createPost error: ', error)
            throw error;
        }
    },
    async likePost(post: any, user: any): Promise<any>{
        try {
            const isLiked = post.likes.some((like) => like.id === user.id);

            const updatedPost = await strapi.db.query("api::post.post").update({
                where: { id: post.id },
                data: {
                    likes: isLiked
                        ? { disconnect: [{ id: user.id }] }
                        : { connect: [{ id: user.id }] },
                },
                populate: {
                    user: {
                        select: ['firstName', 'lastName', 'location'],
                        populate: {
                            photo: {
                                select: ['url']
                            }
                        }
                    },
                    image: {
                        select: ['url'] 
                    },
                    likes: {
                        select: ['firstName', 'lastName'],
                        populate: {
                            photo: {
                                select: ['url']
                            }
                        }
                    },
                    comments: {
                        fields: ['id']
                    }
                },
            });

            const commentCount = updatedPost.comments.length;
            delete updatedPost.comments;

            return {
                message: isLiked ? "Post unliked" : "Post liked",
                updatedPost: { ...updatedPost, commentCount },
            };

        } catch (error) {
            console.error('likePost error: ', error)
            throw error;
        }
    },
    async deletePost(postId: string): Promise<any>{
        try {
            const post = await strapi.entityService.findOne('api::post.post', postId, {
                populate: {
                    user: {
                        fields: ['firstName', 'lastName', 'location'],
                        populate: {
                            photo: {
                                fields: ['url']
                            }
                        }
                    },
                    image: {
                        fields: ['url'] 
                    },
                    likes: {
                        fields: ['firstName', 'lastName'],
                        populate: {
                            photo: {
                                fields: ['url']
                            }
                        }
                    },
                    comments: {
                        fields: ['id']
                    }
                },
            });
            if (!post) return null;

            

            return { message: "Post deleted successfully" }
        } catch (error) {
            console.error('deletePost error: ', error)
            throw error;
        }
    }

}));

