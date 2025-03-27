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
                        }
                    }
                });
                resolve(comment)  
            } catch (error) {
                reject(error)
            }
        })
    }
}));
