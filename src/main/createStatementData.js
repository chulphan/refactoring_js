class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    let result = 0; // 변수 초기화 코드, 함수 안에서 값이 변경 됨 => thisAmount 에서 명확한 변수명으로 변경

    switch (this.performance.play.type) { // play를 playFor() 호출로 변경
      case "tragedy": //비극
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy": //희극
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${this.play.type}`); // play를 playFor() 호출로 변경
    }

    return result;
  }
}

function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer; // 고객 데이터를 중간 데이터로 옮겼다
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);

  return statementData;

  function enrichPerformance(aPerformance) {
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance)); // 공연료 계산기 생성
    // 얕은 복사를 수행한 이유는 함수로 건넨 데이터를 수정하지 않기 위해서임(immutable)
    const result = Object.assign({}, aPerformance); // 얕은 복사 수행
    result.play = calculator.play; // 중간 데이터에 연극 정보를 저장한다
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);

    return result;
  }

  function playFor(aPerformance) { // renderPlainText() 의 중첩 함수였던 함수를 일로 옮겨왔다
    return plays[aPerformance.playID];
  }

  // perf 매개변수명을 의미가 드러나도록 변경했다
  function amountFor(aPerformance) { // aPerformance, play 는 함수 안에서 값이 바뀌지 않으므로 매개변수로 전달
    let result = 0; // 변수 초기화 코드, 함수 안에서 값이 변경 됨 => thisAmount 에서 명확한 변수명으로 변경

    switch (aPerformance.play.type) { // play를 playFor() 호출로 변경
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

  // 간단히 perf 를 전달하는 것으로 포인트 계산이 가능해진다
  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);

    if ('comedy' === playFor(aPerformance).type) {
      result += Math.floor(aPerformance.audience / 5);
    }

    return result;
  }

  // 이제 변수명 충돌이 없어졌으므로 함수 이름을 totalAmount로 변경한다
  function totalAmount(data) {
    return data.performances
      .reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(data) {
    return data.performances
      .reduce((total, p) => total + p.volumeCredits, 0);
  }
}

module.exports = createStatementData;