<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { GameLobbyFromUserPerspective } from '$lib/domain/game';
	import UpdateManager from '$lib/domain/managers/updateManager.svelte';
	import { source } from 'sveltekit-sse';
	import { goto } from '$app/navigation';
	import PlayersPanel from '$lib/components/PlayersPanel.svelte';
	import { enhance } from '$app/forms';

	const { data }: { data: GameLobbyFromUserPerspective } = $props();
	const updateManager = new UpdateManager(data, source(`/api/game/${data.id}/lobby/updates`));

	$effect(() => {
		if (updateManager.mostRecentData.hasStarted) {
			goto(`/game/${data.id}`);
		}
	});
</script>

<div class="game-lobby">
	<div class="main-content">
		<h1>
			Game {data.id}
		</h1>
		{#if !updateManager.mostRecentData.amIParticipating}
			<form action="?/join-game" method="POST" use:enhance>
				<Button>Join</Button>
			</form>
		{:else if updateManager.mostRecentData.players.length >= 2}
			<form action="?/start-game" method="POST" use:enhance>
				<Button>Start Game!</Button>
			</form>
		{/if}
	</div>
	<div class="players-side-panel">
		<PlayersPanel players={updateManager.mostRecentData.players} currentTurnUserId={null} />
	</div>
</div>

<style>
	.game-lobby {
		display: flex;
	}

	.main-content {
		flex: 1;

		padding: 10px;
	}

	.players-side-panel {
		flex: 0 0 auto;

		padding: 10px;
	}

	* {
		color: white;
	}
</style>
