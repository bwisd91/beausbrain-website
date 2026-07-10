'use client';

import { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import initPlasticSoldiersGame from '../../plastic-soldiers-game.js';

export default function PlasticSoldiersPage() {
    const rootRef = useRef(null);

    useEffect(() => {
        const destroy = initPlasticSoldiersGame(rootRef.current);
        return destroy;
    }, []);

    return (
        <>
            <Header />
            <main style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
                <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', color: '#1f2937' }}>Plastic Soldiers RTS</h1>
                <p style={{ color: '#6b7280', marginBottom: '1.75rem', maxWidth: '640px' }}>
                    A tiny real-time strategy game inspired by the little green army men many of us lined up on the
                    carpet before video games existed. Build troops, mass an army, and knock over the enemy&apos;s toy box.
                </p>
                <div ref={rootRef} />
            </main>
            <Footer />
        </>
    );
}
