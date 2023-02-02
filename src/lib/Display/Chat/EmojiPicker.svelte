<script lang="ts">
	import data from '@emoji-mart/data/sets/14/native.json';
	import type types from '@emoji-mart/data';
	import Popover from '../Etc/Popover.svelte';
	import SmileyBlank from 'phosphor-svelte/lib/Smiley';

	export let value: string;
	const emojis: { [key: string]: types.Emoji } = data.emojis;
</script>

<Popover class="right-2 bottom-14">
	<SmileyBlank size={23} />
	<svelte:fragment slot="popover">
		<div class="flex flex-wrap text-2xl gap-1 p-1">
			{#each Object.values(emojis) as { skins: [{ native: emoji }] }}
				<button
					class="p-2 w-12 h-12 rounded select-none cursor-pointer hover:bg-neutral-200"
					on:click={() => value = `${value} ${emoji}`}
				>
					{emoji}
				</button>
			{/each}
		</div>
	</svelte:fragment>
</Popover>
