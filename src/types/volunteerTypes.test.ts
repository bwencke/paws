import type { HourEntry } from './volunteerTypes';
import { describe, it, expect } from 'vitest';

// src/types/volunteerTypes.test.ts

describe('HourEntry type', () => {
    it('accepts a valid HourEntry object', () => {
        const entry: HourEntry = {
            id: 1,
            hours: 2.5,
            date: '2024-06-01',
            type: { id: 10, name: 'Dog Walking' },
            location: { id: 5, name: 'Shelter A' }
        };
        expect(entry.id).toBe(1);
        expect(entry.hours).toBe(2.5);
        expect(entry.type.name).toBe('Dog Walking');
        expect(entry.location.name).toBe('Shelter A');
    });

    it('does not accept missing fields', () => {
        // @ts-expect-error
        const entry: HourEntry = {
            id: 1,
            hours: 2.5,
            date: '2024-06-01',
            type: { id: 10, name: 'Dog Walking' }
            // missing location
        };
    });

    it('does not accept wrong field types', () => {
        // @ts-expect-error
        const entry: HourEntry = {
            id: 'wrong', // should be number
            hours: 2.5,
            date: '2024-06-01',
            type: { id: 10, name: 'Dog Walking' },
            location: { id: 5, name: 'Shelter A' }
        };
    });
});