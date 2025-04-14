// Chờ DOM tải hoàn tất trước khi chạy mã
document.addEventListener("DOMContentLoaded", () => {
    // Lấy các phần tử DOM cho menu thả xuống danh mục
    const categoryInput = document.getElementById("category-input"); // Ô nhập để hiển thị danh mục đã chọn
    const categoryList = document.getElementById("category-list"); // Danh sách <ul> chứa các tùy chọn danh mục (<li>)
    const categoryTrigger = document.querySelector(".bottom"); // Phần tử .bottom hiển thị "New category" và icon
    const categoryDropdown = document.querySelector(".category-dropdown"); // Phần tử bao quanh ô nhập và danh sách

    // Kiểm tra xem tất cả các phần tử có tồn tại không để tránh lỗi
    if (!categoryInput || !categoryList || !categoryTrigger || !categoryDropdown) {
        console.error("Một hoặc nhiều element không tồn tại trong DOM"); // Ghi log lỗi nếu thiếu phần tử
        return; // Thoát để tránh lỗi runtime
    }

    // Sự kiện: Nhấp vào "New category" (.bottom) để hiển thị menu thả xuống
    categoryTrigger.addEventListener("click", () => {
        categoryTrigger.style.display = "none"; // Ẩn phần tử "New category"
        categoryInput.style.display = "block"; // Hiển thị ô nhập danh mục
        categoryDropdown.style.display = "block"; // Hiển thị container thả xuống
        categoryList.style.display = "block"; // Hiển thị danh sách danh mục
        // Mục đích: Mở menu thả xuống để chọn danh mục
    });

    // Sự kiện: Nhấp vào ô nhập để bật/tắt danh sách danh mục
    categoryInput.addEventListener("click", () => {
        categoryList.style.display = categoryList.style.display === "none" ? "block" : "none"; // Bật/tắt danh sách
        // Mục đích: Cho phép hiển thị/ẩn danh sách danh mục khi nhấp vào ô nhập
    });

    // Sự kiện: Chọn một danh mục từ danh sách
    categoryList.addEventListener("click", (e) => {
        if (e.target.tagName === "LI") { // Kiểm tra xem phần tử được nhấp có phải là <li> không
            const selectedText = e.target.textContent.trim(); // Lấy văn bản danh mục (ví dụ: "Desserts")
            categoryInput.value = selectedText; // Cập nhật giá trị ô nhập với danh mục đã chọn
            categoryList.style.display = "none"; // Ẩn danh sách danh mục
            categoryDropdown.style.display = "none"; // Ẩn container thả xuống
            categoryTrigger.style.display = "block"; // Hiển thị lại phần tử "New category"

            // Cập nhật nội dung của .bottom để hiển thị danh mục đã chọn
            categoryTrigger.innerHTML = ""; // Xóa nội dung hiện tại
            const img = document.createElement("img"); // Tạo icon mới
            img.src = "../assets/new_category.svg"; // Đặt nguồn icon
            const p = document.createElement("p"); // Tạo phần tử văn bản
            p.textContent = selectedText; // Đặt văn bản là danh mục đã chọn
            categoryTrigger.appendChild(img); // Thêm icon vào .bottom
            categoryTrigger.appendChild(p); // Thêm văn bản vào .bottom
            // Mục đích: Cập nhật giao diện để hiển thị danh mục đã chọn (ví dụ: icon + "Desserts")
        }
    });

    // Sự kiện: Nhấp ra ngoài menu thả xuống để đóng nó
    document.addEventListener("click", (e) => {
        if (!categoryDropdown.contains(e.target) && !categoryTrigger.contains(e.target)) {
            categoryList.style.display = "none"; // Ẩn danh sách danh mục
            categoryDropdown.style.display = "none"; // Ẩn container thả xuống
            categoryTrigger.style.display = "block"; // Hiển thị lại "New category"
            // Mục đích: Đóng menu thả xuống nếu người dùng nhấp ra ngoài
        }
    });
});

// Hàm: Xác thực các trường thông tin cơ bản trong biểu mẫu
function validateBasicInformation() {
    // Thu thập giá trị từ các ô nhập
    const basicInfo = {
        name: document.querySelector('.basic .info-table .tr:nth-child(1) input').value.trim(), // Tên công thức
        description: document.querySelector('.basic .info-table .tr:nth-child(2) input').value.trim(), // Mô tả
        totalTime: document.querySelector('.basic .info-table .tr:nth-child(3) input').value.trim(), // Thời gian tổng
        prepTime: document.querySelector('.basic .info-table .tr:nth-child(4) input').value.trim(), // Thời gian chuẩn bị
        finalWeight: document.querySelector('.basic .info-table .tr:nth-child(5) input').value.trim(), // Trọng lượng cuối
        portions: document.querySelector('.basic .info-table .tr:nth-child(6) input').value.trim() // Số khẩu phần
    };

    let errors = []; // Mảng lưu trữ các lỗi xác thực

    // Xác thực Tên: Bắt buộc, tối thiểu 3 ký tự
    if (!basicInfo.name) {
        errors.push("Recipe name is required."); // Lỗi nếu tên trống
    } else if (basicInfo.name.length < 3) {
        errors.push("Recipe name must be at least 3 characters long."); // Lỗi nếu tên quá ngắn
    }

    // Xác thực Mô tả: Không bắt buộc, nhưng nếu có thì tối thiểu 10 ký tự
    if (basicInfo.description && basicInfo.description.length < 10) {
        errors.push("Description must be at least 10 characters long if provided."); // Lỗi nếu mô tả quá ngắn
    }

    // Xác thực Thời gian tổng: Bắt buộc, phải là số dương hoặc định dạng hợp lệ
    if (!basicInfo.totalTime) {
        errors.push("Total time is required."); // Lỗi nếu thời gian tổng trống
    } else if (!isValidTime(basicInfo.totalTime)) {
        errors.push("Total time must be a positive number (e.g., '30 minutes' or '30')."); // Lỗi nếu định dạng không hợp lệ
    }

    // Xác thực Thời gian chuẩn bị: Bắt buộc, phải là số dương hoặc định dạng hợp lệ
    if (!basicInfo.prepTime) {
        errors.push("Preparation time is required."); // Lỗi nếu thời gian chuẩn bị trống
    } else if (!isValidTime(basicInfo.prepTime)) {
        errors.push("Preparation time must be a positive number (e.g., '15 minutes' or '15')."); // Lỗi nếu định dạng không hợp lệ
    }

    // Xác thực Trọng lượng cuối: Bắt buộc, phải là số dương kèm đơn vị
    if (!basicInfo.finalWeight) {
        errors.push("Final weight is required."); // Lỗi nếu trọng lượng trống
    } else if (!isValidWeight(basicInfo.finalWeight)) {
        errors.push("Final weight must be a positive number with a unit (e.g., '201 grams')."); // Lỗi nếu định dạng không hợp lệ
    }

    // Xác thực Số khẩu phần: Bắt buộc, phải là số dương
    if (!basicInfo.portions) {
        errors.push("Portions is required."); // Lỗi nếu số khẩu phần trống
    } else if (!isValidNumber(basicInfo.portions) || parseInt(basicInfo.portions) <= 0) {
        errors.push("Portions must be a positive number."); // Lỗi nếu không phải số dương
    }

    // Hiển thị lỗi nếu có
    if (errors.length > 0) {
        Swal.fire({
            icon: "error",
            title: "Validation Error",
            html: errors.map(error => `<p>${error}</p>`).join(""), // Hiển thị tất cả lỗi dưới dạng danh sách
            footer: '<a href="#">Why do I have this issue?</a>' // Liên kết hỗ trợ (chưa hoạt động)
        });
        return false; // Trả về false nếu xác thực thất bại
    }
    return true; // Trả về true nếu tất cả hợp lệ
}

// Hàm: Thu thập dữ liệu từ biểu mẫu để tạo đối tượng công thức
function getRecipeData() {
    // Thu thập thông tin cơ bản
    const basicInfo = {
        name: document.querySelector('.basic .info-table .tr:nth-child(1) input').value.trim(), // Tên công thức
        description: document.querySelector('.basic .info-table .tr:nth-child(2) input').value.trim(), // Mô tả
        totalTime: document.querySelector('.basic .info-table .tr:nth-child(3) input').value.trim(), // Thời gian tổng
        prepTime: document.querySelector('.basic .info-table .tr:nth-child(4) input').value.trim(), // Thời gian chuẩn bị
        finalWeight: document.querySelector('.basic .info-table .tr:nth-child(5) input').value.trim(), // Trọng lượng cuối
        portions: document.querySelector('.basic .info-table .tr:nth-child(6) input').value.trim() // Số khẩu phần
    };

    // Lấy danh sách nguyên liệu từ .ingredients_list
    const ingredients = Array.from(document.querySelectorAll('.ingredients_list .row1 .column1 p'))
        .map(p => p.textContent.trim()); // Lấy văn bản của mỗi nguyên liệu và loại bỏ khoảng trắng

    // Lấy thông tin dinh dưỡng từ giao diện (giả định tĩnh)
    const nutrition = {
        energy: document.querySelector('.energy p span').textContent.trim() + ' kcal', // Năng lượng (kcal)
        fat: document.querySelector('.nutrition .fat').textContent.trim(), // Chất béo (g)
        carbohydrate: document.querySelector('.nutrition .carbohydrate').textContent.trim(), // Tinh bột (g)
        protein: document.querySelector('.nutrition .protein').textContent.trim() // Chất đạm (g)
    };

    // Tạo đối tượng công thức
    return {
        title: basicInfo.name, // Tên công thức
        author: JSON.parse(localStorage.getItem("loggedInUser")).name, // Tên người dùng từ localStorage
        likes: 0, // Mặc định 0 lượt thích
        category: document.querySelector('#category-input').value || "Uncategorized", // Danh mục, mặc định nếu trống
        nutrition: nutrition, // Thông tin dinh dưỡng
        ingredients: ingredients // Danh sách nguyên liệu
    };
}

// Hàm hỗ trợ: Kiểm tra định dạng thời gian hợp lệ
function isValidTime(value) {
    const timeRegex = /^\d+(\s*(minutes|hours))?$/i; // Regex: số dương, có thể kèm "minutes" hoặc "hours"
    return timeRegex.test(value) && parseInt(value) > 0; // Kiểm tra định dạng và giá trị dương
}

// Hàm hỗ trợ: Kiểm tra định dạng trọng lượng hợp lệ
function isValidWeight(value) {
    const weightRegex = /^\d+(\s*(grams|kg))?$/i; // Regex: số dương, có thể kèm "grams" hoặc "kg"
    return weightRegex.test(value) && parseInt(value) > 0; // Kiểm tra định dạng và giá trị dương
}

// Hàm hỗ trợ: Kiểm tra số hợp lệ
function isValidNumber(value) {
    return /^\d+$/.test(value); // Regex: chỉ chứa chữ số
}

// Hàm: Thêm nguyên liệu mới vào danh sách
function addNewIngredient() {
    const searchInput = document.querySelector('.search .input_search input'); // Ô nhập nguyên liệu
    const ingredientList = document.querySelector('.ingredients_list'); // Danh sách nguyên liệu
    const newIngredientText = searchInput.value.trim(); // Lấy văn bản nguyên liệu, loại bỏ khoảng trắng

    // Kiểm tra xem ô nhập có trống không
    if (!newIngredientText) {
        alert("Please enter an ingredient name."); // Hiển thị cảnh báo nếu trống
        return;
    }

    // Tạo phần tử nguyên liệu mới
    const newIngredient = document.createElement('div');
    newIngredient.classList.add('row1'); // Thêm lớp CSS
    newIngredient.innerHTML = `
        <div class="column1">
            <p>${newIngredientText}</p> <!-- Hiển thị tên nguyên liệu -->
            <div class="img">
                <div>
                    <img src="../assets/add_dau_cong.svg" alt="add" /> <!-- Icon thêm tương đương -->
                </div>
                <input type="text" placeholder="Add new food equivalent" /> <!-- Ô nhập tương đương (chưa dùng) -->
            </div>
        </div>
        <div class="delete">
            <img src="../assets/delete.svg" alt="delete" /> <!-- Icon xóa -->
        </div>
    `;

    // Thêm nguyên liệu vào danh sách, trước thanh tìm kiếm
    ingredientList.insertBefore(newIngredient, document.querySelector('.search'));

    // Xóa nội dung ô nhập sau khi thêm
    searchInput.value = '';

    // Sự kiện: Nhấp vào icon xóa để xóa nguyên liệu
    newIngredient.querySelector('.delete img').addEventListener('click', function() {
        newIngredient.remove(); // Xóa phần tử khỏi DOM
        // Lưu ý: Không cập nhật dinh dưỡng hoặc kiểm tra xác nhận
    });
}

// Sự kiện: Nhấn Enter trong ô nhập nguyên liệu để thêm
document.querySelector('.search .input_search input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addNewIngredient(); // Gọi hàm thêm nguyên liệu khi nhấn Enter
    }
});

// Sự kiện: Nhấp vào nút "+" trong bảng dinh dưỡng để chọn nguyên liệu
document.querySelectorAll('.nutritional_table .add').forEach(addButton => {
    addButton.addEventListener('click', function() {
        const row = this.closest('.table_body'); // Lấy hàng chứa nút "+"
        const ingredientName = row.querySelector('.row span:first-child').textContent; // Tên nguyên liệu
        const ingredientPortion = row.querySelector('.row_input span:nth-child(2)').textContent; // Phần (ví dụ: "portion (87 grams)")

        const newIngredient = `${ingredientName} (${ingredientPortion})`; // Tạo tên đầy đủ (ví dụ: "Keto 90 Second Bread (portion (87 grams))")
        document.querySelector('.search .input_search input').value = newIngredient; // Điền tên vào ô nhập
        addNewIngredient(); // Thêm nguyên liệu vào danh sách
    });
});

// Sự kiện: Nhấp vào nút "Publish" để xuất bản công thức
document.querySelector('.pushlish button').addEventListener('click', function(e) {
    if (!validateBasicInformation()) {
        e.preventDefault(); // Ngăn xuất bản nếu xác thực thất bại
    } else {
        const newRecipe = getRecipeData(); // Lấy dữ liệu công thức

        // Lấy danh sách công thức từ localStorage hoặc tạo mới
        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.push(newRecipe); // Thêm công thức mới
        localStorage.setItem('recipes', JSON.stringify(recipes)); // Lưu vào localStorage

        // Hiển thị thông báo thành công
        Swal.fire({
            title: "Good job!",
            text: "You clicked the button!",
            icon: "success"
        });
        window.location.href = "../pages/recipes.html"; // Chuyển hướng đến trang danh sách công thức
    }
});
// Gắn sự kiện 'click' vào phần tử có lớp '.ingredients_list' (container chứa tất cả các nguyên liệu)
// Sử dụng event delegation để xử lý các sự kiện nhấp trên các phần tử con (thay vì gắn sự kiện riêng cho từng nút xóa)
document.querySelector('.ingredients_list').addEventListener('click', function(e) {
    // Kiểm tra xem phần tử được nhấp (hoặc tổ tiên gần nhất của nó) có phải là thẻ <img> nằm trong phần tử có lớp '.delete' hay không
    // 'e.target' là phần tử thực sự được nhấp, 'closest' tìm tổ tiên gần nhất khớp với bộ chọn '.delete img'
    if (e.target.closest('.delete')) {
        // Lấy phần tử cha gần nhất có lớp '.row1' (hàng nguyên liệu chứa nút xóa)
        // '.row1' là container của một nguyên liệu, bao gồm tên nguyên liệu và nút xóa
        const ingredientRow = e.target.closest('.row1');
        
        // Kiểm tra xem 'ingredientRow' có tồn tại không (để tránh lỗi nếu cấu trúc HTML không đúng)
        if (ingredientRow) {
            // Hiển thị hộp thoại xác nhận sử dụng SweetAlert2 (Swal) trước khi xóa nguyên liệu
            Swal.fire({
                // Tiêu đề của hộp thoại xác nhận
                title: 'Are you sure?',
                // Nội dung mô tả, cung cấp thêm thông tin về hành động
                text: 'Do you want to remove this ingredient?',
                // Biểu tượng cảnh báo để nhấn mạnh rằng đây là hành động có thể không thể hoàn tác
                icon: 'warning',
                // Hiển thị nút "Cancel" để người dùng có thể hủy hành động
                showCancelButton: true,
                // Văn bản trên nút xác nhận (xóa nguyên liệu)
                confirmButtonText: 'Yes, delete it!',
                // Văn bản trên nút hủy (giữ nguyên liệu)
                cancelButtonText: 'No, keep it'
            }).then((result) => {
                // Hàm 'then' xử lý kết quả sau khi người dùng tương tác với hộp thoại
                // 'result.isConfirmed' là true nếu người dùng nhấp vào "Yes, delete it!"
                if (result.isConfirmed) {
                    // Xóa hàng nguyên liệu khỏi DOM bằng phương thức 'remove()'
                    // Điều này sẽ xóa toàn bộ phần tử '.row1' (bao gồm tên nguyên liệu và nút xóa)
                    ingredientRow.remove();
                    
                    // Hiển thị thông báo thành công sau khi xóa nguyên liệu
                    Swal.fire(
                        // Tiêu đề thông báo
                        'Deleted!',
                        // Nội dung chi tiết của thông báo
                        'The ingredient has been removed.',
                        // Biểu tượng thành công để xác nhận hành động đã hoàn tất
                        'success'
                    );
                }
                // Nếu người dùng nhấp "No, keep it" hoặc đóng hộp thoại, không làm gì cả
                // (không cần mã bổ sung vì hành động bị hủy)
            });
        }
    }
});
// Thêm sự kiện cho nút đăng xuất
// - Lấy phần tử đầu tiên có class "sign_out"
// - Khi nhấn, chuyển hướng về trang đăng nhập
document.getElementsByClassName("sign_out")[0].onclick = function() {
    window.location.href = "../pages/sign in.html";
};