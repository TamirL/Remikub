<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { USER_ID_COOKIE_FIELD, type User } from '$lib/domain/user';
	import { getClientCookiesMap, setCookie } from '$lib/utils/cookiesUtils';

	// let { data }: { data: User } = $props();

	// if (browser) {
	// 	try {
	// 		const cookiesMap = getClientCookiesMap();
	// 		if (!cookiesMap.has(USER_ID_COOKIE_FIELD)) {
	// 			const newDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
	// 			setCookie(USER_ID_COOKIE_FIELD, makeid(30), {
	// 				httpOnly: false,
	// 				expires: newDate,
	// 				secure: false
	// 			});
	// 		}
	// 	} catch (error) {
	// 		alert(error);
	// 	}

	// 	function makeid(length: number) {
	// 		let result = '';
	// 		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	// 		const charactersLength = characters.length;
	// 		let counter = 0;
	// 		while (counter < length) {
	// 			result += characters.charAt(Math.floor(Math.random() * charactersLength));
	// 			counter += 1;
	// 		}
	// 		return result;
	// 	}

	// 	console.log(makeid(5));
	// }

	let existingGameId: string = $state('');
</script>

<div class="entry-page">
	<form method="POST" use:enhance action="?/create-game">
		<Button type="submit">New Game</Button>
	</form>
	<br />
	<input name="gameId" bind:value={existingGameId} />
	<a href="/game/{existingGameId}/lobby" aria-disabled={!existingGameId}>
		<Button disabled={!existingGameId}>Join Game</Button>
	</a>
</div>

<style>
	.entry-page {
		color: white;
	}

	input {
		color: black;
	}
</style>
