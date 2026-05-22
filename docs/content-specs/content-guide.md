# 콘텐츠 작성 가이드

## 파일명 규칙

`{순번}-{키워드}.md` 형식을 사용한다. 순번은 `docs/topics/` 난이도별 토픽 목록의 번호를 따른다.

```
docs/content-specs/beginner/01-explain.md
docs/content-specs/beginner/02-select-star.md
docs/content-specs/intermediate/01-composite-index.md
docs/content-specs/advanced/03-explain-analyze.md
```

파트 분할 시 파일명 뒤에 `-part1`, `-part2`를 붙인다.

```
docs/content-specs/intermediate/01-composite-index-part1.md
docs/content-specs/intermediate/01-composite-index-part2.md
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

### ②와 ③의 역할 구분

- **② 원인 분석**: 직접 원인 + 관련 이론을 다룬다. "왜 느린지", "왜 인덱스를 못 타는지" 등 분석과 배경 지식이 여기에 속한다.
- **③ 튜닝 과정**: 구체적 조치만 넣는다 (CREATE INDEX, 쿼리 변경 등). 이론 설명은 ②에서 마무리하고, ③에서 반복하지 않는다.

### 보조 내용 처리

주제의 핵심은 아니지만 관련 있는 보조 이론(예: 다른 난이도에서 깊게 다루는 주제)은 아래 방식으로 처리한다.

- `<details>` 접기/펼치기로 본문 흐름을 끊지 않으면서 제공한다
- 본문 표 등에서 보조 내용과 연결되는 항목은 `*` 등으로 마킹하여 접기/펼치기와 연결한다
- 접기/펼치기 안에서 관련된 다른 난이도 토픽으로 링크하여, 더 깊은 학습 경로를 안내한다

### 실전 문제 출제 원칙

- Practice/Quiz는 **본문에서 직접 다룬 핵심 내용** 위주로 출제한다
- 보조 내용(`<details>` 접기/펼치기)은 **Quiz 보기(선택지) 수준**까지만 활용 가능하다. 보조 내용 자체를 문제의 핵심으로 삼지 않는다

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

## 예제

설계 문서의 깊이·분량·구조는 [example-spec.md](example-spec.md)를 참고한다.
