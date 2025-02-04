import type { User } from "$lib/domain/user";

const users = new Map<string, User>();

export async function getUser(userId: string): Promise<User | null> {
    const user = users.get(userId);
    return user ?? null;
}

export async function createOrUpdateUser(userId: string | null, name: string): Promise<User> {
    const id = userId ?? createUserUniqueId();
    let user = users.get(id);

    if (user) {
        user.name = name;
    } else {
        user = { id: id, name };
        users.set(id, user);
    }

    return user;
}

export function createUserUniqueId(): string {
    return crypto.randomUUID();
}

