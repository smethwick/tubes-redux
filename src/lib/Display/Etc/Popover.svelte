<script lang="ts">
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let open = false;
	let klass = '';

	function clickOutside(node: Element, opt: { enabled: boolean; cb: () => void }) {
		//@ts-ignore: cba lmao
		const handleOutsideClick = ({ target }) => {
			if (!node.contains(target)) {
				opt.cb();
			}
		};

		function update(enabled: boolean) {
			if (enabled) {
				window.addEventListener('click', handleOutsideClick);
			} else {
				window.removeEventListener('click', handleOutsideClick);
			}
		}

		update(opt.enabled);
		return {
			update,
			destroy() {
				window.removeEventListener('click', handleOutsideClick);
			}
		};
	}

	export { klass as class };
</script>

<svelte:window
	on:keydown={(e) => {
		if (open && e.key == 'Escape') {
			e.preventDefault();
			open = false;
		}
	}}
/>

<div use:clickOutside={{ enabled: open, cb: () => (open = false) }} class="flex">
	<button on:click={() => (open = !open)}><slot /></button>
	{#if open}
		<div
			class="absolute w-96 bg-white rounded-xl shadow border 
			border-neutral-200 max-h-[60vh] overflow-y-auto {klass}"
			transition:fly={{ opacity: 0, duration: 100, easing: quadOut, y: 2 }}
		>
			<slot name="popover" />
		</div>
	{/if}
</div>
