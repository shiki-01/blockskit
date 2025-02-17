<script lang="ts">
    import Icon from "@iconify/svelte";
    import {step, theme, level, score, pause, preStar} from "$lib";
    import ColorBlocks from "$lib/components/ColorBlocks.svelte";
</script>

<div class="w-full h-full relative flex flex-col items-center py-10 text-sky-50 gap-10">
    {#if $step === 0}
        <h1 class="text-xl">Select the level</h1>
        <div class="flex flex-col items-center gap-5">
            <input type="range" min="0" max="2" bind:value={$level}>
            <p>selected: {$level === 0 ? "Easy" : $level === 1 ? "Normal" : "Difficult"}</p>
        </div>
        <button
            class="bg-sky-600 text-sky-50 px-4 py-2 rounded"
                onclick={() => $step = 1}
        >Next</button>
    {:else if $step === 1 || $step === 2}
        <h1 class="text-xl font-bold">Color Blocks !</h1>
        <ColorBlocks/>
        {#if $step === 2}
            <h1>Game Over !</h1>
        {/if}

        <div class="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center transition-[opacity] duration-300 {$pause ? 'opacity-100 backdrop-blur-lg' : 'opacity-0 backdrop-blur-none pointer-events-none'}">
            <div class="w-[150px] h-[160px] flex flex-col gap-4 justify-center items-center bg-sky-800 rounded-lg">
                <p class="underline text-lg">pause</p>
                <p>score: {$score}</p>
                <button class="flex flex-row p-2 items-center gap-2 bg-sky-400 rounded-md" onclick={() => pause.set(false)}>
                    <p>restart</p>
                    <Icon icon="ic:round-not-started" class="w-6 h-6" />
                </button>
            </div>
        </div>
    {:else}
        <h1>Step 3</h1>
    {/if}
</div>