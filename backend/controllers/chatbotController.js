const asyncHandler = require("express-async-handler");
const axios = require("axios");

// @desc    Send message to chatbot
// @route   POST /api/chatbot
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { message, causes } = req.body;

  if (!message) {
    res.status(400);
    throw new Error("Please provide a message");
  }

  try {
    // Prepare context from causes data for RAG (Retrieval Augmented Generation)
    let context = "";
    if (causes && causes.length > 0) {
      context = "Here's detailed information about our current causes:\n\n";

      causes.forEach((cause, index) => {
        context += `Cause #${index + 1}: "${cause.title}"\n`;
        context += `Description: ${cause.description}\n`;
        context += `Location: ${cause.location}\n`;
        context += `Category: ${cause.category}\n`;
        context += `Target amount: $${cause.target_amount}\n`;
        context += `Current amount: $${cause.current_amount}\n`;
        context += `Percentage funded: ${Math.round(
          (cause.current_amount / cause.target_amount) * 100
        )}%\n`;
        context += `Status: ${cause.status}\n`;
        context += `Created on: ${new Date(
          cause.created_at
        ).toLocaleDateString()}\n`;
        context += `ID: ${cause.id}\n\n`;
      });
    } else {
      context = "We don't have any active causes at the moment.";
    }

    // Create system prompt to instruct the model for RAG
    const systemPrompt = `You are a helpful assistant for the Hands2gether platform, which connects people in need with those who can help, especially for food assistance causes. Your role is to answer questions about the platform and provide information about the current causes. Be friendly, helpful, and concise.
    
Here's what Hands2gether does:
- Connects people who need food assistance with donors and volunteers
- Enables users to create, view and contribute to various feeding initiatives
- Provides a platform for tracking contributions and impact
- Helps build a supportive network for sharing and contributing to causes
- Allows users to follow causes they care about and receive updates

${context}

When answering questions about causes:
1. Reference the data provided in the context above
2. If someone asks about a specific cause, find it in the context and provide details
3. If asked about details not available in the context, politely explain you only have limited information
4. Do not make up information
5. If asked about making donations or contributing, guide users to the specific cause page by mentioning they can click on the cause to contribute directly
6. Keep your answers concise and user-friendly, about 2-3 sentences when possible
7. If users ask how to create a cause, tell them they need to be registered and can click on "Create Cause" in the navigation
8. If asked how to follow causes, explain they can click the "Follow" button on any cause page

IMPORTANT FORMATTING INSTRUCTIONS:
- Use Markdown formatting in your responses to improve readability
- Use **bold** for emphasis and important points
- Use bullet points (*) or numbered lists (1. 2. 3.) to organize information
- Use ## for section headings when providing detailed information
- Use > for quoting cause descriptions
- When listing causes, use bullet points with the cause name in **bold**
- Use proper spacing between paragraphs

You're an AI assistant focused only on Hands2gether platform features and causes. Don't answer questions unrelated to the platform or charitable giving.`; // Prepare the request for OpenRouter API
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/devstral-small:free", // Use Mistral's free model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${
            process.env.OPENROUTER_API_KEY || "YOUR_API_KEY_HERE"
          }`,
          "HTTP-Referer": "https://hands2gether.org",
          "X-Title": "Hands2gether Assistant",
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the assistant's response
    const botReply = response.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      reply: botReply,
    });
  } catch (error) {
    console.error("Chatbot API Error:", error.response?.data || error.message);

    // Handle different types of errors
    if (error.response?.status === 401) {
      // Authentication error with OpenRouter
      res.status(500).json({
        success: false,
        reply:
          "I'm currently unable to connect to my knowledge source. Please check your API key configuration.",
      });
    } else if (
      error.code === "ECONNABORTED" ||
      error.message.includes("timeout")
    ) {
      // Timeout error
      res.status(504).json({
        success: false,
        reply:
          "I'm taking too long to respond. Please try a shorter or simpler question.",
      });
    } else {
      // Generic error
      res.status(500).json({
        success: false,
        reply:
          "I'm having trouble processing your request right now. Please try again shortly.",
      });
    }
  }
});

module.exports = {
  sendMessage,
};
