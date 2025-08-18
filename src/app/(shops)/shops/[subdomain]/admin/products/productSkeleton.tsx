import { useTheme } from "@emotion/react";
import { Card, Skeleton, CardContent, Stack, Box } from "@mui/material";

const ProductCardSkeleton = () => {
  const theme = useTheme();
  
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
      }}
    >
      <Skeleton variant="rectangular" height={200} />
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width="80%" height={32} />
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 2 }} />
        
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton variant="text" width={40} height={20} />
          <Skeleton variant="text" width={60} height={20} />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Skeleton variant="text" width={80} height={28} />
            <Skeleton variant="text" width={60} height={20} />
          </Box>
          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 2 }} />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Skeleton variant="text" width={40} height={16} />
            <Skeleton variant="text" width={60} height={20} />
          </Box>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width={30} height={16} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton