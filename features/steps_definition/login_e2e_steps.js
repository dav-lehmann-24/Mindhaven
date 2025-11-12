// const { Given, When, Then, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const path = require('path');
const cucumber = require(path.resolve(__dirname, '../../server/node_modules/@cucumber/cucumber'));
const { Given, When, Then, BeforeAll, AfterAll } = cucumber;
const { chromium } = require('playwright');
const { expect } = require('chai');
const fetch = require('node-fetch');

let browser, page;
let BACKEND_URL = '', FRONTEND_URL = '';

BeforeAll(async () => {
  browser = await chromium.launch({ headless: false, slowMo: 100 });
  page = await browser.newPage();
});

AfterAll(async () => {
  await browser.close();
});

// --- Backend/Frontend Setup ---
Given('the backend server is running at {string}', async (url) => {
  BACKEND_URL = url;
  const res = await fetch(`${url}/`);
  expect(res.ok).to.be.true;
});

Given('the frontend app is running at {string}', async (url) => {
  FRONTEND_URL = url;
  const res = await fetch(url);
  expect(res.ok).to.be.true;
});

// --- UI Actions ---
Given('I open the login page', async () => {
  await page.goto(`${FRONTEND_URL}/login`);
});

When('I fill in {string} with {string}', async (placeholder, value) => {
  await page.fill(`input[placeholder="${placeholder}"]`, value);
});

When('I click the {string} button', async (text) => {
  await page.click(`text=${text}`);
});

Then('I should see {string}', async (expectedText) => {
  await page.waitForTimeout(1000);
  const body = await page.textContent('body');
  expect(body).to.include(expectedText);
});
