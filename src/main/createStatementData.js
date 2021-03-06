/**
 *
 * @param aPerformance
 * @param aPlay
 * @returns {PerformanceCalculator}
 *
 * 타입 코드 대신에 서브 클래스를 변경하도록 만들어야 한다(타입 코드를 서브 클래스로 바꾸기)
 *
 * 이를 위해서 PerformanceCalculator의 서브 클래스들을 준비하고 createStatementData() 에서 적합한 클래스를 사용하도록 만들어야 한다
 * 그리고 딱 맞는 서브 클래스를 사용하려면 생성자 대신 함수를 호출하도록 바꿔야 한다 (자스에서는 생성자가 서브클래스의 인스턴스를 반환할 수 없기 때문)
 * 그래서 생성자를 팩토리 함수로 바꾸기를 적용해야 한다
 */

function createPerformanceCalculator(aPerformance, aPlay) {
  switch(aPlay.type) {
    case 'tragedy': return new TragedyCalculator(aPerformance, aPlay);
    case 'comedy': return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`알 수 없는 장르: ${aPlay.type}`);
  }
}

class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    throw new Error('서브 클래스에서 처리하도록 설계 됨');
  }

  /**
   *
   * @returns {number}
   *
   * 연극 장르들을 검토한 결과, 일부 장르에서만 계산 방식이 약간 다를 뿐 대다수의 연극은 관객 수가 30명이 넘는지를 기본으로 검사해야한다
   * 이럴 때는 일반적인 경우를 슈퍼 클래스에 남겨두고 장르마다 달라지는 부분을 오버라이드 해서 계산하게 한다
   */
  get volumeCredits() {
    return  Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }

    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;

    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
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
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance)); // 생성자 대신 팩토리 함수 이용
    // 얕은 복사를 수행한 이유는 함수로 건넨 데이터를 수정하지 않기 위해서임(immutable)
    const result = Object.assign({}, aPerformance); // 얕은 복사 수행
    result.play = calculator.play; // 중간 데이터에 연극 정보를 저장한다
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;

    return result;
  }

  function playFor(aPerformance) { // renderPlainText() 의 중첩 함수였던 함수를 일로 옮겨왔다
    return plays[aPerformance.playID];
  }

  // perf 매개변수명을 의미가 드러나도록 변경했다
  function amountFor(aPerformance) { // aPerformance, play 는 함수 안에서 값이 바뀌지 않으므로 매개변수로 전달
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
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