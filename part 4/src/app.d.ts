// See https://kit.svelte.dev/docs/types#app

import type { PrismaClient } from '@prisma/client';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('$lib/server/lucia').Auth;
			username: string;
			name: string;
			profile: string | undefined;
			userId: string;
			session: any;
		}
		// interface PageData {}
		// interface Platform {}
	}
	var prisma: PrismaClient;

	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {};
		type DatabaseSessionAttributes = {};
		type UserSchema = {
			id: string;
		};
		type SessionSchema = {
			id: string;
			active_expires: number;
			idle_expires: number;
			user_id: string;
		};
		type KeySchema = {
			id: string;
			user_id: string;
			hashed_password: string | null;
		};
	}
}

export {};
