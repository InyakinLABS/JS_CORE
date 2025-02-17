const searchInput = document.getElementById('search');
const suggestionsContainer = document.getElementById('suggestions');
const selectedItemsContainer = document.getElementById('selected-items');

let debounceTimer;
function debounce(func, delay) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}
async function fetchRepositories(query) {
    if (!query) {
        suggestionsContainer.innerHTML = '';
        return;
    }
    if(query.replace(/\s/g, '').length==0){
        return;
    }
    try {
        query=query.replace(/\s/g, '');
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}&sort=stars&per_page=5`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        

        if (data.items && data.items.length > 0) {
            displaySuggestions(data.items);
        } else {
            suggestionsContainer.innerHTML = '<div class="no-results">Нет результатов</div>';
        }
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        suggestionsContainer.innerHTML = '<div class="error">Ошибка при получении данных</div>';
    }
}

function displaySuggestions(repositories) {
    suggestionsContainer.innerHTML = '';
    
    repositories.forEach(repo => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = repo.name;

        suggestionItem.addEventListener('click', () => {
            addItemToSelected(repo); 
            searchInput.value = '';
            suggestionsContainer.innerHTML = '';
        });

        suggestionsContainer.appendChild(suggestionItem);
    });
    
}


function addItemToSelected(repo) {
    const selectedItem = document.createElement('div');
    selectedItem.classList.add('selected-item');
    selectedItem.textContent = `Name: ${repo.name}\nВладелец: ${repo.owner.login}\nЗвезды: ${repo.stargazers_count}`;
    selectedItemsContainer.appendChild(selectedItem);
    const deleteItemBtn=document.createElement('button')
    deleteItemBtn.classList.add('deleteBtn');
    selectedItem.appendChild(deleteItemBtn)
    deleteItemBtn.addEventListener('click',(event)=>{
        console.log(event.target)
        selectedItemsContainer.removeChild(deleteItemBtn.parentElement)
        deleteItemBtn.removeEventListener('click',()=>{})
    })
}

searchInput.addEventListener('keydown', debounce((event) => {
    fetchRepositories(event.target.value);
}, 500));


