# Task 2: 콘텐츠 타입 정의 및 샘플 MDX 콘텐츠

> **공통 컨텍스트:** [00-overview.md](00-overview.md)를 먼저 읽을 것.
> **의존성:** 없음 (Task 1과 병렬 수행 가능하나, 프로젝트 초기화 후 커밋하는 것이 자연스럽다)

**파일:**
- 생성: `src/lib/types.ts`
- 생성: `content/mysql/ko/beginner/index-basics.mdx`
- 생성: `content/mysql/ko/beginner/explain-intro.mdx`
- 생성: `content/mysql/en/beginner/index-basics.mdx`
- 생성: `content/mysql/en/beginner/explain-intro.mdx`

- [ ] **Step 1: TypeScript 타입 정의**

`src/lib/types.ts` 생성:

```ts
export type Locale = "ko" | "en";

export type Database = "mysql" | "postgresql";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface ContentMeta {
  title: string;
  slug: string;
  database: Database;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  prerequisites: string[];
  nextSteps: string[];
  part?: number;
  totalParts?: number;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentItem extends ContentMeta {
  content: string;
}

export interface Dictionary {
  site: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    notes: string;
  };
  landing: {
    hero: {
      title: string;
      subtitle: string;
      cta: string;
    };
    difficulty: {
      beginner: string;
      intermediate: string;
      advanced: string;
    };
  };
  content: {
    prerequisites: string;
    nextSteps: string;
    showHint: string;
    hideHint: string;
    showAnswer: string;
    hideAnswer: string;
    checkAnswer: string;
    correct: string;
    incorrect: string;
  };
  search: {
    placeholder: string;
    noResults: string;
  };
  filter: {
    all: string;
    beginner: string;
    intermediate: string;
    advanced: string;
  };
}
```

- [ ] **Step 2: 한국어 샘플 콘텐츠 생성 — index-basics**

`content/mysql/ko/beginner/index-basics.mdx` 생성:

```mdx
---
title: "인덱스 동작원리"
slug: "index-basics"
database: "mysql"
difficulty: "beginner"
category: "index"
tags: ["b-tree", "index", "performance"]
prerequisites: []
nextSteps: ["explain-intro"]
author: ""
createdAt: "2026-05-19"
updatedAt: "2026-05-19"
---

## 인덱스란?

인덱스는 데이터베이스 테이블에서 원하는 데이터를 빠르게 찾기 위한 자료구조다. 책의 목차(Index)와 같은 역할을 한다.

인덱스가 없으면 MySQL은 테이블의 모든 행을 처음부터 끝까지 순차적으로 읽어야 한다. 이를 **Full Table Scan**이라 한다.

## B-Tree 인덱스

MySQL InnoDB 엔진의 기본 인덱스 구조는 **B+Tree**다.

```sql
CREATE INDEX idx_users_email ON users (email);
```

B+Tree의 핵심 특성:
- 모든 리프 노드가 같은 깊이에 위치한다
- 리프 노드끼리 링크드 리스트로 연결되어 범위 검색에 유리하다
- 루트에서 리프까지의 탐색 시간이 O(log N)이다

## 인덱스가 효과적인 경우

| 상황 | 예시 |
|------|------|
| 등호 조건 | `WHERE email = 'test@example.com'` |
| 범위 조건 | `WHERE created_at > '2026-01-01'` |
| 정렬 | `ORDER BY created_at DESC` |
| 그룹핑 | `GROUP BY category` |

## 인덱스가 비효과적인 경우

```sql
-- 컬럼에 함수를 적용하면 인덱스를 사용할 수 없다
SELECT * FROM users WHERE YEAR(created_at) = 2026;

-- 대신 범위 조건으로 변환하면 인덱스를 활용할 수 있다
SELECT * FROM users
WHERE created_at >= '2026-01-01'
  AND created_at < '2027-01-01';
```

<Practice>
<Problem>
`orders` 테이블에 `customer_id`, `order_date`, `total_amount` 컬럼이 있다.
다음 쿼리의 성능을 개선하려면 어떤 인덱스를 생성해야 할까?

```sql
SELECT * FROM orders
WHERE customer_id = 123
ORDER BY order_date DESC
LIMIT 10;
```
</Problem>
<Hint>
WHERE 절과 ORDER BY 절에 사용된 컬럼을 함께 고려하자. 복합 인덱스(Composite Index)를 사용하면 정렬까지 인덱스로 처리할 수 있다.
</Hint>
<Answer>
```sql
CREATE INDEX idx_orders_customer_date ON orders (customer_id, order_date DESC);
```

`customer_id`로 필터링한 후 `order_date` 역순으로 정렬된 결과를 인덱스만으로 얻을 수 있다. 이렇게 하면 별도의 filesort 없이 인덱스 순서대로 읽기만 하면 된다.
</Answer>
</Practice>

<Quiz question="MySQL InnoDB의 기본 인덱스 자료구조는?">
<Option>Hash Table</Option>
<Option correct>B+Tree</Option>
<Option>Red-Black Tree</Option>
<Option>Skip List</Option>
</Quiz>
```

- [ ] **Step 3: 한국어 샘플 콘텐츠 생성 — explain-intro**

`content/mysql/ko/beginner/explain-intro.mdx` 생성:

```mdx
---
title: "EXPLAIN 실행계획 읽기"
slug: "explain-intro"
database: "mysql"
difficulty: "beginner"
category: "explain"
tags: ["explain", "execution-plan", "query-optimization"]
prerequisites: ["index-basics"]
nextSteps: []
author: ""
createdAt: "2026-05-19"
updatedAt: "2026-05-19"
---

## EXPLAIN이란?

`EXPLAIN`은 MySQL이 쿼리를 어떻게 실행할 것인지 실행계획(Execution Plan)을 보여주는 명령어다. 쿼리 튜닝의 첫걸음은 EXPLAIN으로 현재 상태를 파악하는 것이다.

```sql
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

## 주요 컬럼 해석

| 컬럼 | 의미 | 주의할 값 |
|------|------|-----------|
| `type` | 접근 방식 | `ALL`(풀 스캔)은 개선 필요 |
| `key` | 사용된 인덱스 | `NULL`이면 인덱스 미사용 |
| `rows` | 예상 조회 행 수 | 클수록 비효율적 |
| `Extra` | 추가 정보 | `Using filesort`, `Using temporary`는 주의 |

## type 컬럼 성능 순서

좋은 순서대로 나열하면:

1. **const** — PRIMARY KEY 또는 UNIQUE 인덱스로 1행만 조회
2. **eq_ref** — JOIN에서 PRIMARY KEY/UNIQUE로 1행 매칭
3. **ref** — 비유니크 인덱스로 여러 행 조회
4. **range** — 인덱스를 사용한 범위 검색
5. **index** — 인덱스 풀 스캔 (테이블보다 낫지만 여전히 비효율)
6. **ALL** — 테이블 풀 스캔 (최악)

## EXPLAIN ANALYZE

MySQL 8.0.18부터 사용 가능한 `EXPLAIN ANALYZE`는 실제 실행 시간까지 보여준다:

```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'test@example.com';
```

<Practice>
<Problem>
다음 EXPLAIN 결과를 보고, 어떤 문제가 있는지 분석하고 개선 방법을 제시하라.

```
+----+------+---------------+------+------+----------+-------------+
| id | type | possible_keys | key  | rows | filtered | Extra       |
+----+------+---------------+------+------+----------+-------------+
|  1 | ALL  | NULL          | NULL | 5000 |    10.00 | Using where |
+----+------+---------------+------+------+----------+-------------+
```

쿼리:
```sql
SELECT * FROM products WHERE category = 'electronics' AND price > 100;
```
</Problem>
<Hint>
`type`이 `ALL`이고 `key`가 `NULL`이라는 것은 어떤 의미인가? 5000행을 모두 읽고 있다는 점에 주목하자.
</Hint>
<Answer>
**문제:** Full Table Scan (`type: ALL`)이 발생하고 있다. 인덱스를 전혀 사용하지 않아 (`key: NULL`) 5000행을 모두 읽고 있다.

**개선:**
```sql
CREATE INDEX idx_products_category_price ON products (category, price);
```

`category`를 선두 컬럼으로, `price`를 후위 컬럼으로 하는 복합 인덱스를 생성하면:
- `category = 'electronics'` 조건으로 인덱스 탐색
- `price > 100` 조건으로 인덱스 범위 스캔

개선 후 `type`이 `range`로 바뀌고, `rows`가 크게 줄어드는 것을 확인할 수 있다.
</Answer>
</Practice>

<Quiz question="EXPLAIN 결과에서 type 컬럼이 'ALL'인 경우 의미하는 것은?">
<Option>인덱스를 사용한 범위 검색</Option>
<Option>PRIMARY KEY로 1행 조회</Option>
<Option correct>테이블 풀 스캔 (모든 행 읽기)</Option>
<Option>인덱스 풀 스캔</Option>
</Quiz>
```

- [ ] **Step 4: 영어 샘플 콘텐츠 생성 — index-basics**

`content/mysql/en/beginner/index-basics.mdx` 생성:

```mdx
---
title: "How Indexes Work"
slug: "index-basics"
database: "mysql"
difficulty: "beginner"
category: "index"
tags: ["b-tree", "index", "performance"]
prerequisites: []
nextSteps: ["explain-intro"]
author: ""
createdAt: "2026-05-19"
updatedAt: "2026-05-19"
---

## What is an Index?

An index is a data structure that allows the database to quickly locate specific rows in a table. Think of it like a book's index — instead of reading every page, you look up the topic and jump to the right page.

Without an index, MySQL must read every row from start to finish. This is called a **Full Table Scan**.

## B-Tree Index

The default index structure in MySQL InnoDB is **B+Tree**.

```sql
CREATE INDEX idx_users_email ON users (email);
```

Key properties of B+Tree:
- All leaf nodes are at the same depth
- Leaf nodes are connected via a linked list, making range scans efficient
- Search time from root to leaf is O(log N)

## When Indexes Are Effective

| Scenario | Example |
|----------|---------|
| Equality | `WHERE email = 'test@example.com'` |
| Range | `WHERE created_at > '2026-01-01'` |
| Sorting | `ORDER BY created_at DESC` |
| Grouping | `GROUP BY category` |

## When Indexes Are Ineffective

```sql
-- Applying a function to a column prevents index usage
SELECT * FROM users WHERE YEAR(created_at) = 2026;

-- Rewrite as a range condition to utilize the index
SELECT * FROM users
WHERE created_at >= '2026-01-01'
  AND created_at < '2027-01-01';
```

<Practice>
<Problem>
Given an `orders` table with columns `customer_id`, `order_date`, and `total_amount`, what index would improve the following query?

```sql
SELECT * FROM orders
WHERE customer_id = 123
ORDER BY order_date DESC
LIMIT 10;
```
</Problem>
<Hint>
Consider both the WHERE clause and ORDER BY clause together. A composite index can handle both filtering and sorting.
</Hint>
<Answer>
```sql
CREATE INDEX idx_orders_customer_date ON orders (customer_id, order_date DESC);
```

This composite index filters by `customer_id` and returns results already sorted by `order_date DESC`, eliminating the need for a separate filesort operation.
</Answer>
</Practice>

<Quiz question="What is the default index data structure in MySQL InnoDB?">
<Option>Hash Table</Option>
<Option correct>B+Tree</Option>
<Option>Red-Black Tree</Option>
<Option>Skip List</Option>
</Quiz>
```

- [ ] **Step 5: 영어 샘플 콘텐츠 생성 — explain-intro**

`content/mysql/en/beginner/explain-intro.mdx` 생성:

```mdx
---
title: "Reading EXPLAIN Output"
slug: "explain-intro"
database: "mysql"
difficulty: "beginner"
category: "explain"
tags: ["explain", "execution-plan", "query-optimization"]
prerequisites: ["index-basics"]
nextSteps: []
author: ""
createdAt: "2026-05-19"
updatedAt: "2026-05-19"
---

## What is EXPLAIN?

`EXPLAIN` shows you MySQL's execution plan — how it intends to execute a query. The first step in query tuning is understanding the current state through EXPLAIN.

```sql
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

## Key Columns

| Column | Meaning | Watch For |
|--------|---------|-----------|
| `type` | Access method | `ALL` (full scan) needs improvement |
| `key` | Index used | `NULL` means no index used |
| `rows` | Estimated rows examined | Higher = less efficient |
| `Extra` | Additional info | `Using filesort`, `Using temporary` need attention |

## Access Types (Best to Worst)

1. **const** — Single row via PRIMARY KEY or UNIQUE index
2. **eq_ref** — One row per JOIN via PRIMARY KEY/UNIQUE
3. **ref** — Multiple rows via non-unique index
4. **range** — Index range scan
5. **index** — Full index scan (better than table scan, still inefficient)
6. **ALL** — Full table scan (worst case)

## EXPLAIN ANALYZE

Available since MySQL 8.0.18, `EXPLAIN ANALYZE` shows actual execution times:

```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'test@example.com';
```

<Practice>
<Problem>
Analyze the following EXPLAIN output and suggest improvements.

```
+----+------+---------------+------+------+----------+-------------+
| id | type | possible_keys | key  | rows | filtered | Extra       |
+----+------+---------------+------+------+----------+-------------+
|  1 | ALL  | NULL          | NULL | 5000 |    10.00 | Using where |
+----+------+---------------+------+------+----------+-------------+
```

Query:
```sql
SELECT * FROM products WHERE category = 'electronics' AND price > 100;
```
</Problem>
<Hint>
What does `type: ALL` and `key: NULL` tell you? Notice that all 5000 rows are being scanned.
</Hint>
<Answer>
**Problem:** A Full Table Scan (`type: ALL`) is occurring. No index is being used (`key: NULL`), forcing MySQL to read all 5000 rows.

**Solution:**
```sql
CREATE INDEX idx_products_category_price ON products (category, price);
```

A composite index with `category` as the leading column and `price` as the secondary column enables:
- Index lookup on `category = 'electronics'`
- Index range scan on `price > 100`

After adding this index, `type` should change to `range` and `rows` should decrease significantly.
</Answer>
</Practice>

<Quiz question="In EXPLAIN output, what does type 'ALL' indicate?">
<Option>An index range scan</Option>
<Option>A single row lookup via PRIMARY KEY</Option>
<Option correct>A full table scan (reads every row)</Option>
<Option>A full index scan</Option>
</Quiz>
```

- [ ] **Step 6: 커밋**

```bash
git add src/lib/types.ts content/
git commit -m "feat: add content types and sample MDX content (ko/en, 2 beginner topics)"
```
