/**
 * post router
 */

import { factories } from '@strapi/strapi';

const defaultRouter = factories.createCoreRouter('api::post.post');


const router = (innerRouter: any, extraRoutes = []) => {
    let routes: any;
    return {
        get prefix() {
            return innerRouter.prefix;
        },
        get routes() {
            if (!routes) routes = innerRouter.routes.concat(extraRoutes);
            return routes;
        },
    };
};

const Routes = [
    {
        method: 'GET',
        path: '/post/:postId',
        handler: 'api::post.post.getPost',
        config: {
            auth: {
                enabled: true
            },
            policies: [],
        }
    },
    {
        method: 'GET',
        path: '/post/posts/list',
        handler: 'api::post.post.getList',
        config: {
            auth: {
                enabled: true
            },
            policies: [],
        }
    },
    {
        method: 'GET',
        path: '/post-list/all',
        handler: 'api::post.post.getPostsList',
        config: {
            auth: {
                enabled: true
            },
            policies: [],
        }
    },
    {
        method: 'POST',
        path: '/post/create',
        handler: 'api::post.post.createPost',
        config: {
            auth: {
                enabled: true
            },
            policies: [],
        }
    },
    {
        method: 'POST',
        path: '/post/:postId/like',
        handler: 'api::post.post.likePost',
        config: {
            auth: {
                enabled: true
            },
            policies: [],
        }
    },
    {
        method: 'DELETE',
        path: '/post/:postId',
        handler: 'api::post.post.deletePost',
        config: {
            auth: {
                enabled: true
            },
            policies: [],
        }
    },
    
];

export default router(defaultRouter, Routes);
