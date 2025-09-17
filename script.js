// Seen Jeem Quiz Game - Main JavaScript File
// Admin credentials: admin / 123456

// Game State
let gameState = {
    currentScreen: 'gameMode',
    gameMode: null,
    selectedCategories: [],
    currentQuestionIndex: 0,
    currentCategoryIndex: 0,
    playerScore: 0,
    botScore: 0,
    correctAnswers: 0,
    totalQuestionsAnswered: 0,
    timer: {
        timeLeft: 120, // 2 minutes in seconds
        interval: null,
        isRunning: false
    },
    gameData: {
        categories: [],
        questions: [],
        categoryResults: {}
    }
};

// User System
let userSystem = {
    currentUser: null,
    users: [],
    isLoggedIn: false
};

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    loadGameData();
    loadUserData();
    initializeGame();
    setupEventListeners();
    checkUserLoginStatus();
});

// Load data from localStorage
function loadGameData() {
    const savedCategories = localStorage.getItem('yem3aCategories');
    const savedQuestions = localStorage.getItem('yem3aQuestions');
    
    if (savedCategories) {
        gameState.gameData.categories = JSON.parse(savedCategories);
    }
    
    if (savedQuestions) {
        gameState.gameData.questions = JSON.parse(savedQuestions);
    }
    
    // Add default data if none exists
    if (gameState.gameData.categories.length === 0) {
        addDefaultData();
    }
}

// Save data to localStorage
function saveGameData() {
    localStorage.setItem('yem3aCategories', JSON.stringify(gameState.gameData.categories));
    localStorage.setItem('yem3aQuestions', JSON.stringify(gameState.gameData.questions));
}

// Add default categories and questions
function addDefaultData() {
    const defaultCategories = [
        { id: 1, name: 'الأفلام', description: 'أسئلة عن الأفلام والسينما' },
        { id: 2, name: 'التاريخ', description: 'أسئلة تاريخية متنوعة' },
        { id: 3, name: 'العلوم', description: 'أسئلة علمية وتعليمية' },
        { id: 4, name: 'الرياضة', description: 'أسئلة رياضية متنوعة' },
        { id: 5, name: 'الجغرافيا', description: 'أسئلة جغرافية حول العالم' },
        { id: 6, name: 'الثقافة العامة', description: 'أسئلة ثقافية متنوعة' }
    ];
    
    const defaultQuestions = [
        // أفلام
        { id: 1, categoryId: 1, text: 'ما هو اسم المخرج الذي أخرج فيلم "إنترستيلر"؟', answer: 'كريستوفر نولان', difficulty: 200 },
        { id: 2, categoryId: 1, text: 'في أي عام تم إنتاج فيلم "الأسد الملك"؟', answer: '1994', difficulty: 400 },
        { id: 3, categoryId: 1, text: 'ما هو اسم الشخصية الرئيسية في فيلم "فورست غامب"؟', answer: 'فورست غامب', difficulty: 200 },
        
        // تاريخ
        { id: 4, categoryId: 2, text: 'في أي عام وقعت الحرب العالمية الأولى؟', answer: '1914', difficulty: 200 },
        { id: 5, categoryId: 2, text: 'من هو أول خليفة في الإسلام؟', answer: 'أبو بكر الصديق', difficulty: 400 },
        { id: 6, categoryId: 2, text: 'في أي عام انتهت الحرب العالمية الثانية؟', answer: '1945', difficulty: 200 },
        
        // علوم
        { id: 7, categoryId: 3, text: 'ما هو الرمز الكيميائي للذهب؟', answer: 'Au', difficulty: 400 },
        { id: 8, categoryId: 3, text: 'كم عدد الكروموسومات في الإنسان؟', answer: '46', difficulty: 600 },
        { id: 9, categoryId: 3, text: 'ما هو أقرب كوكب للشمس؟', answer: 'عطارد', difficulty: 200 },
        
        // رياضة
        { id: 10, categoryId: 4, text: 'في أي دولة تقام بطولة كأس العالم لكرة القدم 2022؟', answer: 'قطر', difficulty: 200 },
        { id: 11, categoryId: 4, text: 'كم عدد اللاعبين في فريق كرة القدم؟', answer: '11', difficulty: 200 },
        { id: 12, categoryId: 4, text: 'ما هو لون الكرة في رياضة التنس؟', answer: 'أصفر', difficulty: 400 },
        
        // جغرافيا
        { id: 13, categoryId: 5, text: 'ما هو أكبر محيط في العالم؟', answer: 'المحيط الهادئ', difficulty: 200 },
        { id: 14, categoryId: 5, text: 'ما هي عاصمة اليابان؟', answer: 'طوكيو', difficulty: 200 },
        { id: 15, categoryId: 5, text: 'ما هو أطول نهر في العالم؟', answer: 'نهر النيل', difficulty: 400 },
        
        // ثقافة عامة
        { id: 16, categoryId: 6, text: 'من كتب رواية "مئة عام من العزلة"؟', answer: 'جابرييل غارسيا ماركيز', difficulty: 600 },
        { id: 17, categoryId: 6, text: 'ما هو اسم العملة الرسمية في اليابان؟', answer: 'الين', difficulty: 400 },
        { id: 18, categoryId: 6, text: 'من رسم لوحة "الموناليزا"؟', answer: 'ليوناردو دافنشي', difficulty: 200 }
    ];
    
    gameState.gameData.categories = defaultCategories;
    gameState.gameData.questions = defaultQuestions;
    saveGameData();
}

// User Management Functions
function loadUserData() {
    const savedUsers = localStorage.getItem('yem3aUsers');
    const currentUser = localStorage.getItem('yem3aCurrentUser');
    
    if (savedUsers) {
        userSystem.users = JSON.parse(savedUsers);
    }
    
    if (currentUser) {
        userSystem.currentUser = JSON.parse(currentUser);
        userSystem.isLoggedIn = true;
    }
}

function saveUserData() {
    localStorage.setItem('yem3aUsers', JSON.stringify(userSystem.users));
    if (userSystem.currentUser) {
        localStorage.setItem('yem3aCurrentUser', JSON.stringify(userSystem.currentUser));
    } else {
        localStorage.removeItem('yem3aCurrentUser');
    }
}

function checkUserLoginStatus() {
    if (userSystem.isLoggedIn && userSystem.currentUser) {
        showUserProfile();
    } else {
        showUserAuth();
    }
}

function showUserAuth() {
    document.getElementById('userAuthButtons').classList.remove('hidden');
    document.getElementById('userProfileButtons').classList.add('hidden');
}

function showUserProfile() {
    document.getElementById('userAuthButtons').classList.add('hidden');
    document.getElementById('userProfileButtons').classList.remove('hidden');
    document.getElementById('headerUserName').textContent = userSystem.currentUser.username;
}

function showUserLogin() {
    document.getElementById('userLoginModal').style.display = 'block';
    showLoginTab('login');
}

function closeUserLogin() {
    document.getElementById('userLoginModal').style.display = 'none';
    document.getElementById('userLoginForm').reset();
    document.getElementById('userRegisterForm').reset();
}

function showLoginTab(tabName) {
    const tabs = ['loginTab', 'registerTab'];
    const tabBtns = document.querySelectorAll('#userLoginModal .tab-btn');
    
    tabs.forEach(tab => {
        document.getElementById(tab).classList.remove('active');
    });
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

function registerUser(username, email, password) {
    // Check if user already exists
    const existingUser = userSystem.users.find(user => user.username === username || user.email === email);
    if (existingUser) {
        return { success: false, message: 'اسم المستخدم أو البريد الإلكتروني موجود بالفعل' };
    }
    
    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        password: password, // In real app, this should be hashed
        joinDate: new Date().toISOString(),
        totalScore: 0,
        gamesPlayed: 0,
        highestScore: 0,
        gameHistory: [],
        categoryStats: {},
        isAdmin: false
    };
    
    userSystem.users.push(newUser);
    saveUserData();
    
    return { success: true, message: 'تم إنشاء الحساب بنجاح' };
}

function loginUser(username, password) {
    const user = userSystem.users.find(user => user.username === username && user.password === password);
    if (user) {
        userSystem.currentUser = user;
        userSystem.isLoggedIn = true;
        saveUserData();
        return { success: true, message: 'تم تسجيل الدخول بنجاح' };
    } else {
        return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    }
}

function logout() {
    userSystem.currentUser = null;
    userSystem.isLoggedIn = false;
    saveUserData();
    showUserAuth();
    showScreen('gameModeScreen');
}

function updateUserStats(gameResult) {
    if (!userSystem.currentUser) return;
    
    const user = userSystem.users.find(u => u.id === userSystem.currentUser.id);
    if (!user) return;
    
    user.totalScore += gameResult.playerScore;
    user.gamesPlayed++;
    user.highestScore = Math.max(user.highestScore, gameResult.playerScore);
    
    // Add to game history
    user.gameHistory.unshift({
        id: Date.now(),
        date: new Date().toISOString(),
        mode: gameResult.mode,
        score: gameResult.playerScore,
        categories: gameResult.categories,
        totalQuestions: gameResult.totalQuestions,
        correctAnswers: gameResult.correctAnswers
    });
    
    // Keep only last 50 games
    if (user.gameHistory.length > 50) {
        user.gameHistory = user.gameHistory.slice(0, 50);
    }
    
    // Update category stats
    gameResult.categoryResults.forEach(result => {
        if (!user.categoryStats[result.categoryName]) {
            user.categoryStats[result.categoryName] = {
                totalQuestions: 0,
                correctAnswers: 0,
                gamesPlayed: 0
            };
        }
        
        user.categoryStats[result.categoryName].totalQuestions += result.totalQuestions;
        user.categoryStats[result.categoryName].correctAnswers += result.correctAnswers;
        user.categoryStats[result.categoryName].gamesPlayed++;
    });
    
    userSystem.currentUser = user;
    saveUserData();
}

// Initialize game screens
function initializeGame() {
    showScreen('gameModeScreen');
    updateDataStats();
}

// Setup event listeners
function setupEventListeners() {
    // Admin login form
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
    
    // Admin forms
    document.getElementById('addCategoryForm').addEventListener('submit', handleAddCategory);
    document.getElementById('addQuestionForm').addEventListener('submit', handleAddQuestion);
    
    // User forms
    document.getElementById('userLoginForm').addEventListener('submit', handleUserLogin);
    document.getElementById('userRegisterForm').addEventListener('submit', handleUserRegister);
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
}

// Screen management
function showScreen(screenId) {
    const screens = ['gameModeScreen', 'categorySelectionScreen', 'quizScreen', 'resultsScreen'];
    screens.forEach(screen => {
        document.getElementById(screen).classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
    gameState.currentScreen = screenId.replace('Screen', '');
}

// Admin Panel Functions
function showAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'block';
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'none';
    document.getElementById('adminLoginForm').reset();
}

function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Check for main admin account
    if (username === 'admin' && password === '123456') {
        closeAdminLogin();
        showAdminPanel();
        return;
    }
    
    // Check for promoted admin users
    const user = userSystem.users.find(u => u.username === username && u.password === password && u.isAdmin);
    if (user) {
        closeAdminLogin();
        showAdminPanel();
        return;
    }
    
    showNotification('error', 'خطأ في تسجيل الدخول', 'اسم المستخدم أو كلمة المرور غير صحيحة أو ليس لديك صلاحيات إدارية');
}

function showAdminPanel() {
    document.getElementById('gameContainer').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    loadAdminData();
}

function exitAdmin() {
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
}

function showAdminTab(tabName) {
    const tabs = ['categoriesTab', 'questionsTab', 'usersTab', 'dataTab'];
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        document.getElementById(tab).classList.remove('active');
    });
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'questions') {
        loadQuestionsList();
    } else if (tabName === 'users') {
        loadUsersList();
    }
}

function loadAdminData() {
    loadCategoriesList();
    loadQuestionsList();
    updateDataStats();
    populateCategorySelects();
}

function loadCategoriesList() {
    const container = document.getElementById('categoriesList');
    container.innerHTML = '';
    
    gameState.gameData.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'list-item';
        categoryDiv.innerHTML = `
            <div>
                <h4>${category.name}</h4>
                <p>${category.description || 'لا يوجد وصف'}</p>
                <p><small>عدد الأسئلة: ${getQuestionsCountByCategory(category.id)}</small></p>
            </div>
            <div class="list-item-actions">
                <button class="btn btn-small btn-danger" onclick="deleteCategory(${category.id})">حذف</button>
            </div>
        `;
        container.appendChild(categoryDiv);
    });
}

function loadQuestionsList() {
    const container = document.getElementById('questionsList');
    const filterCategory = document.getElementById('filterCategory').value;
    container.innerHTML = '';
    
    let filteredQuestions = gameState.gameData.questions;
    if (filterCategory) {
        filteredQuestions = gameState.gameData.questions.filter(q => q.categoryId == filterCategory);
    }
    
    filteredQuestions.forEach(question => {
        const category = gameState.gameData.categories.find(c => c.id === question.categoryId);
        const questionDiv = document.createElement('div');
        questionDiv.className = 'list-item';
        questionDiv.innerHTML = `
            <div>
                <h4>${question.text}</h4>
                <p><strong>الفئة:</strong> ${category ? category.name : 'غير محدد'}</p>
                <p><strong>الإجابة الصحيحة:</strong> ${question.answer}</p>
                <p><strong>مستوى الصعوبة:</strong> ${question.difficulty} نقطة</p>
            </div>
            <div class="list-item-actions">
                <button class="btn btn-small btn-danger" onclick="deleteQuestion(${question.id})">حذف</button>
            </div>
        `;
        container.appendChild(questionDiv);
    });
}

function populateCategorySelects() {
    const selects = ['questionCategory', 'filterCategory'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '';
        
        if (selectId === 'filterCategory') {
            const allOption = document.createElement('option');
            allOption.value = '';
            allOption.textContent = 'جميع الفئات';
            select.appendChild(allOption);
        }
        
        gameState.gameData.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    });
}

function getQuestionsCountByCategory(categoryId) {
    return gameState.gameData.questions.filter(q => q.categoryId === categoryId).length;
}

function handleAddCategory(e) {
    e.preventDefault();
    const name = document.getElementById('categoryName').value.trim();
    const description = document.getElementById('categoryDescription').value.trim();
    
    if (name) {
        const newCategory = {
            id: Date.now(),
            name: name,
            description: description
        };
        
        gameState.gameData.categories.push(newCategory);
        saveGameData();
        loadCategoriesList();
        populateCategorySelects();
        updateDataStats();
        document.getElementById('addCategoryForm').reset();
    }
}

function handleAddQuestion(e) {
    e.preventDefault();
    const categoryId = parseInt(document.getElementById('questionCategory').value);
    const text = document.getElementById('questionText').value.trim();
    const answer = document.getElementById('questionAnswer').value.trim();
    const difficulty = parseInt(document.getElementById('questionDifficulty').value);
    
    if (categoryId && text && answer) {
        const newQuestion = {
            id: Date.now(),
            categoryId: categoryId,
            text: text,
            answer: answer,
            difficulty: difficulty
        };
        
        gameState.gameData.questions.push(newQuestion);
        saveGameData();
        loadQuestionsList();
        updateDataStats();
        document.getElementById('addQuestionForm').reset();
    }
}

function deleteCategory(categoryId) {
    if (confirm('هل أنت متأكد من حذف هذه الفئة؟ سيتم حذف جميع الأسئلة المرتبطة بها.')) {
        gameState.gameData.categories = gameState.gameData.categories.filter(c => c.id !== categoryId);
        gameState.gameData.questions = gameState.gameData.questions.filter(q => q.categoryId !== categoryId);
        saveGameData();
        loadCategoriesList();
        loadQuestionsList();
        populateCategorySelects();
        updateDataStats();
    }
}

function deleteQuestion(questionId) {
    if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
        gameState.gameData.questions = gameState.gameData.questions.filter(q => q.id !== questionId);
        saveGameData();
        loadQuestionsList();
        updateDataStats();
    }
}

function filterQuestions() {
    loadQuestionsList();
}

function updateDataStats() {
    document.getElementById('categoriesCount').textContent = gameState.gameData.categories.length;
    document.getElementById('questionsCount').textContent = gameState.gameData.questions.length;
}

function exportData() {
    const data = {
        categories: gameState.gameData.categories,
        questions: gameState.gameData.questions,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seen-jeem-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData() {
    document.getElementById('importFile').click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.categories && data.questions) {
                    if (confirm('هل تريد استبدال جميع البيانات الحالية بالبيانات المستوردة؟')) {
                        gameState.gameData.categories = data.categories;
                        gameState.gameData.questions = data.questions;
                        saveGameData();
                        loadAdminData();
                        showNotification('success', 'نجح الاستيراد', 'تم استيراد البيانات بنجاح');
                    }
                } else {
                    showNotification('error', 'ملف غير صالح', 'الملف المستورد لا يحتوي على البيانات المطلوبة');
                }
            } catch (error) {
                showNotification('error', 'خطأ في قراءة الملف', 'تعذر قراءة الملف المحدد');
            }
        };
        reader.readAsText(file);
    }
}

function resetAllData() {
    if (confirm('هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
        if (confirm('تأكيد نهائي: مسح جميع البيانات؟')) {
            gameState.gameData.categories = [];
            gameState.gameData.questions = [];
            localStorage.removeItem('yem3aCategories');
            localStorage.removeItem('yem3aQuestions');
            addDefaultData();
            loadAdminData();
            showNotification('success', 'تم مسح البيانات', 'تم مسح جميع البيانات وإعادة تعيين البيانات الافتراضية');
        }
    }
}

// User Management Functions
function loadUsersList() {
    const container = document.getElementById('usersList');
    container.innerHTML = '';
    
    userSystem.users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        
        const joinDate = new Date(user.joinDate).toLocaleDateString('ar-SA');
        const adminBadge = user.isAdmin ? '<span class="admin-badge">مدير</span>' : '';
        
        userDiv.innerHTML = `
            <div class="user-info">
                <h4>${adminBadge}${user.username}</h4>
                <p><strong>البريد الإلكتروني:</strong> ${user.email}</p>
                <p><strong>تاريخ الانضمام:</strong> ${joinDate}</p>
                <div class="user-stats">
                    <span class="user-stat">الألعاب: ${user.gamesPlayed}</span>
                    <span class="user-stat">النقاط: ${user.totalScore}</span>
                    <span class="user-stat">أعلى نتيجة: ${user.highestScore}</span>
                </div>
            </div>
            <div class="user-actions">
                ${!user.isAdmin ? `<button class="btn btn-small btn-warning" onclick="toggleAdminStatus(${user.id})">تعيين مدير</button>` : `<button class="btn btn-small btn-secondary" onclick="toggleAdminStatus(${user.id})">إلغاء المديرية</button>`}
                <button class="btn btn-small btn-danger" onclick="deleteUser(${user.id})">حذف المستخدم</button>
            </div>
        `;
        container.appendChild(userDiv);
    });
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const userItems = document.querySelectorAll('.user-item');
    
    userItems.forEach(item => {
        const username = item.querySelector('h4').textContent.toLowerCase();
        const email = item.querySelector('p').textContent.toLowerCase();
        
        if (username.includes(searchTerm) || email.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function toggleAdminStatus(userId) {
    const user = userSystem.users.find(u => u.id === userId);
    if (user) {
        user.isAdmin = !user.isAdmin;
        saveUserData();
        loadUsersList();
        showNotification('success', 'تم تحديث الصلاحيات', user.isAdmin ? 'تم تعيين المستخدم كمدير' : 'تم إلغاء صلاحيات المدير');
    }
}

function deleteUser(userId) {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.')) {
        userSystem.users = userSystem.users.filter(u => u.id !== userId);
        if (userSystem.currentUser && userSystem.currentUser.id === userId) {
            logout();
        }
        saveUserData();
        loadUsersList();
        showNotification('success', 'تم حذف المستخدم', 'تم حذف المستخدم بنجاح');
    }
}

// Excel Import Functions
function handleExcelImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    document.getElementById('excelFileName').textContent = file.name;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const text = e.target.result;
            const questions = parseExcelData(text);
            
            if (questions.length > 0) {
                if (confirm(`تم العثور على ${questions.length} سؤال. هل تريد إضافتها إلى قاعدة البيانات؟`)) {
                    addBulkQuestions(questions);
                }
            } else {
                showNotification('warning', 'لا توجد أسئلة صالحة', 'لم يتم العثور على أسئلة صالحة في الملف');
            }
        } catch (error) {
            showNotification('error', 'خطأ في قراءة الملف', 'تعذر قراءة الملف: ' + error.message);
        }
    };
    
    if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
    } else {
        showNotification('info', 'تنسيق الملف', 'يرجى استخدام ملف CSV. يمكنك تصدير ملف Excel كـ CSV');
    }
}

function parseExcelData(text) {
    const lines = text.split('\n');
    const questions = [];
    
    // Find header row
    let headerIndex = -1;
    let questionCol = -1, categoryCol = -1, answerCol = -1, levelCol = -1;
    
    for (let i = 0; i < lines.length; i++) {
        const row = lines[i].split(',').map(cell => cell.trim().toLowerCase());
        if (row.includes('question') && row.includes('category') && row.includes('answer') && row.includes('level')) {
            headerIndex = i;
            questionCol = row.indexOf('question');
            categoryCol = row.indexOf('category');
            answerCol = row.indexOf('answer');
            levelCol = row.indexOf('level');
            break;
        }
    }
    
    if (headerIndex === -1) {
        throw new Error('لم يتم العثور على الأعمدة المطلوبة في الملف');
    }
    
    // Parse data rows
    for (let i = headerIndex + 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(cell => cell.trim().replace(/"/g, ''));
        if (row.length > Math.max(questionCol, categoryCol, answerCol, levelCol)) {
            const questionText = row[questionCol];
            const categoryName = row[categoryCol];
            const answer = row[answerCol];
            const level = parseInt(row[levelCol]);
            
            if (questionText && categoryName && answer && level) {
                // Find category ID
                const category = gameState.gameData.categories.find(c => c.name === categoryName);
                if (category && [200, 400, 600].includes(level)) {
                    questions.push({
                        categoryId: category.id,
                        text: questionText,
                        answer: answer,
                        difficulty: level
                    });
                }
            }
        }
    }
    
    return questions;
}

function addBulkQuestions(questions) {
    let addedCount = 0;
    
    questions.forEach(questionData => {
        const newQuestion = {
            id: Date.now() + Math.random(), // Ensure unique IDs
            categoryId: questionData.categoryId,
            text: questionData.text,
            answer: questionData.answer,
            difficulty: questionData.difficulty
        };
        
        gameState.gameData.questions.push(newQuestion);
        addedCount++;
    });
    
    saveGameData();
    loadQuestionsList();
    updateDataStats();
    
    showNotification('success', 'تم إضافة الأسئلة', `تم إضافة ${addedCount} سؤال بنجاح`);
    document.getElementById('excelFileName').textContent = '';
    document.getElementById('excelFile').value = '';
}

// User Form Handlers
function handleUserLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const result = loginUser(username, password);
    if (result.success) {
        closeUserLogin();
        showUserProfile();
        showNotification('success', 'تم تسجيل الدخول', result.message);
    } else {
        showNotification('error', 'فشل تسجيل الدخول', result.message);
    }
}

function handleUserRegister(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('warning', 'كلمة المرور', 'كلمة المرور غير متطابقة');
        return;
    }
    
    if (password.length < 6) {
        showNotification('warning', 'كلمة المرور قصيرة', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }
    
    const result = registerUser(username, email, password);
    if (result.success) {
        closeUserLogin();
        showNotification('success', 'تم إنشاء الحساب', result.message);
        showLoginTab('login');
    } else {
        showNotification('error', 'فشل إنشاء الحساب', result.message);
    }
}

function handleChangePassword(e) {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (userSystem.currentUser.password !== currentPassword) {
        showNotification('error', 'كلمة المرور الحالية', 'كلمة المرور الحالية غير صحيحة');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        showNotification('warning', 'كلمة المرور الجديدة', 'كلمة المرور الجديدة غير متطابقة');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('warning', 'كلمة المرور قصيرة', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }
    
    const user = userSystem.users.find(u => u.id === userSystem.currentUser.id);
    if (user) {
        user.password = newPassword;
        userSystem.currentUser.password = newPassword;
        saveUserData();
        document.getElementById('changePasswordForm').reset();
        showNotification('success', 'تم تغيير كلمة المرور', 'تم تغيير كلمة المرور بنجاح');
    }
}

// User Dashboard Functions
function showUserDashboard() {
    document.getElementById('gameContainer').classList.add('hidden');
    document.getElementById('userDashboard').classList.remove('hidden');
    loadUserDashboard();
}

function exitUserDashboard() {
    document.getElementById('userDashboard').classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
}

function showDashboardTab(tabName) {
    const tabs = ['statsTab', 'historyTab', 'profileTab'];
    const tabBtns = document.querySelectorAll('#userDashboard .tab-btn');
    
    tabs.forEach(tab => {
        document.getElementById(tab).classList.remove('active');
    });
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'stats') {
        loadUserStats();
    } else if (tabName === 'history') {
        loadGameHistory();
    } else if (tabName === 'profile') {
        loadUserProfile();
    }
}

function loadUserDashboard() {
    if (!userSystem.currentUser) return;
    
    const user = userSystem.currentUser;
    
    // Update header
    document.getElementById('currentUserName').textContent = user.username;
    document.getElementById('totalUserScore').textContent = user.totalScore;
    
    // Load profile info
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileJoinDate').textContent = new Date(user.joinDate).toLocaleDateString('ar-SA');
    
    // Load stats
    loadUserStats();
}

function loadUserStats() {
    if (!userSystem.currentUser) return;
    
    const user = userSystem.currentUser;
    
    // Update main stats
    document.getElementById('totalGamesPlayed').textContent = user.gamesPlayed;
    document.getElementById('highestScore').textContent = user.highestScore;
    document.getElementById('averageScore').textContent = user.gamesPlayed > 0 ? Math.round(user.totalScore / user.gamesPlayed) : 0;
    
    // Calculate success rate
    let totalQuestions = 0;
    let correctAnswers = 0;
    Object.values(user.categoryStats).forEach(stat => {
        totalQuestions += stat.totalQuestions;
        correctAnswers += stat.correctAnswers;
    });
    const successRate = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    document.getElementById('successRate').textContent = successRate + '%';
    
    // Load category stats
    loadCategoryStats();
}

function loadCategoryStats() {
    const container = document.getElementById('categoryStatsContainer');
    container.innerHTML = '';
    
    if (!userSystem.currentUser) return;
    
    const categoryStats = userSystem.currentUser.categoryStats;
    
    if (Object.keys(categoryStats).length === 0) {
        container.innerHTML = '<p>لا توجد إحصائيات متاحة بعد</p>';
        return;
    }
    
    Object.entries(categoryStats).forEach(([categoryName, stats]) => {
        const statItem = document.createElement('div');
        statItem.className = 'category-stat-item';
        
        const accuracy = stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;
        
        statItem.innerHTML = `
            <h4>${categoryName}</h4>
            <div class="stat-info">
                <span>الألعاب: ${stats.gamesPlayed}</span>
                <span>الأسئلة: ${stats.totalQuestions}</span>
                <span>الإجابات الصحيحة: ${stats.correctAnswers}</span>
                <span>نسبة النجاح: ${accuracy}%</span>
            </div>
        `;
        container.appendChild(statItem);
    });
}

function loadGameHistory() {
    const container = document.getElementById('gameHistoryContainer');
    container.innerHTML = '';
    
    if (!userSystem.currentUser || userSystem.currentUser.gameHistory.length === 0) {
        container.innerHTML = '<p>لا توجد ألعاب سابقة</p>';
        return;
    }
    
    userSystem.currentUser.gameHistory.forEach(game => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = new Date(game.date).toLocaleDateString('ar-SA');
        const mode = game.mode === 'solo' ? 'فردي' : 'ضد البوت';
        
        historyItem.innerHTML = `
            <div class="history-item-header">
                <h4>لعبة ${mode}</h4>
                <span class="history-date">${date}</span>
            </div>
            <div class="history-details">
                <div class="history-detail">
                    <strong>النقاط</strong>
                    <span>${game.score}</span>
                </div>
                <div class="history-detail">
                    <strong>الأسئلة</strong>
                    <span>${game.totalQuestions}</span>
                </div>
                <div class="history-detail">
                    <strong>الإجابات الصحيحة</strong>
                    <span>${game.correctAnswers}</span>
                </div>
                <div class="history-detail">
                    <strong>الفئات</strong>
                    <span>${game.categories.length}</span>
                </div>
            </div>
        `;
        container.appendChild(historyItem);
    });
}

function loadUserProfile() {
    // Profile info is already loaded in loadUserDashboard()
}

function startNewGame() {
    exitUserDashboard();
    showScreen('gameModeScreen');
}

// Timer Functions
function startTimer() {
    if (gameState.timer.interval) {
        clearInterval(gameState.timer.interval);
    }
    
    gameState.timer.timeLeft = 120; // Reset to 2 minutes
    gameState.timer.isRunning = true;
    updateTimerDisplay();
    
    gameState.timer.interval = setInterval(() => {
        gameState.timer.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timer.timeLeft <= 0) {
            stopTimer();
            autoShowAnswer();
        }
    }, 1000);
}

function stopTimer() {
    if (gameState.timer.interval) {
        clearInterval(gameState.timer.interval);
        gameState.timer.interval = null;
    }
    gameState.timer.isRunning = false;
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timer.timeLeft / 60);
    const seconds = gameState.timer.timeLeft % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.textContent = timeString;
    
    // Change color based on time left
    const timerElement = timerDisplay.parentElement;
    timerElement.classList.remove('warning', 'danger');
    
    if (gameState.timer.timeLeft <= 30) {
        timerElement.classList.add('danger');
    } else if (gameState.timer.timeLeft <= 60) {
        timerElement.classList.add('warning');
    }
}

function autoShowAnswer() {
    // Automatically show answer when timer reaches 0
    if (!document.getElementById('answerContainer').classList.contains('hidden')) {
        return; // Answer already shown
    }
    
    showAnswer();
    
    // Show notification that time is up
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff416c;
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        font-size: 1.2rem;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    notification.textContent = 'انتهى الوقت! تم إظهار الإجابة تلقائياً';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Game Functions
function startGame(mode) {
    gameState.gameMode = mode;
    gameState.selectedCategories = [];
    gameState.playerScore = 0;
    gameState.botScore = 0;
    gameState.correctAnswers = 0;
    gameState.totalQuestionsAnswered = 0;
    gameState.timer.timeLeft = 120;
    gameState.gameData.categoryResults = {};
    
    stopTimer(); // Stop any running timer
    loadCategorySelection();
    showScreen('categorySelectionScreen');
}

function loadCategorySelection() {
    const container = document.getElementById('categoriesContainer');
    container.innerHTML = '';
    
    gameState.gameData.categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.innerHTML = `
            <h3>${category.name}</h3>
            <p>${category.description || ''}</p>
            <p><small>عدد الأسئلة: ${getQuestionsCountByCategory(category.id)}</small></p>
        `;
        
        categoryCard.addEventListener('click', () => toggleCategorySelection(category.id, categoryCard));
        container.appendChild(categoryCard);
    });
    
    updateSelectionInfo();
}

function toggleCategorySelection(categoryId, cardElement) {
    // Clear all selected categories first
    gameState.selectedCategories = [];
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Select only the clicked category
    gameState.selectedCategories.push(categoryId);
    cardElement.classList.add('selected');
    
    updateSelectionInfo();
}

function updateSelectionInfo() {
    const selectedCount = document.getElementById('selectedCount');
    const startBtn = document.getElementById('startQuizBtn');
    
    selectedCount.textContent = gameState.selectedCategories.length;
    startBtn.disabled = gameState.selectedCategories.length !== 1;
}

function startQuiz() {
    if (gameState.selectedCategories.length === 1) {
        gameState.currentCategoryIndex = 0;
        gameState.currentQuestionIndex = 0;
        loadQuestion();
        showScreen('quizScreen');
        startTimer(); // Start the 2-minute timer
    } else {
        showNotification('warning', 'اختيار الفئة', 'يجب اختيار فئة واحدة قبل بدء المسابقة');
    }
}

function loadQuestion() {
    const currentCategoryId = gameState.selectedCategories[gameState.currentCategoryIndex];
    const category = gameState.gameData.categories.find(c => c.id === currentCategoryId);
    const questions = gameState.gameData.questions.filter(q => q.categoryId === currentCategoryId);
    
    if (questions.length === 0) {
        nextCategory();
        return;
    }
    
    const question = questions[gameState.currentQuestionIndex];
    
    // Debug: Log question data
    console.log('Current question:', question);
    console.log('Question text:', question.text);
    console.log('Question answer:', question.answer);
    
    // Update header
    document.getElementById('currentCategory').textContent = category.name;
    document.getElementById('questionNumber').textContent = gameState.currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = questions.length;
    document.getElementById('playerScore').textContent = gameState.playerScore;
    
    // Show/hide bot score
    const botScoreDisplay = document.getElementById('botScoreDisplay');
    const botScore = document.getElementById('botScore');
    if (gameState.gameMode === 'bot') {
        botScoreDisplay.classList.remove('hidden');
        botScore.textContent = gameState.botScore;
    } else {
        botScoreDisplay.classList.add('hidden');
    }
    
    // Load question
    const questionTextElement = document.getElementById('quizQuestionText');
    const questionPointsElement = document.getElementById('quizQuestionPoints');
    const questionAnswerElement = document.getElementById('quizQuestionAnswer');
    
    console.log('Question text element:', questionTextElement);
    console.log('Question points element:', questionPointsElement);
    console.log('Question answer element:', questionAnswerElement);
    
    if (questionTextElement) {
        questionTextElement.textContent = question.text;
    }
    if (questionPointsElement) {
        questionPointsElement.textContent = question.difficulty + ' نقطة';
    }
    if (questionAnswerElement) {
        questionAnswerElement.textContent = question.answer;
    }
    
    // Hide answer container
    document.getElementById('answerContainer').classList.add('hidden');
    
    // Show/hide action buttons
    document.getElementById('showAnswerBtn').classList.remove('hidden');
    document.getElementById('correctBtn').classList.add('hidden');
    document.getElementById('incorrectBtn').classList.add('hidden');
    document.getElementById('nextQuestionBtn').classList.add('hidden');
    document.getElementById('finishQuizBtn').classList.add('hidden');
}

function showAnswer() {
    stopTimer(); // Stop the timer when answer is revealed
    document.getElementById('answerContainer').classList.remove('hidden');
    document.getElementById('showAnswerBtn').classList.add('hidden');
    document.getElementById('correctBtn').classList.remove('hidden');
    document.getElementById('incorrectBtn').classList.remove('hidden');
}

function markCorrect() {
    const currentCategoryId = gameState.selectedCategories[gameState.currentCategoryIndex];
    const questions = gameState.gameData.questions.filter(q => q.categoryId === currentCategoryId);
    const question = questions[gameState.currentQuestionIndex];
    
    gameState.totalQuestionsAnswered++;
    gameState.correctAnswers++;
    gameState.playerScore += question.difficulty;
    document.getElementById('playerScore').textContent = gameState.playerScore;
    
    // Show success message
    showNotification('success', 'إجابة صحيحة!', 'صحتيننن 🎉', 3000);
    
    // Bot logic
    if (gameState.gameMode === 'bot') {
        const botCorrect = Math.random() < 0.7; // 70% chance bot gets it right
        if (botCorrect) {
            gameState.botScore += question.difficulty;
            document.getElementById('botScore').textContent = gameState.botScore;
        }
    }
    
    showNextButton();
}

function markIncorrect() {
    const currentCategoryId = gameState.selectedCategories[gameState.currentCategoryIndex];
    const questions = gameState.gameData.questions.filter(q => q.categoryId === currentCategoryId);
    const question = questions[gameState.currentQuestionIndex];
    
    gameState.totalQuestionsAnswered++;
    
    // Show error message
    showNotification('error', 'إجابة خاطئة', 'تكبر و تنسى 😅', 3000);
    
    // Bot logic
    if (gameState.gameMode === 'bot') {
        const botCorrect = Math.random() < 0.7; // 70% chance bot gets it right
        if (botCorrect) {
            gameState.botScore += question.difficulty;
            document.getElementById('botScore').textContent = gameState.botScore;
        }
    }
    
    showNextButton();
}

function showNextButton() {
    const currentCategoryId = gameState.selectedCategories[gameState.currentCategoryIndex];
    const questions = gameState.gameData.questions.filter(q => q.categoryId === currentCategoryId);
    
    setTimeout(() => {
        const isLastQuestion = gameState.currentQuestionIndex === questions.length - 1;
        const isLastCategory = gameState.currentCategoryIndex === gameState.selectedCategories.length - 1;
        
        document.getElementById('correctBtn').classList.add('hidden');
        document.getElementById('incorrectBtn').classList.add('hidden');
        
        if (isLastQuestion && isLastCategory) {
            document.getElementById('finishQuizBtn').classList.remove('hidden');
        } else {
            document.getElementById('nextQuestionBtn').classList.remove('hidden');
        }
    }, 1000);
}

function selectAnswer(selectedAnswer, buttonElement) {
    const currentCategoryId = gameState.selectedCategories[gameState.currentCategoryIndex];
    const questions = gameState.gameData.questions.filter(q => q.categoryId === currentCategoryId);
    const question = questions[gameState.currentQuestionIndex];
    
    // Disable all options
    const allOptions = document.querySelectorAll('.option-btn');
    allOptions.forEach(btn => btn.disabled = true);
    
    // Show correct/incorrect answers
    allOptions.forEach((btn, index) => {
        if (index + 1 === question.correctAnswer) {
            btn.classList.add('correct');
        } else if (index + 1 === selectedAnswer && selectedAnswer !== question.correctAnswer) {
            btn.classList.add('incorrect');
        }
    });
    
    // Update scores
    gameState.totalQuestionsAnswered++;
    if (selectedAnswer === question.correctAnswer) {
        gameState.playerScore += 10;
        gameState.correctAnswers++;
        document.getElementById('playerScore').textContent = gameState.playerScore;
    }
    
    // Bot logic
    if (gameState.gameMode === 'bot') {
        const botAnswer = Math.random() < 0.7 ? question.correctAnswer : Math.floor(Math.random() * 4) + 1;
        if (botAnswer === question.correctAnswer) {
            gameState.botScore += 10;
            document.getElementById('botScore').textContent = gameState.botScore;
        }
    }
    
    // Show next button
    setTimeout(() => {
        const isLastQuestion = gameState.currentQuestionIndex === questions.length - 1;
        const isLastCategory = gameState.currentCategoryIndex === gameState.selectedCategories.length - 1;
        
        if (isLastQuestion && isLastCategory) {
            document.getElementById('finishQuizBtn').classList.remove('hidden');
        } else {
            document.getElementById('nextQuestionBtn').classList.remove('hidden');
        }
    }, 1500);
}

function nextQuestion() {
    const currentCategoryId = gameState.selectedCategories[gameState.currentCategoryIndex];
    const questions = gameState.gameData.questions.filter(q => q.categoryId === currentCategoryId);
    
    if (gameState.currentQuestionIndex < questions.length - 1) {
        gameState.currentQuestionIndex++;
        loadQuestion();
        startTimer(); // Restart timer for next question
    } else {
        // No more questions in this category, finish the quiz
        finishQuiz();
    }
}

function nextCategory() {
    // Since we only have one category now, finish the quiz
    finishQuiz();
}

function finishQuiz() {
    stopTimer(); // Stop the timer when quiz finishes
    
    // Calculate game results for user stats
    if (userSystem.isLoggedIn && userSystem.currentUser) {
        const gameResult = {
            mode: gameState.gameMode,
            playerScore: gameState.playerScore,
            categories: gameState.selectedCategories.map(id => {
                const category = gameState.gameData.categories.find(c => c.id === id);
                return category ? category.name : 'غير محدد';
            }),
            totalQuestions: gameState.gameData.questions.filter(q => q.categoryId === gameState.selectedCategories[0]).length,
            correctAnswers: gameState.correctAnswers,
            categoryResults: [{
                categoryName: gameState.gameData.categories.find(c => c.id === gameState.selectedCategories[0]).name,
                totalQuestions: gameState.gameData.questions.filter(q => q.categoryId === gameState.selectedCategories[0]).length,
                correctAnswers: gameState.correctAnswers
            }]
        };
        
        updateUserStats(gameResult);
    }
    
    showScreen('resultsScreen');
    displayResults();
}

function displayResults() {
    document.getElementById('finalPlayerScore').textContent = gameState.playerScore;
    
    if (gameState.gameMode === 'bot') {
        document.getElementById('finalBotScoreDisplay').classList.remove('hidden');
        document.getElementById('finalBotScore').textContent = gameState.botScore;
    }
    
    // Results message
    const resultsMessage = document.getElementById('resultsMessage');
    let message = '';
    
    const totalPossibleScore = gameState.gameData.questions.filter(q => q.categoryId === gameState.selectedCategories[0]).reduce((total, q) => total + q.difficulty, 0);
    
    const percentage = totalPossibleScore > 0 ? (gameState.playerScore / totalPossibleScore) * 100 : 0;
    
    if (gameState.gameMode === 'solo') {
        if (percentage >= 80) {
            message = 'ممتاز! أداء رائع!';
        } else if (percentage >= 60) {
            message = 'جيد جداً!';
        } else if (percentage >= 40) {
            message = 'مقبول';
        } else {
            message = 'حاول مرة أخرى!';
        }
    } else {
        if (gameState.playerScore > gameState.botScore) {
            message = 'مبروك! لقد فزت على البوت!';
        } else if (gameState.playerScore === gameState.botScore) {
            message = 'تعادل! نتيجة متقاربة!';
        } else {
            message = 'البوت فاز هذه المرة! جرب مرة أخرى!';
        }
    }
    
    resultsMessage.textContent = message;
    
    // Category breakdown
    const breakdownContainer = document.getElementById('categoryBreakdown');
    breakdownContainer.innerHTML = '';
    
    const categoryId = gameState.selectedCategories[0];
    const category = gameState.gameData.categories.find(c => c.id === categoryId);
    const questions = gameState.gameData.questions.filter(q => q.categoryId === categoryId);
    
    const breakdownItem = document.createElement('div');
    breakdownItem.className = 'breakdown-item';
    
    const totalPoints = questions.reduce((total, q) => total + q.difficulty, 0);
    const easyCount = questions.filter(q => q.difficulty === 200).length;
    const mediumCount = questions.filter(q => q.difficulty === 400).length;
    const hardCount = questions.filter(q => q.difficulty === 600).length;
    
    breakdownItem.innerHTML = `
        <h5>${category.name}</h5>
        <span>${questions.length} أسئلة (${totalPoints} نقطة)</span>
        <small style="display: block; color: #666; margin-top: 5px;">
            سهل: ${easyCount} | متوسط: ${mediumCount} | صعب: ${hardCount}
        </small>
    `;
    breakdownContainer.appendChild(breakdownItem);
}

function playAgain() {
    showScreen('gameModeScreen');
}

function backToMenu() {
    showScreen('gameModeScreen');
}

// Utility functions
function getRandomQuestions(categoryId, count) {
    const categoryQuestions = gameState.gameData.questions.filter(q => q.categoryId === categoryId);
    const shuffled = categoryQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Add some additional utility functions for better user experience
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Add keyboard support for accessibility
document.addEventListener('keydown', function(e) {
    if (gameState.currentScreen === 'quiz') {
        if (e.key >= '1' && e.key <= '4') {
            const optionIndex = parseInt(e.key) - 1;
            const options = document.querySelectorAll('.option-btn');
            if (options[optionIndex] && !options[optionIndex].disabled) {
                options[optionIndex].click();
            }
        } else if (e.key === 'Enter') {
            const nextBtn = document.getElementById('nextQuestionBtn');
            const finishBtn = document.getElementById('finishQuizBtn');
            if (!nextBtn.classList.contains('hidden')) {
                nextBtn.click();
            } else if (!finishBtn.classList.contains('hidden')) {
                finishBtn.click();
            }
        }
    }
});

// Add loading states and error handling
function showLoading(element) {
    element.innerHTML = '<span class="loading"></span> جاري التحميل...';
}

function showError(message) {
    showNotification('error', 'خطأ', message);
}

// Professional Notification System
function showNotification(type, title, message, duration = 5000) {
    const container = document.getElementById('notificationContainer');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = getNotificationIcon(type);
    
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="closeNotification(this)">×</button>
        <div class="notification-progress"></div>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            removeNotification(notification);
        }
    }, duration);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return '✓';
        case 'error': return '✕';
        case 'warning': return '⚠';
        case 'info': return 'ℹ';
        default: return 'ℹ';
    }
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    removeNotification(notification);
}

function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.animation = 'slideInNotification 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Initialize with a welcome message
console.log('مرحباً بك في لعبة يمعة!');
console.log('بيانات الإدارة: admin / 123456');
