комменты подгружать по клику 
дизайн как в инсте сверху иконка и имя а снизу сам коммент 
можно добавить лайки комменту 
инпут коммента как инпут создания поста 

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
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImlhdCI6MTczNDk4OTgxMSwiZXhwIjoxNzM3NTgxODExfQ.LYBfipBImQfFDxPNaPgxtbms5028I-qVzMfwXoidW_A",
    "user": {
        "id": 35,
        "username": "dimabondarenko2404+1@gmail.com",
        "firstName": "Dima",
        "lastName": "Bondarenko",
        "email": "dimabondarenko2404+1@gmail.com",
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

url: `api/auth/local`    
method: `POST`    
body (JSON): 
```json
{
    "identifier": "user@gmail.com",
    "password": "111111"
}
```

response body (Example):
```json
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImlhdCI6MTczMDU2MjU0OSwiZXhwIjoxNzMzMTU0NTQ5fQ.V_OT-HcSrDZjVfCn677sEPnhpI7N1bh1Asz36MQhbQY",
    "user": {
        "id": 17,
        "username": "User",
        "email": "user@gmail.com",
        "confirmed": true,
        "blocked": false,
    }
}
```
Statuses:   
200 - OK     
400 - Identifier is required
400 - Email is required
400 - User account is blocked
404 - Incorrect password. Please try again
404 - User not found
404 - User account is not confirmed
___

### Sent pin to email:

url: `api/auth/pinRequest`    
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
        "friends": [
            {
                "id": 43,
                "username": "d1@gmail.com"
            }
        ]
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
    "friend": {
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
            "updatedAt": "2025-03-18T21:08:23.371Z"
        },
        "photo": {
            "id": 24,
            "url": "/uploads/man1_77838d1bc1.webp"
        },
        "friends": [
            {
                "id": 43,
                "username": "d1@gmail.com"
            }
        ]
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
        "comments": []
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
                "comments": [
            {
                "id": 1,
                "text": "comment",
                "createdAt": "2025-02-17T19:17:52.575Z",
                "user": {
                    "id": 43,
                    "firstName": "test",
                    "lastName": "test",
                    "photo": {
                        "id": 22,
                        "url": "/uploads/link12_ae19bbb34a.png"
                    }
                }
            }
        ]
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
                "comments": [],
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
                "comments": [
                    {
                        "id": 1,
                        "text": "comment",
                        "createdAt": "2025-02-17T19:17:52.575Z",
                        "user": {
                            "id": 43,
                            "firstName": "test",
                            "lastName": "test",
                            "photo": {
                                "id": 22,
                                "url": "/uploads/link12_ae19bbb34a.png"
                            }
                        }
                    }
                ]
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

url: `api/post/:userId/list?page=1&pageSize=10`    
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
                    "id": 41,
                    "photo": {
                        "url": "/uploads/man1_77838d1bc1.webp"
                    }
                },
                "image": {
                    "url": "/uploads/Dima_Bondarenko_kot_dlya_detskogo_multika_rasczvetka_kota_chernyj_s_89c34888_83c9_4be8_8923_51e22a04f059_8e1e712de5.png"
                },
                "likes": [],
                "comments": [],
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
                    "id": 41,
                    "photo": {
                        "url": "/uploads/man1_77838d1bc1.webp"
                    }
                },
                "image": {
                    "url": "/uploads/Dima_Bondarenko_kot_dlya_detskogo_multika_rasczvetka_kota_chernyj_s_89c34888_83c9_4be8_8923_51e22a04f059_b30a8d1ee4.png"
                },
                "likes": [],
                "comments": [
                    {
                        "id": 1,
                        "text": "comment",
                        "createdAt": "2025-02-17T19:17:52.575Z",
                        "user": {
                            "id": 43,
                            "firstName": "test",
                            "lastName": "test",
                            "photo": {
                                "id": 22,
                                "url": "/uploads/link12_ae19bbb34a.png"
                            }
                        }
                    }
                ]
            }
        ],
        "meta": {
            "totalPosts": 7,
            "currentPage": 1,
            "totalPages": 2
        }
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
        "comments": []
    }
}

```
Statuses:   
200 - Post liked successfully
400 - User not confirmed! / Not found or blocked'
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
        }
    }
}

```
Statuses:   
200 - Comment created successfully
400 - User not confirmed! / Not found or blocked'
404 - User not found
404 - Post not found
___

## Update comment

## Like comment

## Delete comment