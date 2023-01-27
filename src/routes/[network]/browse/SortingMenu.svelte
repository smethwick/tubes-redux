<script lang="ts">
	import MenuBase from '$lib/Display/Menus/MenuBase.svelte';
	import MenuItem from '$lib/Display/Menus/MenuItem.svelte';

	export let value: string;
</script>

<MenuBase>
	<svelte:fragment slot="text"><b>{value}</b></svelte:fragment>
	<MenuItem icon="👋">Members</MenuItem>
	<MenuItem icon="🔤">A-Z</MenuItem>
	<MenuItem icon="✨">Bumpscosity</MenuItem>
</MenuBase>
