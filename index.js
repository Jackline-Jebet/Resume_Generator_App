
async function fetchData() {
    const url = 'https://script.google.com/macros/s/AKfycbz1DKbCXkEVTmCRnG4b0WmbhQOIr9mXrUZqiBqRqtjUNNCY9yttjGOe4NlhLSqtMSOmWQ/exec';
    try {
        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();
        allData = data.slice(1); // Remove headers from data
        populateFilterOptions(allData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function populateFilterOptions(data) {
    const filterSelect = document.getElementById('filter-select');
    data.forEach(entry => {
        const option = document.createElement('option');
        option.value = entry[1]; // Assuming the second column is Name
        option.textContent = entry[1];
        filterSelect.appendChild(option);
    });

    filterSelect.addEventListener('change', function () {
        const selectedName = this.value;
        const selectedData = data.find(entry => entry[1] === selectedName);
        populateCVForm(selectedData);
    });
}


function populateCVForm(data) {
if (data) {
// Personal Information
document.getElementById('cv-name').value = data[1] || '';
document.getElementById('cv-dob').value = data[2] || '';
document.getElementById('cv-nationality').value = data[3] || '';
document.getElementById('cv-email').value = data[3] || '';
document.getElementById('cv-phone').value = data[4] || '';
document.getElementById('cv-Stadt').value = data[6] || '';
document.getElementById('cv-marital-status').value = data[8] || '';
document.getElementById('cv-additional-info').value = data[9] || '';

const linkHref = data[2] || '';
document.getElementById('cv-image-link').href = linkHref;
document.getElementById('cv-image').src = linkHref;

// Experience

const experienceList = document.getElementById('cv-experience');
experienceList.innerHTML = '';  // Clear previous content

const dataString3 = data[10] || '';
const [companiesPart, rolesPart, responsibilitiesPart] = dataString3.split('~');

const companies = (companiesPart || '').split(',').map(comp => comp.trim());
const roles = (rolesPart || '').split(',').map(role => role.trim());
const responsibilities = (responsibilitiesPart || '').split(',').map(res => res.trim());

for (let i = 0; i < companies.length; i++) {
    const companyLi = document.createElement('li');
    companyLi.textContent = companies[i];
    
    const rolesUl = document.createElement('ul');
    if (roles[i]) {
        const roleItems = roles[i].split(',').map(role => role.trim());
        roleItems.forEach(role => {
            const roleLi = document.createElement('li');
            roleLi.textContent = role;

            const responsibilitiesUl = document.createElement('ul');
            const companyResponsibilities = responsibilities.slice(i * roleItems.length, (i + 1) * roleItems.length);
            companyResponsibilities.forEach(responsibility => {
                if (responsibility) {
                    const resLi = document.createElement('li');
                    resLi.textContent = responsibility;
                    responsibilitiesUl.appendChild(resLi);
                }
            });
            
            roleLi.appendChild(responsibilitiesUl);
            rolesUl.appendChild(roleLi);
        });
    }
    
    companyLi.appendChild(rolesUl);
    experienceList.appendChild(companyLi);
}



// Education
const educationList = document.getElementById('cv-education');
educationList.innerHTML = '';  // Clear previous content

const dataString2 = data[11] || '';
const [qualificationsPart, yearsPart] = dataString2.split('~');

const qualifications = (qualificationsPart || '').split(',').map(qual => qual.trim());
const years = (yearsPart || '').split(',').map(year => year.trim());

for (let i = 0; i < qualifications.length; i++) {
    const li = document.createElement('li');
    const yearText = years[i] ? ` (${years[i]})` : '';
    li.textContent = `${qualifications[i]}${yearText}`;
    educationList.appendChild(li);
}

// Referees
const refereesList = document.getElementById('cv-referees');
refereesList.innerHTML = '';  // Clear previous content

const dataStrings = data[16] || '';
const [refereesPart, employersPart] = dataStrings.split('~');

const referees = (refereesPart || '').split(',').map(ref => ref.trim());
const employers = (employersPart || '').split(',').map(emp => emp.trim());

for (let i = 0; i < referees.length; i++) {
    const li = document.createElement('li');
    const employerText = employers[i] ? ` - ${employers[i]}` : '';
    li.textContent = `${referees[i]}${employerText}`;
    refereesList.appendChild(li);
}

// Hobbies
const hobbiesList = document.getElementById('cv-hobbies');
hobbiesList.innerHTML = '';  // Clear previous content
const hobbies = (data[15] || '').split('\n');
hobbies.forEach(hobby => {
    const li = document.createElement('li');
    li.textContent = hobby.trim();
    hobbiesList.appendChild(li);
});

// Languages
const languagesList = document.getElementById('cv-languages');
languagesList.innerHTML = '';  // Clear previous content

const dataString = data[14] || '';
const [languagesPart, proficiencyPart] = dataString.split('~');

const languages = (languagesPart || '').split(',').map(lang => lang.trim());
const proficiencies = (proficiencyPart || '').split(',').map(level => level.trim());

for (let i = 0; i < languages.length; i++) {
    const li = document.createElement('li');
    const proficiencyText = proficiencies[i] ? ` - ${proficiencies[i]}` : '';
    li.textContent = `${languages[i]}${proficiencyText}`;
    languagesList.appendChild(li);
}

// Skills
const skillsList = document.getElementById('cv-skills-list');
skillsList.innerHTML = '';  // Clear previous content
const skills = (data[13] || '').split('\n');
skills.forEach(skill => {
    const li = document.createElement('li');
    li.textContent = skill.trim();
    skillsList.appendChild(li);
});

// Training
const trainingList = document.getElementById('cv-training');
trainingList.innerHTML = '';  // Clear previous content
const training = (data[12] || '').split(',');
training.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.trim();
    trainingList.appendChild(li);
});

document.getElementById('cv-content').style.display = 'block';
    }
}

function downloadPDF() {
    
    const element = document.getElementById('cv-content');
    const img = document.querySelector('#cv-image');
    const downloadButton = document.querySelector(".download-btn");

    
    // Hide the download button 
    downloadButton.style.display = 'none';

    // Remove background colors and borders from inputs and textarea
    
    document.querySelectorAll('input').forEach(input => {
            input.style.border = 'none';
            input.style.backgroundColor = 'transparent'; // Remove background color
            input.style.color = 'black'; // Ensures the text is visible
        });

    document.querySelectorAll('textarea').forEach(textarea => {
            textarea.style.border = 'none';
            textarea.style.backgroundColor = 'transparent'; // Remove background color
            textarea.style.color = 'black'; // Ensures the text is visible
        });
        

   
    // Wait for the image to load, then generate the PDF
    img.onload = () => generatePDF(element, downloadButton);
    img.onerror = () => {
        console.error('Image failed to load.');
        generatePDF(element, downloadButton);
    };

    // If the image is already loaded, generate the PDF immediately
    if (img.complete && img.naturalHeight > 0) {
        generatePDF(element, downloadButton);
    }
}

function generatePDF(element, downloadButton) {
    html2pdf().from(element).save().then(() => {
        downloadButton.style.display = 'block'; // Show the button after PDF is generated
    });
}


    
    document.addEventListener("DOMContentLoaded", function() {
        fetchData();
    });
    

  
    document.getElementById('profile-picture').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = function(e) {
            const imgElement = document.getElementById('cv-image');
            imgElement.src = e.target.result;
            imgElement.style.display = 'block'; // Ensure the image is visible
        };
    
        if (file) {
            reader.readAsDataURL(file); // Read the file as a Data URL
        }
    });

    
    
    document.getElementById('filter-select').addEventListener('change', function () {
        const selectedOption = this.value;
    
        // Check if the "--Select--" option is selected
        if (selectedOption === "") {
            // Refresh the page
            window.location.reload();
        } else {
            // Call your existing populateCVForm function or any other functionality for the selected option
            const selectedData = allData.find(entry => entry[1] === selectedOption);
            populateCVForm(selectedData);
        }
    });

