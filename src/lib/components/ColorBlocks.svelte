<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { step, level, score, pause } from '$lib';
	import blockMeta from '$lib/block/meta';

	type Position = { x: number; y: number };
	type Block = { shape: string[]; color: string };

	const stageSize = 8;

	let mainElement: HTMLElement | null = null;
	let stageElement: HTMLElement | null = null;

	let handBlocks: Block[] = $state([]);
	let stage: Array<Array<{ value: string | null; color: string | null }>> = $state(createEmptyStage(stageSize));
	let draggedBlock: Block | null = $state(null);
	let dragOffset: Position | null = $state(null);
	let dragOffsetDetail: Position | null = $state(null);
	let dragPosition: Position | null = $state(null);
	let suggested: Position[] = $state([]);
	let isTouch: boolean = $state(false);

	const colors = [
		'#D9B632',
		'#D93432',
		'#32D965',
		'#3B45DB',
		'#ae3bdb'
	];

	function createEmptyStage(size: number) {
		return Array(size).fill(null).map(() => Array(size).fill({ value: null, color: null }));
	}

	function rotateBlock(block: string[]): string[] {
		const rotatedBlock = [];
		for (let j = 0; j < block[0].length; j++) {
			rotatedBlock.push(block.map(row => row[j]).reverse().join(''));
		}
		return rotatedBlock;
	}

	function weightedRandomChoice<T>(items: T[], weights: number[]): T {
		const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
		let randomValue = Math.random() * totalWeight;

		return items[weights.findIndex((_, i) => (randomValue -= weights[i]) < 0)];
	}

	function createRandomBlock(blockSet: {shape: string[]; weight: number}[], weights: number[]): Block {
		const selectedBlockMeta = weightedRandomChoice(blockSet, weights);
		let blockShape = selectedBlockMeta.shape;

		for (let i = 0; i < Math.floor(Math.random() * 4); i++) {
			blockShape = rotateBlock(blockShape);
		}

		return { shape: blockShape, color: colors[Math.floor(Math.random() * colors.length)] };
	}

	function getRandomBlocks(): Block[] {
		const blockSet = Object.values(blockMeta).flat();
		const adjustedWeights = blockSet.map(({ weight }) => weight * Math.pow(1.2, $level - 1));
		return Array(3).fill(null).map(() => createRandomBlock(blockSet, adjustedWeights));
	}

	function initializeGame() {
		stage = createEmptyStage(stageSize);
		score.set(0);
		handBlocks = getRandomBlocks();
	}

	function getClientPosition(event: PointerEvent | TouchEvent) {
		if (event.type.startsWith('touch')) {
			const touch = (event as TouchEvent).touches[0] || (event as TouchEvent).changedTouches[0];
			if (!touch) {
				console.error('Touch event is missing touches or changedTouches');
				return { clientX: 0, clientY: 0 };
			}
			return { clientX: touch.clientX, clientY: touch.clientY };
		} else {
			return { clientX: (event as PointerEvent).clientX, clientY: (event as PointerEvent).clientY };
		}
	}

	function addEventListeners() {
		document.addEventListener(isTouch ? 'touchmove' : 'pointermove', handleDragBlock, { passive: false });
		document.addEventListener(isTouch ? 'touchend' : 'pointerup', handlePointerUp);
	}

	function removeEventListeners() {
		document.removeEventListener(isTouch ? 'touchmove' : 'pointermove', handleDragBlock);
		document.removeEventListener(isTouch ? 'touchend' : 'pointerup', handlePointerUp);
	}

	function handlePointerDown(event: PointerEvent, block: Block) {
		event.preventDefault();
		if (typeof window === 'undefined' || !mainElement) return;

		isTouch = event.pointerType.startsWith('touch');
		const { clientX, clientY } = getClientPosition(event);

		const targetElement = event.currentTarget as HTMLElement;
		const boundingRect = targetElement.getBoundingClientRect();
		const stageRect = mainElement.getBoundingClientRect();

		dragOffsetDetail = { x: clientX - boundingRect.left, y: clientY - boundingRect.top };
		dragPosition = { x: clientX - stageRect.left, y: clientY - stageRect.top };

		const x = Math.floor(dragOffsetDetail.x / 32);
		const y = Math.floor(dragOffsetDetail.y / 32);

		dragOffset = { x, y };
		draggedBlock = block;
		suggested = [];

		addEventListeners();
	}

	function handlePointerUp(event: PointerEvent | TouchEvent) {
		event.preventDefault();
		if (typeof window === 'undefined') return;

		isTouch = event.type.startsWith('touch');
		removeEventListeners();

		if (stageElement && dragPosition && dragOffset) {
			const targetRect = stageElement.getBoundingClientRect();
			const { clientX, clientY } = getClientPosition(event);
			if (targetRect.left <= clientX && clientX <= targetRect.right && targetRect.top <= clientY && clientY <= targetRect.bottom) {
				const x = Math.floor((clientX - targetRect.left) / 32);
				const y = Math.floor((clientY - targetRect.top) / 32);
				handlePointerDrop(event, x, y);
			}
		}

		draggedBlock = null;
		dragOffset = null;
		dragOffsetDetail = null;
		dragPosition = null;
		suggested = [];
	}

	function handlePointerOver(event: PointerEvent | TouchEvent, x: number, y: number) {
		if (event.cancelable) event.preventDefault();
		if (!draggedBlock || !dragOffset) return;

		const startX = x - dragOffset.x;
		const startY = y - dragOffset.y;

		if (canPlaceBlock(draggedBlock.shape, startX, startY)) {
			suggested = [];
			for (let i = 0; i < draggedBlock.shape.length; i++) {
				for (let j = 0; j < draggedBlock.shape[i].length; j++) {
					if (draggedBlock.shape[i][j] === '-') {
						suggested.push({ x: startX + j, y: startY + i });
					}
				}
			}
		} else {
			suggested = [];
		}
	}

	function handlePointerDrop(event: PointerEvent | TouchEvent, x: number, y: number) {
		if (event.cancelable) event.preventDefault();
		if (!draggedBlock || !dragOffset) return;

		const startX = x - dragOffset.x;
		const startY = y - dragOffset.y;

		if (canPlaceBlock(draggedBlock.shape, startX, startY)) {
			placeBlock(draggedBlock, startX, startY);
			handBlocks = handBlocks.filter((block) => block !== draggedBlock);
			draggedBlock = null;
			dragOffset = null;

			if (handBlocks.length === 0) nextTurn();

			isGameOver();
		}
	}

	function handleDragBlock(event: PointerEvent | TouchEvent) {
		if (!draggedBlock || !dragOffset) return;

		const { clientX, clientY } = getClientPosition(event);
		const stageRect = mainElement!.getBoundingClientRect();

		const deltaX = (clientX - stageRect.left) - dragPosition!.x;
		const deltaY = (clientY - stageRect.top) - dragPosition!.y;

		dragPosition = {
			x: dragPosition!.x + deltaX * 1.5,
			y: dragPosition!.y + deltaY * 1.5
		};

		if (stageElement) {
			const targetRect = stageElement.getBoundingClientRect();
			const x = Math.floor((clientX - targetRect.left) / 32);
			const y = Math.floor((clientY - targetRect.top) / 32);
			handlePointerOver(event, x, y);
		}
	}

	function canPlaceBlock(block: string[], x: number, y: number): boolean {
		for (let i = 0; i < block.length; i++) {
			for (let j = 0; j < block[i].length; j++) {
				if (block[i][j] === '-' && (stage[y + i]?.[x + j]?.value !== null || x + j >= 9 || y + i >= 9)) {
					return false;
				}
			}
		}
		return true;
	}

	function canPlaceAnyBlock(): boolean {
		for (const block of handBlocks) {
			for (let x = 0; x < stage[0].length; x++) {
				for (let y = 0; y < stage.length; y++) {
					if (canPlaceBlock(block.shape, x, y)) return true;
				}
			}
		}
		return false;
	}

	function placeBlock(block: Block, x: number, y: number): void {
		for (let i = 0; i < block.shape.length; i++) {
			for (let j = 0; j < block.shape[i].length; j++) {
				if (block.shape[i][j] === '-') {
					stage[y + i][x + j] = { value: '-', color: block.color };
				}
			}
		}
		checkAndClearLines();
	}

	function checkAndClearLines() {
		let rowsToClear: number[] = [];
		let colsToClear: number[] = [];

		for (let i = 0; i < stage.length; i++) {
			if (stage[i].every((cell) => cell.value === '-')) rowsToClear.push(i);
		}

		for (let j = 0; j < stage[0].length; j++) {
			if (stage.every((row) => row[j].value === '-')) colsToClear.push(j);
		}

		rowsToClear.forEach((row) => stage[row].forEach((cell) => Object.assign(cell, { value: null, color: null })));
		colsToClear.forEach((col) => stage.forEach((row) => Object.assign(row[col], { value: null, color: null })));

		score.update(v => v + rowsToClear.length + colsToClear.length);
	}

	function isGameOver() {
		if (!canPlaceAnyBlock()) {
			step.set(2);
		}
	}

	function nextTurn() {
		handBlocks = getRandomBlocks();
		isGameOver();
	}

	onMount(() => {
		initializeGame();
	});
</script>

<div bind:this={mainElement} style="--stageSize:{stageSize};" class="relative w-full flex flex-col items-center gap-4">
	
	<div class="flex flex-row gap-4 items-center justify-center">
		<p>score:{$score}</p>
		<button onclick={() => pause.set(true)}>
			<Icon icon="ic:round-pause" class="w-6 h-6" />
		</button>
	</div>

	<!-- ステージ -->
	<div bind:this={stageElement} class="grid touch-none" role="application" aria-dropeffect="move">
		{#each stage as row, y}
			{#each row as cell, x}
				<div
					class="cell {'x-' + x} {'y-' + y} {cell.value ? 'filled' : ''}"
					style="background-color:{cell.color};"
				>
					{#if suggested.some((s) => s.x === x && s.y === y)}
						<div class="suggested" style="--suggestedColor: {draggedBlock?.color || '#052133'}"></div>
					{/if}
				</div>
			{/each}
		{/each}
	</div>

	{#if draggedBlock && dragPosition && dragOffsetDetail}
		<div
			class="dragging-block block-grid"
			style="
                top: {dragPosition.y - dragOffsetDetail.y}px; left: {dragPosition.x - dragOffsetDetail.x}px;
                grid-template-rows: repeat({draggedBlock.shape.length}, 32px);
                grid-template-columns: repeat({draggedBlock.shape[0].length}, 32px);
            "
		>
			{#each draggedBlock.shape as row}
				{#each row.split('') as cell}
					<div class="block-cell {cell === '-' ? 'filled' : ''}"
							 style="background-color:{cell === '-' ? draggedBlock.color : 'transparent'};"></div>
				{/each}
			{/each}
		</div>
	{/if}

	<h2>Next Block</h2>
	<div class="flex flex-row gap-4">
		{#each handBlocks as block}
			<div
				class="block-grid"
				role="button"
				onpointerdown={(event) => handlePointerDown(event, block)}
				style="
                    grid-template-rows: repeat({block.shape.length}, 32px);
                    grid-template-columns: repeat({block.shape[0].length}, 32px);
                "
			>
				{#each block.shape as row}
					{#each row.split('') as cell}
						<div class="block-cell {cell === '-' ? 'filled' : ''}"
								 style="background-color:{cell === '-' ? block.color : 'transparent'};"></div>
					{/each}
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
    /* スタイル設定 */
    .grid {
        display: grid;
        grid-template-columns: repeat(var(--stageSize), 32px);
        border: solid 2px #0382d7;
        background-color: #0382d7;
        border-radius: 10px;
    }

    .x-0.y-0 {
        border-top-left-radius: 8px;
    }

    .x-7.y-0 {
        border-top-right-radius: 8px;
    }

    .x-0.y-7 {
        border-bottom-left-radius: 8px;
    }

    .x-7.y-7 {
        border-bottom-right-radius: 8px;
    }

    .cell {
        width: 32px;
        height: 32px;
        border: solid thin #0382d7;
        background-color: #162833;
    }

    .cell.filled::before, .cell.filled::after {
        content: "";
        position: absolute;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        pointer-events: none;
    }

    .cell::before {
        border-top: solid 5px rgba(255, 255, 255, 0.2);
        border-left: solid 5px rgba(255, 255, 255, 0.2);
        z-index: 1;
    }

    .cell::after {
        border-bottom: solid 5px rgba(0, 0, 0, 0.2);
        border-right: solid 5px rgba(0, 0, 0, 0.2);
        z-index: 2;
    }

    .suggested {
        width: 100%;
        height: 100%;
        background-color: var(--suggestedColor);
        opacity: 0.5;
    }

    .block-grid {
        display: grid;
    }

    .block-cell {
        width: 32px;
        height: 32px;
        border-radius: 4px;
    }

    /* after, before に blend で縁をつけて立体的に */
    .block-cell.filled::after, .block-cell.filled::before {
        content: "";
        position: absolute;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        pointer-events: none;
    }

    .block-cell::before {
        border-top: solid 5px rgba(255, 255, 255, 0.2);
        border-left: solid 5px rgba(255, 255, 255, 0.2);
        z-index: 1;
    }

    .block-cell::after {
        border-bottom: solid 5px rgba(0, 0, 0, 0.2);
        border-right: solid 5px rgba(0, 0, 0, 0.2);
        z-index: 2;
    }

    .dragging-block {
        position: absolute;
        pointer-events: none;
        z-index: 3;
    }
</style>
