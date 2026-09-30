const { runViewTransition, trackPointerSpotlight } = require('../../src/js/ui/motion.js');

describe('runViewTransition', () => {
    afterEach(() => {
        delete document.startViewTransition;
        delete window.matchMedia;
    });

    test('runs the update directly when view transitions are unsupported', () => {
        const update = jest.fn();
        runViewTransition(update);
        expect(update).toHaveBeenCalledTimes(1);
    });

    test('wraps the update in a view transition when supported', () => {
        document.startViewTransition = jest.fn(fn => fn());
        window.matchMedia = jest.fn(() => ({ matches: false }));
        const update = jest.fn();
        runViewTransition(update);
        expect(document.startViewTransition).toHaveBeenCalledWith(update);
        expect(update).toHaveBeenCalledTimes(1);
    });

    test('skips the animation for reduced motion users', () => {
        document.startViewTransition = jest.fn();
        window.matchMedia = jest.fn(() => ({ matches: true }));
        const update = jest.fn();
        runViewTransition(update);
        expect(document.startViewTransition).not.toHaveBeenCalled();
        expect(update).toHaveBeenCalledTimes(1);
    });
});

describe('trackPointerSpotlight', () => {
    test('exposes the pointer position inside a tile as CSS variables', () => {
        document.body.innerHTML = '<div class="tool-card"><span id="inner">x</span></div>';
        const tile = document.querySelector('.tool-card');
        tile.getBoundingClientRect = () => ({ left: 10, top: 20 });
        trackPointerSpotlight(document);
        const event = new MouseEvent('pointermove', { bubbles: true, clientX: 60, clientY: 90 });
        document.getElementById('inner').dispatchEvent(event);
        expect(tile.style.getPropertyValue('--mx')).toBe('50px');
        expect(tile.style.getPropertyValue('--my')).toBe('70px');
    });

    test('ignores movement outside tiles', () => {
        document.body.innerHTML = '<p id="p">text</p>';
        trackPointerSpotlight(document);
        expect(() => document.getElementById('p').dispatchEvent(new MouseEvent('pointermove', { bubbles: true }))).not.toThrow();
    });
});
