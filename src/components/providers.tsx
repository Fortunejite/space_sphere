'use client';

import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { useAppDispatch } from '@/hooks/redux.hook';
import { fetchCategories } from '@/redux/categorySlice';
import { useEffect } from 'react';
import store from '@/redux/store';
import { Provider } from 'react-redux';
import { SnackbarProvider } from '@/context/snackbar';

// import { useState, useEffect } from 'react';

const LoadReduxState = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return <></>;
};

const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Provider store={store}>
      <LoadReduxState />
      <SessionProvider>
        <ThemeProvider theme={theme('light')}>
          <CssBaseline />
          <SnackbarProvider>
            {/* <Navbar mode={mode} setMode={setMode} /> */}
            {children}
          </SnackbarProvider>
        </ThemeProvider>
      </SessionProvider>
    </Provider>
  );
};

export default Providers;
