
const taskFormEl= $('#taskForm');
const taskNameEl= $('#taskName');
const taskDescriptionEl = $('#taskDescription');
const taskStatusEl = $('#taskStatus');
const taskDateInputEl = $('#taskDueDate');

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;


// Todo: create a function to generate a unique task id

    function generateTaskId() {
        if (!nextId) {
          nextId = 1;
        } else {
          nextId++;
        }
        // Ritu- saving it to the local storage
        localStorage.setItem("nextId", JSON.stringify(nextId));
        return nextId;
      }


// Todo: create a function to create a task card

  function createTaskCard(task) {
    const taskCard = $('<div>')
      .addClass('card project-card draggable my-3')
      .attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>')
      .addClass('btn btn-danger delete')
      .text('Delete')
      .attr('data-task-id', task.id)
      .on('click', handleDeleteTask); 
  
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);
  
    // Append the task card to the DOM
    // $('#todo-cards').append(taskCard); 
    console.log(taskCard);
    return taskCard;
  }

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  // ? Loop through projects and create project cards for each status
  for (let task of taskList) {
    if (task.status === 'to-do') {
      todoList.append(createTaskCard(task));
    } else if (task.status === 'in-progress') {
      inProgressList.append(createTaskCard(task));
    } else if (task.status === 'done') {
      doneList.append(createTaskCard(task));
    }
  }
   // ? Use JQuery UI to make task cards draggable
   $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    
    helper: function (e) {
      
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
     
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}


// Todo: create a function to handle adding a new task
function handleAddTask(event){
  event.preventDefault();
  const taskName = taskNameEl.val().trim();
  const taskType = taskDescriptionEl.val(); // don't need to trim select input
  const taskDate = taskDateInputEl.val(); // yyyy-mm-dd format
 
  const newTask = {
  name: taskName,
  type: taskType,
  date: taskDate,
  status:"to do",

 };
console.log(newTask);
console.log(taskList);
 taskList.push(newTask);

 localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();
  taskNameEl.val("");
  taskDescriptionEl.val("");
  taskDateInputEl.val("");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
  
    const taskId = $(this).attr('data-task-id');

  taskList = taskList.filter(task => task.id!== taskId);

  localStorage.setItem('tasks', JSON.stringify(taskList));

  // Remove the task card from the DOM
  $(`[data-task-id="${taskId}"]`).remove();

  renderTaskList();
   
  
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  
    // ? Read task from localStorage
   
  
    // ? Get the task id from the event
    const taskId = ui.draggable[0].dataset.taskId;
  
    // ? Get the id of the lane that the card was dropped into
    const newStatus = event.target.id;
  
    for (let task of taskList) {
      
      if (task.id === taskId) {
        task.status = newStatus;
      }
    }
    // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
    localStorage.setItem('projects', JSON.stringify(taskList));
    renderTaskList();
  }


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  $('#taskDueDate').datepicker({
    changeMonth: true,
    changeYear: true,
  });
  $("#taskForm").on('submit', handleAddTask);

  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });

});
