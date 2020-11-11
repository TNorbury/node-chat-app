export const generateMessage = (username: string, text: string) => {
    return {
        username,
        text,
        createdAt: new Date().getTime(),
    };
};

export interface Coordinate {
    latitude: string;
    longitude: string;
}

export const generateLocationMessage = (
    username: string,
    location: Coordinate
) => {
    return {
        username,
        url: `https://google.com/maps?q=${location.latitude},${location.longitude}`,
        createdAt: new Date().getTime(),
    };
};
