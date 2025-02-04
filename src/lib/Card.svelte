<script lang="ts">
	import { getCardSizeContext, getCssCardColor, type CardData } from '../domain/card';

	let { cardData }: { cardData: CardData } = $props();
	let cardColor = getCssCardColor(cardData);

	let { width, height } = getCardSizeContext();
</script>

<div style:color={cardColor} style:width style:height class="card">
	<div class="card-content">
		{cardData.type === 'number' ? cardData.numericValue : 'JK'}
	</div>
</div>

<style>
	.card {
		display: flex;
		justify-content: center;
		align-items: center;

		background-color: #c1aea5;

		border-radius: 10px;
		container: card / inline-size;
		border: 1px solid black;
		user-select: none;
		line-height: normal;
	}

	@container card (min-width: 0) {
		.card-content {
			font-size: 80cqmin;
			font-weight: 500;
		}
	}
</style>
