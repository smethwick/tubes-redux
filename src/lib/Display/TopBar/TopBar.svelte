<script>
	import TubesMenu from '$lib/Display/Menus/TubesMenu.svelte';
	import HelpMenu from '../Menus/HelpMenu.svelte';
</script>

<div
	class="outer fixed flex place-items-center
    text-sm px-2.5"
>
	<div class="flex place-items-center inner w-max">
		<TubesMenu />
		<div class="w-full drag h-full" />
		<span class="w-max mr-1"><HelpMenu /></span>
	</div>
</div>

<style>
	.outer {
		left: env(titlebar-area-x, 0);
		top: env(titlebar-area-y, 0);
		width: 100%;
		height: 2rem;
	}

	.inner {
		width: env(titlebar-area-width, 100%);
		height: env(titlebar-area-height, 100%);
	}

	.drag {
		-webkit-app-region: drag;
		app-region: drag;
	}

	@media (display-mode: window-controls-overlay) {
		.outer {
			height: calc(env(titlebar-area-height) + 0.5rem);
		}
	}
</style>
