import puppeteer from "puppeteer";

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string | null;
  city: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
  ordersToPlace: number;
}

async function checkoutSentryCookies(customerInfo: CustomerInfo) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  try {
    for (let i = 0; i < customerInfo.ordersToPlace; i++) {
      const page = await browser.newPage();
      console.log(`Processing order ${i + 1} for ${customerInfo.email}`);

      // Navigate to the product page with longer timeout
      await page.goto(
        "https://checkout.sentry.shop/products/irl-cookies?ls=AtF9oAPyFeQ4gJZdbg0Bc",
        {
          waitUntil: "networkidle0",
          timeout: 30000,
        }
      );

      // Wait for and click the "Add to Cart" button with better selector and visibility check
      await page.waitForSelector(
        'button[class="product-form__submit button button--full-width button--primary"][name="add"]',
        {
          visible: true,
          timeout: 10000,
        }
      );

      // Ensure the button is visible and clickable
      const addToCartButton = await page.$(
        'button[class="product-form__submit button button--full-width button--primary"][name="add"]'
      );
      if (!addToCartButton) {
        throw new Error("Add to Cart button not found");
      }

      // Wait a bit for any animations to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Click the button using evaluate to ensure it's interactive
      await page.evaluate((button) => {
        if (button instanceof HTMLElement) {
          button.click();
        }
      }, addToCartButton);

      // Wait for cart update
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Wait for and click the "Checkout" button with better handling
      await page.waitForSelector('button[name="checkout"]', {
        visible: true,
        timeout: 10000,
      });

      const checkoutButton = await page.$('button[name="checkout"]');
      if (!checkoutButton) {
        throw new Error("Checkout button not found");
      }

      await page.evaluate((button) => {
        if (button instanceof HTMLElement) {
          button.click();
        }
      }, checkoutButton);

      // Wait for form fields with longer timeout
      await page.waitForSelector('input[type="email"]', {
        visible: true,
        timeout: 10000,
      });

      // Fill in contact information with delay between inputs
      await page.type('input[type="email"]', customerInfo.email, {
        delay: 100,
      });
      await page.type('input[name="firstName"]', customerInfo.firstName, {
        delay: 100,
      });
      await page.type('input[name="lastName"]', customerInfo.lastName, {
        delay: 100,
      });

      // Fill in shipping information with delay between inputs
      await page.type('input[name="address1"]', customerInfo.address, {
        delay: 100,
      });
      await page.type('input[name="address2"]', customerInfo.apartment || "", {
        delay: 100,
      });
      await page.type('input[name="city"]', customerInfo.city, { delay: 100 });
      // await page.type('input[name="state"]', customerInfo.province, {delay: 100});
      await page.type('input[name="phone"]', customerInfo.phoneNumber, {
        delay: 100,
      });
      await page.type('input[name="postalCode"]', customerInfo.postalCode, {
        delay: 100,
      });

      // Wait longer for review
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const checkoutButtonPayButton = await page.$(
        'button[id="checkout-pay-button"]'
      );
      if (!checkoutButtonPayButton) {
        throw new Error("Checkout button not found");
      }

      await page.evaluate((button) => {
        if (button instanceof HTMLElement) {
          button.click();
        }
      }, checkoutButtonPayButton);

      // Close the page after each order
      // await page.close();

      // Add a longer delay between orders
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log(
      `Completed all ${customerInfo.ordersToPlace} orders for ${customerInfo.email}`
    );
  } catch (error) {
    console.error("An error occurred during checkout:", error);
    // Take a screenshot on error if the page is still open
    try {
      const pages = await browser.pages();
      if (pages.length > 0) {
        await pages[0].screenshot({ path: `error-${Date.now()}.png` });
      }
    } catch (screenshotError) {
      console.error("Failed to take error screenshot:", screenshotError);
    }
  } finally {
    await browser.close();
  }
}

const customers = [
  {
    email: "youredoxed@gmail.com",
    firstName: "doxing",
    lastName: "you",
    address: "your house in toronto",
    apartment: null,
    city: "Toronto",
    province: "Ontario",
    postalCode: "M5A 1AE",
    phoneNumber: "6471114444",
    ordersToPlace: 10,
  },
];

// Example customer list
// Process all customers
async function processAllCustomers() {
  for (const customer of customers) {
    console.log(`Starting orders for ${customer.email}`);
    await checkoutSentryCookies(customer);
    // Add a delay between customers
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  console.log("All customers processed");
}

// Start the process
processAllCustomers();
