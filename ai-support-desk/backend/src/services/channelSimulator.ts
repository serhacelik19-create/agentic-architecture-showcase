import { PrismaClient } from "@prisma/client";
import { generateDraftReply } from "./geminiService";
import { Server } from "socket.io";

const prisma = new PrismaClient();

// Dynamic inquiry templates for the simulator
const INQUIRY_TEMPLATES = [
  "Hello, I am having issues accessing my subscription billing details. It says my account is restricted.",
  "Could you please check if my payment card went through successfully? I received an email confirmation.",
  "I also need to update my billing address to 123 Tech Square, Boston, MA.",
  "Hi, is there an API reference for setting up custom webhook alerts on my server?",
  "I want to receive real-time notifications on Slack whenever my crawler status changes.",
  "My order #4829 has been stuck in 'pending shipment' status for the last two days.",
  "Is there a tracking number available yet? I need this package delivered by Friday.",
  "Can I cancel my monthly subscription plan directly from my dashboard billing settings?",
  "I keep getting a 500 internal server error when attempting to fetch my database connection strings.",
  "Merhaba, hesabıma giriş yaparken hata alıyorum, yardımcı olabilir misiniz?",
  "Ödeme yaptım fakat aboneliğim aktifleşmedi, kontrol edebilir misiniz?",
  "API entegrasyonu için dökümantasyonunuza nereden ulaşabilirim?"
];
export async function triggerSimulatedTicket(io: Server): Promise<Record<string, unknown> | null> {
  try {
    // Fetch all customers from the database to connect the simulator directly to the DB
    const customers = await prisma.customer.findMany();
    if (customers.length === 0) {
      console.error("[Simulator] No customers found in DB.");
      return null;
    }

    // Select a random customer from the DB
    const customer = customers[Math.floor(Math.random() * customers.length)];
    
    // Pick a random inquiry message
    const initialContent = INQUIRY_TEMPLATES[Math.floor(Math.random() * INQUIRY_TEMPLATES.length)];

    // Create Conversation
    const conversation = await prisma.conversation.create({
      data: {
        customerId: customer.id,
        status: "open",
      },
    });

    // Generate AI draft for the initial message
    const history = [{ sender: "customer", content: initialContent }];
    const draft = await generateDraftReply(history, customer.name, "friendly");

    // Create Message with draft
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender: "customer",
        content: initialContent,
        draftReply: draft,
      },
    });

    // Pack full ticket payload
    const ticketPayload = {
      id: conversation.id,
      status: conversation.status,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      customer: {
        id: customer.id,
        name: customer.name,
        channel: customer.channel,
        avatar: customer.avatar,
      },
      messages: [
        {
          id: message.id,
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp,
          draftReply: message.draftReply,
        },
      ],
    };

    // Emit event to all connected dashboard agents
    io.emit("ticket:new", ticketPayload);
    console.log(`[Simulator] New ticket from ${customer.name} via ${customer.channel}`);

    return ticketPayload;
  } catch (error) {
    console.error("[Simulator] Error generating mock ticket:", error);
    return null;
  }
}

/**
 * Automatically starts the periodic ticket generator (every 40 seconds).
 */
export function startChannelSimulator(io: Server) {
  console.log("[Simulator] Periodic channel simulator started.");

  // Seed an initial ticket 3 seconds after boot so the dashboard isn't empty
  setTimeout(() => {
    triggerSimulatedTicket(io).catch((e) => console.error(e));
  }, 3000);

  // Generate a ticket every 40 seconds
  setInterval(() => {
    triggerSimulatedTicket(io).catch((e) => console.error(e));
  }, 40000);
}
