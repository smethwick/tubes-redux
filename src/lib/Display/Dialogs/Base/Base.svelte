<script lang="ts">
	import { quadOut } from 'svelte/easing';
	import { fade, fly, scale } from 'svelte/transition';

	const duration = 125;

	export let isopen = false;

	let open = () => {
		isopen = true;
	};
	let close = () => {
		isopen = false;
	};

	let klass: string = '';
	export let width: 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' = 'max-w-xl';

	export { klass as class };
</script>

{#if isopen}
	<div
		class="absolute top-0 left-0 w-screen h-screen bg-black/70 flex place-items-center justify-center z-[9999]"
		transition:fade={{ duration }}
	>
		<dialog open class="{width} w-full bg-transparent ">
			<div transition:scale={{ duration, start: 0.95, easing: quadOut }}>
				<div
					class="bg-white ext-black rounded-md shadow-lg p-8 max-h-[50rem] overflow-y-auto flex flex-col {klass}"
					transition:fly={{ duration, easing: quadOut, y: 10 }}
				>
					<slot {open} {close} />
				</div>
			</div>
		</dialog>
	</div>
{/if}
