<script lang="ts">
	import Heading1 from '$lib/Display/Type/Heading1.svelte';
	import PrimaryButton from '../Buttons/PrimaryButton.svelte';
	import SecondaryButton from '../Buttons/SecondaryButton.svelte';
	import DialogBase from './Base/Base.svelte';
	import Gif from './yougottagive.gif';

	export let isopen = false;
</script>

<DialogBase bind:isopen width="max-w-2xl" class="h-[95vh] " let:close>
	<h1><img src={Gif} alt="YOU GOTTA GIVE" /></h1>
	<!-- <Heading1 class="text-center">YOU GOTTA GIVE</Heading1> -->

	<article class="prose mt-6">
		<p>
			hello! i'm leah, i am the silly billy who created this web application. i have set up this
			little pop-up in an effort to raise some funds for its continued development. if you couldn't
			already guess, making an IRC client in the year of our lord 2023 isn't particularly profitable!
		</p>
		<p>
			here's the deal. if you enjoy using tubes, you can give me an american dollar or perhaps even two, 
			every month in perpetuity (or until you cancel it), and i will continue to set aside time 
			to develop this app further. if you can't afford that (or just don't feel like it), 
			that's cool too!
		</p>
	</article>

	<div class="flex justify-center my-8 gap-8 text-lg">
	<a href="https://github.com/sponsors/thatcher-gaming" target="_blank"><PrimaryButton>Github Sponsors</PrimaryButton></a>
	<a href="example.com" target="_blank"><PrimaryButton>Patreon</PrimaryButton></a>
	</div>

	<div class="mt-auto">
		<SecondaryButton colors={['bg-rose-200', 'text-black', 'outline-rose-200']} on:click={close}>
			Close
		</SecondaryButton>
	</div>
</DialogBase>
