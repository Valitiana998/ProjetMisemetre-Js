document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transactionForm');
    const typeOptions = document.querySelectorAll('.type-option');
    const transactionTypeInput = document.getElementById('transactionType');
    const recurringCheckbox = document.getElementById('recurring');
    const frequencySection = document.getElementById('frequencySection');
    const tagInput = document.getElementById('tagInput');
    const tagsList = document.getElementById('tagsList');
    
    let tags = [];
    typeOptions.forEach(option => {
        option.addEventListener('click', () => {
            typeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            transactionTypeInput.value = option.getAttribute('data-type');
        });
    });

   
    recurringCheckbox.addEventListener('change', () => {
        frequencySection.style.display = recurringCheckbox.checked ? 'block' : 'none';
    });


    tagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tagValue = tagInput.value.trim();
            if (tagValue && !tags.includes(tagValue)) {
                tags.push(tagValue);
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag';
                tagSpan.innerHTML = `${tagValue} <button type="button" onclick="removeTag('${tagValue}')">x</button>`;
                tagsList.appendChild(tagSpan);
                tagInput.value = '';
            }
        }
    });

  
    window.removeTag = (tag) => {
        tags = tags.filter(t => t !== tag);
        renderTags();
    };

    function renderTags() {
        tagsList.innerHTML = '';
        tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.innerHTML = `${tag} <button type="button" onclick="removeTag('${tag}')">x</button>`;
            tagsList.appendChild(tagSpan);
        });
    }

  
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            id: Date.now(), 
            type: transactionTypeInput.value,
            category: document.getElementById('category').value,
            amount: parseFloat(document.getElementById('amount').value),
            date: document.getElementById('date').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            description: document.getElementById('description').value,
            recurring: recurringCheckbox.checked,
            frequency: recurringCheckbox.checked ? document.getElementById('frequency').value : null,
            tags: tags
        };

        
        const existingTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
        
       
        existingTransactions.push(formData);

        
        localStorage.setItem('transactions', JSON.stringify(existingTransactions));

        alert('Transaction enregistrée avec succès !');
        form.reset();
        tags = [];
        renderTags();
       
    });
});