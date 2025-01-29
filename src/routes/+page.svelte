<script lang="ts">
	import Header from './Header.svelte';
	import { setCardSizeContext } from '../domain/card';
	import Board from '../components/Board.svelte';
	import UserCards from '../components/UserCards.svelte';
	import { createDeck } from '../domain/deck';

	setCardSizeContext({
		width: '30px',
		height: '40px'
	});

	const deck = $state(createDeck());
	const userCards = $derived(deck.slice(0, 14));
</script>

<div class="main">
	<Header />
	<Board />
	<UserCards cards={userCards} />
</div>

<style>
	.main {
		background-color: #222222;
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
</style>
