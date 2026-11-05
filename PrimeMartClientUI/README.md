# PrimeMart Client UI
Run: npm install && npm start
Backend URL is configured only in public/assets/config.json.
Set razorpayKeyId to your Razorpay TEST key id (rzp_test_...). The secret stays on the Spring Boot server.
Online checkout uses Razorpay Standard Checkout for UPI/Card/Netbanking in test mode. COD remains available.
Product location and delivery location are independent. Product location controls the catalog; delivery location controls checkout/navbar.
