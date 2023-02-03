<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let icon: typeof SvelteComponent | undefined = undefined;
	export let action: ((e: MouseEvent) => void) | undefined = undefined;

	const stylez = `py-2 px-4 flex place-items-center gap-2 w-full`;
</script>

<li>
	{#if action}
		<button class={stylez} on:click={action}>
			{#if icon}
				<svelte:component this={icon} />
			{/if}
			<slot />
		</button>
	{:else}
		<span class={stylez}>
			{#if icon}
				<svelte:component this={icon} />
			{/if}
			<slot />
		</span>
	{/if}
</li>
