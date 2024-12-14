// O'zgaruvchilar
const COLORS_COUNT = 8;
let colors = [];
const colorsGrid = document.getElementById('colorsGrid');
const toast = document.getElementById('toast');
let toastTimeout;

// Random rang generatsiya qilish
function generateRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

// Ranglarni generatsiya qilish
function generateColors() {
    colors = colors.length === 0 
        ? Array(COLORS_COUNT).fill().map(() => ({
            hex: generateRandomColor(),
            locked: false
        }))
        : colors.map(color => ({
            hex: color.locked ? color.hex : generateRandomColor(),
            locked: color.locked
        }));
    
    renderColors();
}

// HTML ni xavfsiz tarzda yaratish
function sanitizeHexColor(hex) {
    return /^#[0-9A-F]{6}$/i.test(hex) ? hex : '#000000';
}

function createColorCard(color, index) {
    const div = document.createElement('div');
    div.className = 'color-card';
    
    const sanitizedHex = sanitizeHexColor(color.hex);
    
    div.innerHTML = `
        <div class="color-preview" style="background-color: ${sanitizedHex}">
            <div class="overlay">
                <button class="btn" data-action="copy" data-color="${sanitizedHex}">
                    <i class='bx bx-copy-alt' ></i>
                </button>
                <button class="btn" data-action="lock" data-index="${index}">
                    <i class='bx ${color.locked ? "bx-lock-alt" : "bx-lock-open-alt"}'></i>
                </button>
            </div>
        </div>
        <div class="color-info">
            <span class="color-hex">${sanitizedHex}</span>
        </div>
    `;
    
    return div;
}

// Ranglarni ekranga chizish
function renderColors() {
    const fragment = document.createDocumentFragment();
    colors.forEach((color, index) => {
        fragment.appendChild(createColorCard(color, index));
    });
    
    colorsGrid.innerHTML = '';
    colorsGrid.appendChild(fragment);
}

// Rangni nusxalash
async function copyToClipboard(hex) {
    try {
        await navigator.clipboard.writeText(hex);
        showToast('Rang nusxalandi!');
    } catch (err) {
        showToast('Nusxalashda xatolik yuz berdi');
        console.error('Clipboard error:', err);
    }
}

// Toast xabarni ko'rsatish
function showToast(message) {
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Event delegation orqali hodisalarni boshqarish
colorsGrid.addEventListener('click', (e) => {
    const button = e.target.closest('.btn');
    if (!button) return;
    
    const action = button.dataset.action;
    
    if (action === 'copy') {
        copyToClipboard(button.dataset.color);
    } else if (action === 'lock') {
        const index = parseInt(button.dataset.index);
        if (!isNaN(index) && index >= 0 && index < colors.length) {
            colors[index].locked = !colors[index].locked;
            renderColors();
        }
    }
});

// Space tugmasi uchun event listener
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        generateColors();
    }
});

// Dastlabki ranglarni generatsiya qilish
generateColors();