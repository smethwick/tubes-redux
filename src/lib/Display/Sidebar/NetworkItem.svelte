<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ConnectionInfo, conn_styles } from '$lib/Chat/provider+connection';

	export let network: ConnectionInfo & { last_url: string, styles: conn_styles };

	$: active = $page.params['network'] == network.name;

	let text = network.display_name ?? network.name;
	let abbr = network.display_name
		? network.display_name.substring(0, 2)
		: network.name.substring(0, 2);

	let button: HTMLButtonElement;
</script>

<button
	class="
		flex {active ? `px-4 ${network.styles.net_selected}` : `${network.styles.net_inactive}`} h-10  rounded-2xl
		overflow-hidden select-none
		place-items-center justify-center"
	class:active
	aria-label={network.name}
	bind:this={button}
	on:click={() => {button.scrollIntoView({behavior: 'smooth'}); goto(network.last_url)}}
>
	<span>
		{active ? text : abbr}
	</span>
	<!-- <span class="opacity-25 rotate-12 select-none relative -bottom-2 -right-1 text-3xl">{network.icon}</span> -->
</button>

<style>
	button {
		transition: all 400ms cubic-bezier(0.19, 1, 0.22, 1);
		overflow: hidden;
		white-space: nowrap;
		width: 2.5rem;
		min-width: 2.5rem;
	}
	.active {
		width: 100%;
		min-width: 8rem;
	}
</style>