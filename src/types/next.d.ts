declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
    [key: string]: any;
  }
  export interface NextConfig {
    [key: string]: any;
  }
}

declare module 'next/server' {
  export class NextRequest extends Request {
    readonly nextUrl: URL;
  }

  export class NextResponse<Body = any> extends Response {
    static json<JsonBody>(body: JsonBody, init?: ResponseInit): NextResponse<JsonBody>;
    static redirect(url: string | URL, status?: number): NextResponse;
    static rewrite(destination: string | URL): NextResponse;
    static next(init?: ResponseInit): NextResponse;
  }
}

declare module 'next/font/google' {
  export function Geist(options?: any): { variable: string };
  export function Geist_Mono(options?: any): { variable: string };
}
