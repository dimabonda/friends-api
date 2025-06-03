после логина не видно друзей 
когда добавляешь через пост 

# Auth

## Registration     

url: `api/auth/local/register`    
method: `POST`  
headers: `Content-Type: application/json`   
body (form-data): 
```
{
    "firstName": "Dima",
    "lastName": "Bondarenko",
    "email": "dimabondarenko2404@gmail.com",
    "password": "111111",
    "location": "Kharkiv",
    "occupation": "Developer",
    "photo": File
}
```
response body (Example):
```json
{
    "user": {
        "id": 35,
        "username": "dimabondarenko2404+1@gmail.com",
        "firstName": "Dima",
        "lastName": "Bondarenko",
        "email": "dimabondarenko2404+1@gmail.com",
        "location": "Kharkiv",
        "occupation": "Developer",
        "confirmed": false,
        "blocked": false,
        "role": {
            "id": 1,
            "name": "Authenticated",
            "description": "Default role given to authenticated user.",
            "type": "authenticated",
            "createdAt": "2024-09-16T19:28:38.076Z",
            "updatedAt": "2024-11-02T16:21:16.920Z"
        },
        "photo": {
            "id": 14,
            "url": "/uploads/reduce_cvh_mobile_new1_e29cc2fb93.png"
        }
    },
    "message": "User created successfully"
}
```
Statuses:   
200 - OK     
400 - Email is not valid
400 - Email is required
400 - Username already exists
___

##  Sign In

url: `api/auth/local/login`    
method: `POST`    
body (JSON): 
```json
{
    "identifier": "user@gmail.com",
    "password": "111111"
}
```

response body (Example): if (confirmed === true) jwt 
```json
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDIsImlhdCI6MTc0NjkwODIyNCwiZXhwIjoxNzQ5NTAwMjI0fQ.6_xIhjSQgHJf4rwYxrCkfmtHV15ugdX2T_gyeiAbzKc",
    "user": {
        "id": 41,
        "username": "dimabondarenko2404@gmail.com",
        "firstName": "Dima",
        "lastName": "Bondarenko",
        "email": "dimabondarenko2404@gmail.com",
        "location": "Kharkiv",
        "occupation": "Developer",
        "confirmed": false,
        "blocked": false,
        "role": {
            "id": 7,
            "name": "User",
            "description": "Role assigned to standard users.",
            "type": "user",
            "createdAt": "2024-10-07T19:23:28.946Z",
            "updatedAt": "2025-05-10T17:29:36.403Z"
        },
        "photo": {
            "url": "/uploads/man1_77838d1bc1.webp"
        }
    },
}
```
Statuses:   
200 - OK  ||   User is not confirmed
400 - Identifier is required
400 - Email is required
400 - User account is blocked
404 - Incorrect password. Please try again
404 - User not found
___

## Sent pin to email:

url: `api/auth/pin-request`    
method: `POST`  
headers: `Content-Type: application/json`   
body (JSON, inviteCode is optional): 
```json
{
    "email": "user@gmail.com"
}
```
response body (Example):
```json
{
    "message": "Pin code sent"
}
```
Statuses:   
200 - Pin code sent        
400 - Email is required
400 - Email is not valid
404 - User not found
___

## Confirm User

url: `api/auth/pin-submit`    
method: `POST`  
headers: `Content-Type: application/json`   
body (JSON, inviteCode is optional): 
```json
{
    "email": "user@gmail.com"
    "pin": "803856"
}
```
response body (Example):
```json
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjEsImlhdCI6MTc0Njg5OTkxMSwiZXhwIjoxNzQ5NDkxOTExfQ.Jjv6WP7E1jckuC9WbEv4x95Lsxac8WovWFZqJAmL1Vo",
    "message": "User confirmed",
    "user": {
        "id": 61,
        "username": "user@gmail.com",
        "firstName": "Dima",
        "lastName": "Bondarenko",
        "email": "user@gmail.com",
        "location": "Kharkiv",
        "occupation": "Developer",
        "confirmed": true,
        "blocked": false,
        "role": {
            "id": 7,
            "name": "User",
            "description": "Role assigned to standard users.",
            "type": "user",
            "createdAt": "2024-10-07T19:23:28.946Z",
            "updatedAt": "2025-05-10T17:29:36.403Z"
        }
    }
}
```
Statuses:   
200 - User confirmed        
400 - Email is required
400 - Email is not valid
400 - Pin is required
400 - Pin must be a 6-digit number
404 - User not found
___


# User

## Me 

url: `api/user/me`
method: `GET`  

Authorization: Bearer [YOUR_TOKEN]

response body (Example):
```json
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDEsImlhdCI6MTczOTQ3ODE0NywiZXhwIjoxNzQyMDcwMTQ3fQ.Lmyn_j6J4myIjSoJLjI-vLUsZ7B0jcKqZRaTrg_pwlc",
    "user": {
        "id": 41,
        "username": "dimabondarenko2404@gmail.com",
        "firstName": "Dima",
        "lastName": "Bondarenko",
        "email": "dimabondarenko2404@gmail.com",
        "location": "Kharkiv",
        "occupation": "Developer",
        "confirmed": true,
        "blocked": false,
        "role": {
            "id": 1,
            "name": "Authenticated",
            "description": "Default role given to authenticated user.",
            "type": "authenticated",
            "createdAt": "2024-09-16T19:28:38.076Z",
            "updatedAt": "2025-01-27T21:07:22.572Z"
        },
        "photo": {
            "id": 24,
            "url": "/uploads/man1_77838d1bc1.webp"
        },
        "friendsCount": 1
    }
}

```
Statuses:   
200 - OK
400 - User not confirmed! / Not found or blocked'
404 - User not found
___

## Get user profile

url: `aapi/user/:userId/profile`
method: `GET`  

Authorization: Bearer [YOUR_TOKEN]

response body (Example):
```json
{
    "user": {
        "id": 42,
        "username": "dimabondarenko2404+1@gmail.com",
        "firstName": "test",
        "lastName": "test",
        "email": "dimabondarenko2404+1@gmail.com",
        "location": "Kharkiv",
        "occupation": "Develop",
        "confirmed": true,
        "blocked": false,
        "role": {
            "id": 7,
            "name": "User",
            "description": "Role assigned to standard users.",
            "type": "user",
            "createdAt": "2024-10-07T19:23:28.946Z",
            "updatedAt": "2025-05-26T19:03:49.143Z"
        },
        "photo": {
            "id": 21,
            "url": "/uploads/link12_02dfa00bbe.png"
        },
        "friendsCount": 1
    }
}

```
Statuses:   
200 - OK
400 - User not confirmed! / Not found or blocked'
404 - User not found
___

## Follow / UnFollow friend

url: `api/user/41/follow`
method: `POST`  

Authorization: Bearer [YOUR_TOKEN]

response body (Example):
```json

{
    "message": "You followed the user | You unfollowed the user",
    "isFriend": false | true,
    "cursor": 26 | null,
    "friend": {
        "id": 41,
        "firstName": "Dima",
        "lastName": "Bondarenko",
        "location": "Kharkiv",
        "photo": {
            "id": 24,
            "url": "/uploads/man1_77838d1bc1.webp"
        },
        "cursor": 26 | null,
    }
}

```
Statuses:   
200 - OK
400 - User not confirmed! / User account is blocked'
404 - User not found

400 - Friend not confirmed! / Friend account is blocked'
404 - Friend not found
400 - You can't follow yourself
___

## Get friends

url: `api/user/65/friends?pageSize=2&lastCursor=12`
method: `GET`  

Authorization: Bearer [YOUR_TOKEN]

response body (Example):
```json

{
    "hasMore": true,
    "friends": [
        {
            "id": 68,
            "firstName": "worker2",
            "lastName": "worker2",
            "location": "Kharkiv",
            "photo": {
                "id": 62,
                "url": "/uploads/image_1_eb097d824e.png"
            },
            "cursor": 11
        },
        {
            "id": 69,
            "firstName": "worker4",
            "lastName": "worker4",
            "location": "Kharkiv",
            "photo": {
                "id": 63,
                "url": "/uploads/image_59bf390b7d.png"
            },
            "cursor": 10
        }
    ]
}

```
Statuses:   
200 - OK
400 - User not confirmed! / User account is blocked'
404 - User not found
___

# Post

## Create post 

url: `api/post/create`    
method: `POST`  
headers: `Content-Type: application/json` 

Authorization: Bearer [YOUR_TOKEN]

body (form-data): 

```json
{
    "title": "This is my first post",
    "image": File
}

response body (Example):
```json
{
    "message": "Post created successfully",
    "data": {
        "id": 7,
        "title": "This is my first post",
        "createdAt": "2025-01-27T20:30:12.717Z",
        "updatedAt": "2025-01-27T20:30:12.717Z",
        "user": {
            "id": 41,
            "firstName": "Dima",
            "lastName": "Bondarenko",
            "location": "Kharkiv",
            "photo": {
                "id": 24,
                "url": "/uploads/man1_77838d1bc1.webp"
            }
        },
        "image": {
            "id": 27,
            "url": "/uploads/Dima_Bondarenko_kot_dlya_detskogo_multika_rasczvetka_kota_chernyj_s_89c34888_83c9_4be8_8923_51e22a04f059_0399b2c68a.png"
        },
        "likes": [],
        "commentCount": 2
    }
}

```
Statuses:   
200 - Post created successfully
400 - User not confirmed! / Not found or blocked'
400 - Post title is required
404 - User not found
___


## Get post 

url: `api/post/:postId`    
method: `GET`  
headers: `Content-Type: application/json` 

Authorization: Bearer [YOUR_TOKEN]

response body (Example):
```json
{
    "message": "Post created successfully",
    "data": {
        "id": 7,
        "title": "This is my first post",
        "createdAt": "2025-01-27T20:30:12.717Z",
        "updatedAt": "2025-01-27T20:30:12.717Z",
        "user": {
            "id": 41,
            "firstName": "Dima",
            "lastName": "Bondarenko",
            "location": "Kharkiv",
            "photo": {
                "id": 24,
                "url": "/uploads/man1_77838d1bc1.webp"
            }
        },
        "image": {
            "id": 27,
            "url": "/uploads/Dima_Bondarenko_kot_dlya_detskogo_multika_rasczvetka_kota_chernyj_s_89c34888_83c9_4be8_8923_51e22a04f059_0399b2c68a.png"
        },
        "likes": [],
        "commentCount": 8
    }
}

```
Statuses:   
200 - OK
400 - User not confirmed! / Not found or blocked'
404 - User not found
404 - Post not found
___

## Get post list 

url: `api/post/posts/list?lastPostId=1&pageSize=5`    
method: `GET`  
headers: `Content-Type: application/json` 

Authorization: Bearer [YOUR_TOKEN]

response body (Example):
```json
{
    "message": "Posts retrieved successfully",
    "data": {
        "posts": [
            {
                "createdAt": "2025-01-27T19:41:24.448Z",
                "id": 5,
                "title": "This is my first post",
                "updatedAt": "2025-01-27T19:41:24.448Z",
                "user": {
                    "firstName": "Dima",
                    "lastName": "Bondarenko",
                    "location": "Kharkiv",
                    "id": 41,
                    "photo": {
                        "url": "/uploads/man1_77838d1bc1.webp"
                    }
                },
                "image": {
                    "url": "/uploads/Dima_Bondarenko_kot_dlya_detskogo_multika_rasczvetka_kota_chernyj_s_89c34888_83c9_4be8_8923_51e22a04f059_8e1e712de5.png"
                },
                "likes": [],
                "commentCount": 3,
            },
            ......
            {
                "createdAt": "2025-01-27T21:17:22.131Z",
                "id": 9,
                "title": "This is my first post",
                "updatedAt": "2025-01-27T21:17:22.131Z",
                "user": {
                    "firstName": "Dima",
                    "lastName": "Bondarenko",
                    "location": "Kharkiv",
                    "id": 41,
                    "photo": {
                        "url": "/uploads/man1_77838d1bc1.webp"
                    }
                },
                "image": {
                    "url": "/uploads/Dima_Bondarenko_kot_dlya_detskogo_multika_rasczvetka_kota_chernyj_s_89c34888_83c9_4be8_8923_51e22a04f059_b30a8d1ee4.png"
                },
                "likes": [],
                "commentCount": 0,
            }
        ],
        "hasMore": true,
    }
}

```
Statuses:   
200 - Posts retrieved successfully
400 - User not confirmed! / Not found or blocked'
404 - User not found
404 - Post not found
___

## Get post list by user

url: `/api/post-list/all?userId=42&pageSize=2&lastPostId=47`    
method: `GET`  
headers: `Content-Type: application/json` 

Authorization: Bearer [YOUR_TOKEN]

response body (Example):
```json
{
    "message": "Posts retrieved successfully",
    "data": {
        "posts": [
            {
                "createdAt": "2025-05-17T22:33:47.006Z",
                "id": 47,
                "title": "84",
                "updatedAt": "2025-05-20T21:14:16.643Z",
                "user": {
                    "id": 42,
                    "firstName": "test",
                    "lastName": "test",
                    "location": "Kyiv",
                    "photo": {
                        "id": 21,
                        "url": "/uploads/link12_02dfa00bbe.png"
                    }
                },
                "image": null,
                "likes": [
                    {
                        "id": 65,
                        "firstName": "test",
                        "lastName": "test",
                        "photo": {
                            "id": 59,
                            "url": "/uploads/2025_05_04_20_24_01_63dd848b18.jpg"
                        }
                    }
                ],
                "commentCount": 0,
                "isFriend": true
            },
            {
                "createdAt": "2025-03-18T20:53:03.084Z",
                "id": 26,
                "title": "this is new post ",
                "updatedAt": "2025-05-15T21:39:16.046Z",
                "user": {
                    "id": 42,
                    "firstName": "test",
                    "lastName": "test",
                    "location": "Kyiv",
                    "photo": {
                        "id": 21,
                        "url": "/uploads/link12_02dfa00bbe.png"
                    }
                },
                "image": {
                    "id": 38,
                    "url": "/uploads/industry_ready_back_image480_35e58a34dd.png"
                },
                "likes": [
                    {
                        "id": 42,
                        "firstName": "test",
                        "lastName": "test",
                        "photo": {
                            "id": 21,
                            "url": "/uploads/link12_02dfa00bbe.png"
                        }
                    }
                ],
                "commentCount": 2,
                "isFriend": true
            },
        ],
        "hasMore": false
    }
}

```
Statuses:   
200 - Posts retrieved successfully
400 - User not confirmed! / Not found or blocked'
404 - User not found
404 - Post not found
___

## Like post

url: `api/post/5/like`    
method: `POST`  
headers: `Content-Type: application/json` 

Authorization: Bearer [YOUR_TOKEN]

response body (Example):
```json
{
    "message": "Post unliked | Post liked",
    "data": {
        "id": 5,
        "title": "This is my first post",
        "createdAt": "2025-01-27T19:41:24.448Z",
        "updatedAt": "2025-02-24T20:26:49.653Z",
        "user": {
            "firstName": "Dima",
            "lastName": "Bondarenko",
            "location": "Kharkiv",
            "id": 41,
            "photo": {
                "url": "/uploads/man1_77838d1bc1.webp"
            }
        },
        "image": {
            "url": "/uploads/Dima_Bondarenko_kot_dlya_detskogo_multika_rasczvetka_kota_chernyj_s_89c34888_83c9_4be8_8923_51e22a04f059_8e1e712de5.png"
        },
        "likes": [
            {
                "firstName": "test",
                "lastName": "test",
                "id": 43,
                "photo": {
                    "url": "/uploads/link12_ae19bbb34a.png"
                }
            }
        ],
       "commentCount": 2
    }
}

```
Statuses:   
200 - Post liked successfully
400 - User not confirmed! / Not found or blocked'
404 - User not found
404 - Post not found
___



## Delete post
url: `api/post/27`    
method: `DELETE`  
headers: `Content-Type: application/json` 

Authorization: Bearer [YOUR_TOKEN]

response body (Example):
```json
{
    "message": "Post deleted successfully",
    "data": {
        "id": 27,
        "title": "bla bla bla",
        "createdAt": "2025-03-19T21:30:19.348Z",
        "updatedAt": "2025-03-25T20:42:55.008Z"
    }
}

```
Statuses:   
200 - Post deleted successfully
400 - User not confirmed! / Not found or blocked'
403 - You are not allowed to delete this post
404 - User not found
404 - Post not found
___


# Comment

## Create comment 

url: `api/comments/create` 
method: `POST`  
headers: `Content-Type: application/json` 

Authorization: Bearer [YOUR_TOKEN]


```json
{
    "postId": "7",
    "text": "Comment for 7 post"
}

response body (Example):
```json
{
    "message": "Comment created successfully",
    "data": {
        "id": 5,
        "text": "Comment for 7 post",
        "createdAt": "2025-02-24T21:40:53.295Z",
        "updatedAt": "2025-02-24T21:40:53.295Z",
        "user": {
            "id": 42,
            "firstName": "test",
            "lastName": "test",
            "photo": {
                "id": 21,
                "url": "/uploads/link12_02dfa00bbe.png"
            }
        },
        "post": {
            "id": 7
        },
        "like": []
    }
}

```
Statuses:   
200 - Comment created successfully
400 - User not confirmed! / Not found or blocked'
404 - User not found
404 - Post not found
___

## Get comment list 

url: `api/comments/41/list?pageSize=5&lastCommentId=12`    
method: `GET`  
headers: `Content-Type: application/json` 

Authorization: Bearer [YOUR_TOKEN]

response body (Example):
```json
{
    "message": "Comments retrieved successfully",
    "data": {
        "comments": [
            {
                "createdAt": "2025-03-30T20:38:02.234Z",
                "id": 11,
                "text": "comment4 for 88",
                "updatedAt": "2025-03-30T20:38:02.234Z",
                "user": {
                    "id": 41,
                    "firstName": "Dima",
                    "lastName": "Bondarenko",
                    "photo": {
                        "id": 24,
                        "url": "/uploads/man1_77838d1bc1.webp"
                    }
                },
                "post": {
                    "id": 41
                },
                "likes": [
                    {
                        "id": 41,
                        "firstName": "Dima",
                        "lastName": "Bondarenko",
                        "photo": {
                            "id": 24,
                            "url": "/uploads/man1_77838d1bc1.webp"
                        }
                    }
                ]
            },
            ...
            {
                "createdAt": "2025-03-30T19:08:27.680Z",
                "id": 9,
                "text": "comment3 for 88 ",
                "updatedAt": "2025-03-30T19:08:27.680Z",
                "user": {
                    "id": 41,
                    "firstName": "Dima",
                    "lastName": "Bondarenko",
                    "photo": {
                        "id": 24,
                        "url": "/uploads/man1_77838d1bc1.webp"
                    }
                },
                "post": {
                    "id": 41
                },
                "likes": [
                    {
                        "id": 41,
                        "firstName": "Dima",
                        "lastName": "Bondarenko",
                        "photo": {
                            "id": 24,
                            "url": "/uploads/man1_77838d1bc1.webp"
                        }
                    }
                ]
            },
        ],
        "hasMore": true,
    }
}

```
Statuses:   
200 - Posts retrieved successfully
400 - User not confirmed! / Not found or blocked'
404 - User not found
404 - Post not found
___

## Update comment       empty

## Like comment

url: `/api/comments/8/like` 
method: `POST`  
headers: `Content-Type: application/json` 

Authorization: Bearer [YOUR_TOKEN]

response body (Example):
```json
{
    "message": "Post liked",
    "data": {
        "id": 8,
        "text": "comment for 88",
        "createdAt": "2025-03-30T19:04:13.954Z",
        "updatedAt": "2025-05-03T17:16:56.351Z",
        "user": {
            "firstName": "Dima",
            "lastName": "Bondarenko",
            "id": 41,
            "photo": {
                "url": "/uploads/man1_77838d1bc1.webp"
            }
        },
        "post": {
            "id": 41,
        },
        "likes": [
            {
                "firstName": "Dima",
                "lastName": "Bondarenko",
                "id": 41,
                "photo": {
                    "url": "/uploads/man1_77838d1bc1.webp"
                }
            }
        ]
    }
}

```
Statuses:   
200 - Post liked successfully
400 - User not confirmed! / Not found or blocked'
404 - User not found
404 - Post not found
___




## Delete comment       empty