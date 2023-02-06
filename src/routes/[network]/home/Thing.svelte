<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let icon: typeof SvelteComponent | undefined = undefined;
	export let color: string;
</script>

<button on:click class="flex place-items-center gap-5 rounded-xl bg-{color}-100 px-6 py-4">
	{#if icon}
		<figure
			class="rounded-full h-10 w-10 aspect-square flex place-items-center justify-center bg-neutral-900 text-white"
			aria-hidden
		>
			<svelte:component this={icon} weight="fill" size={24} />
		</figure>
	{/if}
	<div class="text-left">
		<slot />
	</div>
</button>
