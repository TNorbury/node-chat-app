const users: User[] = [];

interface User {
    id: string;
    username: string;
    room: string;
}

export const addUser = ({ id, username, room }: User) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate data
    if (!username || !room) {
        return {
            error: "Username and room are required!",
        };
    }

    // Check for existing user
    const existingUser: User = users.find((user) => {
        return user.room === room && user.username === username;
    });

    // Validate username
    if (existingUser) {
        return {
            error: "Username already taken!",
        };
    }

    // Store user
    const user: User = { id, username, room };
    users.push(user);

    return {
        user,
    };
};

export const removeUser = (id: string) => {
    const index: number = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

export const getUser = (id: string): User => {
    const user = users.find((user) => user.id === id);

    return user;
};

export const getUsersInRoom = (room: string): User[] => {
    room = room.trim().toLowerCase();
    const usersInRoom = users.filter((user) => user.room === room);

    return usersInRoom;
};
