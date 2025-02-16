<script lang="ts">
    import {step, theme, level} from "$lib";
    import ColorBlocks from "$lib/components/ColorBlocks.svelte";
</script>

<div class="w-full h-full flex flex-col items-center py-10 text-sky-50 gap-10">
    {#if $step === 0}
        <h1 class="text-xl">Select the level</h1>
        <div class="flex flex-col items-center gap-5">
            <input type="range" min="0" max="2" bind:value={$level}>
            <p>selected: {$level === 0 ? "Easy" : $level === 1 ? "Normal" : "Difficult"}</p>
        </div>
        <button
            class="bg-sky-600 text-sky-50 px-4 py-2 rounded"
                on:click={() => $step = 1}
        >Next</button>
    {:else if $step === 1 || $step === 2}
        <h1 class="text-xl font-bold">Color Blocks !</h1>
        <ColorBlocks/>
        {#if $step === 2}
            <h1>Game Over !</h1>
        {/if}
    {:else}
        <h1>Step 3</h1>
    {/if}
</div>