// Mengambil elemen dari DOM
const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoDate = document.getElementById('todo-date');
const todoTableBody = document.getElementById('todo-list-body');
const noTaskMessage = document.getElementById('no-task-message');
const btnHapusSemua = document.getElementById('btn-hapus-semua');
const statusFilter = document.getElementById('status-filter');

let todos = []; // Array utama penyimpan data

//Fungsi Utama untuk Menampilkan Data
function renderTodos(dataToRender = todos) {
    todoTableBody.innerHTML = '';

    if (dataToRender.length === 0) {
        noTaskMessage.style.display = 'block';
    } else {
        noTaskMessage.style.display = 'none';
        
        dataToRender.forEach((item) => {
            const row = document.createElement('tr');
            row.className = "border-t border-emerald-400/10 hover:bg-emerald-800/30 transition-colors";
            
            const isDone = item.status === 'Sudah Dikerjakan';
            const statusColor = isDone ? 'bg-emerald-500 text-white' : 'bg-yellow-500/20 text-yellow-300';

            row.innerHTML = `
                <td class="p-4 ${isDone ? 'line-through opacity-50 italic' : ''}">${item.task}</td>
                <td class="p-4 text-center">${item.date}</td>
                <td class="p-4 text-center">
                    <button onclick="toggleStatus('${item.id}')" class="${statusColor} px-2 py-1 rounded text-xs italic cursor-pointer transition-all border border-transparent hover:border-white/50">
                        ${item.status}
                    </button>
                </td>
                <td class="p-4 text-center">
                    <button onclick="deleteTodo('${item.id}')" class="bg-red-500/80 hover:bg-red-600 text-white px-3 py-1 rounded text-xs cursor-pointer transition-all">
                        Hapus
                    </button>
                </td>
            `;
            todoTableBody.appendChild(row);
        });
    }
}

// Fungsi Filter Berdasarkan Status
function applyFilter() {
    const filterValue = statusFilter.value;
    if (filterValue === 'Semua') {
        renderTodos(todos);
    } else {
        const filtered = todos.filter(t => t.status === filterValue);
        renderTodos(filtered);
    }
}

// Menambahkan Tugas Baru
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!todoInput.value.trim() || !todoDate.value) return alert('Lengkapi Nama Tugas dan Tanggal!');

    const newTodo = {
        id: Date.now().toString(), // Menggunakan timestamp sebagai ID unik
        task: todoInput.value,
        date: todoDate.value,
        status: 'Belum Dikerjakan'
    };

    todos.push(newTodo);
    applyFilter(); // Panggil filter agar tampilan tetap sinkron
    todoForm.reset();
});

// Mendaftarkan Fungsi Global untuk Event 'onclick' di HTML
window.toggleStatus = function(id) {
    todos = todos.map(t => {
        if (t.id === id) {
            t.status = t.status === 'Belum Dikerjakan' ? 'Sudah Dikerjakan' : 'Belum Dikerjakan';
        }
        return t;
    });
    applyFilter();
};

window.deleteTodo = function(id) {
    if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
        todos = todos.filter(t => t.id !== id);
        applyFilter();
    }
};

// Fitur Hapus Semua
btnHapusSemua.addEventListener('click', () => {
    if (todos.length === 0) return alert('Daftar tugas masih kosong!');
    if (confirm('Hapus semua tugas secara permanen?')) {
        todos = [];
        renderTodos();
    }
});

// Listener untuk Perubahan Dropdown Filter
statusFilter.addEventListener('change', applyFilter);