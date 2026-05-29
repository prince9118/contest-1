export type Side = "long" | "short";

export type OrderType = "limit" | "market";
export type OrderStatus =
        | "resting"
        | "filled"
        | "partially_filled"
        | "cancelled"
        | "rejected";

    export interface User {
    userId: string;
    availableBalance: number;
    lockedMargin: number;
    realizedPnl: number;
    }

    export  interface Order {
    orderId: string;
    symbol: string;
    userId: string;
    side: Side;
    type: OrderType;
    price: number;
    quantity: number;
    remainingQuantity: number;
    leverage: number;
    postOnly: boolean;
    createdAt: number;
    }

    export  interface Position {
    symbol: string;
    side: Side;
    quantity: number;
    averageEntryPrice: number;
    margin: number;
    }