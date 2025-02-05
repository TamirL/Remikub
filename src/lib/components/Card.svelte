<script lang="ts">
	import { getCardSizeContext, getCssCardColor, type CardData } from '$lib/domain/card';
	import cardTileImage from '$lib/assets/card-tile.webp';

	let { cardData }: { cardData: CardData } = $props();
	let cardColor = getCssCardColor(cardData);

	let { width, height } = getCardSizeContext();
</script>

<div
	style="--card-width: {width}; --card-height: {height}"
	style:background-image="url({cardTileImage})"
	class="card"
>
	<div class="card-content" style:background-color={cardColor}>
		{cardData.type === 'number' ? cardData.numericValue : 'JK'}
	</div>
</div>

<style>
	.card {
		width: var(--card-width);
		height: var(--card-height);

		display: flex;
		justify-content: center;
		align-items: flex-start;

		background-size: cover;
		background-position: center;

		border-radius: 10px;
		container: card / inline-size;
		user-select: none;
		line-height: normal;
	}

	@container card (min-width: 0) {
		.card-content {
			font-size: 80cqmin;
			font-weight: 500;
			font-size: calc(var(--card-width) * 0.5);
			margin-top: calc(var(--card-height) * 0.08);
			color: transparent;
			text-shadow: 2px 2px 3px rgba(255, 255, 255, 0.5);
			-webkit-background-clip: text;
			-moz-background-clip: text;
			background-clip: text;
		}
	}
</style>
