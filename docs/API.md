## ⚙️ API

### `schedule(task[, options])`

The `schedule()` method adds a task to the schedule. Rafael then runs all tasks on the schedule loop. *Returns* the task's ID.

#### Parameters

* `task` `{Function}` The function to be run.
* `options` `{Object?}` An object of [options](#-options).





### `unschedule(taskID)`

The `unschedule()` method removes a task from the schedule.

#### Parameters

* `taskID` `{String}` The ID of the task to be removed from the schedule. This will completely remove the task from the schedule and it cannot be restarted. If the task needs to be restartable, see [`pause()`](#pausetaskid).

#### Returns
- `{Boolean}` Indicates whether or not the task was successfully removed from the schedule.





### `pause([taskID])`

The `pause()` method pauses a task without removing it from the schedule. The task can be restarted with [`start()`](#start).

#### Parameters

* `taskID` `{String?}` The ID of the task to be paused. If not set, all tasks will be paused.





### `start([taskID])`

The `start()` method restarts a paused task.

#### Parameters

* `taskID` `String` The ID of the task to be started. If not set, all paused tasks will be restarted.





### `clear()`

Removes all tasks from the rafael.





## 🔧 Options

The `options` object can include the following properties:

```javascript
{
	/*
	 * The context to be used when running the task. Can be accessed via `this` within the task.
	 * @type `Object`
	 */
	context: undefined,

	/*
	 * The speed at which the task should run in frames per second. Max is 60.
	 * @type `Number`
	 */
	framerate: 60,

	/*
	 * A unique identifier for accessing the task in the schedule. If an ID is not passed then one will be generated automatically.
	 * @type `String`
	 */
	id: ,

	/*
	 * Whether or not the task should be paused on creation. If `true`, task can be started with `start()`.
	 * @type `Boolean`
	 */
	isPaused: false,
}
```
