import { customAlphabet } from "nanoid";
import { Unauthorized } from "rivetkit/errors";
import { auth } from "../auth";

export type AuthConnParams = {
  user: { id: string };
};

export const validateAuth = async (
  params: AuthConnParams,
  opts: { request?: Request }
) => {
  const authResult = await auth.api.getSession({
    headers: opts.request?.headers ?? {},
  });
  if (!authResult) throw new Unauthorized();

  if (params.user.id !== authResult.user.id) throw new Unauthorized();
};

// Using only alphanumeric characters for easy double-click selection
// Excluding similar-looking characters like l, I, 1, O, 0
const generateCustomId = customAlphabet(
  "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789",
  21 // generates an ID with 21 characters
);

export const generateId = <T extends string = string>(
  prefix?: string | undefined
): T =>
  prefix ? (`${prefix}_${generateCustomId()}` as T) : (generateCustomId() as T);
