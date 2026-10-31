// Mock Next.js Server primitives for tests and runtime independence
export class NextRequest extends Request {
  readonly nextUrl: URL;
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init);
    this.nextUrl = new URL(typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString());
  }
}

export class NextResponse<Body = any> extends Response {
  static json<JsonBody>(body: JsonBody, init?: ResponseInit): NextResponse<JsonBody> {
    const headers = new Headers(init?.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return new Response(JSON.stringify(body), {
      ...init,
      headers,
    }) as NextResponse<JsonBody>;
  }

  static redirect(url: string | URL, status = 307): NextResponse {
    return new Response(null, {
      status,
      headers: { Location: typeof url === 'string' ? url : url.toString() },
    }) as NextResponse;
  }
}
