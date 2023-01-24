<script lang="ts">
	import PrimaryButton from '$lib/Display/Buttons/PrimaryButton.svelte';
import SecondaryButton from '$lib/Display/Buttons/SecondaryButton.svelte';
import Heading1 from '$lib/Display/Type/Heading1.svelte';
	import DialogBase from '../Base/Base.svelte';

	export let on_cancel: () => void;
	export let on_finish: undefined | (() => void) = undefined;
</script>

<DialogBase>
	<Heading1 class="text-center">Add a Network</Heading1>

    <div class="flex mt-8">
    <SecondaryButton on:click={on_cancel}>nevermind</SecondaryButton>
    <PrimaryButton class="ml-auto" on:click={on_finish}>let's do it</PrimaryButton>
    </div>
</DialogBase>
