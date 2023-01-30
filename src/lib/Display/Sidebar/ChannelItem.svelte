<script lang="ts">
	import SidebarItem from './SidebarItem.svelte';

	export let unread: number,
		channel: string,
		active: boolean = false;
</script>

<SidebarItem href="./{encodeURIComponent(channel.replaceAll("/", "%2F"))}" {active}>
	<span class="mr-auto">{channel}</span>
	{unread}
</SidebarItem>
