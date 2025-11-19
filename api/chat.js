import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Store conversation sessions (in production, use Redis or similar)
const conversationSessions = new Map();

router.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId, userBalance } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get or create conversation history
        let conversation = conversationSessions.get(sessionId) || {
            messages: [],
            transferData: {}
        };

        // System prompt with function calling capabilities
        const systemPrompt = `You are a helpful banking assistant for OCBC Bank helping users transfer money. 
Your role is to:
1. Extract transfer information (recipient and amount) from natural language
2. Ask for missing information one piece at a time
3. When you have both recipient and amount, create a confirmation message in EXACTLY this format: "Confirm sending [recipient] $[amount]"
4. Be friendly and conversational

User's current balance: $${userBalance}

Important rules:
- Recipients can be phone numbers (like +65 9123 4567) or access codes (like 12345)
- Ask for the recipient first if not provided
- Then ask for the amount if not provided
- Validate that amounts are positive numbers
- After getting both pieces of info, show the confirmation message in the exact format specified
- Keep responses brief and clear`;

        // Add system message if this is the first message
        if (conversation.messages.length === 0) {
            conversation.messages.push({
                role: 'system',
                content: systemPrompt
            });
        }

        // Add user message
        conversation.messages.push({
            role: 'user',
            content: message
        });

        // Call Groq
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile', // Updated to current model
            messages: conversation.messages,
            temperature: 0.7,
            max_tokens: 200
        });

        const assistantMessage = completion.choices[0].message.content;

        // Add assistant response to history
        conversation.messages.push({
            role: 'assistant',
            content: assistantMessage
        });

        // Check if this is a confirmation message
        const confirmationMatch = assistantMessage.match(/Confirm sending (.+?) \$(\d+(?:\.\d{1,2})?)/i);
        
        let isConfirmation = false;
        if (confirmationMatch) {
            isConfirmation = true;
            conversation.transferData = {
                recipient: confirmationMatch[1].trim(),
                amount: parseFloat(confirmationMatch[2])
            };
        }

        // Update session
        conversationSessions.set(sessionId, conversation);

        // Clean up old sessions (older than 30 minutes)
        const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
        for (const [id, session] of conversationSessions.entries()) {
            if (session.timestamp && session.timestamp < thirtyMinutesAgo) {
                conversationSessions.delete(id);
            }
        }
        conversation.timestamp = Date.now();

        res.json({
            message: assistantMessage,
            isConfirmation,
            transferData: isConfirmation ? conversation.transferData : null
        });

    } catch (error) {
        console.error('Groq API error:', error);
        res.status(500).json({ 
            error: 'Failed to process message',
            details: error.message 
        });
    }
});

// Confirm transfer endpoint
router.post('/api/confirm-transfer', async (req, res) => {
    try {
        const { sessionId, confirmed } = req.body;

        const conversation = conversationSessions.get(sessionId);
        if (!conversation || !conversation.transferData) {
            return res.status(400).json({ error: 'No pending transfer' });
        }

        if (confirmed) {
            const { recipient, amount } = conversation.transferData;
            
            // Clear the session
            conversationSessions.delete(sessionId);
            
            return res.json({
                success: true,
                transfer: { recipient, amount }
            });
        } else {
            // User cancelled
            conversation.transferData = {};
            conversation.messages.push({
                role: 'assistant',
                content: 'Transfer cancelled. How else can I help you?'
            });
            
            return res.json({
                success: false,
                message: 'Transfer cancelled. How else can I help you?'
            });
        }

    } catch (error) {
        console.error('Confirmation error:', error);
        res.status(500).json({ error: 'Failed to process confirmation' });
    }
});

export default router;
