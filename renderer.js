const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');
const searchInput = document.getElementById('search');
const submitBtn = document.getElementById('submitBtn');

const nameInput = document.getElementById('name');
const rollInput = document.getElementById('roll');
const departmentInput = document.getElementById('department');
const emailInput = document.getElementById('email');

let students = [];
let editingId = null;

// Load students
async function loadStudents() {
    students = await window.studentAPI.getStudents();
    displayStudents(students);
}

// Display students
function displayStudents(data) {
    studentList.innerHTML = '';

    data.forEach(student => {
        const row = document.createElement('tr');

        const values = [
            student.name,
            student.roll,
            student.department,
            student.email || ''
        ];

        values.forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement('td');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.style.marginRight = '5px';

        editBtn.addEventListener('click', () => {
            editStudent(student.id);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.background = '#dc2626';

        deleteBtn.addEventListener('click', () => {
            deleteStudent(student.id);
        });

        actionCell.append(editBtn, deleteBtn);
        row.appendChild(actionCell);

        studentList.appendChild(row);
    });
}

// Add or Update student
studentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const student = {
        name: nameInput.value.trim(),
        roll: rollInput.value.trim(),
        department: departmentInput.value.trim(),
        email: emailInput.value.trim()
    };

    if (!student.name || !student.roll || !student.department) {
        alert('Please fill in all required fields.');
        return;
    }

    if (editingId) {
        student.id = editingId;
        students = await window.studentAPI.updateStudent(student);
        editingId = null;
        submitBtn.textContent = 'Add Student';
    } else {
        students = await window.studentAPI.addStudent(student);
    }

    studentForm.reset();
    displayStudents(students);
});

// Edit student
function editStudent(id) {
    const student = students.find(item => item.id === id);

    if (!student) return;

    nameInput.value = student.name;
    rollInput.value = student.roll;
    departmentInput.value = student.department;
    emailInput.value = student.email || '';

    editingId = id;
    submitBtn.textContent = 'Update Student';
}

// Delete student
async function deleteStudent(id) {
    const confirmDelete = confirm('Are you sure you want to delete this student?');

    if (!confirmDelete) return;

    students = await window.studentAPI.deleteStudent(id);
    displayStudents(students);
}

// Search student
searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchValue) ||
        student.roll.toLowerCase().includes(searchValue) ||
        student.department.toLowerCase().includes(searchValue)
    );

    displayStudents(filteredStudents);
});

// Initial load
loadStudents();