
import { 
    register,
    login,
    pinRequestHandler,
    pinSubmitHandler,
} from "./controllers/auth-controllers";
import { 
    me,
    followFriend,
    getUserFriendsList,
    getUserProfile,
} from "./controllers/user-controllers";
import userServices from './services/user';
import { authRoutes } from "./routes/auth-routes";
import { userRoutes } from "./routes/user-routes";

const customPlugins = (plugin: any) => {

    authRoutes.forEach(item => plugin.routes["content-api"].routes.unshift(item))
    userRoutes.forEach(item => plugin.routes["content-api"].routes.unshift(item))

    plugin.controllers.auth.register = register;
    plugin.controllers.auth.login = login;
    plugin.controllers.auth.pinRequest = pinRequestHandler;
    plugin.controllers.auth.pinSubmit = pinSubmitHandler;

    plugin.controllers.user.me = me;
    plugin.controllers.user.followFriend = followFriend;
    plugin.controllers.user.getUserFriendsList = getUserFriendsList;
    plugin.controllers.user.getUserProfile = getUserProfile;

    return plugin;
}

export default (plugin: any) => {
    const extendedPlugin = customPlugins(plugin);
  
    return {
        ...extendedPlugin,
        services: {
            ...extendedPlugin.services,
            ...userServices.services,
        },
    };
  };
 