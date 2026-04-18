import { GoogleGenerativeAI } from "@google/generative-ai";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModels.js";
import jwt from "jsonwebtoken";

const handleToolCalls = async (toolCalls, currentUserId) => {
  const responses = [];

  for (const call of toolCalls) {
    try {
      if (call.name === "getUserProfile") {
        if (!currentUserId || call.args.userId !== currentUserId) {
          responses.push({
            functionResponse: {
              name: call.name,
              response: { error: "Unauthorized access or guest user. Please log in first." }
            }
          });
          continue;
        }
        
        const user = await userModel.findById(currentUserId).select("-password");
        responses.push({
          functionResponse: {
            name: call.name,
            response: { profile: user || "User not found." }
          }
        });
      } 
      else if (call.name === "getUserOrders") {
        if (!currentUserId || call.args.userId !== currentUserId) {
          responses.push({
            functionResponse: {
              name: call.name,
              response: { error: "Unauthorized access or guest user. Please log in first." }
            }
          });
          continue;
        }

        const orders = await orderModel.find({ userId: currentUserId }).sort({ date: -1 }).limit(5);
        responses.push({
          functionResponse: {
            name: call.name,
            response: { orders: orders.length ? orders : "No orders found." }
          }
        });
      }
      else if (call.name === "searchProducts") {
        const query = call.args.query || "";
        const products = await productModel.find({
          $or: [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } }
          ]
        }).limit(5);
        
        responses.push({
          functionResponse: {
            name: call.name,
            response: { products: products.length ? products : "No products matching that query." }
          }
        });
      }
    } catch (err) {
      responses.push({
        functionResponse: {
          name: call.name,
          response: { error: "An error occurred fetching data." }
        }
      });
    }
  }
  
  return responses;
};

const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    let userId = null;

    const token = req.headers.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // drop silent
      }
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy");
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are a helpful E-Commerce store assistant for "Forever". The current logged in User ID is ${userId || 'Guest'}. If the ID is Guest, politely ask them to log in before checking orders or profile. ALWAYS pass this exact User ID as the argument when calling tools related to user profile or orders. Do not ask them for their ID. Greet them by name if you check their profile. Keep responses concise and friendly.`,
      tools: [
        {
          functionDeclarations: [
            {
              name: "getUserProfile",
              description: "Get the current user's profile information using their userId.",
              parameters: {
                type: "OBJECT",
                properties: { userId: { type: "STRING" } },
                required: ["userId"],
              },
            },
            {
              name: "getUserOrders",
              description: "Get the order history for a user using their userId.",
              parameters: {
                type: "OBJECT",
                properties: { userId: { type: "STRING" } },
                required: ["userId"],
              },
            },
            {
              name: "searchProducts",
              description: "Search for store products by keyword.",
              parameters: {
                type: "OBJECT",
                properties: { query: { type: "STRING" } },
                required: ["query"],
              },
            }
          ]
        }
      ]
    });

    // Gemini requires history to start with user. Drop the first message if it's the model's auto-greeting.
    let validHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    if (validHistory.length > 0 && validHistory[0].role === 'model') {
      validHistory.shift(); // Remove the leading model response
    }

    const chatSession = model.startChat({
      history: validHistory
    });

    let result = await chatSession.sendMessage(message);

    const calls = result.response.functionCalls ? result.response.functionCalls() : null;
    if (calls && calls.length > 0) {
      const functionResponses = await handleToolCalls(calls, userId);
      result = await chatSession.sendMessage(functionResponses);
    }

    res.json({ success: true, message: result.response.text() });

  } catch (error) {
    console.error("AI Error:", error.message || error);
    res.json({ success: false, message: "AI chat failed. " + (error.message || "Unknown error") });
  }
};

export { chat };
