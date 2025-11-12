# Feature: End-to-End Login Flow
#   As a MindHaven user
#   I want to log in through the UI
#   So that I can access my journal dashboard

#   Background:
#     Given the backend server is running at "http://localhost:8080"
#     And the frontend app is running at "http://localhost:3000"

#   Scenario: Successful login end-to-end
#     Given I open the login page
#     When I fill in "email" with "hafsa@example.com"
#     And I fill in "password" with "mypassword"
#     And I click the "Log in" button
#     Then I should see "✅ Login successful!"

#   Scenario: Login fails with wrong password
#     Given I open the login page
#     When I fill in "email" with "hafsa@example.com"
#     And I fill in "password" with "wrongpass"
#     And I click the "Log in" button
#     Then I should see "❌ Invalid password"

# Scenario: Login fails with wrong email and wrong password
#   Given the backend server is running at "http://localhost:8080"
#   And the frontend app is running at "http://localhost:3000"
#   Given I open the login page
#   When I fill in "email" with "unknown@example.com"
#   And I fill in "password" with "incorrectpass"
#   And I click the "Log in" button
#   Then I should see "❌ User not found"

# Scenario: Login fails with wrong email but correct password
#   Given the backend server is running at "http://localhost:8080"
#   And the frontend app is running at "http://localhost:3000"
#   Given I open the login page
#   When I fill in "email" with "wrong@example.com"
#   And I fill in "password" with "mypassword"
#   And I click the "Log in" button
#   Then I should see "❌ User not found"

# Scenario: Login fails when email or password is missing
#   Given the backend server is running at "http://localhost:8080"
#   And the frontend app is running at "http://localhost:3000"
#   Given I open the login page
#   When I fill in "email" with ""
#   And I fill in "password" with ""
#   And I click the "Log in" button
#   Then I should see "Please enter both email and password."


Feature: Login Functionality (End-to-End)
  As a user
  I want to log into MindHaven
  So that I can access my dashboard

  Background:
    Given the backend server is running at "http://localhost:8080"
    And the frontend app is running at "http://localhost:3000"
    Given I open the login page

  Scenario: Successful login with valid credentials
    When I fill in "Email" with "hafsa@example.com"
    And I fill in "Password" with "mypassword"
    And I click the "Log in" button
    Then I should be redirected to the dashboard

  Scenario: Login fails with correct email and wrong password
    When I fill in "Email" with "hafsa@example.com"
    And I fill in "Password" with "wrongpass"
    And I click the "Log in" button
    Then I should see an error message containing "Invalid password"

  Scenario: Login fails with wrong email and wrong password
    When I fill in "Email" with "unknown@example.com"
    And I fill in "Password" with "incorrectpass"
    And I click the "Log in" button
    Then I should see an error message containing "User not found"

  Scenario: Login fails with wrong email but correct password
    When I fill in "Email" with "wrong@example.com"
    And I fill in "Password" with "mypassword"
    And I click the "Log in" button
    Then I should see an error message containing "User not found"

  Scenario: Login fails when email or password is missing
    When I fill in "Email" with ""
    And I fill in "Password" with ""
    And I click the "Log in" button
    Then I should see an error message containing "Please enter both email and password."
