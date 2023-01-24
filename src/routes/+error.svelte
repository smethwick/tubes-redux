<script>
	import { page } from '$app/stores';
	import Header from '$lib/Display/Type/Header.svelte';

	import Uwuifier from 'uwuifier';

	const uwuifier = new Uwuifier({
        spaces: {
            faces: 0,
            actions: 0,
            stutters: 0
        }
    });
</script>

<div class="max-w-xl w-full mx-auto my-12 flex flex-col justify-center">
	<Header>
		<svelte:fragment slot="above">{uwuifier.uwuifySentence("something went wrong somewhere")}</svelte:fragment>
		<svelte:fragment>
			{$page.status}: {uwuifier
				.uwuifySentence($page.error?.message ?? 'Unknown Error')
				.toLowerCase()}
		</svelte:fragment>
	</Header>
</div>
