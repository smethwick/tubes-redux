<script>
	import PrimaryButton from '../Buttons/PrimaryButton.svelte';
	import SecondaryButton from '../Buttons/SecondaryButton.svelte';
	import Dismissable from '../Etc/Dismissable.svelte';
</script>

<Dismissable key="registration" let:dismiss>
	<article class="bg-purple-700 text-white px-5 py-6 rounded-lg mb-8">
		<h1 class="text-3xl mb-4">Get the <em>complete</em> experience</h1>
		<p class="text-lg mb-3">
			You can <b>register an account</b> on this network, bringing many benefits to you and your fellow
			IRC denizens.
		</p>
		<ul class="list-disc list-inside flex flex-col">
			<li>stop other people from using your nickname!</li>
			<li>sometimes you gotta register to speak in big channels!</li>
			<li>protect natural order!</li>
			<li>feel a sense of accomplishment having done a thing!</li>
		</ul>

		<div class="mt-6 flex">
			<SecondaryButton
				colors={['bg-black/75', 'text-white', 'outline-black/75']}
				on:click={dismiss}
			>
				get outta here. nerd
			</SecondaryButton>

			<PrimaryButton class="ml-auto" colors={['bg-white', 'text-black', 'outline-white']}>
				Log in or Register
			</PrimaryButton>
		</div>
	</article>
</Dismissable>

<style>
	h1 {
		font-stretch: extra-condensed;
	}
</style>
