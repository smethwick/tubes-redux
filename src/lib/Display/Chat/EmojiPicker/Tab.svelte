<script lang="ts">
    export let active: boolean = false;
</script>

<button on:click class:active class="flex px-3 py-1 rounded-full hover:bg-neutral-200">
    <slot />
</button>

<style>
    .active {
        @apply bg-violet-700 text-white
    }
</style>