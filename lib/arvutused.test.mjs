import { test } from "node:test";
import assert from "node:assert/strict";
import { periood, summa, edetabel, keskmine, eelarveSeis, grupeeri, kasvAastati } from "./arvutused.ts";

test("periood", () => {
  assert.deepEqual(periood("koik", "2026-05-01"), { alates: null, kuni: null });
  assert.deepEqual(periood("aasta", "2026-05-01"), { alates: "2026-01-01", kuni: "2026-12-31" });
  assert.deepEqual(periood("semester", "2026-05-01"), { alates: "2026-02-01", kuni: "2026-08-31" });
  assert.deepEqual(periood("semester", "2026-10-01"), { alates: "2026-09-01", kuni: "2027-01-31" });
  assert.deepEqual(periood("semester", "2027-01-15"), { alates: "2026-09-01", kuni: "2027-01-31" });
});

test("summa uses cents", () => {
  assert.equal(summa([0.1, 0.2]), 0.3);
  assert.equal(summa([]), 0);
});

test("edetabel sums and ranks with ties", () => {
  const t = edetabel([
    { liige_id: 1, punktid: 3 },
    { liige_id: 2, punktid: 5 },
    { liige_id: 1, punktid: 2 },
    { liige_id: 3, punktid: 1 },
  ]);
  assert.deepEqual(t.map((r) => [r.liige_id, r.punktid, r.koht]), [[1, 5, 1], [2, 5, 1], [3, 1, 3]]);
});

test("keskmine counts members without points", () => {
  assert.equal(keskmine([{ liige_id: 1, punktid: 10 }], 4), 2.5);
  assert.equal(keskmine([], 0), 0);
});

test("eelarveSeis warning and overspend", () => {
  assert.equal(eelarveSeis(100, 79).onHoiatus, false);
  assert.equal(eelarveSeis(100, 80).onHoiatus, true);
  assert.equal(eelarveSeis(100, 100).onUletatud, false);
  assert.equal(eelarveSeis(100, 100.01).onUletatud, true);
  assert.equal(eelarveSeis(100, 30.3).jaak, 69.7);
  assert.deepEqual([eelarveSeis(0, 0).kasutus, eelarveSeis(0, 0).onHoiatus], [null, false]);
  assert.equal(eelarveSeis(0, 5).onUletatud, true);
});

test("grupeeri", () => {
  const g = grupeeri([{ k: "a", v: 1.1 }, { k: "b", v: 5 }, { k: "a", v: 2.2 }], (r) => r.k, (r) => r.v);
  assert.deepEqual(g, [{ voti: "b", summa: 5 }, { voti: "a", summa: 3.3 }]);
});

test("kasvAastati fills empty years", () => {
  assert.deepEqual(kasvAastati(["2022-09-01", "2024-01-01", "2022-10-01"]), [
    { aasta: 2022, uusi: 2, kokku: 2 },
    { aasta: 2023, uusi: 0, kokku: 2 },
    { aasta: 2024, uusi: 1, kokku: 3 },
  ]);
  assert.deepEqual(kasvAastati([]), []);
});
