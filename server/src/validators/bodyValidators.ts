import { z } from "zod";

const createUserBody = z.object({
    name: z.string(),
    password: z.string()
});

const createRoomSchema = z.object({
    roomName: z.string(),
    private: z.boolean(),
    password: z.string(),
});

const validateJoinRoomSchema = z.object({
    id: z.string(),
    password: z.string().optional(),
})

export {
    createUserBody,
    createRoomSchema,
    validateJoinRoomSchema
}