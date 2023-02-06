<script lang="ts">
	import { current_style } from '$lib/Chat';
	import type { IrcConnection } from '$lib/Chat/provider+connection';
	import Thing from './Thing.svelte';
	import Tag from 'phosphor-svelte/lib/Tag';
	import Chat from 'phosphor-svelte/lib/Chat';
	import IdentificationBadge from 'phosphor-svelte/lib/IdentificationBadge';

	import PrimaryButton from '$lib/Display/Buttons/PrimaryButton.svelte';
	import SecondaryButton from '$lib/Display/Buttons/SecondaryButton.svelte';
	import MiniDialog from '$lib/Display/Dialogs/Base/MiniDialog.svelte';

	export let conn: IrcConnection;
	export let dismiss: () => void;
	const { color_name: color } = $current_style;

	let { display_name: label } = conn.connection_info;

	let label_open = false;
</script>

<article class="flex flex-col gap-4 mb-8">
	<header class="bg-{$current_style.color_name}-50 text-black px-5 py-6 rounded-lg">
		<h2 class="text-2xl mb-2">Network Added!</h2>
		<p class="text-sm">You might want to fiddle with these settings before you connect:</p>
	</header>
	<section class="flex flex-col gap-4">
		<Thing icon={Tag} on:click={() => (label_open = true)} color={$current_style.color_name}>
			<h3 class="text-lg mb-1">Change Label</h3>
			<p class="text-sm">
				You can give your networks labels to better tell them apart. <br /> This network is
				currently labled <b>{label}</b>.
			</p>
		</Thing>
		<MiniDialog
			title="Set Label"
			on:click={() => {
				conn.update_connection_info({ ...conn.connection_info, display_name: label });
				label_open = false;
			}}
			bind:value={label}
			bind:isopen={label_open}
		/>
		<Thing icon={Chat} color={$current_style.color_name}>
			<h3 class="text-lg mb-1">Set Nickname</h3>
			<p class="text-sm">
				Nicknames are how people are identified on IRC. <br /> Your nickname on this network is
				currently
				<b>{conn.connection_info.nick}</b>.
			</p>
		</Thing>
		<Thing icon={IdentificationBadge} color={$current_style.color_name}>
			<h3 class="text-lg mb-1">Log into an Account</h3>
			<p class="text-sm">
				If you've already set up an account on this network, you can set it up here. <br /> (subject
				to network compatibility)
			</p>
		</Thing>
	</section>

	<div class="flex">
		<PrimaryButton
			colors={[`bg-${color}-300`, `text-black`, `outline-${color}-300`]}
			class="mr-auto"
			on:click={() => dismiss()}
		>
			Finish
		</PrimaryButton>
	</div>
</article>

<style>
	h2 {
		font-stretch: extra-condensed;
	}
	a {
		@apply underline font-semibold;
	}
	ul {
		@apply list-disc list-outside pl-4 flex flex-col gap-2;
	}
</style>
