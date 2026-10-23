// ============================================================================
// DATAFORSEO API CLIENT HELPER
// Synlighetsrapporten - Floww Media
// ============================================================================

export interface DataForSeoResponse<T = unknown> {
  version: string;
  status_code: number;
  status_message: string;
  tasks_count: number;
  tasks_error: number;
  tasks?: Array<{
    id: string;
    status_code: number;
    status_message: string;
    result?: T[];
  }>;
}

export function getDataForSeoCredentials(): { login?: string; password?: string } {
  return {
    login: process.env.DATAFORSEO_LOGIN,
    password: process.env.DATAFORSEO_PASSWORD,
  };
}

export function hasDataForSeoCredentials(): boolean {
  const { login, password } = getDataForSeoCredentials();
  return Boolean(login && password);
}

/**
 * Execute a POST request against the DataForSEO v3 API.
 * Uses HTTP Basic Authentication.
 * Handles timeouts and non-200 responses gracefully without throwing unhandled exceptions.
 */
export async function postDataForSeo<T = unknown>(
  endpoint: string,
  payload: unknown,
  timeoutMs: number = 20000,
  log?: (msg: string, meta?: unknown) => void
): Promise<T[] | null> {
  const { login, password } = getDataForSeoCredentials();

  if (!login || !password) {
    if (log) {
      log('⚠️ DataForSEO credentials (DATAFORSEO_LOGIN/DATAFORSEO_PASSWORD) not configured.');
    }
    return null;
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `https://api.dataforseo.com/v3/${endpoint.replace(/^\//, '')}`;

  const authHeader = `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`;

  try {
    if (log) log(`DataForSEO POST request to: ${url}`);

    const res = await fetch(url, {
      method: 'POST',
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      if (log) log(`DataForSEO HTTP error ${res.status}: ${errText.slice(0, 200)}`);
      return null;
    }

    const json = (await res.json()) as DataForSeoResponse<T>;

    if (json.status_code !== 20000 && json.status_code !== 200) {
      if (log) log(`DataForSEO task error (${json.status_code}): ${json.status_message}`);
      return null;
    }

    const task = json.tasks?.[0];
    if (!task || (task.status_code !== 20000 && task.status_code !== 200)) {
      if (log) log(`DataForSEO task failed (${task?.status_code}): ${task?.status_message}`);
      return null;
    }

    return task.result || [];
  } catch (err: any) {
    if (log) log('DataForSEO request failed with exception:', err?.message || err);
    return null;
  }
}
