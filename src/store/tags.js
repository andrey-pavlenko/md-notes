// @ts-ignore
import { derived } from 'svelte/store';
import { assets as repositoryAssets } from './repository';

const assets = derived(
  repositoryAssets,
  (repositoryAssets, set) => {
    let tags = {};
    if (repositoryAssets != null) {
      tags = repositoryAssets.tags.reduce((acc, tag) => { 
        acc[tag.title] = tag.referenceCount;
        return acc;
      }, {});
    }
    set(tags);
  },
  null
);

const empty = derived(assets, (tagsAssets, set) => {
  const isEmpty = tagsAssets == null || Object.keys(tagsAssets).length === 0;
  set(isEmpty);
}, true);

export { assets, empty };
