<script lang="ts">
	import GoodAdvice from '$lib/Display/Setup/GoodAdvice.svelte';
	import Dismissable from '$lib/Display/Etc/Dismissable.svelte';
	import PrimaryButton from '$lib/Display/Buttons/PrimaryButton.svelte';
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import AuthIndicator from './AuthIndicator.svelte';

	export let conn: IrcConnection;
	const connection_info = conn.connection_info;
</script>

<section class="col-span-2">
    <AuthIndicator {conn} />
	<Dismissable key="alpha" let:dismiss>
		<div class="mb-4 rounded-lg bg-rose-200 px-5 py-4 text-black">
			<p>
				you're using an <b>alpha build</b> of Tubes. expect bugs, mising features, perplexing behaviour,
				egregious oversights and more!
			</p>
			<PrimaryButton class="ml-auto mt-2" on:click={dismiss}>Dismiss</PrimaryButton>
		</div>
	</Dismissable>
	<GoodAdvice {connection_info} />
</section>