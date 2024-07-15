//const getUsers = "SELECT * FROM users WHERE id >= 1 AND id <= 1800 ORDER BY id";
//const getUsers = "SELECT * FROM users ORDER BY id LIMIT 50";

const getUsers = "SELECT * FROM users_db ORDER BY id OFFSET $1 LIMIT $2";

const getUserById = "SELECT * FROM users_db WHERE id=$1";

const getUserByName = "SELECT * FROM users_db WHERE name_en ILIKE $1 OR name_ru ILIKE $1 ORDER BY id OFFSET $2 LIMIT $3";
const getUserByNameCount = "SELECT COUNT(*) FROM users_db WHERE name_en ILIKE $1 OR name_ru ILIKE $1";

const checkEmailExists = "SELECT u FROM users_db u WHERE u.email = $1";
const addUser = "INSERT INTO users_db (name_en,name_ru,position,department,location,email,internal_phone,mobile_phone,actual_location,birthday) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
const removeUser = "DELETE FROM users_db WHERE id = $1";

const updateUser = `
  UPDATE users_db 
  SET 
    name_en = $1,
    name_ru = $2,
    position = $3,
    department = $4,
    location = $5,
    email = $6,
    internal_phone = $7,
    mobile_phone = $8,
    actual_location = $9,
    birthday = $10 
  WHERE 
    id = $11;
  `;

const paginationUser = "SELECT * FROM users_db WHERE id >= $1 AND id < $2";

module.exports ={
  getUsers,
  getUserById,
  checkEmailExists,
  addUser,
  removeUser,
  updateUser,
  paginationUser,
  getUserByName,
  getUserByNameCount
};