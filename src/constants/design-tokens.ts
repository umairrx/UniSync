export const GRID_CONFIG = {
  DAY_COLUMN_WIDTH: "minmax(50px, 70px)",
  TIME_SLOT_WIDTH: "minmax(80px, 1fr)",
  ROW_HEIGHT: "minmax(60px, auto)",
  TOTAL_COLUMNS: 6,
} as const;

export const TEXT_SIZES = {
  TINY: "text-[7px]",
  EXTRA_SMALL: "text-[8px]",
  SMALL: "text-[9px]",
  BASE: "text-[10px]",
} as const;

export const ICON_SIZES = {
  TINY: "h-3 w-3",
  SMALL: "h-3.5 w-3.5",
  BASE: "h-4 w-4",
} as const;
