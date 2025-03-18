<script lang="ts">
	import { cardDragDropContext } from '$lib/domain/cards';
	import Board from './Board.svelte';
	import UserCards from './UserCards.svelte';
	import { getGameContext } from '$lib/domain/game';
	import PlayerCard from '$lib/components/PlayerCard.svelte';
	import UndoBoardChangesButton from './UndoBoardChangesButton.svelte';
	import { areBoardsEqual, hasUserMadeContributionsToTheBoard } from '$lib/domain/board';
	import FinishTurnButton from './FinishTurnButton.svelte';
	import DrawCardButton from './DrawCardButton.svelte';
	import PlayersPanel from '$lib/components/PlayersPanel.svelte';
	import { isDefined } from '$lib/utils/utils';

	cardDragDropContext.init(null);
	const gameContext = getGameContext();

	const canFinishTurn = $derived.by(() => {
		if (!gameContext.gameManager.isItMyTurn) {
			return false;
		}

		if (!gameContext.gameManager.beforePlayerChangesData) {
			return false;
		}

		const hasUserMadeContributions = hasUserMadeContributionsToTheBoard(
			{
				board: gameContext.gameManager.board,
				playerCardIds: gameContext.gameManager.userCards.filter(isDefined).map((p) => p.id)
			},
			gameContext.gameManager.beforePlayerChangesData
		);

		return hasUserMadeContributions && gameContext.gameManager.isBoardValid;
	});

	const isItMyTurn = $derived(gameContext.gameManager.isItMyTurn);
</script>

<div class="game">
	<div class="top-part">
		<Board />
		<div class="side-panel">
			<div class="players-panel">
				<PlayersPanel
					players={gameContext.gameManager.players}
					currentTurnUserId={gameContext.gameManager.currentTurnUserId}
				/>
			</div>
			<div class="user-actions">
				<UndoBoardChangesButton />
				{#if isItMyTurn && canFinishTurn}
					<FinishTurnButton />
				{:else}
					<DrawCardButton />
				{/if}
			</div>
		</div>
	</div>
	<div class="bottom-part">
		<UserCards cards={gameContext.gameManager.userCards} />
	</div>
</div>

<style>
	.game {
		display: flex;
		flex-direction: column;

		flex: 1;
		overflow: auto;
		min-height: 0;
	}

	.top-part {
		display: flex;
		flex-direction: row;

		flex: 1;
	}

	.side-panel {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 10px;
		margin: 10px;
	}

	.players-panel {
		flex: 1;
	}

	.bottom-part {
		display: flex;
		flex-direction: row;

		flex: 0 0 auto;
	}

	.user-actions {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
