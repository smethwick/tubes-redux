<script lang="ts">
	import type { ConnectionInfo } from '$lib/Chat/provider+connection';
	import PrimaryButton from '../Buttons/PrimaryButton.svelte';
	import Dismissable from '../Etc/Dismissable.svelte';

	export let connection_info: ConnectionInfo;
</script>

<Dismissable key="welcome" let:dismiss>
	<article class="bg-purple-200 text-black px-5 py-6 rounded-lg mb-8">
		<h1 class="text-3xl mb-4">Welcome to your first network!</h1>
		<p class="text-lg mb-3">
			You're now connected to <b>{connection_info.display_name}</b>. Have fun!
		</p>
		<ul>
			<li>
				if you ever get stuck, check out <a href="/manual">the manual</a> for detailed guides and
				documentaion.
				<ul>
					<li>you can get to the manual whenever by clicking "help!" in the top right corner.</li>
				</ul>
			</li>
			<li>
				coming from another platform? Due to Old™, IRC might be a little different to what you're used to: check
				out
				<a href="/manual/discord-slack">IRC for Discord and Slack users</a>.
			</li>
			<li>make sure to <a href="/manual/etiquette">respect the space and your peers</a>.</li>
			<li>
				if you ever encounter a bug, let us know on
				<a href="https://lists.sr.ht/~leah/tubes-redux"> the mailing list</a>.
			</li>
		</ul>
		<p class="mt-4">take care!</p>

		<div class="mt-6 flex">
			<PrimaryButton class="ml-auto" on:click={dismiss}>Dismiss</PrimaryButton>
		</div>
	</article>
</Dismissable>

<style>
	h1 {
		font-stretch: extra-condensed;
	}
	a {
		@apply underline font-semibold;
	}
	ul {
		@apply list-disc list-outside pl-4 flex flex-col gap-2;
	}
</style>
