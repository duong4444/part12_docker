const express = require("express");
const { Todo } = require("../mongo");
const { getAsync, setAsync } = require("../redis/index");
const router = express.Router();

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  console.log("length", todos.length);

  res.send(todos);
});

router.get("/statistics", async (_, res) => {
  let count = await getAsync("count");
  if (count == null){
    count = 0;
  }
  console.log("log count statistic", count);

  return res.json({
    added_todos: parseInt(count) || 0
  });
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todoCounter = async () => {
    let count = await getAsync("count");
    if(count == null){
      count = 0;
    }
    console.log("count trong post",count);
    
    return count
      ? setAsync("count", parseInt(count) + 1)
      : setAsync("count", 1);
  };
  await todoCounter();

  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  // res.sendStatus(405); // Implement this
  res.json(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  // res.sendStatus(405); // Implement this
  const updated_todo = {
    text: req.body.text,
    done: req.body.done,
  };
  const updatedTodo = await Todo.findByIdAndUpdate(req.todo._id, updated_todo, {
    new: true,
  });
  res.json(updatedTodo);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
