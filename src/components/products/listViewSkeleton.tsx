import { Stack, Typography, Paper, Skeleton, Box } from '@mui/material';

interface ViewsProps {
  limit: number;
}

const ListViewSkeleton = ({ limit }: ViewsProps) => (
  <Stack gap={1}>
    {Array.from({ length: limit }).map((_, i) => (
      <Paper key={i}>
        <Stack direction={'row'} gap={2} p={1}>
          <Skeleton>
            <Box
              sx={{
                height: '100px',
                width: '100px',
              }}
            ></Box>
          </Skeleton>
          <Stack justifyContent={'end'}>
            <Typography variant='h6' width={'200px'}>
              <Skeleton />
            </Typography>
            <Stack direction='column' spacing={1}>
              <Typography variant='body1' width={'40%'}>
                <Skeleton />
              </Typography>
            </Stack>
            <Typography variant='body1' width={'20%'}>
              <Skeleton />
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    ))}
  </Stack>
);

export default ListViewSkeleton;
