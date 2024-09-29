// src/app/QueryProvider.tsx
'use client'; // This makes the component client-side

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // Create the QueryClient instance on the client side
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
