<script lang="ts">
	import MenuBase from '$lib/Display/Menus/MenuBase.svelte';
	import MenuItem from '$lib/Display/Menus/MenuItem.svelte';

	export let value: string;
	export let update: (new_value: string) => void;
</script>

<MenuBase let:close_menu>
	<svelte:fragment slot="text"><b>{value}</b></svelte:fragment>
	<MenuItem
		on:click={() => {
			update('members');
			close_menu();
		}}
		icon="👋">Members</MenuItem
	>
	<MenuItem
		on:click={() => {
			update('az');
			close_menu();
		}}
		icon="🔤">A-Z</MenuItem
	>
	<MenuItem
		on:click={() => {
			update('bumpscosity');
			close_menu();
		}}
		icon="✨">Bumpscosity</MenuItem
	>
</MenuBase>
