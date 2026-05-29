import express from "express";
import "dotenv/config";
import cors from "cors";
import { users, resetData } from "./store/memory";
import { availableMemory } from "node:process";
import { orderBook } from "./store/memory";
import { placeOrder } from "./engine/orderEngine";

const app = express();

app.use(cors());
app.use(express.json());


// reset  api

app.post("/api/reset", (req, res) => {
  resetData();
  res.json({
     "ok": true 
  });
});

app.post("/api/users", (req, res) => {
  const { userId, initialBalance } = req.body;

  users.set(userId, {
    userId,
    availableBalance: initialBalance,
    lockedMargin: 0,
    realizedPnl: 0,
  });

  res.json({ 
    userId
   });
});

app.get("/api/users/:userId/balance", (req, res) => {
  const user = users.get(req.params.userId);

  if (!user) {
    return res.status(404).json({ 
      error: "user not found"
     });
  }

  res.json({
    userId: user.userId,
    availableBalance: user.availableBalance,
    lockedMargin: user.lockedMargin,
    totalEquity: user.availableBalance + user.lockedMargin,
    realizedPnl: user.realizedPnl,
  });
});



app.post("/api/orders", (req, res) => {
  const result = placeOrder(req.body);
  res.json(result);
});
app.get("/api/orderbook/:symbol", (req, res) => {
  const symbol = req.params.symbol;
  res.json({
    symbol,
    bids: orderBook.bids
      .filter((order) => order.symbol === symbol)
      .map((order) => ({
        orderId: order.orderId,
        userId: order.userId,
        price: order.price,
        quantity: order.remainingQuantity,
      })),
    asks: orderBook.asks
      .filter((order) => order.symbol === symbol)
      .map((order) => ({
        orderId: order.orderId,
        userId: order.userId,
        price: order.price,
        quantity: order.remainingQuantity,
      })),
  });
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});