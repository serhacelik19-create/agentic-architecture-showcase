import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { generateDraftReply } from "./services/geminiService";
import { startChannelSimulator, triggerSimulatedTicket } from "./services/channelSimulator";
import {
  validatePayload,
  messageSendSchema,
  messageIncomingSchema,
  redraftSchema,
  ticketResolveSchema,
} from "./lib/validation";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

const authMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.API_AUTH_TOKEN || "demo-auth-token-123";
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};


// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", service: "ai-support-desk-backend", time: new Date() });
});

// Analytics endpoint — returns real calculated metrics from the database
app.get("/api/analytics", authMiddleware, async (req, res) => {
  try {
    const [totalConversations, openCount, resolvedCount, totalMessages] = await Promise.all([
      prisma.conversation.count(),
      prisma.conversation.count({ where: { status: "open" } }),
      prisma.conversation.count({ where: { status: "resolved" } }),
      prisma.message.count(),
    ]);

    // Channel distribution
    const customers = await prisma.customer.findMany({
      select: { channel: true },
    });

    const channelDistribution = {
      whatsapp: customers.filter((c) => c.channel === "whatsapp").length,
      web: customers.filter((c) => c.channel === "web").length,
    };

    // Average response time estimation (time between customer message and next agent message)
    const conversations = await prisma.conversation.findMany({
      include: {
        messages: { orderBy: { timestamp: "asc" } },
      },
    });

    let totalResponseMs = 0;
    let responseCount = 0;

    for (const conv of conversations) {
      for (let i = 0; i < conv.messages.length - 1; i++) {
        if (conv.messages[i].sender === "customer" && conv.messages[i + 1].sender === "agent") {
          const diff =
            new Date(conv.messages[i + 1].timestamp).getTime() -
            new Date(conv.messages[i].timestamp).getTime();
          totalResponseMs += diff;
          responseCount++;
        }
      }
    }

    const avgResponseTime = responseCount > 0 ? Math.round(totalResponseMs / responseCount / 1000) : 0;

    res.json({
      totalConversations,
      openCount,
      resolvedCount,
      totalMessages,
      avgResponseTime,
      channelDistribution,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// REST endpoint to trigger simulator
app.post("/api/simulator/trigger", authMiddleware, async (req, res) => {
  const ticket = await triggerSimulatedTicket(io);
  if (ticket) {
    res.json({ success: true, ticket });
  } else {
    res.status(500).json({ success: false, error: "Failed to trigger simulated ticket" });
  }
});

const server = http.createServer(app);

// Setup Socket.io with permissive CORS for development
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  const expectedToken = process.env.API_AUTH_TOKEN || "demo-auth-token-123";
  if (token === expectedToken) {
    next();
  } else {
    next(new Error("Authentication error"));
  }
});


io.on("connection", (socket) => {
  console.log(`[WebSocket] Agent connected: ${socket.id}`);

  // 1. Fetch and return all conversations with their messages and customer models
  socket.on("ticket:list", async () => {
    try {
      const conversations = await prisma.conversation.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          customer: true,
          messages: {
            orderBy: { timestamp: "asc" },
          },
        },
      });
      socket.emit("ticket:list:response", conversations);
    } catch (error) {
      console.error("Error loading conversations:", error);
      socket.emit("error", "Failed to load active tickets");
    }
  });

  // 2. Resolve a ticket (with validation)
  socket.on("ticket:resolve", async (conversationId: unknown) => {
    const parsed = validatePayload(ticketResolveSchema, conversationId);
    if (!parsed) return;

    try {
      const updated = await prisma.conversation.update({
        where: { id: parsed },
        data: { status: "resolved" },
        include: { customer: true, messages: true },
      });

      // Notify all connected agents
      io.emit("ticket:updated", updated);
      console.log(`[WebSocket] Ticket ${parsed} marked resolved.`);
    } catch (error) {
      console.error("Error resolving conversation:", error);
    }
  });

  // 3. Handle agent sending a reply (with validation)
  socket.on("message:send", async (payload: unknown) => {
    const parsed = validatePayload(messageSendSchema, payload);
    if (!parsed) return;

    const { conversationId, content } = parsed;
    try {
      // Save agent message to database
      const message = await prisma.message.create({
        data: {
          conversationId,
          sender: "agent",
          content,
        },
      });

      // Update conversation timestamp
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      // Broadcast new message to all agents
      io.emit("message:new", { conversationId, message });
      console.log(`[WebSocket] Agent reply stored and broadcasted in ticket ${conversationId}`);
    } catch (error) {
      console.error("Error sending agent message:", error);
    }
  });

  // 4. Simulate a new incoming customer message in an existing thread (with validation)
  socket.on("message:incoming", async (payload: unknown) => {
    const parsed = validatePayload(messageIncomingSchema, payload);
    if (!parsed) return;

    const { conversationId, content } = parsed;
    try {
      // Fetch customer details to build personalization draft
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { customer: true, messages: true },
      });

      if (!conversation) return;

      // Save customer message
      const message = await prisma.message.create({
        data: {
          conversationId,
          sender: "customer",
          content,
        },
      });

      // Update conversation timestamp
      const updatedConv = await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
        include: { customer: true, messages: { orderBy: { timestamp: "asc" } } },
      });

      // Emit new message event instantly
      io.emit("message:new", { conversationId, message });

      // Generate a new AI draft reply considering historical messages
      const draft = await generateDraftReply(
        updatedConv.messages,
        updatedConv.customer.name,
        "friendly"
      );

      // Save the draft back into the message
      const updatedMessage = await prisma.message.update({
        where: { id: message.id },
        data: { draftReply: draft },
      });

      // Broadcast draft update event
      io.emit("message:draft:updated", { conversationId, messageId: message.id, draftReply: draft });
      console.log(`[WebSocket] Simulated incoming message from ${updatedConv.customer.name} and regenerated AI draft.`);
    } catch (error) {
      console.error("Error handling incoming mock customer message:", error);
    }
  });

  // 5. Regenerate AI draft reply with a newly selected tone (with validation)
  socket.on("ai:redraft", async (payload: unknown) => {
    const parsed = validatePayload(redraftSchema, payload);
    if (!parsed) return;

    const { conversationId, lastMessageId, tone } = parsed;
    try {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { customer: true, messages: { orderBy: { timestamp: "asc" } } },
      });

      if (!conversation) return;

      console.log(`[WebSocket] Regenerating AI draft in ${tone} tone for ticket ${conversationId}`);

      // Generate draft
      const draft = await generateDraftReply(conversation.messages, conversation.customer.name, tone);

      // Save to last message
      await prisma.message.update({
        where: { id: lastMessageId },
        data: { draftReply: draft },
      });

      // Broadcast update
      io.emit("message:draft:updated", { conversationId, messageId: lastMessageId, draftReply: draft });
    } catch (error) {
      console.error("Error redrafting reply:", error);
    }
  });

  // 6. Manual simulation trigger from the client dashboard
  socket.on("simulator:trigger", async () => {
    await triggerSimulatedTicket(io);
  });

  socket.on("disconnect", () => {
    console.log(`[WebSocket] Agent disconnected: ${socket.id}`);
  });
});

// Boot servers
server.listen(port, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 AI SUPPORT DESK BACKEND SERVER RUNNING ON PORT ${port}`);
  console.log(`⚡ WebSocket gateway: http://localhost:${port}`);
  console.log(`⚡ Health Endpoint:   http://localhost:${port}/api/health`);
  console.log(`⚡ Analytics:         http://localhost:${port}/api/analytics`);
  console.log(`======================================================\n`);

  // Start periodic mock channel ticket generation
  startChannelSimulator(io);
});
