# 고급 (Advanced) 토픽 목록

> 옵티마이저 내부 동작 이해, 실행 계획 심화 분석, 대규모 데이터 처리 튜닝.

| # | 주제 | 함께 녹이는 이론 | 관련 개념 (Concept Tag) |
|---|------|----------------|----------------------|
| 1 | 옵티마이저 힌트와 조인 순서 제어 | 옵티마이저 비용 기반 선택, Join Reordering | USE INDEX, IGNORE INDEX, STRAIGHT_JOIN, 조인 순서 강제 |
| 2 | EXPLAIN ANALYZE 심화 | 실제 실행 통계 기반 분석 | 예측 vs 실제 rows, actual time, loops |
| 3 | Index Merge, Index Condition Pushdown(ICP) | Index Merge 알고리즘, ICP 동작 원리 | 옵티마이저 자동 선택 조건, 실행 계획에서의 식별 |
| 4 | Loose Index Scan vs Tight Index Scan | GROUP BY 인덱스 스캔 전략 | Using index for group-by, Range 기반 그룹핑 최적화 |
| 5 | 파티셔닝 테이블 조회 튜닝 | Range Partitioning, Pruning | Partition Pruning, 파티션 키 설계 |
| 6 | 중복 서브쿼리 제거 & 쿼리 리팩토링 | 서브쿼리 캐싱, 중복 연산 제거 | CTE, Derived Table 최적화 |
| 7 | Temp Table, Filesort 발생 상황 분석 및 제거 | Internal Temp Table, External Sort | Using temporary, Using filesort 제거 전략 |
| 8 | Generated Column + 함수 기반 인덱스 | Virtual/Stored Column, 함수 인덱스 (MySQL 8.0+) | 함수 적용 인덱스 무효화의 해결책, 표현식 인덱스 |
| 9 | 트랜잭션 내 대량 UPDATE/DELETE 튜닝 | 락과 데드락, Undo/Redo Log | Locking, Batch 처리, 트랜잭션 범위 최적화 |
| 10 | InnoDB 버퍼 풀 | 버퍼 풀 구조, 캐시 히트율, 워밍업 | innodb_buffer_pool_size, LRU 알고리즘, 버퍼 풀 모니터링 |
