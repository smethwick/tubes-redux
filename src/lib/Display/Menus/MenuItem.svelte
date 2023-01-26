<script lang="ts">
	export let icon: string;
</script>

<button
	class="px-3 py-2.5 border-b border-b-neutral-200 flex gap-2 w-full hover:bg-purple-100"
	on:click
>
	<span>{icon}</span>
	<slot />
</button>
