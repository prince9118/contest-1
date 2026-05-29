import { Order } from "../types";
import { nextOrderId, orderBook, users } from "../store/memory";

export function placeOrder(input: any) {
  const user = users.get(input.userId);
  if (!user) {
    return {
      orderId: "",
      status: "rejected",
      reason: "user not found",
      fills: [],
      remainingQuantity: input.quantity,
      cancelledQuantity: input.quantity,
      margin: { locked: 0, used: 0, released: 0 },
    };
  }
  
  const leverage = input.leverage ?? 1;
  const requiredMargin = (input.price * input.quantity) / leverage;

  if (user.availableBalance < requiredMargin) {
    return {
      orderId: "",
      status: "rejected",
      reason: "insufficent margin",
      fills: [],
      remainingQuantity: 0,
      cancelledQuantity: input.quantity,
      margin: { locked: 0, used: 0, released: 0 },
    };
  }

  const order: Order = {
    orderId: nextOrderId(),
    userId: input.userId,
    symbol: input.symbol,
    side: input.side,
    type: input.type,
    price: input.price,
    quantity: input.quantity,
    remainingQuantity: input.quantity,
    leverage,
    postOnly: input.postOnly ?? false,
    createdAt: Date.now(),
  };

  if (order.type === "limit") {
    user.availableBalance -= requiredMargin;
    user.lockedMargin += requiredMargin;

    if (order.side === "long") {
      orderBook.bids.push(order);
      orderBook.bids.sort((a, b) => {
        if (b.price !== a.price) return b.price - a.price;
        return a.createdAt - b.createdAt;
      });
    } else {
      orderBook.asks.push(order);
      orderBook.asks.sort((a, b) => {
        if (a.price !== b.price) return a.price - b.price;
        return a.createdAt - b.createdAt;
      });
    }
    return {
      orderId: order.orderId,
      status: "resting",
      fills: [],
      remainingQuantity: order.remainingQuantity,
      cancelledQuantity: 0,
      margin: {
        locked: requiredMargin,
        used: 0,
        released: 0,
      },
    };
  }
  return {
    orderId: order.orderId,
    status: "cancelled",
    fills: [],
    remainingQuantity: 0,
    cancelledQuantity: order.quantity,
    margin: {
      locked: 0,
      used: 0,
      released: 0,
    },
  };
}