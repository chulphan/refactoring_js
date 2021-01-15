test('print text statement correctly', () => {
  const { statement } = require('../main/index');
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

test('print html statement correctly', () => {
  const { htmlStatement } = require('../main/index');
  const invoiceData = require('../data/invoices.json');
  const playsData = require('../data/plays.json');

  const result = htmlStatement(invoiceData[0], playsData);

  const expectedHTML = `<h1>청구 내역 (고객명: BigCo)</h1>
<table>
<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>  <tr><td>Hamlet</td><td>(55석)</td><td>$650.00</td></tr>
  <tr><td>As You Like It</td><td>(35석)</td><td>$580.00</td></tr>
  <tr><td>Othello</td><td>(40석)</td><td>$500.00</td></tr>
</table>
<p>총액: <em>$1,730.00</em></p>
<p>적립 포인트: <em>47</em>점</p>
`
  expect(result).toBe(expectedHTML);
});