<script lang="ts">
	export let unread: number, channel: string, active: boolean = false;
</script>

<a href="/">
	<li class="flex px-2.5 py-1 hover:bg-neutral-600/5 text-neutral-600 rounded-md duration-[25ms] ease-out transition-colors" class:active>
		<span class="mr-auto">{channel}</span>
		{unread}
	</li>
</a>

<style>
    .active {
        @apply bg-neutral-200 hover:bg-neutral-200 text-black
    }
</style>
