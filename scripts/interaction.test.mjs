import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

// A narrow interaction fixture, not a DOM implementation. Browser checks own
// real selectors, native button behaviour, accessibility and rendered layout.
const source = await readFile(new URL('../assets/live-design.js', import.meta.url), 'utf8');
function node(textContent = '') {
  const attributes = new Map();
  const classes = new Set();
  const handlers = new Map();
  return {
    textContent, tagName: 'DIV',
    getAttribute: name => attributes.get(name) ?? null,
    setAttribute: (name, value) => attributes.set(name, value),
    classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); }, contains: name => classes.has(name) },
    addEventListener: (type, handler) => handlers.set(type, handler),
    focus() { this.focused = true; },
    fire(type, properties = {}) {
      const event = { target: this, preventDefault() { this.prevented = true; }, ...properties };
      handlers.get(type)?.(event);
      return event;
    }
  };
}

function lessonFixture(selected) {
  const title = node('Wrong initial heading');
  const detail = node('Wrong initial detail');
  const label = node('Step 1 of 4');
  const panel = Object.assign(node(), { querySelector: selector => ({ b: title, '.small': detail, small: label })[selector] ?? null });
  const lesson = { querySelector: selector => selector === '.feedback' ? panel : null };
  const controls = ['Diagnose', 'Explain', 'Practise', 'Feedback'].map(text => node(text));
  const group = {
    querySelectorAll: () => controls,
    closest: selector => selector === '.lesson' ? lesson : null,
    matches: () => false
  };
  controls.forEach((control, index) => {
    control.closest = selector => selector === '[role="group"]' ? group : null;
    control.querySelector = () => null;
    control.setAttribute('aria-pressed', String(index === selected));
  });
  return { group, controls, panel, title, detail, label };
}

const expected = [
  ['Find the starting point', 'Use current work and questions to identify the next teaching priority.'],
  ['Clear explanations', 'See the thinking behind a successful answer, one step at a time.'],
  ['Focused practice', 'Apply the method independently, with support when needed.'],
  ['A clear next step', 'Use feedback to improve the next answer.']
];
function selectedIs(fixture, selected) {
  assert.equal(fixture.title.textContent, expected[selected][0]);
  assert.equal(fixture.detail.textContent, expected[selected][1]);
  assert.equal(fixture.label.textContent, `Step ${selected + 1} of 4`);
  fixture.controls.forEach((control, index) => {
    assert.equal(control.getAttribute('aria-pressed'), String(index === selected));
    assert.equal(control.classList.contains('on'), index === selected);
    assert.equal(control.getAttribute('aria-controls'), fixture.panel.id);
  });
}

for (let repetition = 0; repetition < 10; repetition++) {
  const first = lessonFixture(2);
  const second = lessonFixture(1);
  runInNewContext(source, { document: {
    querySelector: () => null,
    querySelectorAll: () => [first.group, second.group]
  } });
  selectedIs(first, 2); // Initial panel must agree with the selected Practise step.
  selectedIs(second, 1);
  assert.notEqual(first.panel.id, second.panel.id);
  for (let index = 0; index < 4; index++) {
    first.controls[index].fire('click');
    selectedIs(first, index);
    selectedIs(second, 1); // An unrelated panel must remain untouched.
  }
  for (const [start, key, end] of [[3, 'ArrowRight', 0], [0, 'ArrowLeft', 3], [3, 'Home', 0], [0, 'End', 3]]) {
    assert.equal(first.controls[start].fire('keydown', { key }).prevented, true);
    selectedIs(first, end);
    assert.equal(first.controls[end].focused, true);
  }
  first.controls[1].fire('keydown', { key: ' ' });
  selectedIs(first, 1);
  first.controls[2].fire('keydown', { key: 'Enter' });
  selectedIs(first, 2);
  first.controls[2].fire('keydown', { key: 'Home', ctrlKey: true });
  selectedIs(first, 2);
}
console.log('PASS: teaching selection, detail, keyboard and group-isolation regressions (10 fresh runs)');
