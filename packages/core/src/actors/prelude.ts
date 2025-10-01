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
