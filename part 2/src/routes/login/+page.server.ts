import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import { z, ZodError } from 'zod';
import type { PageServerLoad } from './$types';


export const load:PageServerLoad = async({cookies})=>{
    let cookie = cookies.get("session");

    if(cookie){
        throw redirect(302,"/")
    }
}




const loginSchema = z.object({
	username: z
		.string({
			required_error: 'Username is required',
			invalid_type_error: 'Username must be a string'
		})
		.min(8, {
			message: 'Username must be at least 8 characters long'
		}),
	password: z
		.string({
			required_error: 'Password is required',
			invalid_type_error: 'Password must be a string'
		})
		.min(8, {
			message: 'Password must be at least 8 characters long'
		})
});

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const formData = await request.formData();
		const { username, password } = Object.fromEntries(formData) as Record<string, string>;

		let user: any;

		try {
			loginSchema.parse({ username, password });
		} catch (err) {
			console.error(err);
			return fail(400);
		}

		try {
			user = await auth.useKey('username', username, password);

			if (user) {
				const session = await auth.createSession({
					userId: user.userId,
					attributes: {}
				});

				cookies.set('session', JSON.stringify(session));
				locals.session = session;
			}
		} catch (err) {
			console.error(err);

			return fail(500);
		}

		if (user) {
			throw redirect(302, '/');
		}
	}
};
