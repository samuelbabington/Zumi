import "server-only";
import { findUserById } from "./db";
import { getSession } from "./session";

export type CurrentUser = {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  avatarUrl: string | null;
  hasGoogle: boolean;
};

/** Data Access Layer: the only place that turns a session cookie into a user. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  if (!session) return null;
  const u = findUserById(session.userId);
  if (!u) return null;
  return {
    id: u.id,
    email: u.email,
    username: u.username,
    name: u.name,
    avatarUrl: u.avatar_url,
    hasGoogle: !!u.google_sub,
  };
}
