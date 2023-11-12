import {prismaClient} from "$lib/server/prisma"
import { lucia } from "lucia";
import {dev} from "$app/environment"
import { sveltekit } from "lucia/middleware";
import {prisma} from "@lucia-auth/adapter-prisma"

const client = prismaClient;


export const auth = lucia({
    env: dev?"DEV":"PROD",
    middleware:sveltekit(),
    adapter: prisma(client,{user:"user",key:"key",session:'session'}),

    getUserAttributes: (data)=>{
        return {id: data.id, username: data.username, name:data.name}
    }
})


export type Auth = typeof auth
