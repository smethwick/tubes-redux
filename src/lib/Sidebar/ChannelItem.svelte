<script lang="ts">
	import SidebarItem from "./SidebarItem.svelte";

	export let unread: number, channel: string, active: boolean = false;
</script>

<a href="/">
	<SidebarItem {active}>
		<span class="mr-auto">{channel}</span>
		{unread}
	</SidebarItem>
</a>

