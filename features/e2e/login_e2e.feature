Feature: End-to-End Login Flow
  As a MindHaven user
  I want to log in through the UI
  So that I can access my journal dashboard

  Background:
    Given the backend server is running at "http://localhost:8080"
    And the frontend app is running at "http://localhost:3000"

  Scenario: Successful login end-to-end
    Given I open the login page
    When I fill in "Email" with "hafsa@example.com"
    And I fill in "Password" with "mypassword"
    And I click the "Login" button
    Then I should see "✅ Login successful!"

  Scenario: Login fails with wrong password
    Given I open the login page
    When I fill in "Email" with "hafsa@example.com"
    And I fill in "Password" with "wrongpass"
    And I click the "Login" button
    Then I should see "❌ Invalid password"
