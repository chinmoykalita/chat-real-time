import z from 'zod';

const JOIN_ROOM = "JOIN_ROOM";
const SEND_MESSAGE = "SEND_MESSAGE";
const UPVOTE_MESSAGE = "UPVOTE_MESSAGE";
const LEAVE_ROOM = "LEAVE_ROOM";

export enum SupportedMessage {
    JoinRoom = JOIN_ROOM,
    SendMessage = SEND_MESSAGE,
    UpvoteMessage = UPVOTE_MESSAGE,
    LeaveRoom = LEAVE_ROOM
};

export type IncommingMessage = {
    type: SupportedMessage.JoinRoom,
    payload: InitMessageType
} | {
    type: SupportedMessage.SendMessage,
    payload: UserMessageType
} | {
    type: SupportedMessage.UpvoteMessage,
    payload: UpvoteMessageType
} | {
    type: SupportedMessage.LeaveRoom,
    payload: LeaveMessageType
}

export const InitMessage = z.object({
    name: z.string(),
    userId: z.string(),
    roomId: z.string(),
});

export type InitMessageType = z.infer<typeof InitMessage>;

export const UserMessage = z.object({
    userId: z.string(),
    roomId: z.string(),
    message: z.string(),
});

export type UserMessageType = z.infer<typeof UserMessage>;

export const UpvoteMessage = z.object({
    userId: z.string(),
    roomId: z.string(),
    chatId: z.string(),
});

export type UpvoteMessageType = z.infer<typeof UpvoteMessage>;

export const LeaveMessage = z.object({
    userId: z.string(),
    roomId: z.string(),
});

export type LeaveMessageType = z.infer<typeof LeaveMessage>;