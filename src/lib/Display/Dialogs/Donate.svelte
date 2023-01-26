<script lang="ts">
	import Heading1 from '$lib/Display/Type/Heading1.svelte';
	import SecondaryButton from '../Buttons/SecondaryButton.svelte';
	import DialogBase from './Base/Base.svelte';

	export let close: () => void;
</script>

<DialogBase width="max-w-2xl" class="h-[95vh] ">
	<Heading1 class="text-center">give me money :)</Heading1>

	<article class="prose mt-6">
		<p>
			hello! i'm leah, i am the silly billy who created this web application. i have set up this
			little pop-up in an effort to raise some funds for its continued development. if you couldn't
			already guess, making an IRC client in 2023 isn't particularly profitable, and that's okay!
		</p>
		<p>
			HOWEVER, i am – as of right now – without a job, and while that's going quite well for me at
			the moment, it'd be nice to have a little bit of extra cash in the bank in case shit really
			hits the fan.
		</p>
		<p>
			so, here's the deal. if you enjoy using tubes, you can give me a dollar or two per month, and
			i will continue to set aside time to develop this app further. if you can't afford that (or
			just don't feel like it), that's cool too!
		</p>
	</article>

	<div class="mt-auto">
		<SecondaryButton colors={['bg-rose-200', 'text-black', 'outline-rose-200']} on:click={close}>
			Close
		</SecondaryButton>
	</div>
</DialogBase>
