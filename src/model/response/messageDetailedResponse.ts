export type MessageDetailedResponse = {
    text: string
    createdAt: string
    messageId: string
    user: {
        name: string
        surname: string
        userId: string
        createdAt: string
    }
}
