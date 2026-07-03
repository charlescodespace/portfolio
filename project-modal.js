window.addEventListener("DOMContentLoaded", () => {
    const projectDetails = {
        devops: {
            title: "DevOps Failure Prediction & Alerting System",
            image: "assests/devops_project.jpg",
            tag: "DevOps - Cloud Computing",
            location: "REVA University, Bangalore",
            details: `
                <h4>Overview</h4>
                <p>This project uses machine learning to predict failures in CI/CD pipelines and trigger proactive alerts.</p>
                <h4>Features</h4>
                <ul>
                    <li>Automated log collection from Jenkins, GitHub Actions, and Docker</li>
                    <li>Failure pattern detection using ML models</li>
                    <li>Real-time notifications and dashboard visibility</li>
                </ul>
            `
        },
        ipsec: {
            title: "Full Stack IPsec Automation System",
            image: "assests/ipsec_project.jpg",
            tag: "Security - Networking",
            location: "REVA University, Bangalore",
            details: `
                <h4>Overview</h4>
                <p>This system automates IPsec configuration and monitoring through a centralized backend and dashboard.</p>
                <h4>Architecture</h4>
                <ul>
                    <li>Backend: FastAPI + SQLite</li>
                    <li>Client Agent: Python-based polling workflow</li>
                    <li>Frontend: React dashboard</li>
                </ul>
            `
        },
        jobportal: {
            title: "Full Stack Job Portal System",
            image: "assests/job_portal.png",
            tag: "Web App - MERN Stack",
            location: "Personal Project",
            details: `
                <h4>Overview</h4>
                <p>A modern job portal for employers and job seekers with authentication, search, and application tracking.</p>
                <h4>Tech Stack</h4>
                <ul>
                    <li>MongoDB, Express, React, Node.js</li>
                    <li>JWT authentication and REST APIs</li>
                </ul>
            `
        }
    };

    const modal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("project-modal-title");
    const modalImage = document.getElementById("project-modal-image");
    const modalTag = document.getElementById("project-modal-tag");
    const modalLocation = document.getElementById("project-modal-location");
    const modalBody = document.getElementById("project-modal-body");
    const modalClose = document.getElementById("project-modal-close");

    if (!modal || !modalTitle || !modalImage || !modalTag || !modalLocation || !modalBody || !modalClose) {
        return;
    }

    document.querySelectorAll(".project-card").forEach((card, index) => {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            const key = index === 0 ? "devops" : index === 1 ? "ipsec" : "jobportal";
            const details = projectDetails[key];
            if (!details) {
                return;
            }

            modalTitle.innerText = details.title;
            modalImage.src = details.image;
            modalTag.innerText = details.tag;
            modalLocation.innerText = details.location;
            modalBody.innerHTML = details.details;
            modal.classList.add("active");
        });
    });

    const closeModal = () => modal.classList.remove("active");
    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });
});
