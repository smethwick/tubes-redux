<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import Users from 'phosphor-svelte/lib/Users';
	import Info from 'phosphor-svelte/lib/Info';
	import Hash from 'phosphor-svelte/lib/Hash';
	export let channel: string;

	const actions: [typeof SvelteComponent, string, Function?][] = [
		[Users, 'member list'],
		[Info, 'channel info']
	];

	const aaaaa = () => {
		null;
	};
</script>

<header class="border-b border-b-neutral-200 px-4 h-14 flex place-items-center">
	<span class="text-lg font-semibold flex place-items-center gap-1">
		<Hash size={20} />
		{channel.replace('#', '')}
	</span>

	<div class="ml-auto flex gap-3">
		{#each actions as [icon, label, action]}
			<button aria-label={label} on:click={() => (action ?? aaaaa)()}>
				<svelte:component this={icon} size={20} />
			</button>
		{/each}
	</div>
</header>
