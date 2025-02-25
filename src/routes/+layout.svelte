<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import { loggedInUser } from '$lib/stores/user.svelte';
	import { goto } from '$app/navigation';
	import type { LayoutData } from './$types';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();

	loggedInUser.user = data.loggedInUser;
	if (!data.isLogin && !data.loggedInUser) {
		goto('/login');
	}

	$effect(() => {
		const abort = new AbortController();
		document.addEventListener(
			'touchmove',
			(e) => {
				e.preventDefault();
			},
			{ signal: abort.signal, passive: false }
		);

		return () => {
			abort.abort();
		};
	});
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
