<script lang="ts">
	import '../app.css';
	import Header from './Header.svelte';
	let { children } = $props();
</script>

<div class="main">
	{@render children()}
</div>

<style>
	.main {
		background-color: #222222;
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	:root {
		--yellow-card-color: #f68230;
		--blue-card-color: #1148ec;
		--red-card-color: #be0509;
		--black-card-color: #020300;
	}
</style>
