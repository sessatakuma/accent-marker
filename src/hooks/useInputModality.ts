import { useEffect, useState } from 'react';

export function useInputModality(): boolean {
    const [isKeyboardModality, setIsKeyboardModality] = useState(false);

    useEffect(() => {
        const handleKeyDown = (): void => {
            setIsKeyboardModality(true);
        };

        const handlePointerDown = (): void => {
            setIsKeyboardModality(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('pointerdown', handlePointerDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('pointerdown', handlePointerDown);
        };
    }, []);

    return isKeyboardModality;
}
