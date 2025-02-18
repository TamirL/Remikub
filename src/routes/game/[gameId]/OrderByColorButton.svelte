<script lang="ts">
	import { getGameContext } from '$lib/domain/game';
	import Button from '$lib/components/Button.svelte';
	import type { ReorderUserCardsAction } from '$lib/domain/gameActions';
	import { joinArrayWithNull } from '$lib/utils/arrayUtils';

	const gameContext = getGameContext();

	async function orderByColor() {
		const newOrder = gameContext.gameManager.getUserCardsIdsOrderdByColor();
		const requestBody: ReorderUserCardsAction = {
			cardIdsNewOrder: joinArrayWithNull([...newOrder.sets, newOrder.otherCards]).map(
				(card) => card?.id ?? null
			)
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

<Button onclick={orderByColor}
	><span class="black-cards">1</span><span class="yellow-cards">2</span><span class="black-cards"
		>2</span
	><span class="yellow-cards">3</span></Button
>

<style>
	.black-cards {
		color: var(--black-card-color);
	}
	.yellow-cards {
		color: var(--yellow-card-color);
	}
</style>
