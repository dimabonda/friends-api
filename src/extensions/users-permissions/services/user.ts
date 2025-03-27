import { Context } from 'koa';

interface UserDataPublic {
    id: number;
    username: string;
    firstName: string
    lastName: string;
    email: string;
    location: string;
    occupation: string;
    confirmed: boolean,
    blocked: boolean,
    role: object,
    photo: object,
	friends: object[],
}

export const userDataPublic = (user: any): UserDataPublic => {
    return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        occupation: user.occupation,
        confirmed: user.confirmed,
        blocked: user.blocked,
        role: user.role,
        photo: user.photo,
		friends: user.friends
    }
}

const isTokenExists = (ctx: Context): boolean => {
    return !!ctx?.request?.headers?.authorization;
};

const getTokenByRequest = async (ctx: Context): Promise<string> => {
	if (!isTokenExists(ctx)) {
	  throw new Error('Token does not exist');
	}

	try {
	  return ctx.request.headers.authorization.split(' ')[1];
	} catch (err) {
	  console.error('getTokenByRequest error:', err);
	  throw err;
	}
};

const getUserIdByToken = async (token: string): Promise<number> => {
	try {
		const { id } = await strapi.plugins['users-permissions'].services.jwt.verify(token)
		return id
	} catch (err) {
		console.error('getUserIdByToken error: ', err)
		throw err;
	}
}

const getUserById = async (id: number): Promise<any> => {
	try {
		return strapi.entityService.findOne('plugin::users-permissions.user', id, {
			populate: {
				role: true,
				photo: {
					fields: ['url'] 
				},
				friends: {
					fields: ['username', 'id']
				},
			},
		});
	} catch (err) {
		console.error('getUserById error: ', err)
		throw err;
	}
}
const getUserByToken = async (token: string): Promise<any> => {
	try {
		const id = await getUserIdByToken(token)
		if(!id) {
			throw new Error('User Id not found');
		}
		return getUserById(id);
	} catch (err) {
		console.error('getUserByToken error: ', err)
		throw err;
	}
}

export const getUserByRequest = async (ctx: Context): Promise<any | void> => {
	try {
		const token = await getTokenByRequest(ctx);
		if (typeof token !== 'string') {
			ctx.unauthorized("Invalid token");
			return;
		}
  
		const user = await getUserByToken(token);
		
	  	return user;
	} catch (error) {
		console.error("getUserByRequest error:", error);
		ctx.internalServerError("An unexpected error occurred");
	}
};

export const followFriend = async (userId: string, friendId: string): Promise<any | void> => {
	try {
		const user = await getUserById(Number(userId));
		if(!user) {
			throw new Error('User Id not found');
		}

		const isFriend = user.friends.some((friend) => friend.id === Number(friendId));

		const updatedUser = await strapi.db.query('plugin::users-permissions.user').update({
			where: { id: userId },
			data: {
				friends: isFriend
					? { disconnect: [{ id: friendId }] }
					: { connect: [{ id: friendId }] },
			}
		});
		
		return { 
			message: isFriend ? "You unfollowed the user" : "You followed the user",
			isFriend: !isFriend,
		};

	} catch (error) {
		console.error('followFriend error: ', error)
		throw error;
	}
}


export default {
    services: {
      'user-service': {
        getTokenByRequest,
        getUserIdByToken,
        getUserById,
        getUserByToken,
        getUserByRequest,
		followFriend,
      }
    }
  }

