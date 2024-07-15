const pool = require("../../db");
const queries = require("./queries");

const getUsers = async (req, res) => {
  const { page = 1, size = 50} = req.query;
  const offset = (page - 1) * size;

  try {
    const countResult = await pool.query('SELECT COUNT(*) FROM users_db');
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / size);
    const result = await pool.query(queries.getUsers, [offset, size]);

    const response = {
      totalPages,
      currentPage: parseInt(page),
      pageSize: parseInt(size),
      totalCount,
      data: result.rows
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const paginationUser = async (req, res) => {
  const from = parseInt(req.params.from);
  const to = parseInt(req.params.to);
  try {
      const result = await pool.query(queries.paginationUser, [from, to]);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);

  if (req.params.id === 'search') {
    const name = `%${req.query.name}%`;
    
    try {
      const { page = 1, size = 50} = req.query;
      const offset = (page - 1) * size;
      const result = await pool.query(queries.getUserByName, [name, offset, size]);
      const resultCount = await pool.query(queries.getUserByNameCount, [name]);

      const countResult = resultCount.rows[0].count;
      const totalCount = parseInt(countResult);
      const totalPages = Math.ceil(totalCount / size);

      const response = {
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(size),
        totalCount,
        data: result.rows,
      };

      if (result.rows.length > 0) {
        res.status(200).json(response);
      } else {
        console.error('Error executing query', error);
        res.status(404).json({ error: `User with name = ${name} does not exist` }); 
      }
    } catch {
      console.error(`User with name ${req.query.name} does not exist or incorrect name`);
      res.status(200).json({ error: `User with name ${req.query.name} does not exist or incorrect name` });
    }
  } else {
    try {
      const result = await pool.query(queries.getUserById, [id]);
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        console.error(`User with id = ${id} does not exist`);
        res.status(404).json({ error: `User with id = ${id} does not exist` });
      }
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const addUser = async (req, res) => {
  const {
    name_en,
    name_ru, 
    position, 
    department,
    location,
    email,
    internal_phone,
    mobile_phone,
    actual_location,
    birthday,
  } = req.body;

  try {
    // Insert the new user into the database
    const result = await pool.query(queries.addUser, 
      [name_en, name_ru, position, department, location, email, internal_phone, mobile_phone, actual_location, birthday]
    );
    console.log('User added successfully');
    res.status(201).json({ success: 'User added successfully' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Fill all information' });
  }
};

const removeUser = (req, res) => {
  const id = parseInt(req.params.id);

  try {
    pool.query(queries.removeUser, [id], (err, results) => {
      if (err) {
        console.error(`Error removing user with id = ${id}:`, err);
        res.status(500).send({error: `Error removing user with id = ${id} from the database`});
        return;
      };
  
      if (results.rowCount === 0) {
        console.error(`User with id = ${id} does not exist`);
        res.status(404).send({ error: `User with id = ${id} does not exist` });
        return;
      }
  
      res.status(200).send({ success: `User with id = ${id} removed successfully` });
    });
  } catch {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { name_en, name_ru, position, department, location, email, internal_phone, mobile_phone, actual_location, birthday } = req.query;



    //const { name_en, name_ru, position, department, location, email, internal_phone, mobile_phone, actual_location, birthday } = req.query;
    pool.query(queries.getUserById, [id], (err, results) => {
      const noUserFound = !results.rows.length;
      if (noUserFound) {
        console.log(`User with id = ${id} does not exist in database`);
        res.status(404).send({ error: `User with id = ${id} does not exist in database` });
      }

      pool.query(queries.updateUser, [name_en, name_ru, position, department, location, email, internal_phone, mobile_phone, actual_location, birthday, id], (err, results) => {
        if (err) {
          console.error('Error updating user:', err);
          res.status(500).send({ error: `Error updating user`});
          return;
        }
        console.log(`User with id = ${id} updated successfully`);
        res.status(200).send({ success: `User with id = ${id} updated successfully` });
      });
    });

  
};

module.exports = {
  getUsers,
  getUserById,
  addUser,
  removeUser,
  updateUser,
  paginationUser,
};
