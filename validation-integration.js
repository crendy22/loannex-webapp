// Wait for DOM to be ready before initializing validation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize validation system
    const loanValidator = new LoanValidator();
    const validationUI = new ValidationUI(loanValidator);

    // Get DOM elements (now they exist)
    const fileUpload = document.getElementById('file-upload');
    const fileName = document.getElementById('file-name');
    const loanCount = document.getElementById('loan-count');
    const fileStatus = document.getElementById('file-status');
    const processBtn = document.getElementById('process-btn');
    const priceReviewBtn = document.getElementById('price-review-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Updated file upload handler with validation
    fileUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!validateCredentials()) {
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                loans = jsonData;
                
                // Show file upload success
                fileName.textContent = `✅ ${file.name}`;
                loanCount.textContent = `${loans.length} loans uploaded`;
                fileStatus.classList.remove('hidden');
                
                // Run validation immediately
                console.log('🔍 Running validation on uploaded loans...');
                const validationResults = loanValidator.validateLoans(loans);
                
                // Display validation results
                validationUI.displayValidationResults(loans, validationResults);
                
                console.log('📊 Validation complete:', validationResults.summary);
                
            } catch (error) {
                console.error('Error reading Excel file:', error);
                alert('Error reading Excel file. Please check the format.');
            }
        };
        reader.readAsArrayBuffer(file);
    });

    // Update reset button to clear validation
    const originalResetHandler = resetBtn.onclick;
    resetBtn.addEventListener('click', function() {
        // Clear validation section
        const validationSection = document.getElementById('validation-section');
        if (validationSection) {
            validationSection.classList.add('hidden');
        }
    });
});
