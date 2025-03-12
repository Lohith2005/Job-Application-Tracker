// Code for the Job Application Tracker project
// This code is written in vanilla JavaScript
// Author: @lohith
// Date: 2021-08-25
// Description: This script file contains the JavaScript code for the Job Application Tracker project. 
document.addEventListener("DOMContentLoaded", () => {
    const jobForm = document.getElementById("job-form");
    const jobList = document.getElementById("job-list");
    const jobTitleInput = document.getElementById("jobTitle");
    const companyNameInput = document.getElementById("companyName");
    const jobStatusInput = document.getElementById("jobStatus");
    const searchInput = document.getElementById("searchInput");  // Search input field
    const interviewDateInput = document.getElementById("interviewDate");
    const interviewDateInputContainer = document.getElementById("interviewDateContainer");
    const statusChartCanvas = document.getElementById("statusChart").getContext("2d");

    // Hide the interview date input initially
    interviewDateInputContainer.style.display = "none";

    // Get jobs from localStorage
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    // Initialize Chart.js
    const statusChart = new Chart(statusChartCanvas, {
        type: 'doughnut',
        data: {
            labels: ["Applied", "Interview Scheduled", "Offer", "Rejected"],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ["#007bff", "#ffc107", "#28a745", "#dc3545"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });

    // Update chart based on the job statuses
    const updateChart = () => {
        const statusCounts = { Applied: 0, "Interview Scheduled": 0, Offer: 0, Rejected: 0 };
        jobs.forEach(job => {
            statusCounts[job.status]++;
        });
        statusChart.data.datasets[0].data = [
            statusCounts.Applied,
            statusCounts["Interview Scheduled"],
            statusCounts.Offer,
            statusCounts.Rejected
        ];
        statusChart.update();
    };

    // Render job cards UI
    const renderJobs = (filteredJobs) => {
        jobList.innerHTML = "";
        if (filteredJobs.length === 0) {
            jobList.innerHTML = "<p>No jobs available</p>";
        } else {
            filteredJobs.forEach((job, index) => {
                const jobCard = `
                <div class="col-md-3 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${job.title}</h5>
                            <p class="card-text">${job.company}</p>
                            <p><strong>Status:</strong> ${job.status}</p>
                            ${job.status === "Interview Scheduled" && job.interviewDate
                        ? `<p><strong>Interview Date:</strong> ${new Date(job.interviewDate).toLocaleString()}</p>`
                        : `<p><strong>Interview Date:</strong> Not yet scheduled</p>`
                    }
                            <div class="d-flex justify-content-between position-relative">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        Change Status
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-up" style="border-radius: 5px; padding: 5px; border: 1px solid #ccc;">
                                        <li><a class="dropdown-item" href="#" onclick="updateStatus(${index},'Applied')">Applied</a></li>
                                        <li><a class="dropdown-item" href="#" onclick="updateStatus(${index}, 'Interview Scheduled')">Interview Scheduled</a></li>
                                        <li><a class="dropdown-item" href="#" onclick="updateStatus(${index}, 'Offer')">Offer</a></li>
                                        <li><a class="dropdown-item" href="#" onclick="updateStatus(${index}, 'Rejected')">Rejected</a></li>
                                    </ul>
                                </div>

                                <button class="btn btn-danger btn-sm" onclick="deleteJob(${index})">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
                jobList.innerHTML += jobCard;
            });
        }
        updateChart();
    };

    // Update interview date based on the job statuses
    jobStatusInput.addEventListener("change", () => {
        if (jobStatusInput.value === "Interview Scheduled") {
            interviewDateInputContainer.style.display = "block";
        } else {
            interviewDateInputContainer.style.display = "none";
            interviewDateInput.value = ""; // Clear interview date when not needed
        }
    });

    //edit btn
    const saveJobsToLocalStorage = () => {
        localStorage.setItem("jobs", JSON.stringify(jobs));
    };
    window.deleteJob = (index) => {
        jobs.splice(index, 1); // Remove job from array
        saveJobsToLocalStorage(); // Save changes
        renderJobs(jobs); // Re-render job list
    };
    window.updateStatus = (index, newStatus) => {
        jobs[index].status = newStatus;
        saveJobsToLocalStorage();
        renderJobs(jobs);
    };




    // Handle form submission to add a job
    jobForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newJob = {
            title: jobTitleInput.value,
            company: companyNameInput.value,
            status: jobStatusInput.value,
            interviewDate: interviewDateInput.value || null
        };
        jobs.push(newJob);
        localStorage.setItem("jobs", JSON.stringify(jobs));  // Save to localStorage
        renderJobs(jobs);
        flatpickr("#calendar").destroy(); // Destroy the current calendar instance
        setupCalendar(); // Reinitialize with updated data
        jobForm.reset();
        const modalElement = document.getElementById("jobModal");
        const modal = bootstrap.Modal.getInstance(modalElement); // Get the Bootstrap modal instance
        if (modal) {
            modal.hide(); // Close the modal
        }
        console.log('calender is activated');
        // for (let i = 0; i<=1; i++) {
        //     window.location.reload();
        //     console.log('page is refeshed');
        // }

    });

    // Delete job
    window.deleteJob = (index) => {
        jobs.splice(index, 1);
        localStorage.setItem("jobs", JSON.stringify(jobs));  // Save to localStorage
        renderJobs(jobs);
    };

    // Search jobs function
    const searchJobs = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredJobs = jobs.filter(job => {
            return (
                job.title.toLowerCase().includes(searchTerm) ||
                job.company.toLowerCase().includes(searchTerm) ||
                job.status.toLowerCase().includes(searchTerm)
            );
        });
        renderJobs(filteredJobs);  // Render filtered jobs
    };

    // Listen for input events on the search box
    searchInput.addEventListener("input", searchJobs);

    // Initial rendering of all jobs
    renderJobs(jobs);
});






// its for the dark mode and the sticky navbar

document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const navbar = document.getElementById("navbar");

    // Check and apply saved theme from localStorage
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        themeIcon.classList.replace("fa-moon", "fa-sun"); // Change icon to sun
    }

    // Toggle dark mode and icon on button click
    darkModeToggle.addEventListener("click", () => {
        const isDarkMode = document.body.classList.toggle("dark-mode");

        // Toggle between moon and sun icons
        if (isDarkMode) {
            themeIcon.classList.replace("fa-moon", "fa-sun"); // Change to sun
            localStorage.setItem("darkMode", "enabled");
        } else {
            themeIcon.classList.replace("fa-sun", "fa-moon"); // Change to moon
            localStorage.setItem("darkMode", "disabled");
        }
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 0) { // Trigger when scrolling down past 100px
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    });
});

// calender integration goes here
// Ensure setupCalendar is defined properly and called with the right data
document.addEventListener("DOMContentLoaded", () => {
    const jobs = JSON.parse(localStorage.getItem("jobs")) || []; // Load jobs from localStorage

    // Check if jobs exist, otherwise, do nothing or show a message
    if (jobs.length === 0) {
        console.log("No jobs available.");
        return;
    }

    // Extract interview dates from job data
    const interviewData = jobs
        .filter((job) => job.status === "Interview Scheduled" && job.interviewDate)
        .map((job) => ({
            date: job.interviewDate,
            title: `${job.title} Interview (${job.company})`,
        }));

    console.log("Interview data:", interviewData);

    // Initialize Flatpickr with interview dates
    flatpickr("#calendar", {
        inline: true,
        enable: interviewData.map((item) => item.date), // Highlight interview dates
        onDayCreate: (dObj, dStr, fp, dayElem) => {
            const dateStr = dayElem.dateObj.toISOString().split("T")[0];
            const interview = interviewData.find((item) => item.date === dateStr);

            if (interview) {
                // Add a tooltip for interview dates
                dayElem.title = interview.title;
                dayElem.style.backgroundColor = "#ffd700"; // Highlight color
                dayElem.style.color = "#000"; // Text color
                dayElem.style.cursor = "pointer";
            }
        },
    });

    // Optionally, call setupCalendar() if you still want it in use
    setupCalendar(jobs); // Pass jobs to setupCalendar function
});

// Function to initialize the calendar separately if needed
function setupCalendar(jobs) {
    console.log("Setting up calendar with jobs:", jobs);
    try {
        const interviewData = jobs
            .filter((job) => job.status === "Interview Scheduled" && job.interviewDate)
            .map((job) => ({
                date: job.interviewDate,
                title: `${job.title} Interview (${job.company})`,
            }));

        flatpickr("#calendar", {
            inline: true,
            enable: interviewData.map((item) => item.date),
            onDayCreate: (dObj, dStr, fp, dayElem) => {
                const dateStr = dayElem.dateObj.toISOString().split("T")[0];
                const interview = interviewData.find((item) => item.date === dateStr);

                if (interview) {
                    dayElem.title = interview.title;
                    dayElem.style.backgroundColor = "#ffd700";
                    dayElem.style.cursor = "pointer";
                }
            },
        });
    } catch (error) {
        console.error('Error setting up calendar:', error);
    }
}







$(document).ready(function() {
    $('.dropdown-toggle').on('click', function(e) {
        var $el = $(this).next('.dropdown-menu');
        var isVisible = $el.is(':visible');
        $('.dropdown-menu').hide();
        if (!isVisible) $el.show();
        e.stopPropagation();
    });

    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dropdown').length) {
            $('.dropdown-menu').hide();
        }
    });
});
