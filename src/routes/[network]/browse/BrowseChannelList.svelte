<script lang="ts">
	import type { ListEntry } from "$lib/Chat/chan_list";
	import SortingMenu from "./SortingMenu.svelte";

    export let list: ListEntry[];
    export let sorting_mode = "bumpscosity";
</script>

<div class="flex">
    <span class="mr-auto">{list.length} {list.length == 1 ? 'result' : 'results'}</span>
    <span class="flex place-items-center gap-1">sorting by <SortingMenu bind:value={sorting_mode} /></span>
</div>

<ul class="flex flex-col gap-4 my-4 list-none px-0">
    {#each list as [name, members, topic]}
        <li>
            <p class="float-right my-0">{members} {members == 1 ? 'member' : 'members'}</p>
            <h3 class="mt-0 mb-2">{name}</h3>
            <p class="mb-0">{topic}</p>
        </li>
    {/each}
</ul>
