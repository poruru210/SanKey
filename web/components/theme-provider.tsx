'use client';

import * as React from 'react';
import {
    ThemeProvider as NextThemesProvider,
    type ThemeProviderProps,
} from 'next-themes';

export function ThemeProvider({
                                  children,
                                  attribute = 'class',    // ← html/body に付与する属性
                                  defaultTheme = 'light',    // ← SSR 時のデフォルト
                                  enableSystem = true,       // ← prefers-color-scheme を使うかどうか
                                  ...props
                              }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute={attribute}
            defaultTheme={defaultTheme}
            enableSystem={enableSystem}
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}
