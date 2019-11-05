const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "postgres://postgres:secret@localhost:5432/postgres"
);

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.post("/", (req, res) => {
  console.log(req.body);
  res.json({
    message: "We received your request body!"
  });
});
app.listen(port, () => console.log("listening on port " + port));

app.post("/echo", (req, res) => {
  res.json(req.body);
});

const User = sequelize.define("user", {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});

const Task = sequelize.define("task", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING
  },
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

sequelize
  .sync()
  .then(() => console.log("Tables created successfully"))
  .catch(err => {
    console.error("Unable to create tables, shutting down...", err);
    process.exit(1);
  });

app.post("/users", (req, res, next) => {
  User.create(req.body)
    .then(user => res.json(user))
    .catch(err => next(err));
});

app.get("/users/:userId", (req, res, next) => {
  User.findByPk(req.params.userId)
    .then(user => {
      if (!user) {
        res.status(404).end();
      } else {
        res.json(user);
      }
    })
    .catch(next);
});

app.put("/users/:userId", (req, res, next) => {
  User.findByPk(req.params.userId)
    .then(user => {
      if (user) {
        user.update(req.body).then(user => res.json(user));
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Get a single user task
app.get("/users/:userId/tasks/:taskId", (req, res, next) => {
  Task.findOne({
    where: {
      id: req.params.taskId,
      userId: req.params.userId
    }
  })
    .then(task => {
      if (task) {
        return res.json(task);
      }
      return res.status(404).end();
    })
    .catch(next);
});

app.post("/users/:userId/tasks", (req, res, next) => {
  User.findByPk(req.params.userId)
    .then(user => {
      if (!user) {
        res.status(404).end();
      } else {
        Task.create({ ...req.body, userId: req.params.userId }).then(task =>
          res.json(task)
        );
      }
    })
    .catch(next);
});
app.get("/users/:userId/tasks", (req, res, next) => {
  Task.findAll({
    where: {
      userId: req.params.userId
    }
  })
    .then(tasks => {
      if (tasks) {
        return res.json(tasks);
      }
      return res.status(404).end();
    })
    .catch(next);
});

app.put("/users/:userId/tasks/:taskId", (req, res, next) => {
  Task.findOne({
    where: {
      id: req.params.taskId,
      userId: req.params.userId
    }
  })
    .then(task => {
      if (task) {
        task.update(req.body).then(task => res.json(task));
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Delete a user's task
app.delete("/users/:userId/tasks/:taskId", (req, res, next) => {
  Task.destroy({
    where: {
      id: req.params.taskId,
      userId: req.params.userId
    }
  })
    .then(numDeleted => {
      if (numDeleted) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Delete all user's tasks
app.delete("/users/:userId/tasks", (req, res, next) => {
  Task.destroy({
    where: {
      userId: req.params.userId
    }
  })
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});
