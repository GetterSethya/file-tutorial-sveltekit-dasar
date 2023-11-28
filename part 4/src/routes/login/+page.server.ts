import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import { z, ZodError } from 'zod';
import type { PageServerLoad } from './$types';
import { LuciaError, type Key } from 'lucia';
import { responseToastEnum, type responseToast } from '$lib/myTypes/myTypes';
import { type } from 'os';

export const load: PageServerLoad = async ({ cookies }) => {
	let cookie = cookies.get('session');

	if (cookie) {
		throw redirect(302, '/');
	}
};

const loginTimeout = new Map<
    string,
    {
        timeoutUntil:number;
        timeoutSeconds:number;
    }
    >();

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

		let data: responseToast;
		let user: Key;

		try {
			loginSchema.parse({ username, password });
		} catch (err) {
			console.error(err);
			if (err instanceof ZodError) {
				const error = err.errors.map((e) => {
					return e.message;
				});

				data = { error: true, message: error, type: responseToastEnum.warning };
				return fail(400, data);
			} else {
				data = { error: true, message: ['Internal server error'], type: responseToastEnum.error };
				return fail(500, data);
			}
		}

        const storedTimeout = loginTimeout.get(username);
        const timeoutUntil = storedTimeout?.timeoutUntil ?? 0;
        
        if(Date.now() < timeoutUntil){
            data = {
                error:true,
                message:[
                    `Too many request, try again in ${Math.floor((timeoutUntil - Date.now())/1000)} seconds`
                ],
                type:responseToastEnum.warning
            }

            return fail(429,data)
        }

        const timeoutSeconds = storedTimeout ? storedTimeout.timeoutSeconds *2 :1;
        loginTimeout.set(username,{
            timeoutUntil:Date.now()+timeoutSeconds * 1000,
            timeoutSeconds
        })


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
			if (
				err instanceof LuciaError &&
				(err.message === 'AUTH_DUPLICATE_KEY_ID' ||
					err.message === 'AUTH_INVALID_PASSWORD' ||
					err.message === 'AUTH_INVALID_KEY_ID')
			) {
				data = {
					error: true,
					message: ['Invalid username or password'],
					type: responseToastEnum.warning
				};
				return fail(400, data);
			} else {
				data = { error: true, message: ['Internal server error'], type: responseToastEnum.error };
				return fail(500, data);
			}
		}

		if (user) {
			throw redirect(302, '/');
		}
	}
};
