<script lang="ts">
	import Scrim from "../Dialogs/Base/Scrim.svelte";
	import type { Media } from "./richtext";

    export let media: Media;
    export let isopen: boolean = false;
</script>
<Scrim bind:isopen width="max-w-max">
    <!-- not a lot we can do about image descriptions right now unfortunately -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <img src={media.url} alt="Media Preview" class="max-h-[80vh] max-w-screen" />
</Scrim>