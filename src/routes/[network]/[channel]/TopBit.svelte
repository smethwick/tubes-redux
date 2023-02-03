<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import Users from 'phosphor-svelte/lib/Users';
	import Info from 'phosphor-svelte/lib/Info';
	import Hash from 'phosphor-svelte/lib/Hash';
	import type { Channel } from '$lib/Chat/channel';
	export let channel: Channel;

	const actions: [typeof SvelteComponent, string, Function?][] = [
		[Users, 'member list'],
		[Info, 'channel info', () => (open_sidebar = !open_sidebar)]
	];

	const aaaaa = () => {
		null;
	};

	export let open_sidebar = false;
</script>

<header class="border-b border-b-neutral-200 px-4 h-14 flex place-items-center">
	<span class="text-lg font-semibold flex place-items-center gap-1">
		<Hash size={20} />
		{channel.name.replace('#', '')}
	</span>

	<div class="ml-auto flex gap-3">
		{#each actions as [icon, label, action]}
			<button aria-label={label} on:click={() => (action ?? aaaaa)()}>
				<svelte:component this={icon} size={20} />
			</button>
		{/each}
	</div>
</header>
