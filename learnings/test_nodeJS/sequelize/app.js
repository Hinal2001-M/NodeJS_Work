const express = require('express');
const { sequelize }= require('./models/index');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected successfully!');
  } catch (error) {
    console.error('Unable to connect:', error);
  }
})();

sequelize.sync({ alter: true });

app.use('/user', require('./routes/userRoutes'));
app.use('/event', require('./routes/eventRoutes'));

app.listen(8000, () => {
  console.log('Server running on port 8080');
});