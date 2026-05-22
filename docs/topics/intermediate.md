# 중급 (Intermediate) 토픽 목록

> 복합 인덱스 설계, 쿼리 리팩토링, 느린 쿼리 진단까지 다루는 실전 튜닝.

| # | 주제 | 관련 개념 (Concept Tag) |
|---|------|----------------------|
| 1 | 복합 인덱스 활용 vs 단일 인덱스 비교 | Composite Index, 인덱스 컬럼 순서 |
| 2 | 커버링 인덱스 활용 | Covering Index, Index-only Scan, Extra: Using index |
| 3 | 다중 JOIN (INNER, LEFT JOIN) 성능 비교 | Join Order, 옵티마이저 조인 전략 |
| 4 | 서브쿼리 vs 조인 성능 비교 및 리팩토링 | Semi-Join, Anti-Join, 옵티마이저 변환 |
| 5 | EXISTS vs IN 성능 비교 | 상관 서브쿼리 vs 비상관 서브쿼리, 옵티마이저 버전별 처리 차이 |
| 6 | GROUP BY + DISTINCT 최적화 | Temporary Table, Using index for group-by, 중복 제거 방식 |
| 7 | OR 조건 vs UNION ALL 리팩토링 | OR 최적화 한계, UNION ALL 효율, 중복 제거 비용 |
| 8 | LIKE 검색 최적화 (prefix 인덱스 vs full scan) | 인덱스 prefix, 와일드카드 검색 원리 |
| 9 | 페이지네이션 최적화 (OFFSET vs Cursor) | OFFSET 비용, Cursor-based Pagination, Deferred Join |
| 10 | 인덱스 통계와 카디널리티 | ANALYZE TABLE, SHOW INDEX, 카디널리티가 실행 계획에 미치는 영향 |
| 11 | Slow Query Log 활용 | long_query_time, 느린 쿼리 수집 및 분석 |
