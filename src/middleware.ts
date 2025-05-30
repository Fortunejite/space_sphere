import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api/|_next/|_static|_vercel|media/|[\\w-]+\\.\\w+).*)'],
};

const middleware = (req: NextRequest) => {
  const url = req.nextUrl;

  const hostname = req.headers.get('host') || '';

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;

  if (hostname.endsWith(`.${rootDomain}`)) {
    const subdomain = hostname.replace(`.${rootDomain}`, '');

    return NextResponse.rewrite(
      new URL(`/shops/${subdomain}${url.pathname}`, req.url),
    );
  }
};

export default middleware;
