const todoList = document.getElementById('todo-list');
const btnAddInline = document.getElementById('btn-add-inline');
const tabTodo = document.getElementById('tab-todo');
const tabDone = document.getElementById('tab-done');
const searchInput = document.getElementById('search-input'); // Ambil elemen search

let activeTab = 'todo';

function getTodayString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// LOGIKA FILTER GABUNGAN: TAB + SEARCH
function filterTasks() {
    const searchQuery = searchInput.value.toLowerCase().trim();
    const items = todoList.querySelectorAll('li');

    items.forEach(function(li) {
        const isDone = li.classList.contains('selesai');
        const spanTeks = li.querySelector('.teks-tugas');
        const inputInline = li.querySelector('.input-inline');

        // Ambil teks tugas (dari span atau input inline yang sedang diketik)
        let teksTugas = '';
        if (spanTeks) {
            teksTugas = spanTeks.textContent.toLowerCase();
        } else if (inputInline) {
            teksTugas = inputInline.value.toLowerCase();
        }

        // Cek filter Tab & filter Kata Kunci Pencarian
        const cocokTab = (activeTab === 'todo') ? !isDone : isDone;
        const cocokSearch = teksTugas.includes(searchQuery);

        // Tampilkan hanya jika COCOK KEDUA-DUANYA
        if (cocokTab && cocokSearch) {
            li.style.display = 'flex';
        } else {
            li.style.display = 'none';
        }
    });
}

// EVENT LISTENER SEARCH INPUT (Berjalan otomatis saat ngetik)
searchInput.addEventListener('input', filterTasks);

// EVENT TABS
tabTodo.addEventListener('click', function() {
    activeTab = 'todo';
    tabTodo.classList.add('active');
    tabDone.classList.remove('active');
    filterTasks();
});

tabDone.addEventListener('click', function() {
    activeTab = 'done';
    tabDone.classList.add('active');
    tabTodo.classList.remove('active');
    filterTasks();
});

// MEMBUAT TUGAS INLINE
btnAddInline.addEventListener('click', function() {
    if (activeTab === 'done') {
        tabTodo.click();
    }

    const li = document.createElement('li');
    const todayStr = getTodayString();

    li.innerHTML = `
        <input type="checkbox" class="check-selesai">
        <input type="text" class="input-inline" placeholder="Ketikkan tugas anda disini :3 ">
        <input type="date" class="input-due-date" value="${todayStr}">
        <div class="aksi-container">
            <button class="btn-naik" title="Naikkan">▲</button>
            <button class="btn-turun" title="Turunkan">▼</button>
            <button class="btn-edit">Edit</button>
            <button class="btn-hapus">Hapus</button>
        </div>
    `;

    todoList.appendChild(li);

    const inputInline = li.querySelector('.input-inline');
    inputInline.focus();

    function commitTask() {
        const teks = inputInline.value.trim();
        if (teks === '') {
            li.remove();
        } else {
            const spanTeks = document.createElement('span');
            spanTeks.className = 'teks-tugas';
            spanTeks.textContent = teks;
            inputInline.replaceWith(spanTeks);
        }
    }

    inputInline.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            commitTask();
        }
    });

    inputInline.addEventListener('blur', function() {
        commitTask();
    });

    pasangListenerBaris(li);
});

function pasangListenerBaris(li) {
    const check = li.querySelector('.check-selesai');
    check.addEventListener('change', function() {
        if (check.checked) {
            li.classList.add('selesai');
        } else {
            li.classList.remove('selesai');
        }
        filterTasks();
    });

    const btnEdit = li.querySelector('.btn-edit');
    btnEdit.addEventListener('click', function() {
        const spanTeks = li.querySelector('.teks-tugas');
        if (!spanTeks) return;

        const teksLama = spanTeks.textContent;
        const teksBaru = prompt('Edit nama tugas:', teksLama);

        if (teksBaru !== null && teksBaru.trim() !== '') {
            spanTeks.textContent = teksBaru.trim();
            filterTasks(); // Re-filter kalau kata kuncinya berubah
        } else if (teksBaru !== null && teksBaru.trim() === '') {
            alert('Teks tugas tidak boleh kosong!');
        }
    });

    const btnNaik = li.querySelector('.btn-naik');
    btnNaik.addEventListener('click', function() {
        if (li.previousElementSibling) {
            todoList.insertBefore(li, li.previousElementSibling);
        }
    });

    const btnTurun = li.querySelector('.btn-turun');
    btnTurun.addEventListener('click', function() {
        if (li.nextElementSibling) {
            todoList.insertBefore(li.nextElementSibling, li);
        }
    });

    const btnHapus = li.querySelector('.btn-hapus');
    btnHapus.addEventListener('click', function() {
        li.remove();
    });
}