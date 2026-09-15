/* ---------------------------------------------------------------------------
   제작 발주 해석기 (v15) — 시드 발주 6건 + 직접 등록한 발주에 상태·검수 기록을
   덮어 씌운다. 시드 값은 기록이 없을 때만 쓴다.
--------------------------------------------------------------------------- */
import { seedProduction, type ProductionOrder } from "./data";
import type { OrderRecord } from "./store";

export interface ResolvedOrder extends ProductionOrder {
  custom: boolean;
  record?: OrderRecord;
}

export function resolveOrders(customOrders: ProductionOrder[], orderStates: Record<string, OrderRecord>): ResolvedOrder[] {
  const apply = (o: ProductionOrder, custom: boolean): ResolvedOrder => {
    const r = orderStates[o.id];
    return r ? { ...o, status: r.status, qc: r.qc, custom, record: r } : { ...o, custom };
  };
  return [...customOrders.map((o) => apply(o, true)), ...seedProduction.map((o) => apply(o, false))];
}

/** 상태 흐름 — 발주 전 → 제작중 → 검수대기 → 완료 → 설치대기 (되돌림은 사람이 직접) */
export const ORDER_FLOW: ProductionOrder["status"][] = ["발주 전", "제작중", "검수대기", "완료", "설치대기"];
export function nextOrderStatus(s: ProductionOrder["status"]) {
  const i = ORDER_FLOW.indexOf(s);
  return i >= 0 && i < ORDER_FLOW.length - 1 ? ORDER_FLOW[i + 1] : null;
}
