/**
 * Standalone Socket.io server for real-time features:
 * live notifications, room presence, and co-working session timers.
 *
 * Run alongside the Next.js app:
 *   node -r tsx/register server/socket.ts
 * or compile and run with node directly in production.
 *
 * The Next.js app connects to this server's URL via socket.io-client
 * (see hooks/use-socket.ts).
 */
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.SOCKET_PORT || 3001;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// userId -> Set of socket ids (a user can have multiple tabs/devices open)
const userSockets = new Map<string, Set<string>>();

io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId as string | undefined;

  if (userId) {
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId)!.add(socket.id);
    socket.join(`user:${userId}`);
  }

  // Join a room's live channel (post feed updates, presence)
  socket.on("room:join", (roomSlug: string) => {
    socket.join(`room:${roomSlug}`);
    io.to(`room:${roomSlug}`).emit("room:presence", { event: "joined", userId });
  });

  socket.on("room:leave", (roomSlug: string) => {
    socket.leave(`room:${roomSlug}`);
    io.to(`room:${roomSlug}`).emit("room:presence", { event: "left", userId });
  });

  // New post broadcast (called by API route via internal HTTP hook, or directly here)
  socket.on("post:new", ({ roomSlug, post }) => {
    socket.to(`room:${roomSlug}`).emit("post:new", post);
  });

  // Co-working / accountability session: shared pomodoro timer state
  socket.on("session:start", ({ roomSlug, durationSeconds }) => {
    io.to(`room:${roomSlug}`).emit("session:started", { durationSeconds, startedAt: Date.now() });
  });

  socket.on("disconnect", () => {
    if (userId) {
      const sockets = userSockets.get(userId);
      sockets?.delete(socket.id);
      if (sockets && sockets.size === 0) userSockets.delete(userId);
    }
  });
});

/**
 * Call this from API routes (via an internal fetch to a small HTTP bridge,
 * or by importing this module directly in a monorepo setup) to push a
 * real-time notification to a specific user.
 */
export function notifyUser(userId: string, event: string, payload: unknown) {
  io.to(`user:${userId}`).emit(event, payload);
}

httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
