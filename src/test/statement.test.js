test('print correctly', () => {
  const statement = require('../main/index');
  const invoiceData = require('../data/invoices.json');
  const playsData = require('../data/plays.json');

  const expectedStr = `청구 내역 (고객명: BigCo)
    Hamlet: $650.00 (55석)
    As You Like It: $580.00 (35석)
    Othello: $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점
`;
  const result = statement(invoiceData[0], playsData);
  expect(result).toBe(expectedStr);
});
