## API

### `schedule(task[, options])`

The `schedule()` method adds a task to the schedule. Rafael then runs all tasks on the schedule loop. *Returns* the task's ID.

| Parameter						| Type				| Required 	| Default		| Description |
|---------------------|-------------|-----------|-----------|-------------|
| `task` 							| `Function`	| `true` 		| 					|	The function to be run. |
| `options` 					| `false` 		| `false` 	| `{}`			|	A dictionary of options to be used for the task. |
| `options.context`		| `Object`		| `false` 	| `window`	| The context to be used when running the task. Can be accessed via `this` within the task. |
| `options.framerate`	| `Number`		| `false` 	| `60`			| The speed at which the task should run in frames per second. Max is 60. |
| `options.id`				| `String`		| `false` 	| 					|	A unique identifier for accessing the task in the schedule. If an ID is not passed then one will be generated automatically. |
| `options.isPaused`	| `Boolean`		| `false` 	| `false`		| Whether or not the task should be paused on creation. If `true`, task can be started with [`start()`](#start). |





### `unschedule(taskID)`

The `unschedule()` method removes a task from the schedule. *Returns* a `boolean` indicating whether or not the task was successfully unscheduled.

| Parameter	| Type			| Required 	| Default		| Description |
|-----------|-----------|-----------|-----------|-------------|
| `taskID`	| `String`	|	`true`		|						| The ID of the task to be removed from the schedule. This will completely remove the task from the schedule and it cannot be restarted. If the task needs to be restartable, see [`pause()`](#pausetaskid). |





### `pause([taskID])`

The `pause()` method pauses a task without removing it from the schedule. The task can be restarted with [`start()`](#start).

| Parameter	| Type			| Required 	| Default		| Description |
|-----------|-----------|-----------|-----------|-------------|
| `taskID`	| `String`	|	`false` 	|						| The ID of the task to be paused. If no `taskID` is set, the all tasks will be paused. |





### `start([taskID])`

The `start()` method restarts a paused task.

| Parameter	| Type			| Required 	| Default		| Description |
|-----------|-----------|-----------|-----------|-------------|
| `taskID`	| `String`	|	`false`		|						| The ID of the task to be started. If no `taskID` is set, all paused tasks will be restarted. |





### `clear()`

Removes all tasks from the rafael.
