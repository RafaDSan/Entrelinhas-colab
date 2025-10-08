import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

test("GET to /api/v1/books should return 200", async () => {
  const response1 = await fetch(
    "http://localhost:3000/api/v1/search-books?q=Dune"
  );
  const responseBody1 = await response1.json();

  await fetch("http://localhost:3000/api/v1/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responseBody1[0]),
  });

  const response = await fetch("http://localhost:3000/api/v1/books");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.length).toBeGreaterThan(0);
});
