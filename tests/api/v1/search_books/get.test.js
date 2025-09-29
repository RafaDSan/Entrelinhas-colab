import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/search-books should return 200", async () => {
  const response = await fetch(
    "http://localhost:3000/api/v1/search-books?q=dune"
  );
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  expect(responseBody.length).toBeGreaterThan(0);

  expect(responseBody[0]).toHaveProperty("key");
  expect(responseBody[0]).toHaveProperty("title");
  expect(responseBody[0]).toHaveProperty("author_name");
  expect(responseBody[0]).toHaveProperty("cover_id");
  expect(responseBody[0]).toHaveProperty("cover_url");
  expect(responseBody[0]).toHaveProperty("first_publish_year");
});
