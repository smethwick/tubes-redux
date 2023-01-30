<script lang="ts">
	import SidebarItem from './SidebarItem.svelte';
	import Hash from 'phosphor-svelte/lib/Hash';

	export let unread: number,
		channel: string,
		active: boolean = false;
</script>

<SidebarItem href="./{encodeURIComponent(channel.replaceAll("/", "%2F"))}" {active}>
	<span class="mr-auto flex gap-2 place-items-center"><Hash size={15} />{channel.replace("#", "")}</span>
	{unread}
</SidebarItem>
