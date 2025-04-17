import { formatDate } from '../src/utils/formatDate';

test('formats date correctly for valid input', () => {
    expect(formatDate('2023-01-01')).toBe('January 1, 2023');
});

test('returns empty string for invalid input', () => {
    expect(formatDate('invalid-date')).toBe('');
});

test('handles edge cases like leap years', () => {
    expect(formatDate('2024-02-29')).toBe('February 29, 2024');
});
