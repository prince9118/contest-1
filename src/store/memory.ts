import { User, Order, Position } from "../types";

export const users = new Map<string, User>();

export const orderBook = {
  bids: [] as Order[],
  asks: [] as Order[],
};

export const positions = new Map<string, Position[]>();
export let orderIdCounter = 1;
export function nextOrderId() {
  return `order-${orderIdCounter++}`;
}

export function resetData() {
  users.clear();
  orderBook.bids = [];
  orderBook.asks = [];
  positions.clear();
  orderIdCounter = 1;
}