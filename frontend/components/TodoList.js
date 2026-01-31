'use client';

import { FaCheckCircle, FaCircle, FaTrash } from 'react-icons/fa';
import { todoAPI } from '@/lib/api';

export default function TodoList({ todos, onUpdate }) {
    const handleToggleComplete = async (id, isComplete) => {
        try {
            if (isComplete) {
                await todoAPI.update(id, { is_complete: false });
            } else {
                await todoAPI.complete(id);
            }
            onUpdate();
        } catch (error) {
            console.error('Failed to update todo:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await todoAPI.delete(id);
            onUpdate();
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'text-red-600 bg-red-50';
            case 'medium':
                return 'text-yellow-600 bg-yellow-50';
            case 'low':
                return 'text-green-600 bg-green-50';
            default:
                return 'text-slate-600 bg-slate-50';
        }
    };

    if (!todos || todos.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                <p>No tasks yet. Your AI Counsellor will create tasks for you!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {todos.map((todo) => (
                <div
                    key={todo.id}
                    className={`card p-4 flex items-start gap-3 ${todo.is_complete ? 'opacity-60' : ''
                        }`}
                >
                    <button
                        onClick={() => handleToggleComplete(todo.id, todo.is_complete)}
                        className="mt-1 text-xl focus:outline-none"
                    >
                        {todo.is_complete ? (
                            <FaCheckCircle className="text-green-600" />
                        ) : (
                            <FaCircle className="text-slate-300" />
                        )}
                    </button>

                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <h4
                                className={`font-medium ${todo.is_complete ? 'line-through text-slate-500' : 'text-slate-800'
                                    }`}
                            >
                                {todo.title}
                            </h4>
                            <button
                                onClick={() => handleDelete(todo.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <FaTrash className="text-sm" />
                            </button>
                        </div>

                        {todo.description && (
                            <p className="text-sm text-slate-600 mt-1">{todo.description}</p>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(todo.priority)}`}>
                                {todo.priority}
                            </span>
                            <span className="text-xs text-slate-500">{todo.category}</span>
                            {todo.deadline && (
                                <span className="text-xs text-slate-500">
                                    Due: {new Date(todo.deadline).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
