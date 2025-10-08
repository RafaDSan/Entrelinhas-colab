import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

test("POST to /api/v1/books should return 201", async () => {
  const response1 = await fetch(
    "http://localhost:3000/api/v1/search-books?q=dune"
  );
  const responseBody = await response1.json();

  const response2 = await fetch("http://localhost:3000/api/v1/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responseBody[0]),
  });
  expect(response2.status).toBe(201);
});
