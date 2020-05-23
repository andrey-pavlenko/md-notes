export type Position = [number, number];

export type FoundStems = { [key: string]: Position[] };

export type FragmentationSlice = { [key in 'fragment' | 'indent']: string };
