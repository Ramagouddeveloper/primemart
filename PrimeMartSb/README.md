# PrimeMart Client Backend
Java 21 / Spring Boot 3.3.4 / MySQL.
Razorpay Java SDK 1.4.10 is used server-side. Set environment variables RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET for Test Mode.
Client payment endpoints: POST /payments/create-order and POST /payments/verify.
The server verifies Razorpay signatures before creating the local paid order and reducing stock. Order totals are recalculated from server-side product prices.
Sample locations/products are created only when the products table is empty.

## Database tables added/used
`payments` stores local payment audit data (`order_id`, method, status, amount, gateway order/payment ids). JPA `ddl-auto=update` creates/updates it automatically.
Product location indexes are added for faster location-based catalog queries.
