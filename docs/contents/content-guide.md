# 콘텐츠 작성 가이드

## 파일명 규칙

`{순번}-{키워드}.md` 형식을 사용한다. 순번은 `docs/topics/` 난이도별 토픽 목록의 번호를 따른다.

```
docs/contents/beginner/01-explain.md
docs/contents/beginner/02-select-star.md
docs/contents/intermediate/01-composite-index.md
docs/contents/advanced/03-explain-analyze.md
```

파트 분할 시 파일명 뒤에 `-part1`, `-part2`를 붙인다.

```
docs/contents/intermediate/01-composite-index-part1.md
docs/contents/intermediate/01-composite-index-part2.md
```

## 기본 원칙

- **시나리오가 메인이다.** 이론은 해당 튜닝을 이해하는 데 필요한 만큼만 설명한다.
- **길어지면 파트를 분할한다.** frontmatter의 `part`, `totalParts` 필드를 활용한다.
- **콘텐츠 템플릿과 공통 스키마는 기본값(default)이다.** 주제 성격에 맞지 않으면 자유롭게 변형한다.

## 콘텐츠 구성 템플릿

대부분의 토픽은 아래 흐름을 따른다.

```
① 문제 상황 — 느린 쿼리와 EXPLAIN 결과 (Before)
② 원인 분석 — 왜 느린지, 필요한 이론을 여기서 설명
③ 튜닝 과정 — 인덱스 추가/쿼리 변경 등 구체적 조치
④ 결과 비교 — 개선된 EXPLAIN 결과 (After)
⑤ 실전 문제 — <Practice>, <Quiz> 컴포넌트 활용
```

### 템플릿 예외

아래 유형의 토픽은 "느린 쿼리 → 개선" 흐름에 맞지 않으므로, 주제에 맞게 자유롭게 구성한다.

- **도구/진단 주제** (Slow Query Log, EXPLAIN ANALYZE 심화) — 도구 사용법 자체가 목적
- **서버 레벨 설정** (InnoDB 버퍼 풀) — 특정 쿼리 튜닝이 아니라 전체 성능 영향

## 공통 샘플 스키마

대부분의 토픽에서 동일한 샘플 DB를 사용하여, 독자가 스키마 파악 없이 쿼리에 바로 집중할 수 있게 한다.

### 도메인: 온라인 쇼핑몰

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    ordered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### 데이터 규모 가정

| 테이블 | 행 수 |
|--------|-------|
| users | 100,000 |
| products | 10,000 |
| orders | 1,000,000 |
| order_items | 3,000,000 |

### 스키마 예외

파티셔닝, 대량 UPDATE/DELETE, InnoDB 버퍼 풀 등 공통 스키마의 구조나 규모가 맞지 않는 토픽은 해당 콘텐츠 서두에서 별도 스키마를 제시한다.

## 파트 분할 기준

하나의 토픽이 아래 조건에 해당하면 파트를 나눈다.

- EXPLAIN 비교가 3회 이상 등장하여 읽기 흐름이 끊기는 경우
- 이론 설명과 실전 시나리오를 한 페이지에 담으면 스크롤이 과도한 경우
- 하나의 주제 안에서 독립적인 하위 시나리오가 2개 이상인 경우

파트 분할 시 각 파트는 단독으로 읽어도 완결성이 있어야 한다.
