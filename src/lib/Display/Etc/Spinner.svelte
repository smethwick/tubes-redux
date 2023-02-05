<script lang="ts">
	import CircleNotch from 'phosphor-svelte/lib/CircleNotch';

    export let size: number = 16;
</script>

<span>
	<CircleNotch {size} />
</span>

<style>
    @keyframes spinny {
        0% {rotate: 0deg;}
        100% {rotate: 360deg;}
    }
    span {
        animation: spinny 1s linear infinite;
    }
</style>