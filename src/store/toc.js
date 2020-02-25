import { derived } from 'svelte/store';
import {
  loading as repositoryLoading,
  assets as repositoryAssets
} from './repository';

const loading = derived(
  [repositoryLoading, repositoryAssets],
  ([repositoryLoading, repositoryAssets], set) => {
    set(repositoryAssets != null ? false : repositoryLoading);
  },
  false
);

const assets = derived(
  repositoryAssets,
  (repositoryAssets, set) => {
    set(repositoryAssets != null ? repositoryAssets.toc : null);
  },
  null
);

export { loading, assets };
