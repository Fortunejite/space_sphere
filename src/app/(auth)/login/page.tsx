'use client';

import { ChangeEvent, FormEvent, Suspense, useCallback, useState } from 'react';

import {
  Button,
  CircularProgress,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { loginUserSchema } from '@/lib/schema/auth';
import { ZodError } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSnackbar } from '@/context/snackbar';

const LoginPage = () => {
  const router = useRouter();
  const params = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { setIsOpen: setSnackbarOpen, setMessage } = useSnackbar();

  setMessage('Invalid credentials');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    try {
      loginUserSchema.parse(formData);
    } catch (err) {
      if (err instanceof ZodError) {
        err.errors.forEach((e) => {
          errors[e.path[0]] = e.message;
        });
      }
    } finally {
      setFormErrors(errors);
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const res = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (res?.error) {
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    router.replace(params.get('callback') || '/');
  };

  return (
    <Grid container flex={1}>
      <Grid
        size={{ xs: 12, sm: 8 }}
        p={{ xs: 1, sm: 2 }}
        gap={2}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        component={'form'}
        onSubmit={handleSubmit}
      >
        <Typography variant='h1'>Welcome Back!</Typography>
        <TextField
          required
          label='Email'
          variant='standard'
          name='email'
          value={formData.email}
          error={!!formErrors.email}
          helperText={formErrors.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          required
          label='Password'
          variant='standard'
          name='password'
          type='password'
          value={formData.password}
          error={!!formErrors.password}
          helperText={formErrors.password}
          onChange={handleChange}
          fullWidth
        />

        <Button
          type='submit'
          variant='contained'
          loading={loading}
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>

        <Typography variant='body2' align='center' mt={2}>
          Don&apos;t have an account?{' '}
          <Link href='/register' style={{ textDecoration: 'underline' }}>
            signup!
          </Link>
        </Typography>
        <Stack></Stack>
      </Grid>
      <Grid
        size={{ xs: 12, sm: 4 }}
        sx={{
          background: 'url(./authPic.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
        }}
      ></Grid>
    </Grid>
  );
};

const LoginSuspense = () => (
  <Suspense fallback={<><CircularProgress /></>}>
    <LoginPage />
  </Suspense>
)

export default LoginSuspense;
