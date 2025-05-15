import { Context } from 'koa';
import { userDataPublic } from '../services/user';
import { yup, validateYupSchema } from "@strapi/utils";
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import _ from "lodash";
import { sendEmail } from '../services/send-email';



interface RegisterBody {
    firstName: string;
    lastName: string;
    location: string;
    occupation: string;
    email: string;
    password: string;
    picture: File;
}

interface SignInBody {
    identifier: string;
    password: string;
}

interface PinRequestBody {
    email: string;
}

interface PinSubmitBody {
    email: string;
    pin: string;
}

function pinGenerator() {
    const min = 0;
    const max = 999999;
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomCode.toString().padStart(4, '0');
}


export const register = async (ctx: Context) => {
    try {
        const body = ctx.request.body;
        const files = ctx.request.files

        const photo = files?.photo ? files.photo : null;
        const emailSchema = yup.string().email("Email is not valid").required("Email is required");
        const {
            firstName,
            lastName,
            email, 
            password,
            location,
            occupation,
        } = body as RegisterBody;

        if(!firstName){
            return ctx.badRequest("Firstname is required")
        }
        if(!lastName){
            return ctx.badRequest("Lastname is required")
        }
        if(!email){
            return ctx.badRequest("Email is required")
        }
        if(!password){
            return ctx.badRequest("Password is required")
        }
        if(!location){
            return ctx.badRequest("Location is required")
        }
        if(!occupation){
            return ctx.badRequest("Occupation is required")
        }
        if(!photo){
            return ctx.badRequest("Avatar is required")
        }

        try {
            await emailSchema.validate(email);
        } catch (error) {
            return ctx.badRequest(error.errors[0]);
        }

        const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
            where: {
                email,
            }
        })

        if (existingUser) {
            return ctx.badRequest("Email already exists");
        }

        const userRole = await strapi.query('plugin::users-permissions.role').findOne({
            where: { type: 'authenticated' },
        });

        if (!userRole) {
            return ctx.notFound("Role not found");
        }
        // upload picture
        let photoId: string | null = null;

        if (photo) {
            const uploadedFiles = await strapi.plugins['upload'].services.upload.upload({
                data: {},
                files: photo,
            });

            photoId = uploadedFiles[0].id;
        }

        const newUser = await strapi.entityService.create('plugin::users-permissions.user', {
            data: {
                username: email,
                firstName,
                lastName,
                email, 
                password,
                location,
                occupation,
                role: userRole.id,
                confirmed: false,
                blocked: false,
                photo: photoId,
            },
            populate: {
                role: true,
                photo: {
                    fields: ['url'] 
                },
            },
        });

        const emailTemplatePath = path.join(__dirname, '..', '..', '..', '..', '..', 'config', 'email-templates', 'pin-code.html');
        const template = await fs.promises.readFile(emailTemplatePath, 'utf8');
        const compiled = _.template(template);
        
        const code = pinGenerator();
        await strapi.plugin("users-permissions").service("user").edit(newUser.id, { pin: code });

        const html = compiled({ code });
        const text = `Your PIN code is: ${code}`;

        await sendEmail({
            to: email.toLowerCase(),
            subject: 'Confirm your registration with this PIN',
            html,
            text,
        });

        ctx.send({
            // jwt,
            user: userDataPublic(newUser),
            message: "User created successfully",
        }, 200)
    } catch (error) {
        console.error("Error", error.message);
        ctx.internalServerError("An unexpected error occurred" )
    }
}


export const login  = async (ctx: Context) => {
    try {
        const { identifier, password } = ctx.request.body as SignInBody;
        // const  = body as SignInBody;

        if(!identifier){
            return ctx.badRequest("Identifier is required")
        }

        if(!password){
            return ctx.badRequest("Password is required")
        }

        const user = await strapi.query("plugin::users-permissions.user").findOne({
            where: {
                email: identifier
            },
            populate: {
                role: true,
                photo: {
                    select: ['url'] 
                },
            },
        })

        if(!user){
            return ctx.notFound("User not found")
        }


        if(user.blocked){
            return ctx.badRequest("User account is blocked.");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword){
            return ctx.badRequest("Incorrect password. Please try again.");
        }

        if (!user.confirmed) {
            return ctx.send({
                user: userDataPublic(user),
                message: "User is not confirmed.",
            }, 200);
        }

        const jwt = strapi.plugin('users-permissions').service('jwt').issue({id: user.id});

        ctx.send({
            jwt,
            user: userDataPublic(user),
        }, 200)
    } catch (error) {
        console.error("Error", error.message);
        ctx.internalServerError("An unexpected error occurred" )
    }
}

export const pinRequestHandler = async (ctx: Context) => {
    try {
        const emailSchema = yup.string().email("Email is not valid").required("Email is required");
        const { email } = ctx.request.body as PinRequestBody;
        
        try {
            await emailSchema.validate(email);
        } catch (error) {
            return ctx.badRequest(error.errors[0]);
        }

        const user = await strapi.query("plugin::users-permissions.user").findOne({
            where: {
                email
            }
        })

        if (!user) {
            return ctx.notFound("User not found")
        }

        const emailTemplatePath = path.join(__dirname, '..', '..', '..', '..', '..', 'config', 'email-templates', 'pin-code.html');
        const template = await fs.promises.readFile(emailTemplatePath, 'utf8');
        const compiled = _.template(template);

        
        const code = pinGenerator();
        await strapi.plugin("users-permissions").service("user").edit(user.id, { pin: code });

         // put code to template
        const html = compiled({ code });
        const text = `Your PIN code is: ${code}`;
 
        await sendEmail({
            to: email.toLowerCase(),
            subject: 'Confirm your registration with this PIN',
            html,
            text,
        });
     
        ctx.send({
            message: "Pin code sent",
        });
    } catch (error) {
        console.error("Error", error.message);
        ctx.internalServerError("An unexpected error occurred" )
    }
}

export const pinSubmitHandler = async (ctx: Context) => {
    try {
        const body = ctx.request.body as PinSubmitBody;
        const schema = yup.object({
            email: yup.string().email("Email is not valid").required("Email is required"),
            pin: yup.string().matches(/^\d{6}$/, "Pin must be a 6-digit number").required("Pin is required"),
        });

        const { email, pin } = await schema.validate(body, { abortEarly: false });

        const user = await strapi.query("plugin::users-permissions.user").findOne({
            where: {
                email
            }
        })

        if (!user) {
            return ctx.notFound("User not found")
        }

        if (user.blocked){
            return ctx.forbidden("User is blocked")
        }

         // Check if the pin matches the saved pin
        if (pin !== user.pin) {
            return ctx.badRequest("Invalid pin")
        }

        const userRole = await strapi.query('plugin::users-permissions.role').findOne({
            where: { type: 'user' }
        });

        if(!userRole){
            return ctx.notFound('Role User not found')
        }
    
        const updatedUser = await strapi.plugin("users-permissions").service("user").edit(user.id, { 
            pin: '', 
            confirmed: true,
            role: userRole
        });

        const jwt = strapi.plugin('users-permissions').service('jwt').issue({id: updatedUser.id});

        ctx.send({
            jwt,
            message: "User confirmed",
            user: userDataPublic(updatedUser),  
        });
    } catch (error) {
        // console.error("Error", error.message);
        // ctx.internalServerError("An unexpected error occurred" )
        console.error("Error", error.message);
        if (error instanceof yup.ValidationError) {
            const errorDetails = error.inner.reduce((acc: Record<string, string>, err) => {
                if (err.path) {
                    acc[err.path] = err.message;
                }
                return acc;
            }, {});
            ctx.response.status = 400;
            ctx.response.body = {
                data: null,
                error: {
                    status: 400,
                    name: "BadRequestError",
                    message: "Validation Error",
                    details: errorDetails
                }
            };

        } else {
            ctx.internalServerError("An unexpected error occurred");
        }

    }
}

