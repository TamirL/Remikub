<script lang="ts">
	const { dropTargetWidth, width }: { dropTargetWidth: string; width: string } = $props();
</script>

<div class="visible-box" style="--visible-box-width: {width}">
	<div class="drop-target" style="--drop-target-width: {dropTargetWidth}"></div>
</div>

<style>
	.visible-box {
		position: relative;
		width: var(--visible-box-width);
	}

	.drop-target {
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc((var(--drop-target-width) - var(--visible-box-width)) * -0.5);
		right: calc((var(--drop-target-width) - var(--visible-box-width)) * 0.5);
	}
</style>
