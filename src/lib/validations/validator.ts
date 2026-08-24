import { NextResponse } from "next/server";
import { z } from "zod";

export interface ValidationSuccess<T> {
  success: true;
  data: T;
}

export interface ValidationFailure {
  success: false;
  response: NextResponse;
  errors: Array<{ field: string; message: string }>;
}

export type ValidationOutcome<T> = ValidationSuccess<T> | ValidationFailure;

/**
 * Validates any raw input object against a strict Zod schema.
 * If validation fails, returns a standard 400 Bad Request NextResponse
 * containing precise field error diagnostics.
 */
export function validateInput<T>(schema: z.ZodType<T>, rawInput: unknown): ValidationOutcome<T> {
  const result = schema.safeParse(rawInput);

  if (!result.success) {
    const errorDetails = result.error.issues.map((issue) => {
      const fieldPath = issue.path.length > 0 ? issue.path.join(".") : "payload";
      return {
        field: fieldPath,
        message: issue.message,
        code: issue.code,
      };
    });

    const firstMessage = errorDetails[0]?.message || "Validation failed";

    const response = NextResponse.json(
      {
        error: firstMessage,
        details: errorDetails,
      },
      { status: 400 }
    );

    return {
      success: false,
      response,
      errors: errorDetails.map((e) => ({ field: e.field, message: e.message })),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/**
 * Parses and validates request JSON body with strict schema matching
 */
export async function parseAndValidateJson<T>(
  request: Request,
  schema: z.ZodType<T>
): Promise<ValidationOutcome<T>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Invalid JSON format in request body.",
          details: [{ field: "body", message: "Malformed or unparseable JSON" }],
        },
        { status: 400 }
      ),
      errors: [{ field: "body", message: "Malformed or unparseable JSON" }],
    };
  }

  return validateInput(schema, body);
}
