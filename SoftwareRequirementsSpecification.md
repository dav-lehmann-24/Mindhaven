# Mindhaven - Software Requirements Specification 

## Table of contents
- [Table of contents](#table-of-contents)
- [Introduction](#1-introduction)
    - [Purpose](#11-purpose)
    - [Scope](#12-scope)
    - [Definitions, Acronyms and Abbreviations](#13-definitions-acronyms-and-abbreviations)
    - [References](#14-references)
    - [Overview](#15-overview)
- [Overall Description](#2-overall-description)
    - [Vision](#21-vision)
    - [Use Case Diagram](#22-use-case-diagram)
	- [Technology Stack](#23-technology-stack)
- [Specific Requirements](#3-specific-requirements)
    - [Functionality](#31-functionality)
    - [Usability](#32-usability)
    - [Reliability](#33-reliability)
    - [Performance](#34-performance)
    - [Supportability](#35-supportability)
    - [Design Constraints](#36-design-constraints)
    - [Online User Documentation and Help System Requirements](#37-on-line-user-documentation-and-help-system-requirements)
    - [Purchased Components](#purchased-components)
    - [Interfaces](#39-interfaces)
    - [Licensing Requirements](#310-licensing-requirements)
    - [Legal, Copyright And Other Notices](#311-legal-copyright-and-other-notices)
    - [Applicable Standards](#312-applicable-standards)
- [Supporting Information](#4-supporting-information)

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) describes all specifications for the application "Mindhaven". It includes an overview about this project and its vision, detailed information about the planned features and boundary conditions of the development process.


### 1.2 Scope
The project is going to be realized as a web application.  
  
Actors of this App can be users.  
  
Planned Subsystems are: 
* TBD

### 1.3 Definitions, Acronyms and Abbreviations
| Abbrevation | Explanation                            |
| ----------- | -------------------------------------- |
| SRS         | Software Requirements Specification    |
| UC          | Use Case                               |
| N/A         | Not Applicable                         |
| TBD         | To Be Determined                       |
| OUCD        | Overall Use Case Diagram               |
| FAQ         | Frequently asked Questions             |

### 1.4 References

| Title                                                                   | Date       | Publishing organization   |
| ----------------------------------------------------------------------- |:----------:| ------------------------- |
| [Mindhaven Blog](https://mindhavenapp-kunpy.wordpress.com/mindhaven)    | 18.10.2018 | Mindhaven Team    		   |
| [GitHub](https://github.com/dav-lehmann-24/Mindhaven)                   | 18.10.2018 | Mindhaven Team    		   |


### 1.5 Overview
The following chapter provides an overview of this project with vision and Overall Use Case Diagram. The third chapter (Requirements Specification) delivers more details about the specific requirements in terms of functionality, usability and design parameters. Finally there is a chapter with supporting information. 
    
## 2. Overall Description

### 2.1 Vision
Mindhaven is a mental health application designed to be a safe and secure digital space for users to manage their mental well-being. It’s a comprehensive hub that provides tools for self-care, offers access to resources, and leverages AI to support, but not replace, professional help. The name “Mindhaven” suggests a safe harbor or sanctuary for the mind, a place to find peace & security.

### 2.2 Use Case Diagram

![OUCD](UCD.png)


### 2.3 Technology Stack
The technology we use is:

Backend:
- Node.js with Express
- MySQL Database

Frontend:
- React

IDE:
- TBD

Project Management:
- YouTrack
- GitHub
- Discord & Whatsapp

Deployment:
- TBD

Testing:
- TBD

## 3. Specific Requirements

### 3.1 Functionality
This section will explain the different use cases, you could see in the Use Case Diagram, and their functionality.  
Until the end of the first semester we plan to implement:
- 3.1.1 Create account
- 3.1.2 Logging in / Logging out
- 3.1.3 Edit account
- 3.1.4 Delete account
- 3.1.5 Reset password

Until the end of the second semester, we want to implement:
- 3.1.6 Manage journal (create, edit, delete, list)
- 3.1.7 Implement AI assistance (Chatbot) 
- 3.1.8 Implement SOS Mode
- 3.1.9 Implement links for SOS Mode
- 3.1.10

#### 3.1.1 Create account


[Create account]()

#### 3.1.2 Logging in / Logging out


[Logging in / Logging out]()

#### 3.1.3 Edit account


[Edit account]()

#### 3.1.4 Delete account


[Delete account]()

#### 3.1.5 Reset password


[Reset password]()

#### 3.1.6 Manage journal


[Manage journal]()

#### 3.1.7 Implement AI assistance (Chatbot)


[Implement AI assistance]()

#### 3.1.8 Implement SOS Mode


[Implement SOS Mode]()

#### 3.1.9 Implement links for SOS Mode


[Implement links for SOS Mode]()

#### 3.1.10


[ ]()


### 3.2 Usability
We plan on designing the user interface as intuitive and self-explanatory as possible to make the user feel as comfortable as possible using the web application.

#### 3.2.1 No training time needed
Our goal is that a user logs into his account or creates one, and is able to use all features without any explanation or help.

#### 3.2.2 Familiar Feeling
We want to implement an app with familiar designs and functions. This way the user is able to interact in familiar ways with the web application without having to get to know new interfaces.

### 3.3 Reliability

#### 3.3.1 Availability
The server shall be available 95% of the time. This also means we have to figure out the "rush hours" of our app because the downtime of the server is only tolerable when as few as possible players want to use the app.

#### 3.3.2 Defect Rate
Our goal is that we have no loss of any data.

### 3.4 Perfomance

#### 3.4.1 Capacity
The system should be able to manage thousands of requests. Also it should be possible to register as many users as necessary.

#### 3.4.2 Storage 
TBD

#### 3.4.3 Perfomance / Response time
To provide the best perfomance we aim to keep the response time as low as possible. This will make the user experience much better.

### 3.5 Supportability

#### 3.5.1 Coding Standards
We are going to write the code by using all of the most common clean code standards. For example we will name our variables and methods by their functionalities. This will keep the code easy to read by everyone and make further developement much easier.

#### 3.5.2 Testing Strategy
The application will have a high test coverage and all important functionalities and edge cases should be tested. Further mistakes in the implementation will be discovered instantly and it will be easy to locate the error. 

### 3.6 Design Constraints
TBD

### 3.7 On-line User Documentation and Help System Requirements
The usage of the app should be as intuitive as possible so it won't need any further documentation.

### 3.8 Purchased Components
We don't have any purchased components yet. If there will be purchased components in the future we will list them here.

### 3.9 Interfaces

#### 3.9.1 User Interfaces
The User interfaces that will be implented are:
- Dashboard - listing items specific for the user (e.g. journals, ...)
- Login - this page is used to log in 
- Register - provides a registration form
- Profile - makes it possible to post information about yourself, might provide messaging feature, also shows additional information about users
- Settings - shows the settings

#### 3.9.2 Hardware Interfaces
(n/a)

#### 3.9.3 Software Interfaces
(n/a)

#### 3.9.4 Communication Interfaces
The server and hardware will communicate using the http protocol. 

### 3.10 Licensing Requirements

### 3.11 Legal, Copyright, and Other Notices
The logo is licensed to the Mindhaven Team and is only allowed to use for the application. We do not take responsibilty for any incorrect data or errors in the application.

### 3.12 Applicable Standards
The development will follow the common clean code standards and naming conventions. Also we will create a definition of which will be added here as soon as its complete.

## 4. Supporting Information
For any further information you can contact the Mindhaven Team or check our [Mindhaven Blog](https://mindhavenapp-kunpy.wordpress.com/mindhaven). 
The Team Members are:
- Daniela Chaves Acuna
- David Lehmann
- Hafsa 
