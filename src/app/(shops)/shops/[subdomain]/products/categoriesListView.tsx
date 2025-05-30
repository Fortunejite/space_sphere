import {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  Dispatch,
  SetStateAction,
  useMemo,
} from 'react';

import { styled, Chip, Box } from '@mui/material';
import { Tune } from '@mui/icons-material';

import { useAppSelector } from '@/hooks/redux.hook';

interface Props {
  setQuery: Dispatch<SetStateAction<Record<string, string>>>;
}

interface CategoryChipProps {
  isActive?: boolean;
}

const CategoryChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<CategoryChipProps>(({ theme, isActive }) => ({
  marginRight: '8px',
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

const CategoryListView = ({ setQuery }: Props) => {
  const { categories: allCategories } = useAppSelector((s) => s.category);
  const { shop } = useAppSelector((s) => s.shop);

  const categories = useMemo(
    () =>
      allCategories.find((cat) => cat._id === shop.category)?.subcategories ||
      [],
    [allCategories, shop.category],
  );

  const [activeCategory, setActiveCategory] = useState(-1);
  const [numCategoriesShown, setNumCategoriesShown] = useState(0);
  const [showViewAll, setShowViewAll] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const allChipRef = useRef<HTMLDivElement>(null);
  const viewAllChipRef = useRef<HTMLDivElement>(null);
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);

  const recompute = useCallback(() => {
    const containerWidth = containerRef.current?.getBoundingClientRect().width;
    const wAll = allChipRef.current?.getBoundingClientRect().width ?? 0;
    const wViewAll = viewAllChipRef.current?.getBoundingClientRect().width ?? 0;
    if (!containerWidth) return;

    const totalCatWidth = measureRefs.current
      .slice(0, categories.length)
      .reduce(
        (sum, chip) => sum + (chip?.getBoundingClientRect().width || 0),
        0,
      );

    if (wAll + totalCatWidth <= containerWidth) {
      setShowViewAll(false);
      setNumCategoriesShown(categories.length);
      return;
    }

    setShowViewAll(true);
    let used = wAll + wViewAll;
    let count = 0;
    for (let i = 0; i < categories.length; i++) {
      const chipEl = measureRefs.current[i];
      if (!chipEl) break;
      const w = chipEl.getBoundingClientRect().width;
      if (used + w <= containerWidth) {
        used += w;
        count++;
      } else {
        break;
      }
    }
    setNumCategoriesShown(count);
  }, [categories]);

  useLayoutEffect(() => {
    recompute();
    window.addEventListener('resize', recompute);
    return () => window.removeEventListener('resize', recompute);
  }, [recompute]);

  const onCategoryClick = (index: number) => {
    if (activeCategory === index) return;
    setActiveCategory(index);
    if (index === -1) setQuery((prev) => ({ ...prev, category: '' }));
    else
      setQuery((prev) => ({
        ...prev,
        category: categories[index]._id.toString(),
      }));
  };

  return (
    <>
      {/* Hidden layer for measurement */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: -9999,
          visibility: 'hidden',
        }}
      >
        <CategoryChip label='All' ref={allChipRef} />
        {categories.map((cat, idx) => (
          <CategoryChip
            key={cat.slug}
            label={cat.name}
            ref={(el) => {
              measureRefs.current[idx] = el;
            }}
          />
        ))}
        <CategoryChip
          label='View All'
          icon={<Tune sx={{ width: 18, height: 18 }} />}
          ref={viewAllChipRef}
        />
      </Box>

      {/* Visible chips */}
      <Box ref={containerRef} sx={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <CategoryChip
          label='All'
          isActive={activeCategory === -1}
          onClick={() => onCategoryClick(-1)}
        />

        {categories.slice(0, numCategoriesShown).map((cat, i) => (
          <CategoryChip
            key={cat.slug}
            label={cat.name}
            isActive={activeCategory === i}
            onClick={() => onCategoryClick(i)}
          />
        ))}

        {showViewAll && (
          <CategoryChip
            label='View All'
            icon={<Tune sx={{ width: 18, height: 18 }} />}
            isActive={activeCategory > numCategoriesShown}
            onClick={() => {
              // TODO: Implement view all categories functionality
              // This could open a modal, navigate to a categories page, etc.
            }}
          />
        )}
      </Box>
    </>
  );
};

export default CategoryListView;
