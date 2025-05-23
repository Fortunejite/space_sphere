'use client';

import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { ZodError } from 'zod';
import axios from 'axios';

import { useRouter } from 'next/navigation';

import {
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';

import SimpleSnackbar from '@/components/snackbar';
import { createUserSchema } from '@/lib/schema/auth';

const RegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [generalMessage, setGeneralMessage] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    try {
      createUserSchema.parse(formData);
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

    try {
      await axios.post('/api/auth/register', formData);
      router.push('/');
    } catch (err) {
      console.error(err);
      // If error is an AxiosError, try to extract form errors from the API response.
      if (axios.isAxiosError(err)) {
        if (err.response?.data.issues) {
          const errors: Record<string, string> = {};

          err.response.data.issues.forEach(
            (e: { path: string[]; message: string }) => {
              errors[e.path[0]] = e.message;
            },
          );
          setFormErrors(errors);
        } else {
          setGeneralMessage(err.response?.data.message);
          setSnackbarOpen(true)
        }
      } else {
        setGeneralMessage('An error occured');
        setSnackbarOpen(true)
      }
    } finally {
      setLoading(false);
    }
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
        <Typography variant='h1'>Get Started!</Typography>
        <Typography variant='body1'>Join 1000+ shop owners on Shop Sphere</Typography>
        <TextField
          required
          label='Username'
          variant='standard'
          name='username'
          value={formData.username}
          error={!!formErrors.username}
          helperText={formErrors.username}
          onChange={handleChange}
          fullWidth
        />
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
          label='Phone Number '
          variant='standard'
          name='phoneNumber'
          value={formData.phoneNumber}
          error={!!formErrors.phoneNumber}
          helperText={formErrors.phoneNumber}
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
          disabled={loading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>

        <Typography variant='body2' align='center' mt={2}>
          Already have an account?{' '}
          <Link href='/login' style={{ textDecoration: 'underline' }}>
            Login
          </Link>
        </Typography>
        <SimpleSnackbar
          open={snackbarOpen}
          setOpen={setSnackbarOpen}
          message={generalMessage}
        />
      </Grid>
      <Grid
        size={{ xs: 12, sm: 4 }}
        sx={{
          background: 'url(./authPic.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          minHeight: 300
        }}
      ></Grid>
    </Grid>
  );
};

export default RegisterPage;
