<script lang="ts">
	import {
		default_config,
		default_icons,
		type ConnectionInfo
	} from '$lib/Chat/provider+connection';
	import { saveMessage } from '$lib/Storage/messages';
	import { provider } from '$lib/Chat';
	import { v4 as uuidv4 } from 'uuid';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';

	const addProvider = async () => {
		const uuid = uuidv4();
		let ci: ConnectionInfo = {
			...default_config,
			name: uuid,
			display_name: 'Ergo Testnet',
			icon: default_icons[Math.floor(Math.random() * default_icons.length)],
			url: 'wss://testnet.ergo.chat/webirc',
			autojoin: ['#tubes', '#tubes/test', '#testaaaa']
		};

		let conn = await provider.add_persistent_connection(ci);
		conn.on_msg = (e) => saveMessage(ci.name, e);
	};

	let login: string, password: string;
</script>

todo

<button on:click={() => addProvider()}>new all</button>

<form>
	<label>
		login
		<input type="text" bind:value={login} />
	</label>

	<label>
		password
		<input type="text" bind:value={password} />
	</label>

	<button on:click={() => {
		localStorage.setItem("login", login);
		localStorage.setItem("password", password);

		throw redirect(302, "/");
	}}>
		save
	</button>
</form>
