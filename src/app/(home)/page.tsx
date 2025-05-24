'use client';
import { useSession } from 'next-auth/react';

export default function Home() {

  const { status, data } = useSession();

  return (
    <div>
      <p>Hello</p>
      <p>{status}</p>
      <p>{JSON.stringify(data?.user)}</p>
    </div>
  );
}
