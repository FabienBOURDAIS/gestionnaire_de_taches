let selectedTask = undefined
const HIGH_PRIORITY = 2
const MEDIUM_PRIORITY =1
const LOW_PRIORITY = 0
const filterPriorityInputs = document.querySelectorAll('input[name="filterPriority"]');
let taskList = loadTasksFromLocalStorage();
paint()

// Fonction d'initialisation du tableau des tâches :
function initTasksList () {
    return []
}

// Fonction de création et d'ajout d'une tâche :

function createTask (title, date, description, priority) {
    const task = {
        id: taskList.length + 1,
        title: title,
        description: description,
        date: date,
        priority: priority,
        status: false
    }
    addTask(task)
    // console.log(task)
}

function addTask (taskToAdd) {
    taskList.push(taskToAdd)

    saveToLocalStorage() //Permet de sauvegarder chaque liste créées dans le local storage
    paint(taskList)
    // console.log(taskToAdd)
}

// Fonction qui supprime une tâche de la liste :

function removeTask (taskIdToRemove) {
    
    if(confirm("Êtes vous sûr de vouloir supprimer cette tâches ?"))
    taskList = taskList.filter((task) => taskIdToRemove !== task.id)
    saveToLocalStorage()
    paint()
    clearInputs()
    
}

// Fonction qui permet de changer le statut de la tâche :

function toggleTaskStatus(taskId) {
    const task = taskList.find(task => task.id === taskId)
    if (task) {
        task.status = !task.status
        // console.log(task.status)
        saveToLocalStorage()
        paint()
    }
}

// Fonction qui modifie une tâche de la liste :
function selectTask (task) {
    let editTask = document.getElementById("titleTask")
    editTask.value = task.title

    let editDateTask = document.getElementById("echeanceTask")
    editDateTask.value = task.date

    let editDescriptionTask=document.getElementById("descriptionTask")
    editDescriptionTask.value = task.description

    let editBtn = document.getElementById("buttonAddTaskToList")
    editBtn.innerText = "Modifier la tâche"

    let editPriority = task.priority
    if(editPriority === HIGH_PRIORITY) {
        document.getElementById("priorityElevée").checked = true
    } else if (task.priority === MEDIUM_PRIORITY) {
        document.getElementById("priorityMoyenne").checked = true
    
    } else {
        document.getElementById("priorityFaible").checked = true
    }

    selectedTask = task
    // console.log(selectedTask)   
}

function editTask (inputValue,task, date, descriptionValue, editedPriority) {
    task.title = inputValue
    task.date = date
    task.description = descriptionValue
    task.priority = editedPriority
    
    // console.table(task)
    selectedTask = undefined; 

    saveToLocalStorage() 
    paint() 
}

// Réinitialiser le bouton et l'input après modification
function clearInputs (){
    let editBtn = document.getElementById("buttonAddTaskToList");
    editBtn.innerText = "Ajouter une tâche";
    document.getElementById("titleTask").value = ""
    document.getElementById("echeanceTask").value = ""
    document.getElementById("descriptionTask").value =""

    let clearSelectedPriority = document.querySelector('input[name="priority"]:checked')
    if(clearSelectedPriority){
       clearSelectedPriority.checked = false 
    }

    selectedTask = undefined
}


// Fonction pour formater la date :
function formatDate (dateString) {
    const [year, month, day] = dateString.split('-')
    return `${day}-${month}-${year}`
}

// Fonction pour vérifier si l'input radio est sélectionné et récupérer sa valeur :
function getPriority (){
    const selectedPriority = document.querySelector('input[name="priority"]:checked')
    if (selectedPriority) {
        console.log("Priorité sélectionnée :", selectedPriority.value)
        return parseInt(selectedPriority.value)
    } else {
        return undefined
    }
}

// Fonction qui permet de sauvegarder la liste :
function saveToLocalStorage(){
    try {
        localStorage.setItem("taskList", JSON.stringify(taskList))

    } catch(error) {
        console.error("erreur lors de la sauvegarde",error)
        alert("impossible de sauvegarder les tâches")
    };
}
// Fonction qui permet de récupérer la liste dans le localStorage :
function loadTasksFromLocalStorage(){
    const existedTasks = localStorage.getItem("taskList")
    console.log(existedTasks)
    return existedTasks ? JSON.parse(existedTasks) : initTasksList()
}


// Fonction de filtrage:
function filterTasks(taskList) {
    const selectedPriority = document.querySelector('input[name="filterPriority"]:checked');
    const priorityFilter = selectedPriority ? selectedPriority.value : 'all';
    
    return taskList.filter(task => {
        if (priorityFilter !== 'all' && task.priority !== parseInt(priorityFilter)) {
            return false;
        }
        return true;
    });
}

// Ajouter l'event listener
document.getElementById('priorityFilter').addEventListener('change', paint);


// Fonction d'ajout des tâches dans le DOM :

function paint() {
    
    // Récupération de la valeur du filtre :
    const priorityFilter = document.getElementById('priorityFilter').value
    const statusFilter = document.getElementById('statusFilter').value

    let filteredTasks = taskList

    // Mise en place du filtrage par priorité :
    if (priorityFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.priority === parseInt(priorityFilter))
    }

    // Mise en place du filtrage par statut :
    if (statusFilter === 'active') {
        filteredTasks = filteredTasks.filter (task => !task.status)
    } else if (statusFilter === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.status)
    }

    console.log(filteredTasks)

    // Création des taches dans le DOM :

    let list = document.getElementById("taskList")
    list.innerHTML = "";
    for (const task of filteredTasks) {
        let li = document.createElement ('li')
        li.className ="cardTask"
        
        if(task.status) {
            li.classList.add("taskTerminated")
        }

        li.addEventListener("click", function(e){
            // console.log("click")
            selectTask(task)
        })

        let cardTitle = document.createElement('span')
        cardTitle.className = "cardElement"
        cardTitle.innerText = `Titre : ${task.title}`
        li.appendChild(cardTitle)

        let inputdescription = document.createElement('span')
        inputdescription.className = "cardElement"
        inputdescription.innerText = `Descritpion : ${task.description}`
        li.appendChild(inputdescription)

        let inputDate = document.createElement('span')
        inputDate.className = "cardElement"
        inputDate.innerText = `Echéance : ${formatDate(task.date)}`
        li.appendChild(inputDate)

        let priority = document.createElement('span')
        priority.className = "cardElement"
        
        if(task.priority === HIGH_PRIORITY) {
            priority.innerText = "Priorité : Elevé"
            li.classList.add("high-priority")
        } else if (task.priority === MEDIUM_PRIORITY) {
            priority.innerText = "Priorité : Moyenne"
            li.classList.add("medium-priority")
        } else {
            priority.innerText = "Priorité : Faible"
            li.classList.add("low-priority")
        }

        li.appendChild(priority)

        let cardButton = document.createElement('div')
        cardButton.className = "taskBtn"
        li.appendChild(cardButton)

        let terminatedBtn = document.createElement('button')
        terminatedBtn.className = "material-icons"
        terminatedBtn.innerText = "check"
        terminatedBtn.addEventListener("click",function(e){
            e.stopPropagation()
            console.log("click")
            toggleTaskStatus(task.id)
        })
        cardButton.appendChild(terminatedBtn)
        
        // Ajout du bouton de suppression :


        let removeBtn = document.createElement('button')
        removeBtn.className = "material-icons"
        removeBtn.innerText = "delete"
        cardButton.appendChild(removeBtn)
        removeBtn.addEventListener("click", function(e){
            e.stopPropagation()
            removeTask(task.id)
        })
    
        list.appendChild(li)
    }
   clearInputs()
}




const clickToAddTask = document.getElementById("buttonAddTaskToList")
clickToAddTask.addEventListener("click", function (e) {
    const inputElement = document.getElementById("titleTask")
    const date = document.getElementById("echeanceTask").value
    const descriptionElement = document.getElementById("descriptionTask")
    if (inputElement.value !== "") {
        const priority = getPriority()
        if (priority === undefined) {
            alert("Merci de définir une priorité")
            return
        }
        if (selectedTask !== undefined) {
            editTask(inputElement.value, selectedTask, date, descriptionElement.value, priority)
        } else {
            createTask(inputElement.value, date, descriptionElement.value, priority)
            
        }
        inputElement.value = ""
        descriptionElement.value =""
    } else {
        alert("Merci de saisir un titre")
    }
    // console.log(input)
});


document.getElementById("priorityFilter").addEventListener("change", paint);
document.getElementById("statusFilter").addEventListener("change", paint);


paint();



