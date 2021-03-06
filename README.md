# REFACTORING

리팩토링 2판을 읽으면서 따라 해나가는 저장소

----

### 1.8 다형성을 활용해 계산 코드 재구성하기

이번 절에서는 연극 장르를 추가하고 장르마다 공연료와 적립 포인트 계산법을 다르게 지정하도록 기능을 수정한다

현재 상태에서 코드를 변경하려면 이 계산을 수행하는 함수에서 조건문을 수정해야 한다

즉, amountFor() 함수를 수정해야하는데, 이 함수 내에 조건부 로직은 코드 수정 횟수가 늘어날수록 골칫거리가 된다

(나도 이 부분, 이러한 형태의 코드를 어떻게 리팩토링하면 좋을지 항상 고민해왔었다)

조건부 로직을 명확한 구조로 보완하는 방법은 다양하지만 이 책에서는 다형성을 활용한다

#### 목표

상속 계층을 구성, 희극(comedy) 서브클래스와 비극(tragedy) 서브 클래스가 각자의 구체적인 계산 로직을 정의하는 것

호출하는 쪽에서는 다형성 버전의 공연료 계산 함수를 호출하면 되고 희극이냐 비극이냐에 따라 계산 로직을 연결하는 작업은 언어 차원에서 처리해준다

여기서는 `조건부 로직을 다형성으로 바꾸기` 기법을 사용한다