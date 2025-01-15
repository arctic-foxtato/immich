<script lang="ts">
  import ImageThumbnail from '$lib/components/assets/thumbnail/image-thumbnail.svelte';
  import Button from '$lib/components/elements/buttons/button.svelte';
  import SearchBar from '$lib/components/elements/search-bar.svelte';
  import Icon from '$lib/components/elements/icon.svelte';
  import { getPeopleThumbnailUrl } from '$lib/utils';
  import {getAllTags, type TagResponseDto} from '@immich/sdk';
  import { mdiClose, mdiArrowRight } from '@mdi/js';
  import { handleError } from '$lib/utils/handle-error';
  import { t } from 'svelte-i18n';
  import SingleGridRow from '$lib/components/shared-components/single-grid-row.svelte';
  import type { SvelteSet } from 'svelte/reactivity';

  interface Props {
    selectedTagIds: SvelteSet<string>;
  }

  let { selectedTagIds = $bindable() }: Props = $props();

  let tagPromise = getTags();
  let showAllTags = $state(false);
  let name = $state('');
  let numberOfTags = $state(1);

  function orderBySelectedTagIdsFirst(tags: TagResponseDto[]) {
    return [
      ...tags.filter((t) => selectedTagIds.has(t.id)), //
      ...tags.filter((t) => !selectedTagIds.has(t.id)),
    ];
  }

  async function getTags() {
    try {
      const res = await getAllTags({ withHidden: false });
      return orderBySelectedTagIdsFirst(res);
    } catch (error) {
      handleError(error, $t('errors.failed_to_get_tags'));
    }
  }

  function toggleTagSelection(id: string) {
    if (selectedTagIds.has(id)) {
      selectedTagIds.delete(id);
    } else {
      selectedTagIds.add(id);
    }
  }

  const filterTags = (list: TagResponseDto[], name: string) => {
    const nameLower = name.toLowerCase();
    return name ? list.filter((t) => t.name.toLowerCase().includes(nameLower)) : list;
  };
</script>

{#await tagPromise then tags}
  {#if tags && tags.length > 0}
    {@const tagList = showAllTags
      ? filterTags(tags, name)
      : filterTags(tags, name).slice(0, numberOfTags)}

    <div id="tags-selection" class="-mb-4">
      <div class="flex items-center w-full justify-between gap-6">
        <p class="immich-form-label py-3">{$t('tags').toUpperCase()}</p>
        <SearchBar bind:name placeholder={$t('filter_tags')} showLoadingSpinner={false} />
      </div>

      <SingleGridRow
        class="grid grid-auto-fill-20 -mx-1 gap-1 mt-2 overflow-y-auto immich-scrollbar"
        bind:itemCount={numberOfTags}
      >
        {#each tagList as tag (tag.id)}
          <button
            type="button"
            class="flex flex-col itemsV-center rounded-3xl border-2 hover:bg-immich-gray dark:hover:bg-immich-dark-primary/20 p-2 transition-all {selectedTagIds.has(
              tag.id,
            )
              ? 'dark:border-slate-500 border-slate-400 bg-slate-200 dark:bg-slate-800 dark:text-white'
              : 'border-transparent'}"
            onclick={() => toggleTagSelection(tag.id)}
          >
            <p class="mt-2 line-clamp-2 text-sm font-medium dark:text-white">{tag.name}</p>
          </button>
        {/each}
      </SingleGridRow>

      {#if showAllTags || tags.length > tagList.length}
        <div class="flex justify-center mt-2">
          <Button
            shadow={false}
            color="text-primary"
            class="flex gap-2 place-items-center"
            onclick={() => (showAllTags = !showAllTags)}
          >
            {#if showAllTags}
              <span><Icon path={mdiClose} ariaHidden /></span>
              {$t('collapse')}
            {:else}
              <span><Icon path={mdiArrowRight} ariaHidden /></span>
              {$t('see_all_tags')}
            {/if}
          </Button>
        </div>
      {/if}
    </div>
  {/if}
{/await}
