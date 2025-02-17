<script lang="ts">
  import Combobox, { type ComboBoxOption } from '$lib/components/shared-components/combobox.svelte';
  import { getAllTags, type TagResponseDto } from '@immich/sdk';
  import { t } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import Icon from '$lib/components/elements/icon.svelte';
  import { mdiClose } from '@mdi/js';
  import { preferences } from '$lib/stores/user.store';
  import Checkbox from "$lib/components/elements/checkbox.svelte";

  interface Props {
    selectedTags: SvelteSet<string>;
    anyTags: boolean;
  }

  let { selectedTags = $bindable(),
    anyTags = $bindable()
  }: Props = $props();

  let allTags: TagResponseDto[] = $state([]);
  let tagMap = $derived(Object.fromEntries(allTags.map((tag) => [tag.id, tag])));
  let selectedOption = $state(undefined);

  onMount(async () => {
    allTags = await getAllTags();
  });

  const handleSelect = (option?: ComboBoxOption) => {
    if (!option || !option.id) {
      return;
    }

    selectedTags.add(option.value);
    selectedOption = undefined;
  };

  const handleRemove = (tag: string) => {
    selectedTags.delete(tag);
  };

</script>

{#if $preferences?.tags?.enabled}
  <div id="tag-selection">
    <form autocomplete="off" id="create-tag-form">

      <div class="grid grid-cols-[auto]">
        <div class="flex flex-col my-4 gap-2">
          <label class="immich-form-label" for="tags">{$t('tags').toUpperCase()}</label>
          <div class="flex flex-row">
            <Combobox
              onSelect={handleSelect}
              defaultFirstOption
              options={allTags.map((tag) => ({ id: tag.id, label: tag.value, value: tag.id }))}
              bind:selectedOption
              placeholder={$t('search_tags')}
            />
            <div class="flex" style="margin-left: 16px">
              <Checkbox labelClass="w-[max-content]" id="not-any-tags" label={$t('match_any_tags')} bind:checked={anyTags} />
            </div>
          </div>
        </div>
      </div>
    </form>

    <section class="flex flex-wrap pt-2 gap-1">
      {#each selectedTags as tagId (tagId)}
        {@const tag = tagMap[tagId]}
        {#if tag}
          <div class="flex group transition-all">
            <span
              class="inline-block h-min whitespace-nowrap pl-3 pr-1 group-hover:pl-3 py-1 text-center align-baseline leading-none text-gray-100 dark:text-immich-dark-gray bg-immich-primary dark:bg-immich-dark-primary rounded-tl-full rounded-bl-full hover:bg-immich-primary/80 dark:hover:bg-immich-dark-primary/80 transition-all"
            >
              <p class="text-sm">
                {tag.value}
              </p>
            </span>

            <button
              type="button"
              class="text-gray-100 dark:text-immich-dark-gray bg-immich-primary/95 dark:bg-immich-dark-primary/95 rounded-tr-full rounded-br-full place-items-center place-content-center pr-2 pl-1 py-1 hover:bg-immich-primary/80 dark:hover:bg-immich-dark-primary/80 transition-all"
              title="Remove tag"
              onclick={() => handleRemove(tagId)}
            >
              <Icon path={mdiClose} />
            </button>
          </div>
        {/if}
      {/each}
    </section>
  </div>
{/if}
