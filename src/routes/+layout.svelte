<script lang="ts">
    import Manifest from '$lib/Things/app.webmanifest';
    import "../app.css";
    import "@fontsource/roboto-serif/variable-full.css";
</script>

<svelte:head>
    <link rel="manifest" href={Manifest} />
</svelte:head>

<main class="font-serif">
<slot />
</main>