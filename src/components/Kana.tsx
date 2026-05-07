import { useRef, type KeyboardEvent, type MouseEvent } from 'react';

import { placeholder } from 'utilities/placeholder';
import type { AccentValueType } from 'utilities/types';

interface KanaProps {
    text: string;
    accent: AccentValueType;
    onUpdate?: (text: string, accent: AccentValueType) => void;
    editable?: boolean;
    onFocusChange?: (isFocused: boolean) => void;
}

const accentName = ['none', 'flat', 'drop'] as const;

export default function Kana({
    text,
    accent,
    onUpdate,
    editable = false,
    onFocusChange,
}: KanaProps) {
    const textRef = useRef<HTMLSpanElement>(null);

    const getCurrentText = (): string => {
        const currentText = textRef.current?.innerText ?? text;
        const trimmed = currentText.trim();

        if (!editable) {
            return currentText;
        }

        return trimmed.length === 0 ? placeholder : currentText;
    };

    const commit = (nextAccent: AccentValueType): void => {
        onUpdate?.(getCurrentText(), nextAccent);
    };

    const changeType = (event: MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        event.stopPropagation();
        commit(((accent + 1) % 3) as AccentValueType);
    };

    const finishEditing = (): void => {
        if (!editable) return;
        commit(accent);
        onFocusChange?.(false);
    };

    const handleFocus = (): void => {
        onFocusChange?.(true);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>): void => {
        if ((event.metaKey || event.ctrlKey) && ['z', 'y'].includes(event.key.toLowerCase())) {
            return;
        }

        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            textRef.current?.blur();
        }
    };

    const handleMouseDown = (event: MouseEvent<HTMLButtonElement>): void => {
        if (!editable) return;
        event.preventDefault();
    };

    return (
        <span
            className={`kana-unit ${editable ? 'is-editable' : ''}`}
            data-accent={accentName[accent]}
            data-ruby={editable ? 'true' : 'false'}
        >
            <button
                type='button'
                className='kana-accent-toggle'
                onClick={changeType}
                onMouseDown={handleMouseDown}
                aria-label='Toggle accent'
                title='アクセントを切り替え'
            />
            <span className='kana-visual'>
                <span
                    ref={textRef}
                    className={`kana-text ${editable ? 'kana-text-editable' : ''}`}
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={finishEditing}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                >
                    {text}
                </span>
            </span>
        </span>
    );
}
