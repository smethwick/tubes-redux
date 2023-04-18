<script lang="ts">
	import type { ConnectionInfo } from '$lib/Chat/provider+connection';
	import PrimaryButton from '../Buttons/PrimaryButton.svelte';
	import Dismissable from '../Etc/Dismissable.svelte';

	export let connection_info: ConnectionInfo;
</script>

<Dismissable key="welcome" let:dismiss>
	<article class="mb-8 rounded-lg bg-purple-200 px-5 py-6 text-black">
		<h1 class="mb-4 text-3xl">Welcome to your first network!</h1>
		<p class="mb-3 text-lg">
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
				coming from another platform? Due to Old™, IRC might be a little different to what you're
				used to: check out
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
		@apply font-semibold underline;
	}
	ul {
		@apply flex list-outside list-disc flex-col gap-2 pl-4;
	}
</style>
