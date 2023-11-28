import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const cookie = cookies.get('session');

		if (!cookies) {
			return fail(401);
		}

		try {
			const json = JSON.parse(cookie as string);
			await auth.invalidateSession(json.sessionId);
		} catch (err) {
			console.error(err);

			return fail(500);
		}

		cookies.delete('session');

		throw redirect(302, '/login');
	}
};
