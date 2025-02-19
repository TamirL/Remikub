<script lang="ts">
	import { getCardDragDropContext } from '$lib/domain/cards';
	import { getGameContext } from '$lib/domain/game';
	import type { ReorderUserCardsAction } from '$lib/domain/gameActions';
	import { joinArrayWithNull } from '$lib/utils/arrayUtils';
	import DragDropDropArea from './DragDropDropArea.svelte';
	import { type UserCardsOrdered } from '$lib/domain/userCards';

	const {
		index,
		dropTargetWidth,
		width,
		height
	}: { index: number; dropTargetWidth: string; width: string; height: string } = $props();

	const dragDropContext = getCardDragDropContext();
	const gameContext = getGameContext();

	let isCardOverThis = $state(false);

	function onElementDragOverChange(isOver: boolean) {
		isCardOverThis = isOver;
	}

	async function onElementDropped() {
		const userCards = gameContext.gameManager.userCards;

		const userCardsUpdated = [...userCards];
		const indexOfDraggedCard = userCardsUpdated.findIndex(
			(userCard) => userCard?.id === dragDropContext.draggedCard?.id
		);

		[userCardsUpdated[index], userCardsUpdated[indexOfDraggedCard]] = [
			userCardsUpdated[indexOfDraggedCard],
			userCardsUpdated[index]
		];

		const requestBody: ReorderUserCardsAction = {
			cardIdsNewOrder: userCardsUpdated.map((card) => card?.id ?? null)
		};

		await fetch(`/api/game/${gameContext.gameManager.gameId}/user-cards`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});
	}
</script>

<div
	class={['visible-box', isCardOverThis && 'card-over-me']}
	style="--visible-box-width: {width}; --visible-box-height: {height}"
>
	<div class="drop-target" style="--drop-target-width: {dropTargetWidth}">
		<DragDropDropArea
			isAnyElementDragged={!!dragDropContext.draggedCard}
			{onElementDropped}
			{onElementDragOverChange}
		/>
	</div>
</div>

<style>
	.visible-box {
		position: relative;
		width: var(--visible-box-width);
		height: var(--visible-box-height);
		border-radius: 4px;
	}

	.drop-target {
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc((var(--drop-target-width) - var(--visible-box-width)) * -0.5);
		right: calc((var(--drop-target-width) - var(--visible-box-width)) * -0.5);
	}

	.card-over-me {
		background-color: #00000042;
	}
</style>
