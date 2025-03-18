<script lang="ts">
	import { cardDragDropContext, type DraggedCardData, type RealCardData } from '$lib/domain/cards';
	import { getGameContext } from '$lib/domain/game';
	import type { ReorderUserCardsAction } from '$lib/domain/gameActions';
	import { dndzone, TRIGGERS, type DndEvent, type Options } from 'svelte-dnd-action';
	import Card from './Card.svelte';
	import { untrack } from 'svelte';

	const {
		cardData,
		index,
		dropTargetWidth,
		width,
		height
	}: {
		cardData: RealCardData | null;
		index: number;
		dropTargetWidth: string;
		width: string;
		height: string;
	} = $props();

	const dragDropContext = cardDragDropContext.get();
	const gameContext = getGameContext();

	function getItemsFromCardData(cardData: RealCardData | null): DraggedCardData[] {
		return cardData
			? [
					{
						id: cardData.id,
						draggedCard: cardData,
						draggedFromUserCardIndex: index
					}
				]
			: [];
	}

	let items: DraggedCardData[] = $state<DraggedCardData[]>(getItemsFromCardData(cardData));

	$effect(() => {
		const newItems = getItemsFromCardData(cardData);
		untrack(() => (items = newItems));
	});

	function onConsider(event: CustomEvent<DndEvent<DraggedCardData>>) {
		console.log('DropTarget onConsider', event.detail);
		items = event.detail.items;

		if (event.detail.info.trigger === TRIGGERS.DRAG_STARTED) {
			console.log('DRAG_STARTED', event.detail.items);
			dragDropContext.current = event.detail.items[0];
		}
	}

	async function onFinalized(e: CustomEvent<DndEvent<DraggedCardData>>) {
		console.log('DropTaget onFinalized', { detail: e.detail, index, cardData });

		resetItemsState();

		if (e.detail.info.trigger === TRIGGERS.DROPPED_OUTSIDE_OF_ANY) {
			dragDropContext.current = null;
			return;
		}

		if (e.detail.info.trigger !== TRIGGERS.DROPPED_INTO_ZONE) {
			return;
		}

		const dragDropContextData = dragDropContext.current;

		if (!dragDropContextData) {
			return;
		}

		dragDropContext.current = null;

		const userCards = gameContext.gameManager.userCards;

		const userCardsUpdated = [...userCards];
		const indexOfDraggedCard = userCardsUpdated.findIndex(
			(userCard) => userCard?.id === dragDropContextData.draggedCard.id
		);

		[userCardsUpdated[index], userCardsUpdated[indexOfDraggedCard]] = [
			userCardsUpdated[indexOfDraggedCard],
			userCardsUpdated[index]
		];

		const requestBody: ReorderUserCardsAction = {
			cardIdsNewOrder: userCardsUpdated.map((card) => card?.id ?? null)
		};

		console.log('drop target drop', { before: userCards, after: userCardsUpdated });

		await fetch(`/api/game/${gameContext.gameManager.gameId}/user-cards`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});
	}

	function resetItemsState() {
		items = getItemsFromCardData(cardData);
	}

	const dndOptions: Options<DraggedCardData> = $derived({
		items,
		dropFromOthersDisabled: !!cardData
		// dropTargetClasses: ['card-over-me']
	});
</script>

<div class={['visible-box']} style="--visible-box-width: {width}; --visible-box-height: {height}">
	<div
		class="drop-target"
		style="--drop-target-width: {dropTargetWidth}"
		use:dndzone={dndOptions}
		onconsider={onConsider}
		onfinalize={onFinalized}
	>
		{#each items as item (item.id)}
			<div>
				<Card cardData={item.draggedCard} />
			</div>
		{/each}
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
