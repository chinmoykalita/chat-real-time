export type UserId = string;
export interface Chat {
    chatId: string;
    id: UserId,
    name: string,
    message: string,
    upvotes: UserId[] //who has upvoted
}

export abstract class Store {
    constructor() {

    };
    initRoom(roomId: string) {

    };
    
    getChats(roomId: string, limit: number, offset: number) {

    };

    addChat(userId: UserId, name: string, message: string, roomId: string) {

    };

    upVote(userId: UserId, roomId: string, chatId: string) {

    };
}