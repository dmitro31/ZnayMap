import { normalizeName } from './normalize-name.util';

describe('normalizeName', () => {
  it('lowercases, strips quotes and collapses whitespace', () => {
    expect(normalizeName('  ТОВ «Ромашка»   Плюс ')).toBe('тов ромашка плюс');
  });

  it('returns empty string for whitespace only input', () => {
    expect(normalizeName('   ')).toBe('');
  });
});