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
	friendsCount: number,
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
		friendsCount: user.friendsCount
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
		const user = await strapi.entityService.findOne('plugin::users-permissions.user', id, {
			populate: {
				role: true,
				photo: {
					fields: ['url']
				},
			},
		});

		const friendsCount = await strapi.db.query('api::friend-link.friend-link').count({
			where: {
				user: id,
			}
		});

		return {
			...user,
			friendsCount,
		};
	} catch (err) {
		console.error('getUserById error: ', err)
		throw err;
	}
}

const getUserFriendsIds = async (id: number): Promise<number[]> => {
	try {
		const links = await strapi.entityService.findMany('api::friend-link.friend-link', {
			filters: { user: id },
				populate: {
					friend: { fields: ['id'] },
				},
			});

		return links.map(link => link.friend.id) || [];	

	} catch (err) {
		console.error('getUserFriendsIds error: ', err);
		throw err;
	}
};

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

export const checkIsUserFriend = async (userId: number, targetUserId: number): Promise<boolean> => {
	try {
		const result = await strapi.entityService.findMany('api::friend-link.friend-link', {
			filters: {
				user: userId,
				friend: targetUserId,
			},
			limit: 1,
		});
		return result.length > 0;
	} catch (err) {
		console.error('checkIsUserFriend error:', err);
		throw err;
	}
};


export const followFriend = async (userId: number, friendId: number): Promise<any | void> => {
	try {

		const isFriend = await checkIsUserFriend(userId, friendId);

		let cursor = null;

		if (isFriend) {
			await strapi.db.query('api::friend-link.friend-link').delete({
				where: {
					user: userId,
					friend: friendId,
				}
			});
		} else {
			const doc = await strapi.entityService.create('api::friend-link.friend-link', {
				data: {
					user: userId,
					friend: friendId,
				},
			});
			cursor = doc.id;
		}

		return {
			message: isFriend ? 'You unfollowed the user' : 'You followed the user',
			isFriend: !isFriend,
			cursor,
		};

	} catch (error) {
		console.error('followFriend error: ', error)
		throw error;
	}
}

export const getUserFriendsWithPagination = async (
	lastFriendLinkId: string | null,
	pageSize: string,
	userId: number
): Promise<{ hasMore: boolean; friends: any[] }> => {
	try {
		const filters: any = { user: userId };
		console.log('lastFriendLinkId', typeof lastFriendLinkId);
		if (lastFriendLinkId) {
			filters.id = { $lt: Number(lastFriendLinkId) };
		}

		const friendLinks = await strapi.entityService.findMany('api::friend-link.friend-link', {
			filters,
			sort: [{ id: 'desc' }],
			limit: parseInt(pageSize, 10) + 1,
			populate: {
				friend: {
				fields: ['id', 'firstName', 'lastName', 'location'],
					populate: {
						photo: { fields: ['url'] },
					},
				},
			},
		});

		const hasMore = friendLinks.length > parseInt(pageSize, 10);
		if (hasMore) friendLinks.pop();

		const friends = friendLinks
		.filter(link => link.friend)
		.map(link => ({
			...link.friend,
			cursor: link.id,
		}));

		return {
			hasMore,
			friends,
		};
	} catch (error) {
		console.error('getUserFriendsWithPagination error:', error);
		throw new Error('Failed to load friends');
	}
};


export default {
    services: {
      'user-service': {
        getTokenByRequest,
        getUserIdByToken,
        getUserById,
        getUserByToken,
        getUserByRequest,
		followFriend,
		getUserFriendsIds,
		getUserFriendsWithPagination,
      }
    }
  }

