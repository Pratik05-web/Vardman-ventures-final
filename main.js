// main.js - Interactive Scripts for Vardhaman Ventures Real Estate Consultants

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. STICKY NAV & MOBILE MENU TOGGLE
    // ==========================================
    const mainNav = document.getElementById('main-nav');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    // Toggle sticky navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }

        // Highlight active navigation section depending on scroll height
        updateActiveNavMenuItem();
    });

    function updateActiveNavMenuItem() {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-links .nav-item');
        let currentSectionId = '';

        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            const secHeight = sec.clientHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    }

    // Toggle Mobile Drawer menu
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        });

        // Close menu when link is clicked
        const mobileLinks = document.querySelectorAll('.mobile-nav-item');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('open');
            });
        });
    }


    // ==========================================
    // 2. STATISTICS COUNTERS ANIMATION ON SCROLL
    // ==========================================
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let statsAnimated = false;

    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        let count = 0;
        const speed = Math.ceil(target / 45); // Speed multiplier

        const updateCount = () => {
            if (count < target) {
                count += speed;
                if (count > target) count = target;
                element.innerText = count + (target === 6 ? '+' : (target === 500 ? '+' : '+'));
                setTimeout(updateCount, 15);
            } else {
                element.innerText = target + (target === 6 ? '+' : (target === 500 ? '+' : '+'));
            }
        };
        updateCount();
    };

    const statsObserver = new IntersectionObserver((events) => {
        events.forEach(ev => {
            if (ev.isIntersecting && !statsAnimated) {
                statNumbers.forEach(num => countUp(num));
                statsAnimated = true;
            }
        });
    }, { threshold: 0.15 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }


    // ==========================================
    // 3. PROPERTY FINDER MATCHING ALGORITHM
    // ==========================================
    // Local client database matches representation
    const projectDatabase = [
        {
            name: "ANP Universe (ANP Corp)",
            location: "wakad",
            bhk: ["2bhk", "3bhk", "4bhk"],
            budget: ["90-1.5Cr", "above-1.5Cr"],
            status: ["near-completion", "new-launch"],
            highlights: ["Smart home features", "3 acres amenity podium", "Close to Mumbai Highway"]
        },
        {
            name: "Vilas Javdekar Portia",
            location: "wakad",
            bhk: ["3bhk", "4bhk"],
            budget: ["90-1.5Cr", "above-1.5Cr"],
            status: ["near-completion", "ready"],
            highlights: ["Premium bespoke layouts", "Wakad's premium residential lane", "Direct VJ warranty"]
        },
        {
            name: "Godrej Woodsville",
            location: "hinjewadi",
            bhk: ["2bhk", "3bhk"],
            budget: ["60-90", "90-1.5Cr"],
            status: ["near-completion"],
            highlights: ["Forest-themed design amenities", "Phase 1 strategic placement", "High security systems"]
        },
        {
            name: "Kohinoor Courtyard One",
            location: "wakad",
            bhk: ["2bhk", "3bhk"],
            budget: ["60-90", "90-1.5Cr"],
            status: ["near-completion", "ready"],
            highlights: ["Premium high-rise tower", "Zero waste layout design", "Fully equipped modern clubhouse"]
        },
        {
            name: "Kasturi Apostrophe",
            location: "hinjewadi",
            bhk: ["3bhk", "4bhk"],
            budget: ["above-1.5Cr"],
            status: ["ready"],
            highlights: ["Ultra-luxury aesthetics", "Imported modular marble fittings", "Panoramic Hinjewadi views"]
        },
        {
            name: "VJ YashOne Infinite",
            location: "tathawade",
            bhk: ["2bhk", "3bhk"],
            budget: ["under-60", "60-90"],
            status: ["near-completion", "new-launch"],
            highlights: ["Compact smart designs", "Direct campus IT hub shuttle", "Reputed educational partners nearby"]
        },
        {
            name: "Siddhashila Eela",
            location: "punawale",
            bhk: ["2bhk", "3bhk"],
            budget: ["under-60", "60-90"],
            status: ["ready", "near-completion"],
            highlights: ["Affordable luxury style", "Spacious balconies layout", "IGBC green rating building"]
        },
        {
            name: "Pride Purple Park District",
            location: "wakad",
            bhk: ["2bhk", "3bhk"],
            budget: ["90-1.5Cr", "above-1.5Cr"],
            status: ["near-completion", "new-launch"],
            highlights: ["Massive mixed township", "Excellent Balewadi Highstreet access", "Premium high-grade concrete builds"]
        },
        {
            name: "Gera World of Joy",
            location: "hinjewadi",
            bhk: ["2bhk", "3bhk", "4bhk"],
            budget: ["90-1.5Cr", "above-1.5Cr"],
            status: ["near-completion"],
            highlights: ["Child-centric homes", "Professional music/sports academies", "Gera warranty registry"]
        },
        {
            name: "Kalpataru Jade Residencies",
            location: "baner",
            bhk: ["3bhk", "4bhk"],
            budget: ["above-1.5Cr"],
            status: ["ready", "near-completion"],
            highlights: ["Baner hill backdrop views", "Super premium interiors", "High carpet area margins"]
        },
        {
            name: "Austin Park",
            location: "wakad",
            bhk: ["2bhk", "3bhk"],
            budget: ["60-90", "90-1.5Cr"],
            status: ["ready"],
            highlights: ["Ready to move luxury rooms", "Strategically near main Wakad market", "Vastu-compliant architectures"]
        },
        {
            name: "Pharande Puneville",
            location: "ravet",
            bhk: ["2bhk", "3bhk"],
            budget: ["60-90", "90-1.5Cr"],
            status: ["near-completion", "ready"],
            highlights: ["Aedas Singapore designs", "Olympic-sized sports pool Complex", "Direct Expressway entry Point"]
        },
        {
            name: "Vardhaman Golden Plots",
            location: "bavdhan",
            bhk: ["investment"],
            budget: ["60-90", "90-1.5Cr"],
            status: ["new-launch"],
            highlights: ["Premium NA Villa Plots", "Scenic Bavdhan Hills backdrop", "High capital appreciation margins"]
        },
        {
            name: "Kohinoor Commercial Hub",
            location: "wakad",
            bhk: ["investment"],
            budget: ["90-1.5Cr", "above-1.5Cr"],
            status: ["new-launch", "near-completion"],
            highlights: ["Pre-leased premium retail space", "Assured 8% yearly rental yield", "High traffic Wakad expressway node"]
        }
    ];

    const propertyForm = document.getElementById('property-finder-form');
    const matcherResults = document.getElementById('matcher-results');
    const resultsList = document.getElementById('results-list');
    const closeResultsBtn = document.getElementById('close-results');

    if (propertyForm && matcherResults && resultsList) {
        propertyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const location = document.getElementById('find-location').value;
            const bhk = document.getElementById('find-bhk').value;
            const budget = document.getElementById('find-budget').value;
            const status = document.getElementById('find-status').value;

            // Filtration logic
            const matches = projectDatabase.filter(project => {
                const locMatch = (location === 'any' || project.location === location);
                const bhkMatch = (bhk === 'any' || project.bhk.includes(bhk));
                const budgetMatch = (budget === 'any' || project.budget.includes(budget));
                const statusMatch = (status === 'any' || project.status.includes(status));

                return locMatch && bhkMatch && budgetMatch && statusMatch;
            });

            // Populate HTML results
            resultsList.innerHTML = '';

            if (matches.length > 0) {
                matches.forEach(match => {
                    const card = document.createElement('div');
                    card.className = 'match-result-card';
                    card.innerHTML = `
                        <h5>${match.name}</h5>
                        <p class="m-spec"><i class="fa-solid fa-location-dot"></i> Location: ${match.location.toUpperCase()} | Configs: ${match.bhk.map(b => b.toUpperCase()).join(', ')}</p>
                        <ul class="m-bullets">
                            ${match.highlights.map(hl => `<li>${hl}</li>`).join('')}
                        </ul>
                    `;
                    resultsList.appendChild(card);
                });
            } else {
                // Fallback recommendations if zero strict matches
                resultsList.innerHTML = `
                    <div class="match-result-card text-center" style="padding: 2rem;">
                        <i class="fa-solid fa-circle-exclamation text-gold" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                        <h5>Custom Match Needed</h5>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">No direct package matches your specific filters at this moment. However, we have off-market projects and pre-launch prices matching these configs.</p>
                        <ul class="m-bullets" style="display:inline-block; text-align:left; margin-top: 0.5rem;">
                            <li>Exclusive Builder Pre-launches</li>
                            <li>Special price negotiations through Vardhaman networks</li>
                        </ul>
                    </div>
                `;
            }

            matcherResults.style.display = 'flex';
        });

        // Close results pane
        if (closeResultsBtn) {
            closeResultsBtn.addEventListener('click', () => {
                matcherResults.style.display = 'none';
            });
        }
    }


    // ==========================================
    // 4. AREA EXPLORER ACCORDION / TABS SYSTEM
    // ==========================================
    const tabButtons = document.querySelectorAll('.area-tab-btn');
    const contentNodes = document.querySelectorAll('.area-content-node');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const area = btn.getAttribute('data-area');

            // Set buttons state
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Swap out info panels
            contentNodes.forEach(node => {
                node.classList.remove('active');
                if (node.getAttribute('id') === `node-${area}`) {
                    node.classList.add('active');
                }
            });
        });
    });


    // ==========================================
    // 5. INTERACTIVE SERVICE CARDS CLICK TRIGGERS
    // ==========================================
    const serviceCards = document.querySelectorAll('.service-card.interactive-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceType = card.getAttribute('data-service');
            const locSelect = document.getElementById('find-location');
            const bhkSelect = document.getElementById('find-bhk');
            const budgetSelect = document.getElementById('find-budget');
            const statusSelect = document.getElementById('find-status');

            if (serviceType === 'residential') {
                if (locSelect) locSelect.value = 'any';
                if (bhkSelect) bhkSelect.value = '2bhk'; // Defaults to residential standard
                if (budgetSelect) budgetSelect.value = 'any';
                if (statusSelect) statusSelect.value = 'any';
            } else if (serviceType === 'luxury') {
                if (locSelect) locSelect.value = 'any';
                if (bhkSelect) bhkSelect.value = '4bhk'; // Luxury Penthouse
                if (budgetSelect) budgetSelect.value = 'above-1.5Cr';
                if (statusSelect) statusSelect.value = 'any';
            } else if (serviceType === 'investment') {
                if (locSelect) locSelect.value = 'any';
                if (bhkSelect) bhkSelect.value = 'investment'; // High ROI plots
                if (budgetSelect) budgetSelect.value = 'any';
                if (statusSelect) statusSelect.value = 'any';
            }

            // Scroll to Property Matcher section
            const finderWidget = document.getElementById('finder');
            if (finderWidget) {
                finderWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Trigger submit programmatically
            if (propertyForm) {
                // Dispatch submit event
                propertyForm.dispatchEvent(new Event('submit'));
            }
        });
    });


    // ==========================================
    // 6. PROJECT CARDS DISPATCH TO CONTACT FORM
    // ==========================================
    const projectInquireBtns = document.querySelectorAll('.project-inquire-btn');
    projectInquireBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectName = btn.getAttribute('data-project');
            const messageArea = document.getElementById('user-message');

            if (messageArea && projectName) {
                messageArea.value = `I am interested in ${projectName}. Please send me the brochures, carpet layouts, and available discount lists.`;
            }

            // Scroll to contact form
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // ==========================================
    // 7. INQUIRY FORM VALIDATION & API REDIRECT
    // ==========================================
    const inquiryForm = document.getElementById('inquiry-form');
    const submitBtn = document.getElementById('submit-btn-loader');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;

    const thankyouModal = document.getElementById('thankyou-modal');
    const closeModalBtn = document.getElementById('close-modal');

    // Error tag elements
    const errName = document.getElementById('err-name');
    const errPhone = document.getElementById('err-phone');
    const errEmail = document.getElementById('err-email');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clean error states
            if (errName) errName.innerText = '';
            if (errPhone) errPhone.innerText = '';
            if (errEmail) errEmail.innerText = '';

            const name = document.getElementById('user-name').value.trim();
            const phone = document.getElementById('user-phone').value.trim();
            const email = document.getElementById('user-email').value.trim();
            const location = document.getElementById('user-loc').value;
            const budget = document.getElementById('user-budget').value;
            const message = document.getElementById('user-message').value.trim();
            const siteVisit = document.getElementById('user-sitevisit').checked;

            let isValid = true;

            // Validations
            if (name.length < 3) {
                if (errName) errName.innerText = 'Please enter a valid name (at least 3 characters)';
                isValid = false;
            }

            const phonePattern = /^[6789][0-9]{9}$/;
            if (!phonePattern.test(phone)) {
                if (errPhone) errPhone.innerText = 'Please enter a valid 10-digit Indian phone number';
                isValid = false;
            }

            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                if (errEmail) errEmail.innerText = 'Please enter a valid email format';
                isValid = false;
            }

            if (!isValid) return;

            // Submit loading effects
            if (submitBtn && btnText && btnSpinner) {
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnSpinner.style.display = 'inline-flex';
            }

            // Create lead data
            const leadData = {
                timestamp: new Date().toLocaleString(),
                name,
                phone,
                email: email || 'N/A',
                location,
                budget,
                message: message || 'No details provided.',
                siteVisit: siteVisit ? 'Required' : 'Not Required'
            };

            // Post request to backend API with local-storage fallback
            fetch('/api/inquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(leadData)
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Server rejected lead delivery');
                    }
                    return res.json();
                })
                .then(data => {
                    console.log('Lead delivered successfully:', data);
                    completeLeadSubmission(leadData);
                })
                .catch(err => {
                    console.warn('Backend server not responding/configured. Falling back to local offline registry... Details:', err.message);
                    completeLeadSubmission(leadData);
                });

            function completeLeadSubmission(lead) {
                // Save lead locally to localStorage vault
                let savedLeads = JSON.parse(localStorage.getItem('vardhaman_leads')) || [];
                savedLeads.unshift(lead); // Add to beginning
                localStorage.setItem('vardhaman_leads', JSON.stringify(savedLeads));

                // Clean form values
                inquiryForm.reset();

                // Restore button states
                if (submitBtn && btnText && btnSpinner) {
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnSpinner.style.display = 'none';
                }

                // Show appreciation modal
                if (thankyouModal) {
                    thankyouModal.classList.add('open');
                }

                // Refresh admin vault lists if open
                renderAdminLeads();
            }
        });
    }

    // Modal dismiss actions
    if (closeModalBtn && thankyouModal) {
        closeModalBtn.addEventListener('click', () => {
            thankyouModal.classList.remove('open');
        });
    }


    // ==========================================
    // 8. DEVELOPER ADMIN INQUIRY VAULT BACKDOOR
    // ==========================================
    const adminTrigger = document.getElementById('admin-trigger');
    const adminModal = document.getElementById('admin-modal');
    const closeAdminBtn = document.getElementById('close-admin');
    const adminLeadsBody = document.getElementById('admin-leads-body');
    const clearLeadsBtn = document.getElementById('clear-leads-btn');

    function renderAdminLeads() {
        if (!adminLeadsBody) return;

        const leads = JSON.parse(localStorage.getItem('vardhaman_leads')) || [];
        adminLeadsBody.innerHTML = '';

        if (leads.length === 0) {
            adminLeadsBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                        <i class="fa-solid fa-folder-open" style="font-size: 1.5rem; display:block; margin-bottom: 0.5rem;"></i>
                        No inquiries documented on this browser session yet.
                    </td>
                </tr>
            `;
            return;
        }

        leads.forEach((lead, idx) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="white-space: nowrap; color: var(--text-muted);">${lead.timestamp.split(',')[0]}<span style="display:block; font-size: 0.72rem;">${lead.timestamp.split(',')[1] || ''}</span></td>
                <td>
                    <strong>${lead.name}</strong><br>
                    <span style="font-size: 0.8rem;"><i class="fa-solid fa-phone text-gold"></i> <a href="tel:${lead.phone}">${lead.phone}</a></span><br>
                    <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="fa-solid fa-envelope"></i> ${lead.email}</span>
                </td>
                <td>
                    <span class="badge-pill badge-gold" style="font-size: 0.7rem; padding: 0.15rem 0.4rem; margin-bottom: 0.25rem; display:inline-flex;">${lead.location}</span><br>
                    <span style="font-weight:700; color:var(--accent-emerald);">${lead.budget}</span><br>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Cab Visit: ${lead.siteVisit}</span>
                </td>
                <td>
                    <button class="btn btn-secondary btn-sm delete-single-lead" data-index="${idx}" style="padding: 0.35rem 0.6rem; font-size: 0.75rem;">
                        <i class="fa-solid fa-trash-can" style="color: #ef4444;"></i>
                    </button>
                </td>
            `;
            adminLeadsBody.appendChild(row);
        });

        // Add single delete buttons listeners
        document.querySelectorAll('.delete-single-lead').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.getAttribute('data-index'), 10);
                let currentLeads = JSON.parse(localStorage.getItem('vardhaman_leads')) || [];
                currentLeads.splice(index, 1);
                localStorage.setItem('vardhaman_leads', JSON.stringify(currentLeads));
                renderAdminLeads();
            });
        });
    }

    // Trigger Admin page (Double-tap/Double-click the logo area OR click header logo)
    if (adminTrigger && adminModal) {
        adminTrigger.addEventListener('dblclick', (e) => {
            e.preventDefault();
            renderAdminLeads();
            adminModal.classList.add('open');
        });
    }

    // Footer Staff link fallback
    const secretAdminLink = document.querySelector('.secret-admin-link');
    if (secretAdminLink && adminModal) {
        secretAdminLink.addEventListener('click', (e) => {
            e.preventDefault();
            renderAdminLeads();
            adminModal.classList.add('open');
        });
    }

    if (closeAdminBtn && adminModal) {
        closeAdminBtn.addEventListener('click', () => {
            adminModal.classList.remove('open');
        });
    }

    if (clearLeadsBtn) {
        clearLeadsBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all inquiries logged local registry?")) {
                localStorage.removeItem('vardhaman_leads');
                renderAdminLeads();
            }
        });
    }
});
