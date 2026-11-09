import { expect, test } from "@playwright/test";

test("home page loads without errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toContainText("AI-powered product");
  await expect(page).toHaveTitle(/Glovax Technologies/);
  expect(errors).toEqual([]);
});

test("contact form validates before submitting", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Name must be at least 2 characters")).toBeVisible();
  await expect(page.getByText("Please enter a valid email")).toBeVisible();
  await expect(page.getByText("Please select a service")).toBeVisible();
});

test("unknown pages return 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("removed blog posts return 410", async ({ request }) => {
  const response = await request.get("/blog/a-post-that-was-deleted", { maxRedirects: 0 });
  expect(response.status()).toBe(410);
});

test("the admin area requires a login", async ({ page, request }) => {
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.locator('input[type="password"]')).toBeVisible();

  expect((await request.get("/api/admin/leads")).status()).toBe(401);
});
