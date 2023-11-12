import { auth } from '$lib/server/lucia';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { z, ZodError } from 'zod';

export const load: PageServerLoad = async ({ cookies }) => {
	let cookie = cookies.get('session');

	if (cookie) {
		throw redirect(302, '/');
	}
};

const registerSchema = z.object({
	username: z
		.string({
			required_error: 'Username is required',
			invalid_type_error: 'Username must be a string'
		})
		.toLowerCase()
		.min(8, {
			message: 'Username must be at least 8 characters'
		})
		.regex(/^[a-z0-9]+$/, {
			message: 'Space characters/special characters is not allowed in username'
		}),
	name: z
		.string({
			required_error: 'Name is required',
			invalid_type_error: 'Name must be a string'
		})
		.min(1),
	password: z
		.string({
			required_error: 'Password is required',
			invalid_type_error: 'Password must be a string'
		})
		.min(8)
});

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		let user: Any;

		const { username, name, password, confirm_password } = Object.fromEntries(formData) as Record<
			string,
			string
		>;

		// cek apakah password dan confirm_password tidak sama
		if (password != confirm_password) {
			return fail(400);
		}

		//parse ke register schema
		try {
			registerSchema.parse({ username, name, password });
		} catch (err) {
			console.error(err);

			return fail(400);
		}

		// create user ke dalam database
		try {
			user = await auth.createUser({
				key: {
					providerId: 'username',
					providerUserId: username,
					password
				},
				attributes: { name, username }
			});
		} catch (err) {
			console.error(err);

			return fail(500);
		}

		if (user) {
			throw redirect(302, '/login');
		}
	}
};
