
const { test } = require("node:test");
const assert = require("node:assert/strict");

const validateTask = require("../src/utils/validateTask");

test("accepts a valid task", () => {
  const errors = validateTask({
    title: "Complete assignment",
    description: "Finish the API evaluation",
    status: "pending",
  });

  assert.deepEqual(errors, []);
});

test("rejects a missing title", () => {
  const errors = validateTask({
    description: "Task without a title",
  });

  assert.ok(errors.length > 0);
});

test("rejects a whitespace-only title", () => {
  const errors = validateTask({
    title: "    ",
  });

  assert.ok(errors.length > 0);
});

test("rejects a non-string title", () => {
  const errors = validateTask({
    title: 123,
  });

  assert.ok(errors.length > 0);
});

test("rejects an unsupported status", () => {
  const errors = validateTask({
    title: "Valid task",
    status: "blocked",
  });

  assert.ok(errors.length > 0);
});

test("rejects a non-string description", () => {
  const errors = validateTask({
    title: "Valid task",
    description: 123,
  });

  assert.ok(errors.length > 0);
});

test("allows a partial update without a title", () => {
  const errors = validateTask(
    { status: "completed" },
    true
  );

  assert.deepEqual(errors, []);
});

test("accepts an empty object during an update", () => {
  const errors = validateTask({}, true);

  assert.deepEqual(errors, []);
});

test("accepts a whitespace-only description", () => {
  const errors = validateTask({
    title: "Valid task",
    description: "   ",
  });

  assert.deepEqual(errors, []);
});
