<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { loggedInUser } from '$lib/stores/user.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	$effect(() => {
		if (form?.user) {
			loggedInUser.user = form.user;
			goto(form.redirectUrl ?? '/');
		}
	});
</script>

<div class="page-size-wrapper">
	<form method="POST" use:enhance>
		<label for="name">Name</label>
		<input name="name" />
		<Button type="submit">Log in</Button>
	</form>
</div>

<style>
	.page-size-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;
	}

	input {
		color: black;
	}
</style>
