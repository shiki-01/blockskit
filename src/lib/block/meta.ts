type BlockMeta = {
    [key: string]: {
        shape: string[];
        weight: number;
    }[]
}

const blockMeta: BlockMeta = {
    lines: [
        { shape: ['--'], weight: 5 },
        { shape: ['---'], weight: 4 },
        { shape: ['----'], weight: 3 },
        { shape: ['-----'], weight: 2 }
    ],
    lShapes: [
        { shape: ['..-', '---'], weight: 3 },
        { shape: ['-..', '---'], weight: 3 },
        { shape: ['-.', '--'], weight: 4 },
        { shape: ['.-', '--'], weight: 4 },
        { shape: ['-..', '-..', '---'], weight: 2 },
        { shape: ['..-', '..-', '---'], weight: 2 }
    ],
    tShapes: [
        { shape: ['---', '.-.'], weight: 3 }
    ],
    zShapes: [
        { shape: ['--.', '.--'], weight: 3 },
        { shape: ['.--', '--.'], weight: 3 }
    ],
    squares: [
        { shape: ['--', '--'], weight: 4 },
        { shape: ['---', '---', '---'], weight: 2 }
    ],
    obliques: [
        { shape: ['-..', '.-.', '..-'], weight: 2 },
        { shape: ['..-', '.-.', '-..'], weight: 2 }
    ]
};

export default blockMeta;
