import type { User } from "$lib/domain/user";

export const loggedInUser: { user: User | null } = $state({ user: null });