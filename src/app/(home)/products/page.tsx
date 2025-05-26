'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import {
  GridView,
  List,
  Search as SearchIcon,
  Tune,
} from '@mui/icons-material';

import CategoryListView from './categoriesListView';
import ProductsView from '@/components/products/productsView';

interface SortChipProps {
  isActive?: boolean;
}

const sortTypes = [
  {
    title: 'Curated for you',
    label: 'Curated',
  },
  {
    title: 'Top Picks',
    label: 'Trending',
  },
  {
    title: 'New Products',
    label: 'Latest',
  },
];

const SortChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<SortChipProps>(({ theme, isActive }) => ({
  display: 'inline-flex',
  cursor: 'pointer',
  backgroundColor: isActive
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  ...(isActive && { color: theme.palette.primary.contrastText }),
  ...(isActive && {
    '&:hover': { opacity: 0.5, backgroundColor: theme.palette.primary.main },
  }),
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: '16px',
}));

const Products = () => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewStyle, setViewStyle] = useState<'grid' | 'list'>('list');
  const [activeSort, setActiveSort] = useState(sortTypes[0]);
  const [query, setQuery] = useState<Record<string, string>>({
    sort: activeSort.label,
  });

  const activeSortIndex = sortTypes.findIndex(
    (sortType) => sortType.label === activeSort.label,
  );

  const changeSort = (sortType: (typeof sortTypes)[0]) => {
    setActiveSort(sortType);
    setQuery((prev) => ({ ...prev, sort: sortType.label }));
  };

  return (
    <Stack py={2} gap={1}>
      <Stack
        px={{ xs: 1, sm: 2 }}
        pb={{ xs: 1, sm: 2 }}
        gap={{ xs: 1, sm: 2 }}
        sx={{
          borderBottom: '1px solid #000000',
        }}
      >
        <Stack direction={'row'} gap={1} alignItems='center'>
          <Box
            component='form'
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.length) router.push(`/products?q=${searchQuery}`);
            }}
            sx={{
              position: 'relative',
              backgroundColor: 'background.paper',
              borderRadius: 1,
              width: '100%',
            }}
          >
            <TextField
              placeholder='Search...'
              variant='outlined'
              size='small'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              // onFocus={() => setShowSearchResults(true)}
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: 1,
                width: '100%',
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            {/* {showSearchResults && searchResults.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              bgcolor: 'background.paper',
              boxShadow: 3,
              zIndex: 100,
              mt: 1,
              borderRadius: 1,
              p: 1,
            }}
          >
            {searchResults.map((result) => (
              <>
                <Grid2
                  container
                  key={result._id.toString()}
                  spacing={1}
                  my={1}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    setShowSearchResults(false);
                    router.push(`/products/${result._id}`);
                  }}
                >
                  <Grid2 size={3} sx={{ position: 'relative' }}>
                    <Image
                      src={result.mainPic}
                      alt={result.name}
                      fill
                      objectFit='contain'
                      style={{ padding: '8px' }}
                    />
                  </Grid2>
                  <Grid2 size={9}>
                    <Typography variant='subtitle1'>{result.name}</Typography>
                    <PriceSection product={result} />
                  </Grid2>
                </Grid2>
                <Divider />
              </>
            ))}
          </Box>
        )} */}
          </Box>

          <Button
            color='primary'
            variant='contained'
            size='small'
            startIcon={<Tune />}
          >
            Filter
          </Button>
        </Stack>

        <CategoryListView setQuery={setQuery} />
      </Stack>
      <Stack px={2} direction={'row'} justifyContent='space-between'>
        <Typography variant='h3'>{activeSort.title}</Typography>
        <Stack direction={'row'} gap={1} display={{ xs: 'none', sm: 'flex' }}>
          <IconButton
            onClick={() =>
              setViewStyle((prev) => (prev === 'grid' ? 'list' : 'grid'))
            }
          >
            {viewStyle === 'grid' ? (
              <List color='primary' />
            ) : (
              <GridView color='primary' />
            )}
          </IconButton>
          {sortTypes.map((sortType) => (
            <SortChip
              key={sortType.label}
              label={sortType.label}
              sx={{ pointer: 'cursor' }}
              isActive={activeSort.label === sortType.label}
              onClick={() => changeSort(sortType)}
            />
          ))}
        </Stack>
        <Stack direction={'row'} gap={1} display={{ xs: 'flex', sm: 'none' }}>
          <IconButton
            onClick={() =>
              setViewStyle((prev) => (prev === 'grid' ? 'list' : 'grid'))
            }
          >
            {viewStyle === 'grid' ? (
              <List color='primary' />
            ) : (
              <GridView color='primary' />
            )}
          </IconButton>
          <FormControl size='small' sx={{ minWidth: 100 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={activeSortIndex}
              label='Sort by'
              onChange={(e) => changeSort(sortTypes[e.target.value as number])}
            >
              {sortTypes.map((sortType, index) => (
                <MenuItem key={sortType.label} value={index}>
                  {sortType.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
      <Stack px={2}>
        <ProductsView query={query} limit={5} style={viewStyle} />
      </Stack>
    </Stack>
  );
};

export default Products;
