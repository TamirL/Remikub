<script lang="ts">
	import Header from './Header.svelte';
	import { setCardSizeContext } from '../domain/card';
	import Game from './Game.svelte';

	setCardSizeContext({
		width: '30px',
		height: '40px'
	});
</script>

<div class="main">
	<Header />
	<Game />
</div>

<style>
	.main {
		background-color: #222222;
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
</style>
