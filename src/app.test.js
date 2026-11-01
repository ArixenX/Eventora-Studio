test('budget calculation works correctly', () => {
  const budget = 50000;
  const guests = 100;
  const perPerson = budget / guests;
  expect(perPerson).toBe(500);
});