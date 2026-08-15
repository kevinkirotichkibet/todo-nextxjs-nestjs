import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
  ) {}

  create(createTodoDto: CreateTodoDto) {
    const newTodo = new this.todoModel(createTodoDto);
    return newTodo.save();
  }

  findAll() {
    return this.todoModel.find().exec();
  }

  async findOne(id: string) {
    const todo = await this.todoModel.findById(id).exec();
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const updated = await this.todoModel
      .findByIdAndUpdate(id, updateTodoDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Todo ${id} not found`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.todoModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Todo ${id} not found`);
    return deleted;
  }
}