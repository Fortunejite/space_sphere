import { Stack, Typography, Grid, Paper, Skeleton } from '@mui/material';

interface ViewsProps {
  limit: number;
}

const GridViewSkeleton = ({ limit }: ViewsProps) => (
  <Grid container spacing={2}>
    {Array.from({ length: limit }).map((_, i) => (
      <Grid key={i} size={{ xs: 6, sm: 3 }}>
        <Paper sx={{ overflow: 'hidden' }}>
          <Skeleton height='200px' width='auto' variant='rectangular' />
          <Stack p={1}>
            <Typography variant='body1'>
              <Skeleton />
            </Typography>
            <Typography variant='body2' width={'40%'}>
              <Skeleton />
            </Typography>
          </Stack>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

export default GridViewSkeleton;
