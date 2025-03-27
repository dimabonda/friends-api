/**
 * comment router
 */

import { factories } from '@strapi/strapi';

const defaultRouter = factories.createCoreRouter('api::comment.comment');

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
        method: 'POST',
        path: '/comments/create',
        handler: 'api::comment.comment.createComment',
        config: {
            auth: {
                enabled: true
            },
            policies: [],
        }
    },
];

export default router(defaultRouter, Routes);