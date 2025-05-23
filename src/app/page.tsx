'use client';
import { Button } from '@mui/material';
import styles from './page.module.css';
import { useSession } from 'next-auth/react';

export default function Home() {

  const { status, data } = useSession();

  return (
    <div className={styles.page}>
      <p>Hello</p>
      <p>{status}</p>
      <p>{JSON.stringify(data?.user)}</p>
      <Button variant='contained'>Click me</Button>
    </div>
  );
}
