const express = require('express');
const app = express();
//const port = 3000;
const port = process.env.PORT || 3000;
const Mongo= process.env.MONGODB_URI;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { MongoClient, ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const uri = 'mongodb+srv://syamaail:syamaail123@syamaail.yb22dtg.mongodb.net/CarRental';


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CAR RENTAL ',
      version: '1.0.0',
    },
  },
  apis: ['./swagger.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let carDetailCollection;
let rentalDetailCollection;
let hostCollection;
let adminCollection;

// MongoDB setup
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db('CarRental');
    adminCollection = db.collection('adminCollection');
    rentalDetailCollection = db.collection('rentalDetailCollection');
    hostCollection = db.collection('hostCollectionName');
    carDetailCollection = db.collection('carDetailCollection');

    //DAH BUAT
// Login User
app.post('/user-login', (req, res) => {
  Userlogin(req.body.Username, req.body.Password)
    .then((result) => {
      res.json(result.user); // Return user information without generating a token
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

// Register User
app.post('/register-user', (req, res) => {
  register(req.body.Username, req.body.Password, req.body.name, req.body.email)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////
//create rental
app.post('/create-rental', async (req, res) => {
  try {
    const { rentalName, gender, customerId, rentalDate, phoneNo, carType } = req.body;

    // Ensure all required fields are present
    if (!rentalName || !gender || !customerId || !rentalDate || !phoneNo || !carType) {
      throw new Error('Missing required fields');
    }

    // Insert the rental data into the rentalDetailCollection
    const rentalData = {
      rentalName,
      gender,
      phoneNo,
      carType,
      customerId,
      rentalDate,
    };

    await rentalDetailCollection.insertOne(rentalData);

    res.send('Rental created successfully');
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).send('An error occurred while creating the rental');
  }
});

// Update Rental (only admin)
app.patch('/update-rental/:rentalName', verifyToken, async (req, res) => {
  try {
    const rentalName = req.params.rentalName;
    const { gender, phoneNo, carType, customerId, rentalDate } = req.body;

    // Ensure at least one field is provided for update
    if (!gender && !phoneNo && !carType && !customerId && !rentalDate) {
      res.status(400).send('No fields provided for update');
      return;
    }

    const updateData = {};

    if (gender) updateData.gender = gender;
    if (phoneNo) updateData.phoneNo = phoneNo;
    if (carType) updateData.carType = carType;
    if (customerId) updateData.customerId = customerId;
    if (rentalDate) updateData.rentalDate = rentalDate;

    await rentalDetailCollection
      .findOneAndUpdate({ rentalName }, { $set: updateData });

    res.send('Rental updated successfully');
  } catch (error) {
    console.error('Error updating rental:', error);
    res.status(500).send('An error occurred while updating the rental');
  }
});

    //DAH BUAT
// Delete Rental (only admin)
app.delete('/delete-rental/:rentalName', verifyToken, async (req, res) => {
  try {
    const rentalName = req.params.rentalName;

    // Check if rentalName is provided
    if (!rentalName) {
      res.status(400).send('No rentalName provided for deletion');
      return;
    }

    // Use findOneAndDelete to delete the rental
    const result = await rentalDetailCollection.findOneAndDelete({ rentalName });

    if (!result.value) {
      // No matching document found
      res.status(404).send('Rental not found for deletion');
      return;
    }

    res.send('Rental deleted successfully');
  } catch (error) {
    console.error('Error deleting rental:', error);
    res.status(500).send('An error occurred while deleting the rental');
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////
//CAR DETAIL//
//created
app.post('/create-car', verifyToken, async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (!req.user || !req.user.isAdmin) {
      res.status(403).send('Only admin users are allowed to create cars.');
      return;
    }

    const { carName, brand, model, year, color, licensePlate } = req.body;

    // Ensure all required fields are present
    if (!carName || !brand || !model || !year || !color || !licensePlate) {
      throw new Error('Missing required fields');
    }

    // Insert the car data into the carDetailCollection
    const carData = {
      carName,
      brand,
      model,
      year,
      color,
      licensePlate,
    };

    await carDetailCollection.insertOne(carData);

    res.send('Car created successfully');
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).send('An error occurred while creating the car');
  }
});

//deleted
app.delete('/delete-car/:carName', verifyToken, async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (!req.user || !req.user.isAdmin) {
      res.status(403).send('Only admin users are allowed to delete cars.');
      return;
    }

    const carName = req.params.carName;

    // Check if carName is provided
    if (!carName) {
      res.status(400).send('Missing carName parameter for deletion');
      return;
    }

    // Use findOneAndDelete to delete the car
    const result = await carDetailCollection.findOneAndDelete({ carName });

    if (!result.value) {
      // No matching document found
      res.status(404).send('Car not found for deletion');
      return;
    }

    res.send('Car deleted successfully');
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).send('An error occurred while deleting the car');
  }
});

///////////////////////////////////READ/////////////////////////////////////////////////
//DAH BUAT

    // Read rental details (only admin)
    app.get('/rental-details', verifyToken, (req, res) => {
      rentalDetailCollection
        .find({})
        .toArray()
        .then((rentalDetails) => {
          res.json(rentalDetails);
        })
        .catch((error) => {
          console.error('Error retrieving rental details:', error);
          res.status(500).send('An error occurred while retrieving rental details');
        });
    });

    //DAH BUAT
   ////////////////////////////////////////////////////////////////////////////////////////////// 
    // Register Admin
    app.post('/register-admin', (req, res) => {
      registerAdmin(req.body.Username, req.body.Password, req.body.name, req.body.email)
        .then((result) => {
          res.send(result);
        })
        .catch((error) => {
          res.status(400).send(error.message);
        });
    });

    // Login Admin
    app.post('/login-admin', (req, res) => {
      Adminlogin(req.body.Username, req.body.Password)
        .then((result) => {
          let token = generateToken(result);
          res.send(token);
        })
        .catch((error) => {
          res.status(400).send(error.message);
        });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });

// Function User Login
async function Userlogin(reqUsername, reqPassword) {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // Validate the request payload
    if (!reqUsername || !reqPassword) {
      throw new Error('Missing required fields');
    }

    let matchuser = await hostCollection.findOne({ Username: reqUsername });

    if (!matchuser) {
      throw new Error('User not found!');
    }
    if (matchuser.Password === reqPassword) {
      return {
        user: matchuser,
      };
    } else {
      throw new Error('Invalid password');
    }
  } catch (error) {
    console.error('Login Error:', error);
    throw new Error('An error occurred during login.');
  } finally {
    await client.close();
  }
}

// Function Admin Login
async function Adminlogin(reqAdminUsername, reqAdminPassword) {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // Validate the request payload
    if (!reqAdminUsername || !reqAdminPassword) {
      throw new Error('Missing required fields');
    }
    let matchuser = await adminCollection.findOne({ Username: reqAdminUsername });

    if (!matchuser) {
      throw new Error('User not found!');
    }
    if (matchuser.Password === reqAdminPassword) {
      const token = generateToken(matchuser);
      return {
        user: matchuser,
        token: token,
      };
    } else {
      throw new Error('Invalid password');
    }
  } catch (error) {
    console.error('Login Error:', error);
    throw new Error('An error occurred during login.');
  } finally {
    await client.close();
  }
}

// Function Admin Register
async function registerAdmin(reqAdminUsername, reqAdminPassword, reqAdminName, reqAdminEmail) {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // Validate the request payload
    if (!reqAdminUsername || !reqAdminPassword || !reqAdminName || !reqAdminEmail) {
      throw new Error('Missing required fields');
    }

    await adminCollection.insertOne({
      Username: reqAdminUsername,
      Password: reqAdminPassword,
      name: reqAdminName,
      email: reqAdminEmail,
    });

    return 'Registration Complete!!';
  } catch (error) {
    console.error('Registration Error:', error);
    throw new Error('An error occurred during registration.');
  } finally {
    await client.close();
  }
}

// Function User Register
async function register(reqUsername, reqPassword, reqName, reqEmail) {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // Validate the request payload
    if (!reqUsername || !reqPassword || !reqName || !reqEmail) {
      throw new Error('Missing required fields');
    }

    await hostCollection.insertOne({
      Username: reqUsername,
      Password: reqPassword,
      name: reqName,
      email: reqEmail,
    });

    return 'Registration Complete!!';
  } catch (error) {
    console.error('Registration Error:', error);
    throw new Error('An error occurred during registration.');
  } finally {
    await client.close();
  }
}

// Function Generate Token
function generateToken(user) {
  const payload =
  {
    username: user.AdminUsername,
  };
  const token = jwt.sign(
    payload, 'inipassword',
    { expiresIn: '1h' }
  );
  return token;
}

// Function Verify Token
function verifyToken(req, res, next) {
  let header = req.headers.authorization;
  console.log(header);

  let token = header.split(' ')[1];

  jwt.verify(token, 'inipassword', function (err, decoded) {
    if (err) {
      return res.status(401).send('Invalid Token');
    }

    req.user = decoded;
    next();
  });
}

