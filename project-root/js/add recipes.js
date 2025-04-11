// Hàm kiểm tra giá trị cân nặng
function isValidWeight(weight) {
    // Định nghĩa regex để kiểm tra định dạng cân nặng
    // - \d+: Kiểm tra một hoặc nhiều chữ số (số nguyên dương)
    // - (\.\d+)? : Kiểm tra phần thập phân tùy chọn (ví dụ: 200.5)
    // - \s* : Cho phép khoảng trắng tùy chọn giữa số và đơn vị
    // - (grams|kg|g|mg) : Kiểm tra đơn vị hợp lệ (grams, kg, g, mg)
    // - /i : Không phân biệt hoa thường
    const weightRegex = /^\d+(\.\d+)?\s*(grams|kg|g|mg)$/i;
    
    // Trả về true nếu weight khớp với regex, ngược lại trả về false
    return weightRegex.test(weight);
}

// Function để validate thông tin cơ bản của công thức
function validateBasicInformation() {
    // Tạo object basicInfo để lưu trữ giá trị từ các input trong form
    // - Sử dụng querySelector để lấy giá trị từ các input dựa trên cấu trúc DOM
    // - .trim() loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi
    const basicInfo = {
        name: document.querySelector('.basic .info-table .tr:nth-child(1) input').value.trim(),
        description: document.querySelector('.basic .info-table .tr:nth-child(2) input').value.trim(),
        totalTime: document.querySelector('.basic .info-table .tr:nth-child(3) input').value.trim(),
        prepTime: document.querySelector('.basic .info-table .tr:nth-child(4) input').value.trim(),
        finalWeight: document.querySelector('.basic .info-table .tr:nth-child(5) input').value.trim(),
        portions: document.querySelector('.basic .info-table .tr:nth-child(6) input').value.trim()
    };

    // Khởi tạo mảng errors để lưu trữ các thông báo lỗi nếu có
    let errors = [];

    // Validate Name (bắt buộc, tối thiểu 3 ký tự)
    // - Kiểm tra nếu name rỗng, thêm lỗi vào mảng errors
    if (!basicInfo.name) {
        errors.push("Recipe name is required.");
    // Nếu name không rỗng nhưng dưới 3 ký tự, thêm lỗi khác
    } else if (basicInfo.name.length < 3) {
        errors.push("Recipe name must be at least 3 characters long.");
    }

    // Validate Description (không bắt buộc, nhưng nếu có thì tối thiểu 10 ký tự)
    // - Nếu description không rỗng và dưới 10 ký tự, thêm lỗi
    if (basicInfo.description && basicInfo.description.length < 10) {
        errors.push("Description must be at least 10 characters long if provided.");
    }

    // Validate Total Time (phải là số dương hoặc định dạng thời gian hợp lệ)
    // - Kiểm tra nếu totalTime rỗng, thêm lỗi
    if (!basicInfo.totalTime) {
        errors.push("Total time is required.");
    // Nếu totalTime không rỗng nhưng không hợp lệ (dựa trên hàm isValidTime), thêm lỗi
    } else if (!isValidTime(basicInfo.totalTime)) {
        errors.push("Total time must be a positive number (e.g., '30 minutes' or '30').");
    }

    // Validate Preparation Time (phải là số dương hoặc định dạng thời gian hợp lệ)
    // - Tương tự totalTime, kiểm tra prepTime rỗng
    if (!basicInfo.prepTime) {
        errors.push("Preparation time is required.");
    // Nếu prepTime không rỗng nhưng không hợp lệ, thêm lỗi
    } else if (!isValidTime(basicInfo.prepTime)) {
        errors.push("Preparation time must be a positive number (e.g., '15 minutes' or '15').");
    }

    // Validate Final Weight (phải là số dương kèm đơn vị)
    // - Kiểm tra nếu finalWeight rỗng, thêm lỗi
    if (!basicInfo.finalWeight) {
        errors.push("Final weight is required.");
    // Nếu finalWeight không rỗng nhưng không hợp lệ (dựa trên hàm isValidWeight), thêm lỗi
    } else if (!isValidWeight(basicInfo.finalWeight)) {
        errors.push("Final weight must be a positive number with a unit (e.g., '201 grams').");
    }

    // Validate Portions (phải là số dương)
    // - Kiểm tra nếu portions rỗng, thêm lỗi
    if (!basicInfo.portions) {
        errors.push("Portions is required.");
    // Nếu portions không rỗng nhưng không phải số hợp lệ hoặc nhỏ hơn/ bằng 0, thêm lỗi
    } else if (!isValidNumber(basicInfo.portions) || parseInt(basicInfo.portions) <= 0) {
        errors.push("Portions must be a positive number.");
    }

    // Hiển thị lỗi nếu có
    // - Nếu mảng errors có phần tử, hiển thị thông báo lỗi bằng SweetAlert2
    if (errors.length > 0) {
        // Sử dụng Swal.fire để hiển thị thông báo lỗi
        // - icon: "error" để hiển thị biểu tượng lỗi
        // - title: Tiêu đề của thông báo
        // - html: Chuyển danh sách lỗi thành các thẻ <p> để hiển thị đẹp hơn
        // - footer: Thêm link hỗ trợ (hiện tại là placeholder)
        Swal.fire({
            icon: "error",
            title: "Validation Error",
            html: errors.map(error => `<p>${error}</p>`).join(""),
            footer: '<a href="#">Why do I have this issue?</a>'
        });
        // Trả về false để báo hiệu rằng validate thất bại
        return false;
    }
    // Nếu không có lỗi, trả về true để báo hiệu validate thành công
    return true;
}

// Function để thêm ingredient mới vào danh sách
function addNewIngredient() {
    // Lấy input tìm kiếm nguyên liệu
    const searchInput = document.querySelector('.search .input_search input');
    // Lấy container danh sách nguyên liệu
    const ingredientList = document.querySelector('.ingredients_list');
    // Lấy giá trị từ input và loại bỏ khoảng trắng thừa
    const newIngredientText = searchInput.value.trim();

    // Kiểm tra nếu input rỗng
    if (!newIngredientText) {
        // Hiển thị thông báo lỗi bằng SweetAlert2 nếu người dùng không nhập tên nguyên liệu
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter an ingredient name!",
            footer: '<a href="#">Why do I have this issue?</a>'
        });
        // Thoát hàm để không tiếp tục xử lý
        return;
    }

    // Tạo phần tử div mới cho nguyên liệu
    // - Sử dụng createElement để tạo một div mới
    const newIngredient = document.createElement('div');
    // Thêm class 'row1' để áp dụng kiểu CSS
    newIngredient.classList.add('row1');
    // Gán nội dung HTML cho div mới, bao gồm:
    // - Tên nguyên liệu
    // - Nút thêm food equivalent
    // - Input để nhập food equivalent
    // - Nút xóa nguyên liệu
    newIngredient.innerHTML = `
        <div class="column1">
            <p>${newIngredientText}</p>
            <div class="img">
                <div>
                    <img src="../assets/add_dau_cong.svg" alt="add" />
                </div>
                <input type="text" placeholder="Add new food equivalent" />
            </div>
        </div>
        <div class="delete">
            <img src="../assets/delete.svg" alt="delete" />
        </div>
    `;

    // Thêm nguyên liệu mới vào danh sách
    // - Chèn trước phần tử .search (input tìm kiếm) để giữ vị trí hợp lý
    ingredientList.insertBefore(newIngredient, document.querySelector('.search'));

    // Xóa giá trị trong input sau khi thêm nguyên liệu
    searchInput.value = '';

    // Thêm sự kiện xóa cho nút delete của nguyên liệu mới
    // - Khi click vào biểu tượng xóa, phần tử nguyên liệu sẽ bị xóa khỏi DOM
    newIngredient.querySelector('.delete img').addEventListener('click', function() {
        newIngredient.remove();
    });
}

// Gắn sự kiện Publish cho nút publish
// - Sử dụng querySelector để lấy nút publish và gắn sự kiện click
document.querySelector('.pushlish button').addEventListener('click', function(e) {
    // Kiểm tra validate thông tin cơ bản
    // - Nếu validate thất bại (trả về false), ngăn sự kiện mặc định (submit form)
    if (!validateBasicInformation()) {
        e.preventDefault(); // Ngăn không cho publish nếu validate thất bại
    } else {
        // Nếu validate thành công, lấy dữ liệu công thức từ hàm getRecipeData
        const newRecipe = getRecipeData();

        // Lấy danh sách recipes từ localStorage
        // - JSON.parse để chuyển chuỗi JSON thành mảng
        // - Nếu không có recipes, khởi tạo mảng rỗng
        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        // Thêm công thức mới vào mảng recipes
        recipes.push(newRecipe);
        // Lưu lại mảng recipes vào localStorage
        // - JSON.stringify chuyển mảng thành chuỗi JSON để lưu
        localStorage.setItem('recipes', JSON.stringify(recipes));

        // Hiển thị thông báo thành công bằng SweetAlert2
        // - icon: "success" để hiển thị biểu tượng thành công
        // - title: Tiêu đề thông báo
        // - text: Nội dung thông báo
        // - showConfirmButton: false để không hiển thị nút xác nhận
        // - timer: 1500 để tự động đóng sau 1.5 giây
        Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Recipe published successfully!",
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            // Sau khi thông báo đóng, chuyển hướng đến trang recipes.html
            window.location.href = "../pages/recipes.html";
        });
    }
});