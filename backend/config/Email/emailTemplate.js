const Seller_Welcome_Email = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to MidNight_Fuel Marketplace</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #f8f9fa;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #fff;
      border-radius: 8px;
      border: 1px solid #e1e1e1;
      overflow: hidden;
    }
    .header {
      background: #0d6efd;
      color: #fff;
      text-align: center;
      padding: 25px;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
      font-size: 16px;
      line-height: 1.7;
    }
    .btn {
      display: inline-block;
      background: #0d6efd;
      color: #fff;
      padding: 12px 30px;
      margin: 25px 0;
      border-radius: 5px;
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
    }
    .btn:hover {
      background: #0a58ca;
    }
    .footer {
      background: #f1f1f1;
      text-align: center;
      padding: 15px;
      font-size: 13px;
      color: #6c757d;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Welcome to MidNight_Fuel Marketplace</div>
    <div class="content">
      <p>Hi <strong>{name}</strong>,</p>
      <p>We’re excited to let you know that your seller request has been <strong>approved</strong>! You are now officially part of the <strong>MidNight_Fuel</strong> seller community.</p>
      <p>Here’s how you can get started:</p>
      <ul>
        <li>Log in to your <strong>MidNight_Fuel</strong> dashboard and set up your store details.</li>
        <li>List your first product and make it live.</li>
        <li>Explore our resources to maximize your sales potential.</li>
      </ul>
      <a href="{dashboard_link}" class="btn">Go to Dashboard</a>
      <p>We’re here to support you at every step. Let’s grow together with <strong>MidNight_Fuel</strong>!</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} MidNight_Fuel. All Rights Reserved.
    </div>
  </div>
</body>
</html>
`;





const Seller_Rejection_Email = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MidNight_Fuel Seller Request Update</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #f8f9fa;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #fff;
      border-radius: 8px;
      border: 1px solid #e1e1e1;
      overflow: hidden;
    }
    .header {
      background: #dc3545;
      color: #fff;
      text-align: center;
      padding: 25px;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
      font-size: 16px;
      line-height: 1.7;
    }
    .btn {
      display: inline-block;
      background: #0d6efd;
      color: #fff;
      padding: 12px 30px;
      margin: 25px 0;
      border-radius: 5px;
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
    }
    .btn:hover {
      background: #0a58ca;
    }
    .footer {
      background: #f1f1f1;
      text-align: center;
      padding: 15px;
      font-size: 13px;
      color: #6c757d;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">MidNight_Fuel Seller Request Update</div>
    <div class="content">
      <p>Hi <strong>{name}</strong>,</p>
      <p>We appreciate your interest in joining the <strong>MidNight_Fuel</strong> marketplace. After reviewing your request, we regret to inform you that your application was <strong>not approved</strong> at this time.</p>
      <p>You can:</p>
      <ul>
        <li>Review and update your application details.</li>
        <li>Contact our <strong>MidNight_Fuel</strong> support team for more information.</li>
        <li>Reapply after making the necessary updates.</li>
      </ul>
      <a href="{support_link}" class="btn">Contact Support</a>
      <p>We value your interest in <strong>MidNight_Fuel</strong> and hope to collaborate in the future.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} MidNight_Fuel. All Rights Reserved.
    </div>
  </div>
</body>
</html>
`;



export { Seller_Welcome_Email, Seller_Rejection_Email };