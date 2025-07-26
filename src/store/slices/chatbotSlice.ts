import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    causesFound?: number;
    suggestions?: string[];
    sources?: string[];
    confidence?: number;
  };
}

export interface ChatConversation {
  id: string;
  user_id: number;
  session_id: string;
  messages: ChatMessage[];
  context?: {
    location?: string;
    preferences?: string[];
    lastQuery?: string;
  };
  is_active: boolean;
  rating?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatbotSettings {
  enabled: boolean;
  model: string;
  temperature: number;
  max_tokens: number;
  context_window: number;
  rag_enabled: boolean;
  suggested_prompts: string[];
}

interface ChatbotState {
  conversations: ChatConversation[];
  currentConversation: ChatConversation | null;
  settings: ChatbotSettings | null;
  isOpen: boolean;
  isTyping: boolean;
  loading: boolean;
  settingsLoading: boolean;
  error: string | null;
  quickSuggestions: string[];
  contextData: {
    nearbyPlaces?: string[];
    popularTopics?: string[];
    recentSearches?: string[];
  };
}

const defaultSuggestions = [
  "What food assistance is available near me?",
  "I need help finding clothing donations",
  "Are there any job training programs?",
  "How can I volunteer in my community?",
  "What educational opportunities are available?",
  "I want to donate items, how do I start?"
];

const initialState: ChatbotState = {
  conversations: [],
  currentConversation: null,
  settings: null,
  isOpen: false,
  isTyping: false,
  loading: false,
  settingsLoading: false,
  error: null,
  quickSuggestions: defaultSuggestions,
  contextData: {},
};

// Async thunks
export const sendMessage = createAsyncThunk(
  'chatbot/sendMessage',
  async ({ message, conversationId }: { message: string; conversationId?: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const currentConversation = state.chatbot.currentConversation;
      
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversation_id: conversationId || currentConversation?.id,
          context: currentConversation?.context,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchConversations = createAsyncThunk(
  'chatbot/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/chatbot/conversations');
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      return data.conversations;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const createConversation = createAsyncThunk(
  'chatbot/createConversation',
  async (initialMessage?: string, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/chatbot/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initial_message: initialMessage,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }
      
      const data = await response.json();
      return data.conversation;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateConversationRating = createAsyncThunk(
  'chatbot/updateRating',
  async ({ conversationId, rating, feedback }: { conversationId: string; rating: number; feedback?: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/chatbot/conversations/${conversationId}/rating`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, feedback }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update rating');
      }
      
      return { conversationId, rating, feedback };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchChatbotSettings = createAsyncThunk(
  'chatbot/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/chatbot/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch chatbot settings');
      }
      const data = await response.json();
      return data.settings;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchContextData = createAsyncThunk(
  'chatbot/fetchContextData',
  async (location?: string, { rejectWithValue }) => {
    try {
      const params = location ? `?location=${encodeURIComponent(location)}` : '';
      const response = await fetch(`/api/chatbot/context${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch context data');
      }
      
      const data = await response.json();
      return data.context;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    setChatbotOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setCurrentConversation: (state, action: PayloadAction<ChatConversation | null>) => {
      state.currentConversation = action.payload;
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: ChatMessage }>) => {
      const { conversationId, message } = action.payload;
      
      // Add to current conversation if it matches
      if (state.currentConversation?.id === conversationId) {
        state.currentConversation.messages.push(message);
      }
      
      // Add to conversations list
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.messages.push(message);
      }
    },
    updateConversationContext: (state, action: PayloadAction<{ conversationId: string; context: any }>) => {
      const { conversationId, context } = action.payload;
      
      if (state.currentConversation?.id === conversationId) {
        state.currentConversation.context = { ...state.currentConversation.context, ...context };
      }
      
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.context = { ...conversation.context, ...context };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },
    updateQuickSuggestions: (state, action: PayloadAction<string[]>) => {
      state.quickSuggestions = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isTyping = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isTyping = false;
        const { userMessage, assistantMessage, conversation } = action.payload;
        
        // Update current conversation
        if (conversation) {
          state.currentConversation = conversation;
          
          // Update in conversations list
          const existingIndex = state.conversations.findIndex(c => c.id === conversation.id);
          if (existingIndex >= 0) {
            state.conversations[existingIndex] = conversation;
          } else {
            state.conversations.unshift(conversation);
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isTyping = false;
        state.error = action.payload as string;
      })
      
    // Fetch conversations
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Create conversation
    builder
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
        state.conversations.unshift(action.payload);
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Update rating
    builder
      .addCase(updateConversationRating.fulfilled, (state, action) => {
        const { conversationId, rating, feedback } = action.payload;
        
        if (state.currentConversation?.id === conversationId) {
          state.currentConversation.rating = rating;
          state.currentConversation.feedback = feedback;
        }
        
        const conversation = state.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.rating = rating;
          conversation.feedback = feedback;
        }
      })
      
    // Fetch settings
    builder
      .addCase(fetchChatbotSettings.pending, (state) => {
        state.settingsLoading = true;
        state.error = null;
      })
      .addCase(fetchChatbotSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.settings = action.payload;
        if (action.payload.suggested_prompts) {
          state.quickSuggestions = action.payload.suggested_prompts;
        }
      })
      .addCase(fetchChatbotSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.error = action.payload as string;
      })
      
    // Fetch context data
    builder
      .addCase(fetchContextData.fulfilled, (state, action) => {
        state.contextData = action.payload;
      });
  },
});

export const {
  setChatbotOpen,
  setCurrentConversation,
  setTyping,
  addMessage,
  updateConversationContext,
  clearError,
  clearCurrentConversation,
  updateQuickSuggestions,
} = chatbotSlice.actions;

// Selectors
export const selectChatbotConversations = (state: RootState) => state.chatbot.conversations;
export const selectCurrentConversation = (state: RootState) => state.chatbot.currentConversation;
export const selectChatbotSettings = (state: RootState) => state.chatbot.settings;
export const selectChatbotOpen = (state: RootState) => state.chatbot.isOpen;
export const selectChatbotTyping = (state: RootState) => state.chatbot.isTyping;
export const selectChatbotLoading = (state: RootState) => state.chatbot.loading;
export const selectChatbotError = (state: RootState) => state.chatbot.error;
export const selectQuickSuggestions = (state: RootState) => state.chatbot.quickSuggestions;
export const selectContextData = (state: RootState) => state.chatbot.contextData;
export const selectConversationById = (state: RootState, id: string) => 
  state.chatbot.conversations.find(c => c.id === id);

export default chatbotSlice.reducer;