<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import Content from '$lib/Display/Type/Content.svelte';
	import Header from '$lib/Display/Type/Header.svelte';

	let previousPage: string = base;

	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
	});
</script>

<div class="w-full h-full">
	<Content>
		<Header>
			<svelte:fragment slot="above">
				<button class="underline" on:click={() => goto(previousPage)}> ← return to the app </button>
			</svelte:fragment>
			Configuration
		</Header>
	</Content>
</div>
