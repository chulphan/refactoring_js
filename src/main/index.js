const invoice = require('../data/invoices.json');
const plays = require('../data/plays.json');

/**
 * 임시 변수는 자신이 속한 루틴에만 의미가 있어서 루틴이 길고 복잡해지기 쉽다
 * 본래 fotmat 함수는 임시 변수에 함수를 대입한 형태인데, 저자는 직접 선언해서 사용하도록 바꾼다고 한다
 *
 * format 이라는 이름은 정확히 무엇을 하는지 정확히 표현하지 못한다
 * 이 함수의 핵심은 화폐 단위 맞추기이므로 함수 선언 바꾸기를 적용했다
 *
 * 긴 함수를 작게 쪼개는 리팩터링은 이름을 잘 지어야만 효과가 있고, 이름이 좋으면 함수 본문을 읽지 않고도 무슨 일을 할 수 있는지 알 수 있다...
 */
function usd(aNumber) {
  return new Intl.NumberFormat("en-US",
    {style: "currency", currency: "USD", minimumFractionDigits: 2}).format(aNumber / 100);
}

// 간단히 perf 를 전달하는 것으로 포인트 계산이 가능해진다
function volumeCreditsFor(aPerformance) {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);

  if ('comedy' === playFor(aPerformance).type) {
    result += Math.floor(aPerformance.audience / 5);
  }

  return result;
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

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf); // 추출한 함수를 이용해 값을 누적

    // 청구 내역을 출력한다
    //                                        amountFor(perf) 를 사용하여 thisAmount 변수를 인라인한다
    result += `    ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf); // thisAmount 변수를 인라인한다
  }

  // 임시 변수였던 format 을 함수 호출로 대체했다
  result += `총액: ${usd(totalAmount)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;

  return result;
}

module.exports = statement;