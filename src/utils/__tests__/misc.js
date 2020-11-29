import {formatTime} from 'utils/date'

test('formatTime formats the date to look nice!', () => {
  expect(formatTime(Date.now())).toBe('Nov 20')
})
