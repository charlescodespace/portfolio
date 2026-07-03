document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("js-enhanced");

    const hasGsap = typeof window.gsap !== "undefined";
    const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";
    const hasThree = typeof window.THREE !== "undefined";

    if (hasGsap && hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const setupBackgroundNetwork = () => {
        if (!hasThree) {
            return;
        }

        const canvas = document.getElementById("bg-canvas");
        if (!canvas) {
            return;
        }

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 34;

        const nodes = [];
        const positions = [];
        const pointGeometry = new THREE.BufferGeometry();
        const nodeCount = 42;

        for (let index = 0; index < nodeCount; index += 1) {
            const node = new THREE.Vector3(
                (Math.random() - 0.5) * 34,
                (Math.random() - 0.5) * 22,
                (Math.random() - 0.5) * 16
            );
            nodes.push(node);
            positions.push(node.x, node.y, node.z);
        }

        pointGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        const points = new THREE.Points(
            pointGeometry,
            new THREE.PointsMaterial({
                color: 0xd9dde3,
                size: 0.18,
                transparent: true,
                opacity: 0.9
            })
        );
        scene.add(points);

        const linkPositions = [];
        for (let a = 0; a < nodes.length; a += 1) {
            for (let b = a + 1; b < nodes.length; b += 1) {
                if (nodes[a].distanceTo(nodes[b]) < 9.6) {
                    linkPositions.push(
                        nodes[a].x, nodes[a].y, nodes[a].z,
                        nodes[b].x, nodes[b].y, nodes[b].z
                    );
                }
            }
        }

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linkPositions, 3));
        const lines = new THREE.LineSegments(
            lineGeometry,
            new THREE.LineBasicMaterial({
                color: 0x8c919a,
                transparent: true,
                opacity: 0.22
            })
        );
        scene.add(lines);

        const resize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight, false);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };

        resize();
        window.addEventListener("resize", resize);

        const pointer = { x: 0, y: 0 };
        window.addEventListener("mousemove", (event) => {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
        });

        const animate = () => {
            points.rotation.y += 0.0012;
            lines.rotation.y += 0.001;
            points.rotation.x += (pointer.y * 0.12 - points.rotation.x) * 0.04;
            lines.rotation.x += (pointer.y * 0.08 - lines.rotation.x) * 0.04;
            points.rotation.z += (pointer.x * 0.06 - points.rotation.z) * 0.04;
            lines.rotation.z += (pointer.x * 0.03 - lines.rotation.z) * 0.035;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();
    };

    const setupNetworkCanvas = (canvasId, nodes, links) => {
        if (!hasThree) {
            return;
        }

        const canvas = document.getElementById(canvasId);
        if (!canvas || !canvas.parentElement) {
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });

        const resize = () => {
            const { offsetWidth, offsetHeight } = canvas.parentElement;
            if (!offsetWidth || !offsetHeight) {
                return;
            }

            renderer.setSize(offsetWidth, offsetHeight, false);
            camera.aspect = offsetWidth / offsetHeight;
            camera.updateProjectionMatrix();
        };

        resize();
        window.addEventListener("resize", resize);
        camera.position.z = 22;

        nodes.forEach((node, index) => {
            const geometry = new THREE.SphereGeometry(index === 0 ? 0.7 : 0.5, 24, 24);
            const material = new THREE.MeshBasicMaterial({
                color: index === 0 ? 0xc6c9cf : 0xf0f2f5
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(node.x, node.y, node.z);
            scene.add(sphere);
        });

        links.forEach(([a, b]) => {
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(nodes[a].x, nodes[a].y, nodes[a].z),
                new THREE.Vector3(nodes[b].x, nodes[b].y, nodes[b].z)
            ]);
            const material = new THREE.LineBasicMaterial({ color: 0x8c919a });
            scene.add(new THREE.Line(geometry, material));
        });

        const animate = () => {
            scene.rotation.y += 0.0042;
            scene.rotation.x = Math.sin(Date.now() * 0.00055) * 0.12;
            scene.rotation.z = Math.cos(Date.now() * 0.00035) * 0.03;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();
    };

    setupBackgroundNetwork();

    setupNetworkCanvas("network-3d-projects", [
        { x: 0, y: 0, z: 0 },
        { x: 6, y: 2, z: 0 },
        { x: -6, y: 2, z: 0 },
        { x: 3, y: -5, z: 0 },
        { x: -3, y: -5, z: 0 },
        { x: 0, y: 5, z: 0 },
        { x: 8, y: -3, z: 0 },
        { x: -8, y: -3, z: 0 },
        { x: 0, y: -8, z: 0 }
    ], [
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 5], [2, 5], [3, 4], [3, 6], [4, 7], [6, 8], [7, 8]
    ]);

    setupNetworkCanvas("network-3d", [
        { x: 0, y: 0, z: 0 },
        { x: 6, y: 2, z: 0 },
        { x: -6, y: 2, z: 0 },
        { x: 3, y: -5, z: 0 },
        { x: -3, y: -5, z: 0 },
        { x: 0, y: 5, z: 0 }
    ], [
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 5], [2, 5], [3, 4]
    ]);

    setupNetworkCanvas("network-hero", [
        { x: 0, y: 0, z: 0 },
        { x: 7, y: 3, z: -1 },
        { x: -7, y: 3, z: 1 },
        { x: 5, y: -4, z: 2 },
        { x: -5, y: -4, z: -2 },
        { x: 0, y: 7, z: 0 },
        { x: 9, y: -1, z: -2 },
        { x: -9, y: -1, z: 2 },
        { x: 0, y: -8, z: 0 },
        { x: 3, y: 1, z: 5 },
        { x: -3, y: 1, z: -5 }
    ], [
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 8], [0, 9], [0, 10],
        [1, 5], [2, 5], [3, 8], [4, 8], [1, 6], [2, 7], [9, 5], [10, 8]
    ]);

    if (hasGsap && hasScrollTrigger) {
        document.querySelectorAll("section").forEach((section) => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power3.out"
            });

            const items = section.querySelectorAll(".reveal-item");
            if (items.length) {
                gsap.from(items, {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 70%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 0,
                    y: 30,
                    stagger: 0.2,
                    duration: 0.8,
                    ease: "power2.out"
                });
            }
        });
    }

    const typewriter = document.getElementById("typewriter");
    if (typewriter) {
        const lines = [
            "scanning security protocols...",
            "optimizing cloud pipelines...",
            "ready for breakthrough solutions.",
            "welcome to CHARLES S ecosystem."
        ];

        let lineIndex = 0;
        let charIndex = 0;

        const type = () => {
            if (charIndex < lines[lineIndex].length) {
                typewriter.textContent += lines[lineIndex].charAt(charIndex);
                charIndex += 1;
                setTimeout(type, 50);
                return;
            }

            setTimeout(erase, 1800);
        };

        const erase = () => {
            if (charIndex > 0) {
                typewriter.textContent = lines[lineIndex].substring(0, charIndex - 1);
                charIndex -= 1;
                setTimeout(erase, 30);
                return;
            }

            lineIndex = (lineIndex + 1) % lines.length;
            setTimeout(type, 400);
        };

        setTimeout(type, 1000);
    }

    const consoleOutput = document.getElementById("console-output");
    const consoleLines = consoleOutput ? Array.from(consoleOutput.querySelectorAll(".line")) : [];
    if (consoleLines.length >= 11) {
        const terminalStates = {
            status: ["stable", "synced", "elevated", "mission ready"],
            control: ["absolute", "locked", "precise", "adaptive"],
            focus: [
                "architecting intelligent systems",
                "building polished digital products",
                "orchestrating cloud-first workflows",
                "designing resilient user experiences"
            ],
            process: [
                "break -> rebuild -> optimize",
                "analyze -> simplify -> scale",
                "prototype -> refine -> launch",
                "map -> test -> elevate"
            ],
            mode: [
                "simplify -> scale -> automate",
                "observe -> adapt -> deliver",
                "research -> ship -> improve",
                "design -> engineer -> optimize"
            ],
            sequence: [
                "$ launching environment",
                "$ validating runtime",
                "$ syncing interface layers",
                "$ calibrating premium systems"
            ],
            init: [
                "> init_sequence...",
                "> mesh_alignment...",
                "> visual_matrix...",
                "> experience_engine..."
            ],
            events: [
                ["> signal detected", "> signal stabilized", "> ready."],
                ["> latency checked", "> response optimized", "> ready."],
                ["> workflow detected", "> workflow streamlined", "> ready."],
                ["> motion calibrated", "> interface elevated", "> ready."]
            ]
        };

        let terminalIndex = 0;
        const refreshLine = (element, text) => {
            if (!element) {
                return;
            }

            element.classList.remove("is-refreshing");
            void element.offsetWidth;
            element.textContent = text;
            element.classList.add("is-refreshing");
        };

        const updateTerminal = () => {
            terminalIndex = (terminalIndex + 1) % terminalStates.status.length;
            refreshLine(consoleLines[1], terminalStates.sequence[terminalIndex]);
            refreshLine(consoleLines[2], terminalStates.init[terminalIndex]);
            refreshLine(consoleLines[3], `[ status ]     ${terminalStates.status[terminalIndex]}`);
            refreshLine(consoleLines[4], `[ control ]    ${terminalStates.control[terminalIndex]}`);
            refreshLine(consoleLines[5], `[ focus  ]     ${terminalStates.focus[terminalIndex]}`);
            refreshLine(consoleLines[6], `[ process]     ${terminalStates.process[terminalIndex]}`);
            refreshLine(consoleLines[7], `[ mode   ]     ${terminalStates.mode[terminalIndex]}`);
            refreshLine(consoleLines[8], terminalStates.events[terminalIndex][0]);
            refreshLine(consoleLines[9], terminalStates.events[terminalIndex][1]);
            refreshLine(consoleLines[10], terminalStates.events[terminalIndex][2]);
        };

        window.setInterval(updateTerminal, 2600);
    }

    const ribbonTrack = document.querySelector(".ribbon-track");
    if (ribbonTrack && !ribbonTrack.dataset.loopReady) {
        ribbonTrack.innerHTML += ribbonTrack.innerHTML;
        ribbonTrack.dataset.loopReady = "true";
    }

    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");
    if (hasGsap && cursor && follower) {
        document.addEventListener("mousemove", (event) => {
            gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.1 });
            gsap.to(follower, { x: event.clientX, y: event.clientY, duration: 0.4 });
        });
    }

    const skillDetails = {
        Java: { desc: "I build scalable backend systems with clean architecture and strong OOP principles.", usage: ["Spring Boot", "APIs", "System Design"] },
        Python: { desc: "My go-to language for ML, automation, and turning ideas into working solutions fast.", usage: ["Pandas", "FastAPI", "MLOps"] },
        "C++": { desc: "Used to sharpen problem-solving and write highly optimized, performance-critical code.", usage: ["Algorithms", "Optimization", "DSA"] },
        FastAPI: { desc: "I create high-speed, efficient APIs with async support and minimal overhead.", usage: ["Asyncio", "Pydantic", "Security"] },
        "React.js": { desc: "I design dynamic, modern UIs that are smooth, interactive, and user-focused.", usage: ["Hooks", "State Management", "UI Systems"] },
        Flask: { desc: "Perfect for quickly building lightweight backend services and prototypes.", usage: ["Microservices", "Extensions", "Rapid Build"] },
        Docker: { desc: "Ensures my applications run consistently across any environment without issues.", usage: ["Containers", "Images", "Deployment"] },
        AWS: { desc: "I leverage cloud services to deploy and scale applications efficiently.", usage: ["EC2", "S3", "Serverless"] },
        MySQL: { desc: "Reliable choice for structured data and efficient query handling.", usage: ["SQL", "Indexes", "Relations"] },
        PostgreSQL: { desc: "Used for complex data handling with powerful querying capabilities.", usage: ["JSONB", "Advanced Queries", "Extensions"] }
    };

    const modal = document.getElementById("skill-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalIcon = document.getElementById("modal-icon");
    const modalDesc = document.getElementById("modal-description");
    const modalUsage = document.getElementById("modal-usage");
    const modalClose = document.querySelector(".modal-close");

    document.querySelectorAll(".skill-tile").forEach((tile) => {
        tile.addEventListener("click", () => {
            const name = tile.querySelector("span")?.innerText;
            const details = skillDetails[name];
            if (!details || !modal || !modalTitle || !modalIcon || !modalDesc || !modalUsage) {
                return;
            }

            modalTitle.innerText = name;
            modalIcon.src = tile.querySelector("img")?.src || "";
            modalDesc.innerText = details.desc;
            modalUsage.innerHTML = details.usage.map((item) => `<span>${item}</span>`).join("");
            modal.classList.add("active");
        });

        if (hasGsap) {
            tile.addEventListener("mousemove", (event) => {
                const rect = tile.getBoundingClientRect();
                const x = event.clientX - rect.left - rect.width / 2;
                const y = event.clientY - rect.top - rect.height / 2;
                gsap.to(tile, { rotateX: -y / 10, rotateY: x / 10, y: -10, duration: 0.5 });
            });

            tile.addEventListener("mouseleave", () => {
                gsap.to(tile, { rotateX: 0, rotateY: 0, y: 0, duration: 0.5 });
            });
        }
    });

    document.querySelectorAll(".foundation-card").forEach((card) => {
        if (!hasGsap) {
            return;
        }

        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            gsap.to(card, { rotateX: -y / 15, rotateY: x / 15, scale: 1.05, duration: 0.4 });
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.4 });
        });
    });

    if (modal && modalClose) {
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
    }

    const projectModal = document.getElementById("project-modal");
    const projectModalImage = document.getElementById("project-modal-image");
    const projectModalTag = document.getElementById("project-modal-tag");
    const projectModalLocation = document.getElementById("project-modal-location");
    const projectModalTitle = document.getElementById("project-modal-title");
    const projectModalSummary = document.getElementById("project-modal-summary");
    const projectModalFeatures = document.getElementById("project-modal-features");
    const projectModalStack = document.getElementById("project-modal-stack");
    const projectModalImpact = document.getElementById("project-modal-impact");
    const projectModalClose = document.querySelector(".project-modal-close");

    const renderList = (target, items) => {
        if (!target) {
            return;
        }

        target.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
    };

    const renderTags = (target, items) => {
        if (!target) {
            return;
        }

        target.innerHTML = items.map((item) => `<span class="skill-tag">${item}</span>`).join("");
    };

    const openProjectModal = (card) => {
        if (
            !projectModal || !projectModalImage || !projectModalTag || !projectModalLocation ||
            !projectModalTitle || !projectModalSummary || !projectModalFeatures ||
            !projectModalStack || !projectModalImpact
        ) {
            return;
        }

        const image = card.querySelector(".project-image img");
        const tag = card.querySelector(".project-tag")?.textContent?.trim() || "";
        const title = card.querySelector("h3")?.textContent?.trim() || "";
        const location = card.querySelector(".location")?.textContent?.trim() || "";
        const blocks = Array.from(card.querySelectorAll(".description-block"));

        const descriptionBlock = blocks.find((block) => block.querySelector("h4")?.textContent?.trim() === "Description");
        const featuresBlock = blocks.find((block) => block.querySelector("h4")?.textContent?.trim() === "Key Features");
        const stackBlock = blocks.find((block) => block.querySelector("h4")?.textContent?.trim() === "Tech Stack");
        const impactBlock = blocks.find((block) => block.querySelector("h4")?.textContent?.trim() === "Impact");

        const descriptionParagraphs = Array.from(descriptionBlock?.querySelectorAll("p") || []).map((item) => item.textContent.trim());
        const featureItems = Array.from(featuresBlock?.querySelectorAll("li") || []).map((item) => item.textContent.trim());
        const stackItems = Array.from(stackBlock?.querySelectorAll("li") || []).map((item) => item.textContent.trim());
        const impactItems = Array.from(impactBlock?.querySelectorAll("li") || []).map((item) => item.textContent.trim());

        projectModalImage.src = image?.src || "";
        projectModalImage.alt = image?.alt || title;
        projectModalTag.textContent = tag;
        projectModalLocation.textContent = location;
        projectModalTitle.textContent = title;
        projectModalSummary.innerHTML = descriptionParagraphs.map((item) => `<p>${item}</p>`).join("");
        renderList(projectModalFeatures, featureItems);
        renderTags(projectModalStack, stackItems);
        renderList(projectModalImpact, impactItems);

        projectModal.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    const closeProjectModal = () => {
        if (!projectModal) {
            return;
        }

        projectModal.classList.remove("active");
        document.body.style.overflow = "";
    };

    document.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("click", (event) => {
            const interactive = event.target.closest("a, button");
            if (interactive) {
                return;
            }

            openProjectModal(card);
        });
    });

    if (projectModal && projectModalClose) {
        projectModalClose.addEventListener("click", closeProjectModal);
        projectModal.addEventListener("click", (event) => {
            if (event.target === projectModal) {
                closeProjectModal();
            }
        });

        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && projectModal.classList.contains("active")) {
                closeProjectModal();
            }
        });
    }

    document.addEventListener("mousemove", (event) => {
        document.body.style.setProperty("--x", `${event.clientX}px`);
        document.body.style.setProperty("--y", `${event.clientY}px`);
    });

    document.querySelectorAll(".chip").forEach((button) => {
        button.addEventListener("mousemove", (event) => {
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "translate(0,0)";
        });
    });

    const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const rect = link.getBoundingClientRect();
            const ripple = document.createElement("span");
            ripple.className = "nav-ripple";
            ripple.style.left = `${event.clientX - rect.left}px`;
            ripple.style.top = `${event.clientY - rect.top}px`;
            link.appendChild(ripple);

            link.classList.remove("is-splashing");
            void link.offsetWidth;
            link.classList.add("is-splashing");

            window.setTimeout(() => {
                ripple.remove();
                link.classList.remove("is-splashing");
            }, 900);
        });
    });

    const sectionMap = navLinks
        .map((link) => {
            const target = document.querySelector(link.getAttribute("href"));
            return target ? { link, target } : null;
        })
        .filter(Boolean);

    if (sectionMap.length) {
        const setActiveLink = () => {
            const scrollPoint = window.scrollY + window.innerHeight * 0.28;
            let activeItem = sectionMap[0];

            sectionMap.forEach((item) => {
                if (item.target.offsetTop <= scrollPoint) {
                    activeItem = item;
                }
            });

            sectionMap.forEach((item) => {
                item.link.classList.toggle("active", item === activeItem);
            });
        };

        setActiveLink();
        window.addEventListener("scroll", setActiveLink, { passive: true });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    });

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

    const heroImage = document.querySelector(".hero-image-container");
    if (heroImage) {
        heroImage.addEventListener("mousemove", (event) => {
            const rect = heroImage.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            heroImage.style.transform = `perspective(1400px) rotateX(${y * 14}deg) rotateY(${x * 14}deg) translateZ(10px)`;
        });

        heroImage.addEventListener("mouseleave", () => {
            heroImage.style.transform = "perspective(1400px) rotateX(0) rotateY(0) translateZ(0)";
        });
    }

    document.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            card.style.transform = `perspective(1200px) translateY(-10px) rotateX(${(-y / rect.height) * 14}deg) rotateY(${(x / rect.width) * 16}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

    window.scrollTo(0, 0);
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }
});
