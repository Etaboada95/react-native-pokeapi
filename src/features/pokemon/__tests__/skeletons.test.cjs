const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const { cssToReactNativeRuntime } = require('react-native-css-interop/css-to-rn');

test('skeleton pulse animates only opacity and respects the native reduced-motion setting', async () => {
    const configPath = path.resolve(__dirname, '../../../../tailwind.config.js');
    const config = require(configPath);
    const css = await postcss([
        tailwind({ ...config, content: [{ raw: 'animate-pulse reduce-motion:animate-none' }] })
    ]).process('@tailwind utilities;', { from: undefined });
    const compiled = cssToReactNativeRuntime(css.css);
    const rules = new Map(Array.isArray(compiled.rules) ? compiled.rules : Object.entries(compiled.rules));
    const pulse = new Map(compiled.keyframes).get('pulse');
    assert.deepEqual(pulse.frames.map(([property]) => property), ['opacity']);
    assert.equal(rules.get('animate-pulse').n[0].animations.name[0].value, 'pulse');
    const reducedMotion = rules.get('reduce-motion:animate-none').n[0];
    assert.equal(reducedMotion.animations.name[0].type, 'none');

    let reduceMotion = false;
    const mocks = {
        'react-native': {},
        '../../shared': {},
        './appearance-observables': { isReduceMotionEnabled: { get: () => reduceMotion } },
        './unit-observables': {}
    };
    const runtime = {};
    const source = fs.readFileSync(require.resolve('react-native-css-interop/dist/runtime/native/conditions'), 'utf8');
    new Function('exports', 'require', source)(runtime, (id) => {
        if (Object.hasOwn(mocks, id)) return mocks[id];
        throw new Error(`Unexpected dependency: ${id}`);
    });
    assert.equal(runtime.testMediaQuery(undefined, reducedMotion.media[0]), false);
    reduceMotion = true;
    assert.equal(runtime.testMediaQuery(undefined, reducedMotion.media[0]), true);
});
