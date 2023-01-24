<script lang="ts">
	import { quadOut } from 'svelte/easing';
	import { fade, fly, scale } from 'svelte/transition';

    const duration = 125;
</script>

<div
	class="absolute top-0 left-0 w-screen h-screen bg-black/70 flex place-items-center justify-center z-50"
	transition:fade={{ duration }}
>
	<dialog open class="max-w-xl w-full bg-transparent">
		<div transition:scale={{ duration, start: 0.95, easing: quadOut }}>
			<div
				class="bg-white text-black rounded-md shadow-lg p-8"
				transition:fly={{ duration, easing: quadOut, y: 10 }}
			>
				<slot />
			</div>
		</div>
	</dialog>
</div>
