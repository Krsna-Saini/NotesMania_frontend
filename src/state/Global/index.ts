// features/theme/themeSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface Message {
    role: 'user' | 'assistant';
    content: string;
    selectedText?: string | null;
    pending?: boolean;
    error?: boolean;
}
const initialState: themeStatetype = {
    messages: [],
    loading: false,
    newChatId: "",
    darkMode: false,
    isAuthenticated: false,
    user: {
        id: "",
        username: "",
        email: "",
        profileImageUrl: "",
        description: "",
    },
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = {
                id: "",
                username: "",
                email: "",
                profileImageUrl: "",
                description: "",
            };
        },
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        addMessage(state, action: PayloadAction<Message>) {
            state.messages.push(action.payload);
        },
        updateLastMessage(state, action: PayloadAction<Partial<Message>>) {
            const last = state.messages[state.messages.length - 1];
            if (last) {
                Object.assign(last, action.payload);
            }
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setMessages(state, action: PayloadAction<Message[]>) {
            state.messages = action.payload;
        },
        setNewChatId(state, action: PayloadAction<string>) {
            state.newChatId = action.payload
        }
    },
});
export type themeStatetype = {
    darkMode: boolean;
    isAuthenticated: boolean;
    user: {
        id: string;
        username: string;
        email: string;
        profileImageUrl: string;
        description: string;
    };
    messages: Message[];
    loading: boolean;
    newChatId: string
};

export const { addMessage, updateLastMessage, setLoading, setMessages , setNewChatId,toggleDarkMode, setIsAuthenticated, login, logout, setUser } = themeSlice.actions;
export default themeSlice.reducer;
