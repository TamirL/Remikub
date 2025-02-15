<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { GameLobbyFromUserPerspective } from '$lib/domain/game';
	import UpdateManager from '$lib/domain/managers/updateManager.svelte';
	import { source } from 'sveltekit-sse';
	import { goto } from '$app/navigation';
	import PlayerCard from '$lib/components/PlayerCard.svelte';

	const { data }: { data: GameLobbyFromUserPerspective } = $props();
	const updateManager = new UpdateManager(data, source(`/api/game/${data.id}/lobby/updates`));

	$effect(() => {
		if (updateManager.mostRecentData.hasStarted) {
			goto(`/game/${data.id}`);
		}
	});
</script>

<h1>
	Game {data.id}
</h1>
<h2>Players:</h2>
<ul>
	{#each updateManager.mostRecentData.players as player}
		<li><PlayerCard {player} /></li>
	{/each}
</ul>

{#if !updateManager.mostRecentData.amIParticipating}
	<form action="?/join-game" method="POST">
		<Button>Join</Button>
	</form>
{:else if updateManager.mostRecentData.players.length >= 2}
	<form action="?/start-game" method="POST">
		<Button>Start Game!</Button>
	</form>
{/if}

<style>
	* {
		color: white;
	}

	ul {
		list-style-type: none;
		padding: 0;

		display: flex;
		flex-direction: row;
		align-items: stretch;
		gap: 10px;
	}
</style>
