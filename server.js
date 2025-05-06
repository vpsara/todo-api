const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect('mongodb://mongo:27017/todoDB', {  // نستخدم "mongo" كاسم الحاوية للمونجو
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


const todoSchema = new mongoose.Schema({
  task: String,
  done: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);


app.post('/todos', async (req, res) => {
  const { task } = req.body;
  const todo = new Todo({
    task,
  });

  try {
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.put('/todos/:id', async (req, res) => {
  const { done } = req.body;
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { done },
      { new: true }
    );
    res.status(200).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.delete('/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).send({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
