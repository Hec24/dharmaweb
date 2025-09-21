export function withUTM(
  baseUrl: string,
  params: Record<string, string | number | undefined>
) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  });
  return url.toString();
}
