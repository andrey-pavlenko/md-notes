<script>
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { tokenize, stopwords, stem, search, fragmentation } from '../modules/search';
  import { assets as repository } from '../store/repository';
  import { pattern as storePattern, found as storeFound } from '../store/search';

  let searchPatternValue = get(storePattern) || '';
  let searchPatternInput = undefined;
  let searchPatternError = undefined;
  const fragmentationIndents = 48;

  window._notes = $repository.notes;

  function onSearchPatternSubmit(event) {
    event.preventDefault();
    const tokens = tokenize(searchPatternValue.toLowerCase())
      .map(token => {
        const tokenStem = !stopwords.has(token) ? stem(token) : undefined;
        if (tokenStem == null) {
          return { token };
        } else {
          return { token, stem: tokenStem };
        }
      });
    const stems = tokens.map(token => token.stem).filter(stem => !!stem);
    if (stems.length === 0) {
      searchPatternError = tokens.length ? 
        'Ни одно слово в строке поиска не являются словом из которого можно выделить основание' : 
        'Строка поиска не содержит токенов';
      return;
    }

    const found = get(repository).notes
      .reduce((found, note) => {
        const foundStems = search(note.text, stems);
        const positions = Object.values(foundStems).flat();
        if (positions.length > 0) {
          found.push({
            path: note.path,
            title: note.title,
            fragments: fragmentation(note.text, positions, fragmentationIndents)
              .map(fragments => fragments
                .map(slice => slice.indent != null ? slice.indent : '<mark>' + slice.fragment + '</mark>')
                .join('')
                .trim()
                .replace(/[\r\n]+/g, '<span class="is-size-7 has-text-grey-light paragraph">&para;</span>')),
            found: positions.length,
            tokens: tokens
              .map(token => token.stem ? [token.token, foundStems[token.stem].length] : undefined)
              .filter(token => token != null)
          });
        }
        return found;
      }, [])
      .sort((a, b) => b.found - a.found);

    $storePattern = searchPatternValue;
    $storeFound = found;
  }

  function missingTokens(tokens) {
    return tokens.filter(token => token[1] == 0).map(token => token[0]);
  }

  function onBackspaceMouseDown(event) {
    event.preventDefault();
    searchPatternValue = '';
    searchPatternInput.focus();
    searchPatternError = undefined;
  }

  function resetPatternError() {
    if (searchPatternError != null) {
      searchPatternError = undefined;
    }
  }

  onMount(() => {
    searchPatternInput.focus();
  });

</script>

<form 
  id="search-pattern"
  on:submit="{onSearchPatternSubmit}"
>
  <div class="field">
    <div class="control has-icons-left has-icons-right">
      <input
        class="input"
        class:is-danger="{!!searchPatternError}"
        type="text"
        placeholder="Строка поиска"
        bind:value="{searchPatternValue}"
        bind:this="{searchPatternInput}"
        on:input="{resetPatternError}"
      >
      <span class="icon is-left has-text-grey-lighter">
        <svg><use href="icons.svg#search" /></svg>
      </span>
      <span
        id="backspace"
        class="icon is-right"
        class:disabled="{!searchPatternValue}"
        on:mousedown="{onBackspaceMouseDown}"
      >
        <svg><use href="icons.svg#backspace" /></svg>
      </span>
    </div>
    {#if searchPatternError}
      <p class="help is-danger">{searchPatternError}</p>
    {:else}
      <p class="help">&nbsp;</p>
    {/if}
  </div>
</form>

<div id="search-results">
  {#each $storeFound as found (found.path)}
  <div class="found">
    <div class="found_title">
      <a href="#/{found.path}">{found.title}</a>
      <spam class="has-text-grey-light path">{found.path}</spam>
    </div>
    {#each found.fragments as fragment}
    <div class="found_fragment">{@html fragment}</div>
    {/each}
    <div class="found_missing-tokens has-text-right">
    {#each missingTokens(found.tokens) as missing}
      <span>{missing}</span>
    {/each}
    </div>
  </div>
  {:else}
    {#if searchPatternValue}
    <div class="has-text-centered has-text-grey-light">Ничего не найдено</div>
    {/if}
  {/each}
</div>
