# 1 Use-Case Name
Edit Account

## 1.1 Brief Description

## 2. Basic Flow

### 2.1 Activity Diagram
![Edit Account Activity Diagram](Pictures/Edit_Account_UML_Diagram.png)

### 2.2 Mock-up


### 2.3 Alternate Flow:

### 2.4 Narrative
```gherkin
Feature: Edit Account
    As a user
    I want to edit my account information
    So that I can change my username or password
  
  Scenario: Open account page
    Given I am logged in
    And I am on the landingpage
    When I click the "Account" button
    Then I am redirected to the "Account" page

  Scenario: Enter valid data and change username
    Given I am on the "Account" page
    When I click on the "Edit Data" button
    And I enter "myusername" in the "Username" field
    And I press the "submit" button
    And the username is not taken already
    Then I receive a "Success" message
    And I am redirected to the "Account" page

Scenario: Enter valid data and change password
    Given I am on the "Account" page
    When I click on the "Edit Data" button
    And I enter "%dh5!XEX" in the "password" field
    And I press the "submit" button
    Then I receive a "Success" message
    And I am redirected to the "Account" page

  Scenario: Enter invalid data and receive error message
    Given I am on the "Account" page
    When I enter "short" in the "Password" field
    And I press the "submit" button
    Then I remain on the "Edit Account" page
    And I receive an "Error" message
```

## 3. Preconditions:

## 4. Postconditions:

## 5. Exceptions:
- **System Failure**

## 6. Link to SRS:
This use case is linked to the relevant section of the [Software Requirements Specification (SRS)](SRS.md).

## 7. CRUD Classification:
