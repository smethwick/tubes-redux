<script lang="ts">
	// export let href: string = '';
	let klass = "";

	export {klass as class}
</script>

<button on:click class={klass}>
	<li
		class="text-sm duration-75 transition-all ease-out 
        hover:font-bold py-1 mr-auto min-w-full text-left 
		list-none"
	>
		<slot />
	</li>
</button>
