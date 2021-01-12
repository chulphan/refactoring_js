const createStatementData = require('./createStatementData');

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data, plays) {
  let result = `청구 내역 (고객명: ${data.customer})\n`; // 중간 데이터로 부터 고객 데이터를 얻었다

  for (let perf of data.performances) {
    // 청구 내역을 출력한다
    //                                        amountFor(perf) 를 사용하여 thisAmount 변수를 인라인한다
    result += `    ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }

  // 임시 변수였던 format 을 함수 호출로 대체했다
  result += `총액: ${usd(data.totalAmount)}\n`; // 변수 인라인 후 함수 이름을 바꾼
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`; // volumeCredits 변수를 인라인 시켰다

  return result;

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
}

module.exports = statement;