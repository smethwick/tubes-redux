<script lang="ts">
	import data from '@emoji-mart/data/sets/14/native.json';
	import type types from '@emoji-mart/data';
	import Popover from '../../Etc/Popover.svelte';
	import SmileyBlank from 'phosphor-svelte/lib/Smiley';
	import EmojiHeader from './EmojiHeader.svelte';
	import TabBar from './TabBar.svelte';
	import Tab from './Tab.svelte';

	export let value: string;
	const emojis: { [key: string]: types.Emoji } = data.emojis;
	let categories: types.Category[] = data.categories;
	categories = categories.map((o) => {
		return {
			id: o.id,
			emojis: o.emojis.map((o) => {
				return emojis[o].skins[0].native;
			})
		};
	});
</script>

<Popover class="right-2 bottom-14">
	<SmileyBlank size={23} />
	<svelte:fragment slot="popover">
		<div class="p-1">
			<TabBar>
				<Tab active>Emoji</Tab>
				<Tab>Emoticons</Tab>
				<Tab>Kaomoji</Tab>
			</TabBar>
			<main class="max-h-[21rem] overflow-y-auto">
			{#each categories as { id, emojis }}
				<EmojiHeader {id}>{id}</EmojiHeader>
				<div class="flex flex-wrap text-2xl gap-1">
					{#each emojis as emoji}
						<button
							class="p-2 w-12 h-12 rounded select-none cursor-pointer hover:bg-neutral-200"
							on:click={() => (value = `${value} ${emoji}`)}
						>
							{emoji}
						</button>
					{/each}
				</div>
			{/each}
			</main>
		</div>
	</svelte:fragment>
</Popover>
