# REFACTORING

리팩토링 2판을 읽으면서 따라 해나가는 저장소

----

1.4 statement() 함수 쪼개기

statement 함수 내부에 switch문은 한 번 공연에 대한 요금을 계산한다

코드를 분석해서 얻은 정보이므로 기억에서 지워지기 쉬우므로 빨리 코드에 반영해야한다

이 코드 조각을 별도 함수로 추출한다 (amountFor)