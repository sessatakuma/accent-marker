const markdownExportStyles = `
.akuma {
    --accent-color: #cc3344;
    --accent-width: 2px;
    --kana-ruby-font-scale: 0.6;
    --kana-accent-lane-height: 0.5em;
    --kana-accent-gap: 2px;
    --kana-drop-height: 0.4rem;
    --result-ruby-font-size: calc(1em * var(--kana-ruby-font-scale));
    --result-ruby-line-height: 1.2;
    --result-reading-text-height: calc(var(--result-ruby-font-size) * var(--result-ruby-line-height));
    --result-kana-shell-gap: var(--kana-accent-gap);
    --result-kana-shell-rows: var(--kana-accent-lane-height) auto;
    --result-accent-track-height: calc(var(--kana-accent-lane-height) + var(--result-kana-shell-gap));
    --result-reading-track-height: calc(var(--result-accent-track-height) + var(--result-reading-text-height));

    font-family: 'Noto Sans JP', sans-serif;
    font-size: 1.5rem;
    line-height: 2.5;
    color: #1f2937;
}

.akuma .word-stack,
.akuma .word-group {
    display: inline-grid;
    grid-template-rows: var(--result-reading-track-height) auto;
    vertical-align: top;
    justify-items: stretch;
}

.akuma .word-inline-cluster {
    display: inline-flex;
    align-items: flex-start;
    vertical-align: top;
}

.akuma .word-group-kana {
    align-items: stretch;
}

.akuma .word-reading-row,
.akuma .word-base-row {
    display: flex;
    width: 100%;
    justify-content: flex-start;
}

.akuma .word-reading-row {
    min-height: var(--result-reading-track-height);
    font-size: var(--result-ruby-font-size);
    line-height: var(--result-ruby-line-height);
    letter-spacing: 0;
    color: #6b7280;
    white-space: nowrap;
}

.akuma .word-reading-row-empty {
    color: transparent;
}

.akuma .word-base-row {
    line-height: 1;
    white-space: nowrap;
}

.akuma .word-reading-cell,
.akuma .word-base-cell {
    display: inline-flex;
    justify-content: center;
    align-items: flex-end;
    flex: none;
}

.akuma .word-base-cell[style] {
    width: 100%;
}

.akuma .word-base-cell-plain {
    justify-content: flex-start;
}

.akuma .furigana-group {
    display: flex;
    width: 100%;
    white-space: nowrap;
}

.akuma .word-reading-cell {
    text-align: center;
}

.akuma .word-reading-cell > .kana-shell {
    min-width: 0;
    width: 100%;
    display: inline-grid;
    grid-template-rows: var(--result-kana-shell-rows);
    justify-items: stretch;
    row-gap: var(--result-kana-shell-gap);
}

.akuma .word-reading-cell > .kana-shell > .kana-text,
.akuma .word-reading-cell > .kana-shell > .kana-accent-lane {
    display: block;
    width: 100%;
}

.akuma .kana-shell {
    position: relative;
    align-items: start;
}

.akuma .kana-accent-lane {
    position: relative;
    height: var(--kana-accent-lane-height);
    opacity: 0;
    visibility: hidden;
}

.akuma .kana-text {
    text-align: center;
    white-space: nowrap;
}

.akuma .kana-shell[data-accent-phase-active='true'][data-accent-visible='true'] > .kana-accent-lane {
    opacity: 1;
    visibility: visible;
}

.akuma .kana-shell[data-accent-phase-active='true'][data-accent-visible='true'][data-accent='flat'] > .kana-accent-lane::before,
.akuma .kana-shell[data-accent-phase-active='true'][data-accent-visible='true'][data-accent='drop'] > .kana-accent-lane::before {
    content: '';
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    border-top: var(--accent-width) solid var(--accent-color);
}

.akuma .kana-shell[data-accent-phase-active='true'][data-accent-visible='true'][data-accent='drop'] > .kana-accent-lane::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: calc(-1 * var(--kana-drop-height) + var(--accent-width));
    height: var(--kana-drop-height);
    border-left: var(--accent-width) solid var(--accent-color);
}
`;

export default markdownExportStyles;
