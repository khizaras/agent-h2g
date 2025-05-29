# Hands2gether Chatbot Assistant

This document provides an overview of the Hands2gether AI chatbot feature implementation.

## Overview

The Hands2gether chatbot is an AI-powered assistant that helps users learn about the platform, find causes to support, and get answers to common questions. It uses RAG (Retrieval Augmented Generation) to provide context-aware responses based on the current causes in the system.

## Technical Implementation

### Frontend Components

- **Chatbot UI**: Floating chat button positioned in the bottom right corner of the application
- **Message Interface**: Allows for conversation with the AI assistant
- **Authentication Integration**: Only registered and logged-in users can use the chatbot

### Backend Integration

- **OpenRouter API**: Uses mistralai/devstral-small:free model for AI responses
- **RAG Implementation**: Sends causes data as context to the LLM for better responses
- **Protected Routes**: All chatbot API endpoints require authentication

## Configuration

The chatbot requires an OpenRouter API key to be set in the server's `.env` file:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## User Experience

### For Registered Users

- Access the chatbot by clicking the floating chat button
- Ask questions about causes, contributions, or platform features
- Get personalized responses based on their account and platform activity

### For Guest Users

- See the chatbot button but receive a prompt to log in when clicked
- Automatically redirected to the login page when attempting to use the chatbot
- Clear indication that the chatbot is a premium feature for registered users

## Sample Questions

The chatbot can answer questions like:

- "What causes need funding right now?"
- "How do I create a new cause?"
- "Tell me about food assistance programs"
- "How can I contribute to a cause?"
- "What is Hands2gether?"

## Technical Notes

1. The chatbot uses a RAG approach without vector database, passing causes data directly to the LLM
2. Response caching is not implemented in this version
3. The system is rate-limited by the OpenRouter API's free tier limitations
