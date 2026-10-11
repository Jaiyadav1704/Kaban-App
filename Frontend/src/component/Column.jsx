import TaskCard from "./TaskCard";

function Column({column, columns, tasks, onTaskDeleted, onTaskUpdated, onTaskMoved}) {

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleDrop = (e) => {
        e.preventDefault();

        const taskId = Number(e.dataTransfer.getData("taskId"));
        onTaskMoved(taskId, column.id);
    }
    return(
        <div className="w-full h-full flex flex-col"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        >
            <h2 className="font-bold text-xl mb-4">
                {column.title}
            </h2>

            <div className="space-y-3 flex-1">
                {tasks.map((task) => (
                    <TaskCard 
                    key={task.id} 
                    task={task} 
                    columns = {columns}
                    onTaskDeleted={onTaskDeleted}
                    onTaskUpdated={onTaskUpdated} 
                    onTaskMoved = {onTaskMoved}
                    />
                ))}
            </div>
        </div>
    )
}

export default Column;
