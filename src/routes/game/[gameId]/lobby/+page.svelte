<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { GameLobbyFromUserPerspective } from '$lib/domain/game';
	import UpdateManager from '$lib/domain/managers/updateManager.svelte';
	import { source } from 'sveltekit-sse';

	const { data }: { data: GameLobbyFromUserPerspective } = $props();
	const updateManager = new UpdateManager(data, source(`/api/game/${data.id}/lobby/updates`));
</script>

<h1>
	Game {data.id}
</h1>
<h2>Players:</h2>
<ul>
	{#each updateManager.mostRecentData.players as player}
		<li>{player.name}</li>
	{/each}

	{#if !updateManager.mostRecentData.amIParticipating}
		<form action="?/join-game" method="POST">
			<Button>Join</Button>
		</form>
	{:else if updateManager.mostRecentData.players.length > 2}
		<form action="?/start-game" method="POST">
			<Button>Start Game!</Button>
		</form>
	{/if}
</ul>
