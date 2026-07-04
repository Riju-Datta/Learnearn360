"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export function useSocket() {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;

    const socket = io(SOCKET_URL, {
      auth: { userId: session.user.id },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [session?.user?.id]);

  return { socket: socketRef.current, connected };
}

/** Joins a room's live channel for the lifetime of the component. */
export function useRoomChannel(roomSlug: string | undefined) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !roomSlug) return;
    socket.emit("room:join", roomSlug);
    return () => { socket.emit("room:leave", roomSlug); };
  }, [socket, roomSlug]);

  return socket;
}
