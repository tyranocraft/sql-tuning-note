# 초급 (Beginner) 토픽 목록

> MySQL SQL 튜닝 기초. 실행 계획을 읽고, 단일 인덱스 활용 여부를 판단하는 수준.

| # | 주제 | 함께 녹이는 이론 | 관련 개념 (Concept Tag) |
|---|------|----------------|----------------------|
| 1 | 실행 계획 읽기 기초 (EXPLAIN 결과 해석) | 실행 계획 기본 구조 | access type(ALL, index, range), rows/filtered 의미 |
| 2 | B-Tree 인덱스 구조 기초 | B-Tree 탐색 원리, 클러스터 인덱스 vs 보조 인덱스 | 리프 노드, 인덱스 스캔 방식, CREATE INDEX |
| 3 | 단순 SELECT 성능 비교 (SELECT * vs 컬럼 지정) | Projection 최적화 | 네트워크 전송량, 버퍼 풀 오염, 커버링 인덱스 방해 |
| 4 | WHERE 조건절과 단일 인덱스 활용 여부 판별 | 데이터 타입과 암묵적 형변환 | sargable 조건, 암묵적 형변환 |
| 5 | WHERE절 함수 사용으로 인한 인덱스 무효화 | 인덱스 컬럼 변환과 sargable 조건 | YEAR(), DATE(), CAST(), LOWER() 등 함수 적용 시 풀 스캔 유발 |
| 6 | NULL 처리와 인덱스 | NULL 저장 방식과 인덱스 탐색 | IS NULL, IS NOT NULL, IFNULL() 조건별 인덱스 활용 여부 |
| 7 | ORDER BY + LIMIT 최적화 기초 | 인덱스 정렬, Filesort 발생 원리 | 인덱스 스캔 순서, Extra: Using filesort |
| 8 | COUNT/AVG/SUM 성능 차이 비교 (인덱스 활용 여부) | 집계 함수의 인덱스 접근 방식 | Clustered Index, Index-only Scan |
| 9 | 기본 JOIN 튜닝 (소규모 vs 대규모 테이블) | Nested Loop Join, 드라이빙 테이블 | 조인 순서, 드라이빙/드리븐 테이블 |
