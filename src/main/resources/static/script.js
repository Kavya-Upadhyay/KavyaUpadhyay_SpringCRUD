// ===========================
// API Configuration
// ===========================
const API_URL = '/students';

let allStudents = [];
let editingId = null;
let deletingId = null;

// ===========================
// On Page Load
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    fetchStudents();
});

// ===========================
// Fetch All Students
// ===========================
async function fetchStudents() {
    showSkeletonLoading();
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch students');
        allStudents = await response.json();
        renderStudents(allStudents);
        updateStats();
    } catch (error) {
        showToast('Failed to load students. Is the server running?', 'error');
        renderStudents([]);
    }
}

// ===========================
// Render Student Table
// ===========================
function renderStudents(students) {
    const tbody = document.getElementById('studentTableBody');
    const emptyState = document.getElementById('emptyState');
    const table = document.getElementById('studentTable');

    if (students.length === 0) {
        tbody.innerHTML = '';
        table.style.display = 'none';
        emptyState.classList.add('visible');
        return;
    }

    table.style.display = 'table';
    emptyState.classList.remove('visible');

    tbody.innerHTML = students.map((student, index) => `
        <tr style="animation-delay: ${index * 0.05}s">
            <td>#${index + 1}</td>
            <td>
                <span class="student-name">${escapeHtml(student.name)}</span>
            </td>
            <td>
                <span class="student-email">${escapeHtml(student.email)}</span>
            </td>
            <td>
                <span class="course-badge">${escapeHtml(student.course)}</span>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="btn-icon edit" title="Edit student" onclick="editStudent(${student.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="btn-icon delete" title="Delete student" onclick="openDeleteModal(${student.id}, '${escapeHtml(student.name)}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===========================
// Form Submit Handler
// ===========================
async function handleSubmit(event) {
    event.preventDefault();

    const student = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        course: document.getElementById('course').value.trim(),
    };

    if (!student.name || !student.email || !student.course) {
        showToast('Please fill in all fields.', 'error');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;

    try {
        let response;
        if (editingId) {
            // Update existing student
            response = await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student),
            });
            if (!response.ok) throw new Error('Update failed');
            showToast(`${student.name} updated successfully!`, 'success');
        } else {
            // Create new student
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student),
            });
            if (!response.ok) throw new Error('Creation failed');
            showToast(`${student.name} added successfully!`, 'success');
        }

        resetForm();
        await fetchStudents();
    } catch (error) {
        showToast(error.message || 'Something went wrong.', 'error');
    } finally {
        submitBtn.disabled = false;
    }
}

// ===========================
// Edit Student
// ===========================
function editStudent(id) {
    const student = allStudents.find(s => s.id === id);
    if (!student) return;

    editingId = id;
    document.getElementById('studentId').value = id;
    document.getElementById('name').value = student.name;
    document.getElementById('email').value = student.email;
    document.getElementById('course').value = student.course;

    // Update form appearance
    document.getElementById('formTitle').innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Edit Student #${id}
    `;
    document.getElementById('submitBtn').innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
        </svg>
        Save Changes
    `;
    document.getElementById('resetFormBtn').style.display = 'flex';

    // Scroll to form
    document.getElementById('formSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('name').focus();
}

// ===========================
// Reset Form
// ===========================
function resetForm() {
    editingId = null;
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';

    document.getElementById('formTitle').innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        Add New Student
    `;
    document.getElementById('submitBtn').innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Student
    `;
    document.getElementById('resetFormBtn').style.display = 'none';
}

// ===========================
// Delete Modal
// ===========================
function openDeleteModal(id, name) {
    deletingId = id;
    document.getElementById('deleteStudentName').textContent = name;
    document.getElementById('deleteModal').classList.add('active');

    document.getElementById('confirmDeleteBtn').onclick = () => deleteStudent(id);
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deletingId = null;
}

async function deleteStudent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Delete failed');
        showToast('Student deleted successfully.', 'success');
        closeDeleteModal();
        await fetchStudents();
    } catch (error) {
        showToast('Failed to delete student.', 'error');
    }
}

// ===========================
// Search / Filter
// ===========================
function filterStudents() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allStudents.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.course.toLowerCase().includes(query) ||
        String(s.id).includes(query)
    );
    renderStudents(filtered);
}

// ===========================
// Stats
// ===========================
function updateStats() {
    document.getElementById('totalCount').textContent = allStudents.length;
}

// ===========================
// Toast Notifications
// ===========================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');

    const icons = {
        success: `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
        error: `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${icons[type] || ''}<span>${message}</span>`;
    container.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ===========================
// Skeleton Loading
// ===========================
function showSkeletonLoading() {
    const tbody = document.getElementById('studentTableBody');
    const table = document.getElementById('studentTable');
    const emptyState = document.getElementById('emptyState');

    table.style.display = 'table';
    emptyState.classList.remove('visible');

    const skeletonRows = Array(3).fill('').map(() => `
        <tr class="skeleton-row">
            <td><div class="skeleton" style="width:40px"></div></td>
            <td><div class="skeleton" style="width:140px"></div></td>
            <td><div class="skeleton" style="width:180px"></div></td>
            <td><div class="skeleton" style="width:100px"></div></td>
            <td><div class="skeleton" style="width:70px; margin:0 auto"></div></td>
        </tr>
    `).join('');

    tbody.innerHTML = skeletonRows;
}

// ===========================
// Utility: Escape HTML
// ===========================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
