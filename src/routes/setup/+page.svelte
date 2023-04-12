<script lang="ts">
	import Tubes from './tubes.svg';
	import Redux from './redux.gif';
	import PrimaryButton from '$lib/Display/Buttons/PrimaryButton.svelte';
	import { goto } from '$app/navigation';
</script>

<main class="mx-auto h-full w-full max-w-screen-sm">
	<header class="mb-12 mt-24 flex h-min w-full place-items-end justify-center gap-2">
		<img src={Tubes} alt="tubes" width="180" />
		<img src={Redux} alt="redux" width="140" />
	</header>

	<p class="text-center">
		Tubes <i>Redux</i> is the thinking man/woman/enby's IRC client.
	</p>
	<section class="my-8 flex w-full flex-col place-items-center gap-2">
		<PrimaryButton on:click={() => goto('/setup/tubinate/')}>Start Tubinating</PrimaryButton>
		<a href="/import" class="mt-4 text-sm text-neutral-700 underline">import an old config</a>
	</section>
</main>
