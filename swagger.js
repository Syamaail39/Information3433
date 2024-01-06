/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

//ADMIN SITE

/**
 * @swagger
 * /register-admin:
 *   post:
 *     tags:
 *       - Login
 *     summary: Register Admin
 *     description: Register a new admin user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterAdminRequest'
 *     responses:
 *       200:
 *         description: Registration complete
 *       400:
 *         description: Missing required fields in the request body
 *       500:
 *         description: Internal Server Error
 *
 * /login-admin:
 *   post:
 *     tags:
 *       - Login
 *     summary: "Login Admin"
 *     description: "Login with admin credentials and get an authentication token."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginRequest'
 *     responses:
 *       200:
 *         description: "Login successful, returns an authentication token"
 *       400:
 *         description: "Invalid credentials or missing required fields"
 *       500:
 *         description: "Internal Server Error"
 *
 * components:
 *   schemas:
 *     RegisterAdminRequest:
 *       type: object
 *       properties:
 *         Username:
 *           type: string
 *         Password:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *       required:
 *         - Username
 *         - Password
 *         - name
 *         - email
 *
 *     AdminLoginRequest:
 *       type: object
 *       properties:
 *         Username:
 *           type: string
 *         Password:
 *           type: string
 *       required:
 *         - Username
 *         - Password
 */

//update
/**
 * @swagger
 * /update-rental/{rentalName}:
 *   patch:
 *     summary: Update rental details (admin only)
 *     description: Update rental details for a specific rental (admin only).
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: rentalName
 *         required: true
 *         description: The name of the rental to update.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: Rental details to update.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gender:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               carType:
 *                 type: string
 *               customerId:
 *                 type: string
 *               rentalDate:
 *                 type: string
 *             example:
 *               gender: Male
 *               phoneNo: "+123456789"
 *               carType: Sedan
 *               customerId: "123456"
 *               rentalDate: "2023-01-01"
 *     responses:
 *       200:
 *         description: Rental updated successfully.
 *       400:
 *         description: Bad request. No fields provided for update.
 *       500:
 *         description: Internal Server Error. An error occurred while updating the rental.
 */

//RENTAL
/**
 * @swagger
 * /create-rental:
 *   post:
 *     summary: Create a new rental.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rentalName:
 *                 type: string
 *               gender:
 *                 type: string
 *               customerId:
 *                 type: string
 *               rentalDate:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               carType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rental created successfully.
 *       400:
 *         description: Bad request. Missing required fields.
 *       500:
 *         description: Internal Server Error. An error occurred while creating the rental.
 */

//DELETE rental
/**
 * @swagger
 * /delete-rental/{rentalName}:
 *   delete:
 *     summary: Delete a rental (admin only)
 *     description: Delete a rental by providing the rentalName. Only accessible to admin users.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: rentalName
 *         required: true
 *         description: The name of the rental to be deleted
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Rental deleted successfully
 *       400:
 *         description: Bad request, missing rentalName
 *       404:
 *         description: Rental not found for deletion
 *       500:
 *         description: Internal server error
 */

//READ rental
/**
 * @swagger
 * /rental-details:
 *   get:
 *     summary: Get all rental details (admin only)
 *     description: Get a list of all rental details. Only accessible to admin users.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation. Returns a list of rental details.
 *         content:
 *           application/json:
 *             example:
 *               - rentalName: Rental1
 *                 gender: Male
 *                 phoneNo: 1234567890
 *                 carType: Sedan
 *                 customerId: ABC123
 *                 rentalDate: "2023-01-01"
 *               - rentalName: Rental2
 *                 gender: Female
 *                 phoneNo: 9876543210
 *                 carType: SUV
 *                 customerId: XYZ789
 *                 rentalDate: "2023-02-15"
 *       500:
 *         description: Internal server error
 */

//CAR DETAIL
/**
 * @swagger
 * /create-car:
 *   post:
 *     summary: Create Car
 *     description: Create a new car entry (Admin Only).
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               carName:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: number
 *               color:
 *                 type: string
 *               licensePlate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Car created successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: Car created successfully.
 *       400:
 *         description: Bad request. Missing required fields or car with the same name already exists.
 *       403:
 *         description: Forbidden. Only admin users are allowed to create cars.
 */

//deleted car
/**
 * @swagger
 * /delete-car/{carName}:
 *   delete:
 *     summary: Delete Car
 *     description: Delete a car entry by carName (Admin Only).
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: carName
 *         in: path
 *         required: true
 *         description: Name of the car to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: Car deleted successfully.
 *       400:
 *         description: Bad request. Missing carName parameter.
 *       403:
 *         description: Forbidden. Only admin users are allowed to delete cars.
 *       404:
 *         description: Car not found for deletion.
 */

//CUSTOMER 
/**
 * @swagger
 * /user-login:
 *   post:
 *     summary: User Login
 *     description: Login a user and return user information without generating a token.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User login successful. Returns user information.
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 username: JohnDoe
 *                 name: John Doe
 *                 email: john.doe@example.com
 *       400:
 *         description: Bad request. Invalid username or password.
 */

/**
 * @swagger
 * /register-user:
 *   post:
 *     summary: Register User
 *     description: Register a new user.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *               Password:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registration successful. Returns success message.
 *         content:
 *           application/json:
 *             example:
 *               message: User registered successfully.
 *       400:
 *         description: Bad request. Missing required fields or username already exists.
 */


