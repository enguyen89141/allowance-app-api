# Allowance App API

* This is the backend API for my [Allowance App](https://allowance-app.enguyen89141.now.sh/)

## Summary

* This tested API communicates with my [client side application](https://github.com/enguyen89141/Allowance-App) to populate the tasks, create user accounts for both "parent" and "child" with child receiving an email with the proper sign up link. 

* The technology used in this API include Express, Node.js, and PostgreSQL and for the testing I utilized Chai, Jest, and Supertest.

### Endpoints - These are the main endpoints utilized in my application. Other endpoints are for testing and future functionality. Not all endpoints are accessible as some require authentication. 

* Logins: /api/logins <br>
Accesses the logins created when signing up and the account status for "parent" and "child"
* Parents: /api/parents <br>
Accesses the information pertaining to the parent such as name, email, and "children"
* Children: /api/children <br>
Accesses the childrens names, emails, and associated parent id.
* Tasks /api/tasks <br>
Accesses the lists of tasks which have foreign keys to tie to a specific child/parent

