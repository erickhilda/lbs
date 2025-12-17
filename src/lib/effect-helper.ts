import { Effect } from "effect";

import type { ErrorMessage } from "../types";
import { formatError } from "./format-error";

async function runEffect<A>(
  effect: Effect.Effect<A, ErrorMessage>,
): Promise<void> {
  const result = await Effect.runPromise(
    effect.pipe(
      Effect.catchAll((error) => {
        console.error("❌ Error:", formatError(error));
        process.exit(1);
        return Effect.succeed(undefined as any);
      }),
    ),
  );
  return result;
}

export { runEffect };
