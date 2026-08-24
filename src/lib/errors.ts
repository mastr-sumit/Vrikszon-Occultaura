import { NextResponse } from "next/server";

/**
 * Standardized Server-Side Error Handler
 *
 * Prevents information leakage (stack traces, SQL queries, internal paths) to clients.
 * Logs full diagnostic details to server console while sending a clean, generic message to the user.
 */
export function handleServerError(
  error: unknown,
  context: string,
  publicMessage: string = "An unexpected error occurred. Please try again or contact support."
): NextResponse {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  const errorName = error instanceof Error ? error.name : "UnknownError";

  // Full diagnostic logging on the server
  console.error(`[SERVER_ERROR] [${new Date().toISOString()}] [${context}]`, {
    name: errorName,
    message: errorMessage,
    stack: errorStack,
  });

  // Generic, sanitized response for the client
  return NextResponse.json(
    {
      error: publicMessage,
    },
    { status: 500 }
  );
}
