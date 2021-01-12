const invoice = require('../data/invoices.json');
const plays = require('../data/plays.json');

// 간단히 perf 를 전달하는 것으로 포인트 계산이 가능해진다
function volumeCreditsFor(perf) {
  let volumeCredits = 0;
  volumeCredits += Math.max(perf.audience - 30, 0);

  if ('comedy' === playFor(perf).type) {
    volumeCredits += Math.floor(perf.audience / 5);
  }

  return volumeCredits;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

// perf 매개변수명을 의미가 드러나도록 변경했다
function amountFor(aPerformance) { // aPerformance, play 는 함수 안에서 값이 바뀌지 않으므로 매개변수로 전달
  let result = 0; // 변수 초기화 코드, 함수 안에서 값이 변경 됨 => thisAmount 에서 명확한 변수명으로 변경

  switch (playFor(aPerformance).type) { // play를 playFor() 호출로 변경
    case "tragedy": //비극
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case "comedy": //희극
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`); // play를 playFor() 호출로 변경
  }

  return result;
}


function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  const format = new Intl.NumberFormat("en-US",
    {style: "currency", currency: "USD", minimumFractionDigits: 2}).format;

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf); // 추출한 함수를 이용해 값을 누적

    // 청구 내역을 출력한다
    //                                        amountFor(perf) 를 사용하여 thisAmount 변수를 인라인한다
    result += `    ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf); // thisAmount 변수를 인라인한다
  }

  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;

  return result;
}

module.exports = statement;