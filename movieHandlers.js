const database = require("./database");

// const movies = [
//   {
//     id: 1,
//     title: "Citizen Kane",
//     director: "Orson Wells",
//     year: "1941",
//     colors: false,
//     duration: 120,
//   },
//   {
//     id: 2,
//     title: "The Godfather",
//     director: "Francis Ford Coppola",
//     year: "1972",
//     colors: true,
//     duration: 180,
//   },
//   {
//     id: 3,
//     title: "Pulp Fiction",
//     director: "Quentin Tarantino",
//     year: "1994",
//     color: true,
//     duration: 180,
//   },
// ];

const getMovies = (req, res) => {
  let sql = "SELECT * FROM movies";
  const sqlValues = [];

  if (req.query.max_duration != null) {
    sql += " WHERE duration <= ?";
    sqlValues.push(req.query.max_duration);

    if (req.query.color != null) {
    sql += " AND color = ?";
    sqlValues.push(req.query.color);
  }
} else if (req.query.color != null) {
  sql += " WHERE color = ?";
    sqlValues.push(req.query.color);
}
  

  database
    .query(sql, sqlValues)
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

// const getMovieById = (req, res) => {
//   const id = parseInt(req.params.id);

//   const movie = movies.find((movie) => movie.id === id);

//   if (movie != null) {
//     res.json(movie);
//   } else {
//     res.status(404).send("Not Found");
//   }
// };

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("SELECT * FROM movies WHERE id = ?", [id])
    .then(([movies]) => {
      if (movies[0] != null) {
res.json(movies[0]);
    } else {
      res.status(404).send("not found");
    }})
    .catch((err) => {
      res.status(500);
    });
};

const getUsers = (req, res) => {
  database
    .query("SELECT * FROM users")
    .then(([users]) => {
      res.json(users).status(200);
    })
};

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("SELECT * FROM users WHERE id = ?", [id])
    .then(([users]) => {
      if (users[0] != null) {
res.json(users[0]).status(200);
    } else {
      res.status(404).send("not found");
    }})
};

const postMovie = (req, res) => {
  // console.log(req.body);
  // res.send("Post route is working 🎉");
  const { title, director, year, color, duration } = req.body;

  database
  .query(
    "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
    [title, director, year, color, duration]
  )
  .then(([result]) => {
    res.location(`/api/movies/${result.insertId}`).sendStatus(201);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error saving the movie");
  });  
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;

  database
  .query(
    "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
    [firstname, lastname, email, city, language]
  )
  .then(([result]) => {
    res.location(`/api/users/${result.insertId}`).sendStatus(201);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error saving the user");
  });  
};

const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const userData = req.body;

  database
    .query(
      "UPDATE movies SET ? WHERE id = ?",
      [userData, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the movie");
    });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const userData = req.body;

  database
    .query(
      "UPDATE users SET ? WHERE id = ?",
      [userData, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the user");
    });
};

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("DELETE FROM movies WHERE id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the movie");
    });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("DELETE FROM users WHERE id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the user");
    });
};

module.exports = {
  getMovies,
  getMovieById,
  getUsers,
  getUsersById,
  postMovie,
  postUser,
  updateMovie,
  updateUser,
  deleteMovie,
  deleteUser
};
