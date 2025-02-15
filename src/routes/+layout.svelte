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
</style>
