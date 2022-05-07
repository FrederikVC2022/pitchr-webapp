export const FETCH_CHATS = 'FETCH_CHATS'
export const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT'
export const FRIENDS_ONLINE = 'FRIENDS_ONLINE'
export const FRIEND_ONLINE = 'FRIEND_ONLINE'
export const FRIEND_OFFLINE = 'FRIEND_OFFLINE'
export const SET_SOCKET = 'SET_SOCKET'
export const RECEIVED_MESSAGE = 'RECEIVED_MESSAGE'
export const SENDER_TYPING = 'SENDER_TYPING'
export const PAGINATE_MESSAGES = 'PAGINATE_MESSAGES'
export const INCREMENT_SCROLL = 'INCREMENT_SCROLL'
export const CREATE_CHAT = 'CREATE_CHAT'
export const ADD_USER_TO_GROUP = 'ADD_USER_TO_GROUP'
export const LEAVE_CURRENT_CHAT = 'LEAVE_CURRENT_CHAT'
export const DELETE_CURRENT_CHAT = 'DELETE_CURRENT_CHAT'

const initialState = {
    chats: [],
    currentChat: {},
    socket: {},
    newMessage: { chatId: null, seen: null },
    scrollBottom: 0,
    senderTyping: { typing: false }
}

const chatReducer = (state = initialState, action) => {
    
    const { type, payload } = action

    switch (type) {

        case FETCH_CHATS:
            console.log(payload);
            return {
                ...state,
                chats: payload
            }

        case SET_CURRENT_CHAT:
            return {
                ...state,
                currentChat: payload,
                scrollBottom: state.scrollBottom + 1,
                newMessage: { chatId: null, seen: null }
            }

        case FRIENDS_ONLINE: {
            console.log(state);
            const chatsCopy = state.chats.map(chat => {
                return {
                    ...chat,
                    Users: chat.Users.map(user => {
                        if (payload.includes(user.id)) {
                            return {
                                ...user,
                                status: 'online'
                            }
                        }
                        return user
                    })
                }
            })

            return {
                ...state,
                chats: chatsCopy
            }
        }

        case FRIEND_ONLINE: {

            let currentChatCopy = { ...state.currentChat }

            const chatsCopy = state.chats.map(chat => {

                const Users = chat.Users.map(user => {

                    if (user.id === parseInt(payload.id)) {
                        return {
                            ...user,
                            status: 'online'
                        }
                    }
                    return user
                })

                if (chat.id === currentChatCopy.id) {
                    currentChatCopy = {
                        ...currentChatCopy,
                        Users
                    }
                }

                return {
                    ...chat,
                    Users
                }
            })

            return {
                ...state,
                chats: chatsCopy,
                currentChat: currentChatCopy
            }

        }

        case FRIEND_OFFLINE: {

            let currentChatCopy = { ...state.currentChat }

            const chatsCopy = state.chats.map(chat => {

                const Users = chat.Users.map(user => {

                    if (user.id === parseInt(payload.id)) {
                        return {
                            ...user,
                            status: 'offline'
                        }
                    }
                    return user
                })

                if (chat.id === currentChatCopy.id) {
                    currentChatCopy = {
                        ...currentChatCopy,
                        Users
                    }
                }

                return {
                    ...chat,
                    Users
                }
            })

            return {
                ...state,
                chats: chatsCopy,
                currentChat: currentChatCopy
            }

        }

        case SET_SOCKET: {
            return {
                ...state,
                socket: payload
            }
        }

        case RECEIVED_MESSAGE: {
            const { userId, message } = payload
            let currentChatCopy = { ...state.currentChat }
            let newMessage = { ...state.newMessage }
            let scrollBottom = state.scrollBottom

            const chatsCopy = state.chats.map(chat => {
                if (message.chatId === chat.id) {

                    if (message.User.id === userId) {
                        scrollBottom++
                    } else {
                        newMessage = {
                            chatId: chat.id,
                            seen: false
                        }
                    }

                    if (message.chatId === currentChatCopy.id) {
                        console.log("tilføjer en bedsked");
                        currentChatCopy = {
                            ...currentChatCopy,
                            Messages: [...currentChatCopy.Messages, ...[message]]
                        }
                    }
                    
                    return {
                        ...chat,
                        Messages: [...chat.Messages, ...[message]]
                    }
                }

                return chat
            })

            if (scrollBottom === state.scrollBottom) {
                return {
                    ...state,
                    chats: chatsCopy,
                    currentChat: currentChatCopy,
                    newMessage,
                    senderTyping: { typing: false }
                }
            }

            return {
                ...state,
                chats: chatsCopy,
                currentChat: currentChatCopy,
                newMessage,
                scrollBottom,
                senderTyping: { typing: false }
            }
        }

        case SENDER_TYPING: {
            if (payload.typing) {
                return {
                    ...state,
                    senderTyping: payload,
                    scrollBottom: state.scrollBottom + 1
                }
            }

            return {
                ...state,
                senderTyping: payload,
            }
        }

        case PAGINATE_MESSAGES: {
            const { messages, id, pagination } = payload

            let currentChatCopy = { ...state.currentChat }

            const chatsCopy = state.chats.map(chat => {
                if (chat.id === id) {
                    const shifted = [...messages, ...chat.Messages]

                    currentChatCopy = {
                        ...currentChatCopy,
                        Messages: shifted,
                        Pagination: pagination
                    }

                    return {
                        ...chat,
                        Messages: shifted,
                        Pagination: pagination
                    }
                }

                return chat
            })

            return {
                ...state,
                chats: chatsCopy,
                currentChat: currentChatCopy
            }
        }

        case INCREMENT_SCROLL:
            return {
                ...state,
                scrollBottom: state.scrollBottom + 1,
                newMessage: { chatId: null, seen: true }
            }

        case CREATE_CHAT:
            return {
                ...state,
                chats: [...state.chats, ...[payload]]
            }

        case ADD_USER_TO_GROUP: {

            const { chat, chatters } = payload

            let exists = false

            const chatsCopy = state.chats.map(chatState => {
                if (chat.id === chatState.id) {

                    exists = true

                    return {
                        ...chatState,
                        Users: [...chatState.Users, ...chatters]
                    }
                }

                return chatState
            })

            if (!exists) chatsCopy.push(chat)

            let currentChatCopy = { ...state.currentChat }

            if (Object.keys(currentChatCopy).length > 0) {
                if (chat.id === currentChatCopy.id) {
                    currentChatCopy = {
                        ...state.currentChat,
                        Users: [
                            ...state.currentChat.Users,
                            ...chatters
                        ]
                    }
                }
            }

            return {
                ...state,
                chats: chatsCopy,
                currentChat: currentChatCopy
            }
        }

        case LEAVE_CURRENT_CHAT: {
            const { chatId, userId, currentUserId } = payload

            if (userId === currentUserId) {

                const chatsCopy = state.chats.filter(chat => chat.id !== chatId)

                return {
                    ...state,
                    chats: chatsCopy,
                    currentChat: state.currentChat.id === chatId ? {} : state.currentChat
                }
            } else {

                const chatsCopy = state.chats.map(chat => {
                    if (chatId === chat.id) {
                        return {
                            ...chat,
                            Users: chat.Users.filter(user => user.id !== userId)
                        }
                    }

                    return chat
                })

                let currentChatCopy = { ...state.currentChat }
                if (currentChatCopy.id === chatId) {
                    currentChatCopy = {
                        ...currentChatCopy,
                        Users: currentChatCopy.Users.filter(user => user.id !== userId)
                    }
                }

                return {
                    ...state,
                    chats: chatsCopy,
                    currentChat: currentChatCopy
                }
            }
        }

        case DELETE_CURRENT_CHAT: {
            return {
                ...state,
                chats: state.chats.filter(chat => chat.id !== payload),
                currentChat: state.currentChat.id === payload ? {} : state.currentChat
            }
        }

        default: {
            return state
        }
    }
}

export default chatReducer