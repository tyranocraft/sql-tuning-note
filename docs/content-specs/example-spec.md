# WHERE 조건절과 단일 인덱스 활용 여부 판별

> 난이도: 초급 | 토픽 #3
> 참조: docs/topics/beginner.md #3

## 개요

WHERE 조건절에 인덱스가 있음에도 Full Table Scan이 발생하는 상황을 진단하고, 단일 인덱스가 언제 활용되고 언제 무시되는지 판별하는 방법을 학습한다. B-Tree 인덱스의 내부 구조와 데이터 타입 불일치로 인한 암묵적 형변환 문제를 시나리오를 통해 이해한다.

## MDX Frontmatter

```yaml
title: "WHERE 조건절과 단일 인덱스"
slug: "where-single-index"
database: "mysql"
difficulty: "beginner"
category: "index"
tags: ["b-tree", "index", "where", "sargable", "implicit-conversion"]
prerequisites: ["explain-intro"]
nextSteps: ["where-function-index-invalidation"]
author: ""
createdAt: "2026-05-22"
updatedAt: "2026-05-22"
```

## ① 문제 상황 (Before)

### 시나리오 설명

주문 내역 조회 API에서 특정 사용자의 주문을 가져오는 쿼리가 응답 시간 2초를 넘기고 있다. `orders` 테이블에 100만 건이 쌓인 상태다.

### 느린 쿼리

```sql
SELECT id, status, total_amount, ordered_at
FROM orders
WHERE user_id = 12345;
```

이 시점에서 `orders` 테이블에는 PK(`id`)와 FK 제약조건만 있고, `user_id`에 별도 인덱스가 없다.

### EXPLAIN 결과 (Before)

| id | select_type | table  | type | possible_keys | key  | key_len | rows    | filtered | Extra       |
|----|-------------|--------|------|---------------|------|---------|---------|----------|-------------|
| 1  | SIMPLE      | orders | ALL  | NULL          | NULL | NULL    | 998,424 | 10.00    | Using where |

## ② 원인 분석

### 왜 Full Table Scan인가

`user_id` 컬럼에 인덱스가 없으므로, MySQL은 `orders` 테이블의 모든 행(약 100만 건)을 순차적으로 읽으며 `user_id = 12345` 조건을 하나씩 확인한다. `type: ALL`이 이를 나타낸다.

### B-Tree 인덱스 구조 (간단 설명)

InnoDB의 인덱스는 B+Tree 구조다. 핵심 특성만 짚으면:

- **클러스터 인덱스(PRIMARY KEY)**: 리프 노드에 행 데이터 전체가 저장된다. `id`로 조회하면 인덱스 탐색만으로 데이터를 얻는다.
- **보조 인덱스(Secondary Index)**: 리프 노드에 인덱스 컬럼 값 + PK 값이 저장된다. 보조 인덱스로 행을 찾으면 PK를 이용해 클러스터 인덱스를 한 번 더 조회한다(랜덤 I/O).
- **탐색 비용**: 루트 → 브랜치 → 리프 순으로 내려가므로 O(log N). 100만 건이면 3~4회 페이지 접근으로 원하는 위치를 찾는다.

`user_id`에 보조 인덱스가 없으면 이 탐색 경로 자체가 존재하지 않아 Full Table Scan이 유일한 선택이다.

### 인덱스가 있어도 못 타는 경우: 암묵적 형변환

인덱스가 있어도 활용되지 않는 경우가 있다. `user_id`는 `BIGINT`인데 문자열로 비교하면:

```sql
-- user_id는 BIGINT인데 문자열 '12345'로 비교
SELECT id, status, total_amount, ordered_at
FROM orders
WHERE user_id = '12345';
```

이 경우 MySQL은 `'12345'`를 숫자로 변환하여 인덱스를 **정상 활용한다** (숫자 컬럼에 문자열 리터럴은 숫자로 변환).

하지만 반대 상황은 다르다. `email`은 `VARCHAR(255)`인데 숫자로 비교하면:

```sql
-- email은 VARCHAR인데 숫자 0으로 비교
SELECT id, name, email
FROM users
WHERE email = 0;
```

| id | select_type | table | type | possible_keys      | key  | key_len | rows   | filtered | Extra       |
|----|-------------|-------|------|--------------------|------|---------|--------|----------|-------------|
| 1  | SIMPLE      | users | ALL  | idx_users_email    | NULL | NULL    | 99,876 | 10.00    | Using where |

MySQL이 `email` 컬럼의 **모든 값을 숫자로 변환**해서 비교하기 때문에 인덱스를 사용할 수 없다. 컬럼 쪽에 변환이 발생하면 인덱스 탐색 경로가 무너진다.

### sargable 조건 정리

**SARGable**(Search ARGument ABLE): 인덱스를 활용할 수 있는 조건 형태. 지금까지 살펴본 내용을 종합하면:

| sargable (인덱스 활용 가능) | non-sargable (인덱스 활용 불가) |
|---|---|
| `WHERE user_id = 12345` | `WHERE CAST(user_id AS CHAR) = '12345'` |
| `WHERE email = 'test@example.com'` | `WHERE email = 0` (암묵적 형변환) |
| `WHERE ordered_at >= '2026-01-01'` | `WHERE YEAR(ordered_at) = 2026` |
| `WHERE email LIKE 'test%'` (접두사 고정)* | `WHERE email LIKE '%test%'` (접두사 불확정)* |

원칙: **인덱스 컬럼이 변환 없이 그대로 비교되어야 인덱스를 탈 수 있다.**

*\* LIKE와 인덱스 — 접기/펼치기 (`<details>` 태그)*

> B-Tree 인덱스는 데이터가 정렬되어 있으므로, **접두사가 고정된 LIKE는 범위 검색(range)으로 인덱스를 활용**할 수 있다. 와일드카드가 앞에 오면 시작점을 특정할 수 없어 인덱스를 탈 수 없다.
>
> | 패턴 | 인덱스 활용 | 이유 |
> |------|-----------|------|
> | `LIKE 'test%'` | O (range) | 접두사가 고정 → 범위 스캔 가능 |
> | `LIKE '%test'` | X (ALL) | 시작점을 특정할 수 없음 |
> | `LIKE '%test%'` | X (ALL) | 시작점을 특정할 수 없음 |
>
> LIKE 검색의 더 깊은 최적화(prefix 인덱스, Full-Text Index 등)는 중급 #8 "LIKE 검색 최적화"에서 다룬다.

## ③ 튜닝 과정

### 단계 1: 보조 인덱스 추가

```sql
CREATE INDEX idx_orders_user_id ON orders (user_id);
```

### 단계 2: 인덱스 활용 확인

```sql
EXPLAIN SELECT id, status, total_amount, ordered_at
FROM orders
WHERE user_id = 12345;
```

## ④ 결과 비교 (After)

### EXPLAIN 결과 (After)

인덱스 추가 후 동일 쿼리의 실행 계획:

| id | select_type | table  | type | possible_keys       | key                 | key_len | rows | filtered | Extra |
|----|-------------|--------|------|---------------------|---------------------|---------|------|----------|-------|
| 1  | SIMPLE      | orders | ref  | idx_orders_user_id  | idx_orders_user_id  | 8       | 10   | 100.00   | NULL  |

### Before vs After 요약

| 항목 | Before | After |
|------|--------|-------|
| type | ALL (Full Table Scan) | ref (인덱스 탐색) |
| key | NULL | idx_orders_user_id |
| rows | 998,424 | 10 |
| filtered | 10.00 | 100.00 |
| Extra | Using where | NULL |

100만 건을 모두 읽던 것이 10건만 읽는 것으로 변경. 약 10만 배의 행 접근 감소.

## ⑤ 실전 문제

### Practice

**문제:**

아래 `products` 테이블에서 특정 카테고리의 상품을 조회하는 쿼리가 Full Table Scan을 일으키고 있다.

```sql
SELECT id, name, price
FROM products
WHERE category = 'electronics';
```

EXPLAIN 결과:

```
type: ALL | key: NULL | rows: 9,876
```

1. 왜 Full Table Scan이 발생하는가?
2. 어떤 인덱스를 추가하면 해결되는가?
3. 인덱스 추가 후 예상되는 EXPLAIN 결과의 `type`은?

**힌트:**

`category` 컬럼의 현재 인덱스 존재 여부를 확인하자. 공통 스키마의 `products` 테이블 정의를 다시 보면 답이 보인다.

**정답:**

1. `category` 컬럼에 인덱스가 없으므로 MySQL이 모든 행을 순차 스캔한다.
2. `CREATE INDEX idx_products_category ON products (category);`
3. `type`이 `ref`로 변경된다. 등호 조건으로 비유니크 인덱스를 사용하면 `ref` 접근 타입이 된다.

### Quiz

**문제:** `users` 테이블의 `email` 컬럼에 UNIQUE 인덱스가 있다. 다음 중 이 인덱스를 활용할 수 **없는** 쿼리는?

| 보기 | 정답 여부 |
|------|----------|
| `WHERE email = 'test@example.com'` | |
| `WHERE email LIKE 'test%'` | |
| `WHERE email = 0` | 정답 |
| `WHERE email IN ('a@b.com', 'c@d.com')` | |

정답 이유: 숫자 `0`과 VARCHAR 컬럼을 비교하면 MySQL이 `email` 컬럼의 모든 값을 숫자로 변환(암묵적 형변환)하므로, 인덱스 탐색이 불가능하다.

## 파트 분할 여부

EXPLAIN 비교가 2회(Before/After + 암묵적 형변환)로 적절하고, 이론 분량도 과도하지 않다. **파트 분할 불필요.**

## 이전/다음 콘텐츠 연결

- **prerequisites**: `["explain-intro"]` — EXPLAIN 결과를 읽을 수 있어야 이 콘텐츠를 따라갈 수 있다
- **nextSteps**: `["where-function-index-invalidation"]` — 초급 #4 "WHERE절 함수 사용으로 인한 인덱스 무효화"로 자연스럽게 연결. 이 콘텐츠에서 sargable 개념을 배웠으므로, 함수 적용 시 인덱스 무효화 시나리오로 확장한다.
