'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Thoughts from '@/components/Thoughts';
import Credentials from '@/components/Credentials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import '@/styles/globals.css';
import '@/styles/thoughts.css';

export default function Home() {
    return (
          <>
                <Header />
                <main>
                        <Hero />
                        <About />
                        <Services />
                        <Thoughts />
                        <Credentials />
                        <Contact />
                </main>main>
                <Footer />
          </>>
        );
}</>
