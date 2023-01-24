<script lang="ts">
    let klass = "";
    export {klass as class}
</script>

<h1 class={klass}><slot /></h1>

<style>
	h1 {
		@apply text-4xl;
		font-stretch: extra-condensed;
	}
</style>