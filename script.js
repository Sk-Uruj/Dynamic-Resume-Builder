function selectTemplate(templateId) {
  localStorage.setItem("selectedTemplate", templateId);
  window.location.href = "template-editor.html";
}

function goBackToTemplates() {
  window.location.href = "index.html";
}

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.querySelector(`#tab-${tabName}`).style.display = 'block';

  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.tab[onclick="showTab('${tabName}')"]`).classList.add('active');
}

function switchTemplateLayout(templateId) {
  document.querySelectorAll(".resume-layout").forEach(layout => layout.style.display = "none");
  const selected = document.getElementById(`${templateId}-layout`);
  if (selected) selected.style.display = "block";
  localStorage.setItem("selectedTemplate", templateId);
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTemplate = localStorage.getItem("selectedTemplate") || "template1";
  switchTemplateLayout(savedTemplate);

  document.querySelectorAll(".template-switcher button").forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const templateId = `template${index + 1}`;
      switchTemplateLayout(templateId);

      document.querySelectorAll(".template-switcher button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  const bind = (selector, targetClass, fallback) => {
  const input = document.querySelector(selector);
  const previews = document.querySelectorAll(`.${targetClass}`);
  if (input) {
    input.addEventListener("input", () => {
      previews.forEach(p => {
        const span = p.querySelector("span");
        if (span) {
          span.textContent = input.value || fallback;
        } else {
          p.textContent = input.value || fallback;
        }
      });
    });
  }
};



  bind('input[placeholder="Full Name"]', "name-preview", "Your Name");
  bind('input[placeholder="Email"]', "email-preview", "your.email@example.com");
  bind('input[placeholder="Phone"]', "phone-preview", "123-456-7890");
  bind('input[placeholder="Location"]', "location-preview", "Your City");
  bind('input[placeholder="LinkedIn (optional)"]', "linkedin-preview", "linkedin.com/in/yourprofile");
  bind('input[placeholder="Portfolio (optional)"]', "portfolio-preview", "yourportfolio.com");

  // ✨ Summary section binding (dynamic based on selected template)
  const summaryInput = document.getElementById("summary-input");

  if (summaryInput) {
    summaryInput.addEventListener("input", () => {
      const value = summaryInput.value.trim();
      document.querySelectorAll(".summary-text").forEach(p => {
        p.textContent = value ? `"${value}"` : "";
      });

      document.querySelectorAll("#preview-summary").forEach(section => {
        section.style.display = value ? "block" : "none";
      });
    });
  }


});

//Experience

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return ""; // Invalid date check
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function addExperience() {
  const container = document.getElementById("experience-entries");
  const index = container.children.length;

  const entry = document.createElement("div");
  entry.className = "experience-entry-container";

  entry.innerHTML = `
    <div class="form-row">
      <input type="text" placeholder="Job Title" class="job-title-input" />
      <input type="text" placeholder="Company" class="company-input" />
    </div>
    <div class="form-row">
      <input type="date" class="start-date-input" />
      <input type="date" class="end-date-input" />
      <label>
        <input type="checkbox" class="current-checkbox" /> Presently Working
      </label>
    </div>
    <textarea placeholder="Describe your role" class="description-input"></textarea>
    <button onclick="this.parentElement.remove(); removeExperienceFromPreviews(${index});">Remove</button>
  `;
  container.appendChild(entry);

  // Create preview in all templates dynamically
  document.querySelectorAll(".resume-layout").forEach((layout) => {
    let templatePreview = layout.querySelector(".preview-section.experience");

    if (!templatePreview) {
      templatePreview = document.createElement("section");
      templatePreview.className = "preview-section experience";
      layout.appendChild(templatePreview);
    }

    if (!templatePreview.querySelector("h2")) {
      const heading = document.createElement("h2");
      heading.textContent = "Experience";
      templatePreview.appendChild(heading);
    }

    const preview = document.createElement("div");
    preview.className = "experience-preview-entry";
    preview.setAttribute("data-index", index);
    preview.innerHTML = `
      <div class="exp-header">
        <h3 class="job-title">Job Title</h3>
        <p class="company-name">at Company</p>
        <span class="start-date">Start Date</span> – <span class="end-date">End Date</span>
      </div>
      <p class="job-description">Description</p>
    `;
    templatePreview.appendChild(preview);
    templatePreview.style.display = "block";
  });

  // Bind inputs
  const jobTitleInput = entry.querySelector(".job-title-input");
  const companyInput = entry.querySelector(".company-input");
  const startDateInput = entry.querySelector(".start-date-input");
  const endDateInput = entry.querySelector(".end-date-input");
  const currentCheckbox = entry.querySelector(".current-checkbox");
  const descInput = entry.querySelector(".description-input");

  function updateAllPreviews() {
    const job = jobTitleInput.value;
    const company = companyInput.value;
    const start = startDateInput.value;
    const end = currentCheckbox.checked ? "Present" : endDateInput.value;
    const desc = descInput.value;

    document.querySelectorAll(`.experience-preview-entry[data-index="${index}"]`).forEach((preview) => {
      preview.querySelector(".job-title").textContent = job || "Job Title";
      preview.querySelector(".company-name").textContent = company ? `at ${company}` : "at Company";
      preview.querySelector(".start-date").textContent = start || "Start Date";
      preview.querySelector(".end-date").textContent = end || "End Date";
      preview.querySelector(".job-description").textContent = desc || "Description";
    });
  }

  [jobTitleInput, companyInput, startDateInput, endDateInput, descInput, currentCheckbox].forEach(input => {
    input.addEventListener("input", updateAllPreviews);
    input.addEventListener("change", updateAllPreviews);
  });
}

function removeExperienceFromPreviews(index) {
  document.querySelectorAll(`.experience-preview-entry[data-index="${index}"]`).forEach((preview) => {
    const section = preview.closest(".preview-section.experience");
    preview.remove();

    // Hide section if no entries left (only <h2>)
    if (section && section.children.length === 1) {
      section.style.display = "none";
    }
  });
}

//Education 
function addEducation() {
  const container = document.getElementById("education-entries");
  const index = container.children.length;

  const entry = document.createElement("div");
  entry.className = "education-entry";
  entry.innerHTML = `
    <div class="form-row">
      <input type="text" placeholder="College Name" class="college-input" />
      <input type="text" placeholder="Degree" class="degree-input" />
    </div>
    <div class="form-row">
      <input type="text" placeholder="Stream (e.g. CSE, IT)" class="stream-input" />
      <input type="text" placeholder="GPA / CGPA" class="gpa-input" />
    </div>
    <div class="form-row">
      <input type="month" class="start-date-input" />
      <input type="month" class="end-date-input" />
    </div>
    <button onclick="this.parentElement.remove(); removeEducationFromPreviews(${index});">Remove</button>
  `;
  container.appendChild(entry);

  // Live Preview for all resume layouts
  document.querySelectorAll(".resume-layout").forEach((layout) => {
    let templatePreview = layout.querySelector(".preview-section.education");

    if (!templatePreview) {
      templatePreview = document.createElement("section");
      templatePreview.className = "preview-section education";
      layout.appendChild(templatePreview);
    }

    if (!templatePreview.querySelector("h2")) {
      const heading = document.createElement("h2");
      heading.textContent = "Education";
      templatePreview.appendChild(heading);
    }

    const preview = document.createElement("div");
    preview.className = "education-preview-entry";
    preview.setAttribute("data-index", index);
    preview.innerHTML = `
      <div class="edu-header">
        <h3 class="degree-name">Degree</h3>
        <p class="college-name">at College</p>
        <p class="stream-gpa">Stream | GPA</p>
        <span class="edu-dates">Start – End</span>
      </div>
    `;
    templatePreview.appendChild(preview);
    templatePreview.style.display = "block";
  });

  // Bind input to update preview
  const collegeInput = entry.querySelector(".college-input");
  const degreeInput = entry.querySelector(".degree-input");
  const streamInput = entry.querySelector(".stream-input");
  const gpaInput = entry.querySelector(".gpa-input");
  const startDateInput = entry.querySelector(".start-date-input");
  const endDateInput = entry.querySelector(".end-date-input");

  function updateAllPreviews() {
    const college = collegeInput.value;
    const degree = degreeInput.value;
    const stream = streamInput.value;
    const gpa = gpaInput.value;
    const start = startDateInput.value;
    const end = endDateInput.value;

    document.querySelectorAll(`.education-preview-entry[data-index="${index}"]`).forEach((preview) => {
      preview.querySelector(".degree-name").textContent = degree || "Degree";
      preview.querySelector(".college-name").textContent = college ? `at ${college}` : "at College";
      preview.querySelector(".stream-gpa").textContent = `${stream || "Stream"} | ${gpa || "GPA"}`;
      preview.querySelector(".edu-dates").textContent = (start || end) ? `${start} – ${end}` : "Start – End";
    });
  }

  [collegeInput, degreeInput, streamInput, gpaInput, startDateInput, endDateInput].forEach(input => {
    input.addEventListener("input", updateAllPreviews);
    input.addEventListener("change", updateAllPreviews);
  });
}

function removeEducationFromPreviews(index) {
  document.querySelectorAll(`.education-preview-entry[data-index="${index}"]`).forEach((preview) => {
    const section = preview.closest(".preview-section.education");
    preview.remove();

    if (section && section.children.length === 1) {
      section.style.display = "none";
    }
  });
}

//Skills 
let skills = [];

function setupSkillsSection() {
  const input = document.getElementById("skill-input");
  const addBtn = document.getElementById("add-skill-btn");
  const skillList = document.getElementById("skill-list");

  addBtn.addEventListener("click", () => {
    const skill = input.value.trim();
    if (skill && !skills.includes(skill)) {
      skills.push(skill);
      input.value = "";
      renderSkills();
      updateSkillsPreview();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addBtn.click();
    }
  });

  function renderSkills() {
    skillList.innerHTML = "";
    skills.forEach((skill, index) => {
      const tag = document.createElement("div");
      tag.className = "skill-tag";
      tag.innerHTML = `${skill} <button onclick="removeSkill(${index})">&times;</button>`;
      skillList.appendChild(tag);
    });
  }

  window.removeSkill = function (index) {
    skills.splice(index, 1);
    renderSkills();
    updateSkillsPreview();
  };
}

function updateSkillsPreview() {
  for (let i = 1; i <= 4; i++) {
    let section = document.getElementById(`template${i}-skills`);
    if (!section) {
      section = document.createElement("section");
      section.id = `template${i}-skills`;
      section.className = "preview-section";
      document.getElementById(`template${i}-layout`).appendChild(section);
    }

    section.innerHTML = "<h2>Skills</h2>";
    const list = document.createElement("ul");
    skills.forEach(skill => {
      const li = document.createElement("li");
      li.textContent = skill;
      list.appendChild(li);
    });

    section.appendChild(list);
    section.style.display = skills.length ? "block" : "none";
  }
}

setupSkillsSection();

//Project 
function addProject() {
  const container = document.getElementById("project-entries");
  const index = container.children.length;

  const entry = document.createElement("div");
  entry.className = "project-entry";
  entry.innerHTML = `
    <input type="text" placeholder="Project Title" class="project-title" />
    <textarea placeholder="Project Description" class="project-description"></textarea>
    <input type="text" placeholder="Technologies Used (e.g. HTML, CSS, JS)" class="project-tech" />
    <input type="text" placeholder="Project Link (optional)" class="project-link" />
    <button onclick="this.parentElement.remove(); removeProjectFromPreviews(${index});">Remove</button>
  `;
  container.appendChild(entry);

  const titleInput = entry.querySelector(".project-title");
  const descInput = entry.querySelector(".project-description");
  const techInput = entry.querySelector(".project-tech");
  const linkInput = entry.querySelector(".project-link");

  // Live preview creation
  document.querySelectorAll(".resume-layout").forEach(layout => {
    let section = layout.querySelector(".preview-projects");
    if (!section) {
      section = document.createElement("section");
      section.className = "preview-section preview-projects";
      layout.appendChild(section);
    }

    if (!section.querySelector("h2")) {
      const heading = document.createElement("h2");
      heading.textContent = "Projects";
      section.appendChild(heading);
    }

    const preview = document.createElement("div");
    preview.className = "project-preview";
    preview.setAttribute("data-index", index);
    preview.innerHTML = `
      <h3 class="proj-title">Project Title</h3>
      <p class="proj-description">Project Description</p>
      <p class="proj-tech"><strong>Technologies:</strong> Tech Used</p>
      <a class="proj-link" href="#" target="_blank" style="display:none;">View Project</a>
    `;
    section.appendChild(preview);
    section.style.display = "block";
  });

  // Update preview on input
  const updatePreviews = () => {
    const title = titleInput.value || "Project Title";
    const desc = descInput.value || "Project Description";
    const tech = techInput.value || "Tech Used";
    const link = linkInput.value.trim();

    document.querySelectorAll(".resume-layout").forEach(layout => {
      const preview = layout.querySelector(`.project-preview[data-index="${index}"]`);
      if (preview) {
        preview.querySelector(".proj-title").textContent = title;
        preview.querySelector(".proj-description").textContent = desc;
        preview.querySelector(".proj-tech").innerHTML = `<strong>Technologies:</strong> ${tech}`;
        const linkEl = preview.querySelector(".proj-link");
        if (link) {
          linkEl.href = link;
          linkEl.textContent = "View Project";
          linkEl.style.display = "inline-block";
        } else {
          linkEl.style.display = "none";
        }
      }
    });
  };

  [titleInput, descInput, techInput, linkInput].forEach(input => {
    input.addEventListener("input", updatePreviews);
  });
}

function removeProjectFromPreviews(index) {
  document.querySelectorAll(".resume-layout").forEach(layout => {
    const preview = layout.querySelector(`.project-preview[data-index="${index}"]`);
    if (preview) preview.remove();

    const section = layout.querySelector(".preview-projects");
    if (section && section.children.length <= 1) {
      section.style.display = "none";
    }
  });
}

//pdf and word
function downloadPDF() {
  const selectedTemplate = document.querySelector('.resume-layout:not([style*="display: none"])');
  if (!selectedTemplate) return alert("No resume content to download!");

  const opt = {
    margin: 0.3,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(selectedTemplate).set(opt).save();
}

function downloadWord() {
  const selectedTemplate = document.querySelector('.resume-layout:not([style*="display: none"])');
  if (!selectedTemplate) return alert("No resume content to download!");

  const content = selectedTemplate.outerHTML;

  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Resume</title></head><body>`;
  const footer = "</body></html>";
  const sourceHTML = header + content + footer;

  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = 'resume.doc';
  fileDownload.click();
  document.body.removeChild(fileDownload);
}

document.querySelector(".pdf-btn").addEventListener("click", downloadPDF);
document.querySelector(".word-btn").addEventListener("click", downloadWord);
