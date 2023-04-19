<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import Users from 'phosphor-svelte/lib/Users';
	import Info from 'phosphor-svelte/lib/Info';
	import Hash from 'phosphor-svelte/lib/Hash';
	import type { Channel } from '$lib/Chat/channel';
	export let channel: Channel;

	export let open_sidebar: boolean = false;

	const actions: [typeof SvelteComponent, string, Function?][] = [
		[Users, 'member list', () => null],
		[Info, 'channel info', () => (open_sidebar = !open_sidebar)]
	];

	$: topic = channel.topic_live;

	const aaaaa = () => {
		null;
	};
</script>

<header class="border-b border-b-neutral-200 dark:border-b-neutral-700 max-w-full px-4 h-14 flex place-items-center">
	<span class="text-lg font-semibold flex place-items-center gap-1">
		<Hash size={20} />
		{channel.name.replace('#', '')}
	</span>

	{#if $topic && $topic[0] && !open_sidebar}
		<button
			on:click={() => (open_sidebar = !open_sidebar)}
			class="text-sm ml-2 overflow-hidden whitespace-nowrap max-w-[75%] 
			text-ellipsis hover:underline text-left"
		>
			{$topic[0]}
		</button>
	{/if}

	<div class="ml-auto flex gap-3">
		{#each actions as [icon, label, action]}
			<button aria-label={label} on:click={() => (action ?? aaaaa)()}>
				<svelte:component
					this={icon}
					weight={// epic swag
					label == 'channel info' ? (open_sidebar ? 'fill' : 'regular') : 'regular'}
					size={20}
				/>
			</button>
		{/each}
	</div>
</header>
