// Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Certificate Modal
function openCertModal(element) {
    const modal = document.getElementById('certModal');
    const title = element.querySelector('p').textContent;
    const issuer = element.querySelector('.cert-issuer').textContent;
    
    document.getElementById('certTitle').textContent = title;
    document.getElementById('certIssuer').textContent = 'Issuer: ' + issuer;
    document.getElementById('certDate').textContent = 'Date: 2024';
    
    modal.classList.add('active');
}

function closeCertModal() {
    document.getElementById('certModal').classList.remove('active');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertModal();
    }
});

// Contact Form
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('formName').value;
    const email = document.getElementById('formEmail').value;
    const subject = document.getElementById('formSubject').value;
    const message = document.getElementById('formMessage').value;
    
    // Validate
    if (!name || !email || !subject || !message) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email', 'error');
        return;
    }
    
    // Mock submission (in production, use EmailJS or a backend service)
    console.log('Form Data:', { name, email, subject, message });
    
    // Show success
    showToast('Message sent successfully!', 'success');
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    // Uncomment below for EmailJS integration:
    // emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
    //     to_email: "alnoman@example.com",
    //     from_name: name,
    //     from_email: email,
    //     subject: subject,
    //     message: message
    // });
});

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    
    if (type === 'error') {
        toast.style.background = '#ff006e';
    } else {
        toast.style.background = '#00d9ff';
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Hobby Zone - Upload & Management
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const worksGallery = document.getElementById('worksGallery');

// Load works from localStorage on page load
loadWorks();

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.background = 'rgba(0, 217, 255, 0.2)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.background = '';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.background = '';
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
});

function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const image = e.target.result;
                document.getElementById('workTitle').value = file.name.replace(/\.[^/.]+$/, '');
                // Store in form for user to add description
                fileInput.dataset.lastImage = image;
            };
            reader.readAsDataURL(file);
        }
    });
}

function addWork() {
    const title = document.getElementById('workTitle').value;
    const description = document.getElementById('workDescription').value;
    const imageData = fileInput.dataset.lastImage;
    
    if (!title || !imageData) {
        showToast('Please select an image and enter a title', 'error');
        return;
    }
    
    const work = {
        id: Date.now(),
        title,
        description,
        image: imageData
    };
    
    // Get existing works from localStorage
    let works = JSON.parse(localStorage.getItem('hobbyWorks')) || [];
    works.push(work);
    localStorage.setItem('hobbyWorks', JSON.stringify(works));
    
    // Reset form
    document.getElementById('workTitle').value = '';
    document.getElementById('workDescription').value = '';
    fileInput.value = '';
    delete fileInput.dataset.lastImage;
    
    showToast('Work added successfully!', 'success');
    loadWorks();
}

function deleteWork(id) {
    let works = JSON.parse(localStorage.getItem('hobbyWorks')) || [];
    works = works.filter(work => work.id !== id);
    localStorage.setItem('hobbyWorks', JSON.stringify(works));
    loadWorks();
    showToast('Work deleted!', 'success');
}

function loadWorks() {
    const works = JSON.parse(localStorage.getItem('hobbyWorks')) || [];
    worksGallery.innerHTML = '';
    
    if (works.length === 0) {
        worksGallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No works uploaded yet. Upload your first work!</p>';
        return;
    }
    
    works.forEach(work => {
        const workElement = document.createElement('div');
        workElement.className = 'work-item';
        workElement.innerHTML = `
            <img src="${work.image}" alt="${work.title}" class="work-image">
            <div class="work-info">
                <div class="work-title">${work.title}</div>
                <div class="work-description">${work.description}</div>
            </div>
            <button class="work-delete" onclick="deleteWork(${work.id})">✕</button>
        `;
        worksGallery.appendChild(workElement);
    });
}

// Download CV
function downloadCV() {
    // Create a simple text file as CV placeholder
    const cvContent = `
AL NOMAN ROBIN - CURRICULUM VITAE

CONTACT INFORMATION
Email: alnoman@example.com
Phone: +880 1234 567890
Location: Dhaka, Bangladesh

EDUCATION
Bachelor of Science - XYZ University (2023)
GPA: 3.75/4.0

SKILLS
Frontend: React, JavaScript, TailwindCSS, HTML/CSS
Backend: Node.js, Python, MongoDB
Tools: Git, VS Code, Figma, AWS
Robotics & AI: ROS, TensorFlow, OpenCV, Arduino

ACHIEVEMENTS
- Winner, Robotics Hackathon 2024
- Top 10, UI Design Challenge 2023
- Published Research Paper on AI-driven Robotics (2023)

PROJECTS
1. Autonomous Navigation Robot
2. Interactive Portfolio
3. AI Image Classification

CERTIFICATIONS
- React Certification (Udemy)
- Python for AI (Coursera)
- Web Design (LinkedIn Learning)
- Robotics Basics (edX)
    `;
    
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AL_Noman_Robin_CV.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showToast('CV downloaded!', 'success');
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    observer.observe(section);
});

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

console.log('Portfolio loaded successfully! Replace content as needed.');