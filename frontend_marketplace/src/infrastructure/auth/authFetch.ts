let refreshPromise: Promise<string> | null = null;

export type AuthFetchOptions = RequestInit & {
  token: string;
  onRefresh: () => Promise<string>;
  onLogout: () => void;
};

export async function authFetch(
  url: string,
  { token, onRefresh, onLogout, ...init }: AuthFetchOptions,
): Promise<Response> {
  const res = await fetch(url, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}` },
  });

  if (res.status !== 401) return res;

  if (!refreshPromise) {
    refreshPromise = onRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  let newToken: string;
  try {
    newToken = await refreshPromise;
  } catch {
    throw new Error("Session expired");
  }

  return fetch(url, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${newToken}` },
  });
}
