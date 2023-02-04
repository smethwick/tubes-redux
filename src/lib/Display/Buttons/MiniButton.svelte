<script lang="ts">
	export let klass: string = '';

	export { klass as class };
</script>

<button
	on:click
	class="list-none w-max select-none hover:bg-neutral-200 active:bg-neutral-300
cursor-pointer py-0.5 rounded px-1.5 place-items-center flex gap-1.5 {klass}"
>
	<slot />
</button>
