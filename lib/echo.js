"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

let echo = null;

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_REVERB_APP_KEY
) {
  window.Pusher = Pusher;

  const tokenKey =
    process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME || "kniholap_auth_token";

  const authToken = localStorage.getItem(tokenKey);

  echo = new Echo({
    broadcaster: "reverb",
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8083),
    wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8083),
    forceTLS: false,
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/api/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
        Accept: "application/json",
      },
    },
  });

  const connection = echo?.connector?.pusher?.connection;

  if (connection) {
    connection.bind("connected", () =>
      console.log("✅ Reverb connected")
    );

    connection.bind("disconnected", () =>
      console.warn("⚠️ Reverb disconnected")
    );

    connection.bind("failed", () =>
      console.error("❌ Reverb failed")
    );
  }
}

export default echo;
