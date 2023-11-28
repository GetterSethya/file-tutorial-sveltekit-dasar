import { auth } from "$lib/server/lucia";
import { redirect, type Handle } from "@sveltejs/kit";



export const handle:Handle = async ({event, resolve})=>{

    
    if(event.route.id === "/login" || event.route.id === "/register"){
        return resolve(event)
    }

    let cookie = event.cookies.get("session");


    if(!cookie) throw redirect(302,"/login")

    let session;

    try {
        
        session = await auth.validateSession(JSON.parse(cookie).sessionId)

        if(!session) throw redirect(302,"/login")

        const userData = await auth.getUser(session.user.userId);
        // const profile = await prisma.profile.findFirst({where:{user:userData.id},
        //     include:{image:{select:{thumbnail:true}}}
        // })


        event.locals.session = session
        event.locals.name = userData.name
        event.locals.userId = userData.userId
        event.locals.profile = undefined
        event.locals.username = userData.username


    } catch (err) {
        console.error(err)
        event.cookies.delete("session");
    }




    return await resolve(event)

}
