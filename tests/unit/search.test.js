const { normalizeSearchText, matchesSearch, filterToolCards } = require('../../src/js/ui/search.js');

describe('matchesSearch', () => {
    test('ignores case and accents', () => {
        expect(normalizeSearchText('Équations')).toBe('equations');
        expect(matchesSearch('equation', 'Équations multi-degrés')).toBe(true);
        expect(matchesSearch('MULTI', 'Multi-degree')).toBe(true);
    });

    test('requires every word, in any order', () => {
        expect(matchesSearch('solve quad', 'Quadratic: solve ax² + bx + c')).toBe(true);
        expect(matchesSearch('solve cubic', 'Quadratic: solve ax² + bx + c')).toBe(false);
    });

    test('an empty query matches everything', () => {
        expect(matchesSearch('   ', 'anything')).toBe(true);
    });
});

describe('filterToolCards', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="tool-card">Matrices Operations on 2x2</div>
            <div class="tool-card">Graph Visualize equations</div>
            <p id="toolSearchEmpty" hidden>none</p>`;
    });

    test('hides non matching tiles', () => {
        expect(filterToolCards('graph')).toBe(1);
        const [matrices, graph] = document.querySelectorAll('.tool-card');
        expect(matrices.hidden).toBe(true);
        expect(graph.hidden).toBe(false);
    });

    test('shows the empty message when nothing matches', () => {
        expect(filterToolCards('zzz')).toBe(0);
        expect(document.getElementById('toolSearchEmpty').hidden).toBe(false);
        filterToolCards('');
        expect(document.getElementById('toolSearchEmpty').hidden).toBe(true);
    });
});
