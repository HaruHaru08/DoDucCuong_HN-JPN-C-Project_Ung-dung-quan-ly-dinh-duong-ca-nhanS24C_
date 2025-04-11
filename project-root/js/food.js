// Tải thông tin người dùng đã đăng nhập từ localStorage
// - JSON.parse chuyển chuỗi JSON thành object
// - Nếu không có dữ liệu (null), sử dụng giá trị mặc định là object với name: "User"
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || { name: "User" };

// Hiển thị tên người dùng lên giao diện
// - Lấy phần tử có id="name" và gán nội dung là tên người dùng từ loggedInUser
document.getElementById("name").textContent = `${loggedInUser.name}`;

// Tải cơ sở dữ liệu thực phẩm từ localStorage
// - Nếu không có dữ liệu (null), sử dụng danh sách thực phẩm mặc định
// - Danh sách mặc định chứa 9 loại thực phẩm với các thuộc tính: id, name, source, category, energy, fat, carbohydrate, protein, quantity
let foodDatabase = JSON.parse(localStorage.getItem("foodDatabase")) || [
    { id: 1, name: "Ackee canned drained", source: "McCance and Widdowson's", category: "Fruits", energy: 151, fat: 15, carbohydrate: 1, protein: 3, quantity: 100 },
    { id: 2, name: "Chicken Breast grilled", source: "USDA", category: "Meat", energy: 165, fat: 3.6, carbohydrate: 0, protein: 31, quantity: 100 },
    { id: 3, name: "Brown Rice cooked", source: "USDA", category: "Grains", energy: 123, fat: 1, carbohydrate: 26, protein: 2.7, quantity: 100 },
    { id: 4, name: "Broccoli steamed", source: "Nutrition Australia", category: "Vegetables", energy: 35, fat: 0.4, carbohydrate: 7, protein: 3, quantity: 100 },
    { id: 5, name: "Salmon baked", source: "USDA", category: "Meat", energy: 208, fat: 13, carbohydrate: 0, protein: 22, quantity: 100 },
    { id: 6, name: "Almonds raw", source: "Nutrition Australia", category: "Grains", energy: 579, fat: 50, carbohydrate: 22, protein: 21, quantity: 100 },
    { id: 7, name: "Greek Yogurt plain", source: "McCance and Widdowson's", category: "Dairy", energy: 59, fat: 0.4, carbohydrate: 3.6, protein: 10, quantity: 100 },
    { id: 8, name: "Sweet Potato boiled", source: "Nutrition Australia", category: "Vegetables", energy: 86, fat: 0.1, carbohydrate: 20, protein: 1.6, quantity: 100 },
    { id: 9, name: "Egg boiled", source: "USDA", category: "Meat", energy: 68, fat: 4.8, carbohydrate: 0.6, protein: 6, quantity: 100 }
];

// Hàm lưu cơ sở dữ liệu thực phẩm vào localStorage với xử lý lỗi
function saveToLocalStorage() {
    // Sử dụng try-catch để xử lý lỗi khi lưu vào localStorage
    try {
        // Chuyển foodDatabase thành chuỗi JSON và lưu vào localStorage với key "foodDatabase"
        localStorage.setItem("foodDatabase", JSON.stringify(foodDatabase));
    } catch (error) {
        // Nếu xảy ra lỗi (ví dụ: localStorage đầy), ghi log lỗi và hiển thị thông báo
        console.error("Lỗi khi lưu vào localStorage:", error);
        alert("Không thể lưu dữ liệu. Vui lòng thử lại.");
    }
}

// Sự kiện được kích hoạt khi trang web tải xong
// - Đảm bảo DOM đã sẵn sàng trước khi thực thi các thao tác
document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử giao diện để tương tác
    // - createFoodBtn: Nút mở form tạo thực phẩm mới
    // - foodChild: Container chứa danh sách thực phẩm
    // - searchInput: Ô tìm kiếm thực phẩm
    // - sortSelect: Dropdown sắp xếp thực phẩm
    // - categorySelect: Dropdown lọc theo danh mục
    // - prevBtn, nextBtn: Nút điều hướng phân trang
    const createFoodBtn = document.querySelector(".creat_food");
    const foodChild = document.querySelector(".food_child");
    const searchInput = document.querySelector(".search_food");
    const sortSelect = document.querySelector(".custom_input select");
    const categorySelect = document.querySelector("#category");
    const prevBtn = document.getElementById("btn-prev");
    const nextBtn = document.getElementById("btn-next");

    // Thiết lập số lượng mục trên mỗi trang và trang hiện tại
    // - itemsPerPage: Số thực phẩm hiển thị trên mỗi trang (9)
    // - currentPage: Trang hiện tại, mặc định là 1
    // - currentFoods: Mảng chứa danh sách thực phẩm hiện tại, ban đầu là bản sao của foodDatabase
    const itemsPerPage = 9;
    let currentPage = 1;
    let currentFoods = [...foodDatabase];

    // Sự kiện khi nhấn nút "Create new food" để mở modal thêm thực phẩm
    createFoodBtn.addEventListener("click", function () {
        // Kiểm tra xem modal đã tồn tại chưa, nếu có thì không tạo mới
        if (document.querySelector(".main")) return;

        // Tạo phần tử div cho modal
        const mainForm = document.createElement("div");
        // Thêm class "main" để áp dụng kiểu CSS
        mainForm.classList.add("main");
        // Gán nội dung HTML cho modal, bao gồm:
        // - Tiêu đề và nút đóng
        // - Các trường nhập thông tin: tên, danh mục, nguồn, số lượng
        // - Các trường dinh dưỡng: năng lượng, chất béo, carbohydrate, protein
        // - Nút hủy và lưu
        mainForm.innerHTML = `
            <div class="title">
                <p>Thêm thực phẩm mới</p>
                <p>Điền thông tin thực phẩm vào các ô dưới đây</p>
                <i class="fa-solid fa-xmark close-btn"></i>
            </div>
            <div class="infor">
                <div class="left">
                    <p class="name-row">
                        <span>Tên</span>
                        <input type="text" name="name" value="" />
                    </p>
                    <p class="category-row">
                        <span>Danh mục</span>
                        <select id="category">
                            <option value="category">Category</option>
                            <option value="Grains">Grains</option>
                            <option value="Meat">Meat</option>
                            <option value="Fruits">Fruits</option>
                            <option value="Vegetables">Vegetables</option>
                        </select>
                    </p>
                </div>
                <div class="right">
                    <p class="source-row">
                        <span>Nguồn</span>
                        <input type="text" name="source" value="My foods" />
                    </p>
                    <p class="quantity-row">
                        <span>Số lượng</span>
                        <input type="text" name="quantity" value="100" />
                        <span>grams</span>
                    </p>
                </div>
            </div>
            <div class="nutritional">
                <p>Nutritional value per 100 g</p>
            </div>
            <div class="macronutrients">
                <span>Macronutrients</span>
                <div class="content_macronutrional">
                    <div class="left_macronutrional">
                        <p><span>Energy</span><input type="text" name="energy" value="" /><span>kcal</span></p>
                        <p><span>Carbohydrate</span><input type="text" name="carbohydrate" value="" /><span>g</span></p>
                    </div>
                    <div class="right_macronutrional">
                        <p><span>Fat</span><input type="text" name="fat" value="" /><span>g</span></p>
                        <p><span>Protein</span><input type="text" name="protein" value="" /><span>g</span></p>
                    </div>
                </div>
            </div>
            <div class="button">
                <button class="cancel-btn">Hủy</button>
                <button class="save-btn">Lưu và đóng</button>
            </div>
        `;

        // Thêm modal vào body của trang
        document.body.appendChild(mainForm);

        // Sự kiện khi nhấn nút "Lưu và đóng"
        const saveBtn = mainForm.querySelector(".save-btn");
        saveBtn.addEventListener("click", function () {
            // Lấy tất cả input trong form để xử lý
            const inputs = mainForm.querySelectorAll(".infor input, .macronutrients input");
            // Biến kiểm tra tính hợp lệ của dữ liệu
            let isValid = true;
            // Tạo object để lưu thông tin thực phẩm mới
            const newFood = {};
            // Regex kiểm tra tên chỉ chứa chữ cái và khoảng trắng
            const nameRegex = /^[A-Za-z\s]+$/;

            // Lấy và xử lý giá trị từ các input
            inputs.forEach(input => {
                const fieldName = input.name;
                const value = input.value.trim();

                // Xử lý trường tên
                if (fieldName === "name") {
                    if (value) {
                        // Nếu tên hợp lệ (chỉ chữ cái và khoảng trắng)
                        if (nameRegex.test(value)) {
                            newFood[fieldName] = value;
                        } else {
                            // Loại bỏ số và ký tự đặc biệt, nhưng đánh dấu là không hợp lệ
                            newFood[fieldName] = value.replace(/[^A-Za-z\s]/g, "");
                            isValid = false;
                            input.style.border = "1px solid red";
                        }
                    } else {
                        // Tên rỗng là không hợp lệ
                        newFood[fieldName] = "";
                        isValid = false;
                        input.style.border = "1px solid red";
                    }
                } else {
                    // Các trường khác: nếu rỗng thì gán giá trị mặc định
                    newFood[fieldName] = value || (fieldName === "source" ? "" : "0");
                }
                // Reset viền cho các trường không phải tên
                if (fieldName !== "name") input.style.border = "";
            });

            // Kiểm tra danh mục
            // - Lấy giá trị danh mục từ dropdown
            const category = mainForm.querySelector("#category").value;
            // Nếu danh mục là giá trị mặc định ("category"), đánh dấu không hợp lệ
            if (category === "category") {
                isValid = false;
                mainForm.querySelector("#category").style.border = "1px solid red";
            } else {
                // Gán danh mục vào object thực phẩm
                newFood.category = category;
            }

            // Kiểm tra và chuẩn hóa các trường số
            if (isValid) {
                // Các trường cần là số: energy, fat, carbohydrate, protein, quantity
                const numericFields = ["energy", "fat", "carbohydrate", "protein", "quantity"];
                numericFields.forEach(field => {
                    // Nếu trường không tồn tại, gán mặc định là "0"
                    if (!(field in newFood)) {
                        newFood[field] = "0";
                    }
                    // Chuyển giá trị thành số
                    const value = parseFloat(newFood[field]);
                    // Nếu giá trị không phải số hoặc âm, đánh dấu không hợp lệ
                    if (isNaN(value) || value < 0) {
                        isValid = false;
                        const input = mainForm.querySelector(`input[name="${field}"]`);
                        if (input) input.style.border = "1px solid red";
                    } else {
                        // Lưu giá trị số hợp lệ
                        newFood[field] = value;
                    }
                });

                // Nếu dữ liệu hợp lệ, thêm thực phẩm mới vào database
                if (isValid) {
                    const newFoodEntry = {
                        id: foodDatabase.length + 1, // Tạo id mới dựa trên độ dài database
                        name: newFood.name,
                        source: newFood.source || "My foods",
                        category: newFood.category,
                        energy: newFood.energy || 0,
                        fat: newFood.fat || 0,
                        carbohydrate: newFood.carbohydrate || 0,
                        protein: newFood.protein || 0,
                        quantity: newFood.quantity || 100
                    };
                    // Thêm thực phẩm mới vào foodDatabase
                    foodDatabase.push(newFoodEntry);
                    // Lưu database vào localStorage
                    saveToLocalStorage();
                    // Cập nhật danh sách hiện tại
                    currentFoods = [...foodDatabase];
                    // Đóng modal
                    mainForm.remove();
                    // Hiển thị lại danh sách thực phẩm
                    renderFoods(currentFoods);
                    // Cập nhật phân trang
                    renderPagination(Math.ceil(currentFoods.length / itemsPerPage));
                } else {
                    // Nếu không hợp lệ, hiển thị thông báo lỗi
                    alert("Vui lòng nhập số không âm cho các giá trị dinh dưỡng");
                }
            } else {
                // Nếu tên hoặc danh mục không hợp lệ, hiển thị thông báo
                alert("Vui lòng điền đầy đủ tên (chỉ chữ cái và khoảng trắng) và chọn danh mục thực phẩm");
            }
        });

        // Sự kiện khi nhấn nút "Hủy"
        // - Đóng modal bằng cách xóa khỏi DOM
        mainForm.querySelector(".cancel-btn").addEventListener("click", function () {
            mainForm.remove();
        });

        // Sự kiện khi nhấn nút đóng (X)
        // - Tương tự nút hủy, xóa modal
        mainForm.querySelector(".close-btn").addEventListener("click", function () {
            mainForm.remove();
        });
    });

    // Hàm tạo modal chi tiết cho một thực phẩm
    // - Được gọi khi nhấp vào một thực phẩm trong danh sách
    function createMainElement(foodData) {
        // (Giữ nguyên như mã gốc, không có thay đổi)
    }

    // Sự kiện khi nhấp vào một thực phẩm trong danh sách
    // - Tìm phần tử thực phẩm gần nhất với vị trí nhấp
    foodChild.addEventListener("click", (event) => {
        // Lấy phần tử .child gần nhất từ vị trí nhấp
        const child = event.target.closest(".child");
        if (!child) return; // Nếu không có, thoát

        // Lấy tên thực phẩm từ phần tử
        const name = child.querySelector(".text p:first-child").textContent;
        // Tìm dữ liệu thực phẩm trong foodDatabase
        const foodData = foodDatabase.find(f => f.name === name);
        if (foodData) {
            // Nếu tìm thấy, hiển thị modal chi tiết
            createMainElement(foodData);
        }
    });

    // Hàm hiển thị danh sách thực phẩm trên giao diện
    function renderFoods(foods) {
        // Xóa nội dung cũ trong container danh sách thực phẩm
        foodChild.innerHTML = "";
        // Tính toán vị trí bắt đầu và kết thúc của trang hiện tại
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        // Lấy danh sách thực phẩm cho trang hiện tại
        const paginatedFoods = foods.slice(start, end);

        // Duyệt qua từng thực phẩm để tạo phần tử hiển thị
        paginatedFoods.forEach(food => {
            const foodElement = document.createElement("div");
            foodElement.className = "child";
            // Tạo HTML cho mỗi thực phẩm, bao gồm:
            // - Tên và nguồn
            // - Bảng thông tin dinh dưỡng
            foodElement.innerHTML = `
                <div class="text">
                    <p>${food.name}</p>
                    <p>${food.source}</p>
                </div>
                <div class="specifications">
                    <table>
                        <tr>
                            <td>${food.energy} kcal</td>
                            <td>${food.fat} g</td>
                            <td>${food.carbohydrate} g</td>
                            <td>${food.protein} g</td>
                        </tr>
                        <tr>
                            <th>Energy</th>
                            <th>Fat</th>
                            <th>Carbohydrate</th>
                            <th>Protein</th>
                        </tr>
                    </table>
                </div>
            `;
            // Thêm phần tử vào container
            foodChild.appendChild(foodElement);
        });

        // Tính toán tổng số trang
        const totalPages = Math.ceil(foods.length / itemsPerPage);
        // Cập nhật phân trang
        renderPagination(totalPages);
    }

    // Hàm hiển thị các nút phân trang
    function renderPagination(totalPages) {
        // Lấy container chứa các nút phân trang
        const pageNumberContainer = document.getElementById("page-number");
        if (!pageNumberContainer) return; // Nếu không tồn tại, thoát

        // Xóa các nút phân trang cũ
        pageNumberContainer.innerHTML = "";
        // Tạo nút cho từng trang
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.classList.add("page-btn");
            // Đánh dấu nút của trang hiện tại
            if (i === currentPage) {
                pageButton.classList.add("active");
            }
            // Thêm sự kiện nhấp để chuyển trang
            pageButton.addEventListener("click", () => {
                currentPage = i;
                renderFoods(currentFoods);
            });
            pageNumberContainer.appendChild(pageButton);
        }
    }

    // Sự kiện tìm kiếm thực phẩm
    // - Kích hoạt mỗi khi người dùng nhập vào ô tìm kiếm
    searchInput.addEventListener("input", function (e) {
        // Lấy giá trị tìm kiếm, chuyển thành chữ thường và loại bỏ khoảng trắng thừa
        const searchTerm = e.target.value.toLowerCase().trim();
        // Lọc danh sách thực phẩm dựa trên tên, nguồn, hoặc danh mục
        currentFoods = foodDatabase.filter(food =>
            food.name.toLowerCase().includes(searchTerm) ||
            food.source.toLowerCase().includes(searchTerm) ||
            food.category.toLowerCase().includes(searchTerm)
        );
        // Đặt lại về trang đầu tiên
        currentPage = 1;
        // Hiển thị danh sách thực phẩm đã lọc
        renderFoods(currentFoods);
    });

    // Sự kiện sắp xếp thực phẩm
    // - Kích hoạt khi chọn một tùy chọn trong dropdown sắp xếp
    if (sortSelect) {
        sortSelect.addEventListener("change", function (e) {
            // Lấy giá trị sắp xếp, chuyển thành chữ thường
            const sortBy = e.target.value.toLowerCase();
            // Sắp xếp danh sách thực phẩm theo giá trị được chọn
            switch (sortBy) {
                case "energy":
                    currentFoods.sort((a, b) => b.energy - a.energy); // Giảm dần theo năng lượng
                    break;
                case "fat":
                    currentFoods.sort((a, b) => b.fat - a.fat); // Giảm dần theo chất béo
                    break;
                case "carbohydrate":
                    currentFoods.sort((a, b) => b.carbohydrate - a.carbohydrate); // Giảm dần theo carbohydrate
                    break;
                case "protein":
                    currentFoods.sort((a, b) => b.protein - a.protein); // Giảm dần theo protein
                    break;
                default:
                    currentFoods = [...foodDatabase]; // Mặc định: không sắp xếp
            }
            // Đặt lại về trang đầu tiên
            currentPage = 1;
            // Hiển thị danh sách đã sắp xếp
            renderFoods(currentFoods);
        });
    }

    // Sự kiện lọc theo danh mục
    // - Kích hoạt khi chọn một danh mục trong dropdown
    if (categorySelect) {
        categorySelect.addEventListener("change", function (e) {
            // Lấy giá trị danh mục
            const category = e.target.value;
            // Nếu chọn "category", hiển thị tất cả thực phẩm
            if (category === "category") {
                currentFoods = [...foodDatabase];
            } else {
                // Lọc danh sách thực phẩm theo danh mục
                currentFoods = foodDatabase.filter(food =>
                    food.category.toLowerCase() === category.toLowerCase()
                );
            }
            // Đặt lại về trang đầu tiên
            currentPage = 1;
            // Hiển thị danh sách đã lọc
            renderFoods(currentFoods);
        });
    }

    // Sự kiện nút "Trang trước"
    // - Giảm trang hiện tại nếu không phải trang đầu tiên
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderFoods(currentFoods);
            }
        });
    }

    // Sự kiện nút "Trang sau"
    // - Tăng trang hiện tại nếu chưa phải trang cuối
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const totalPages = Math.ceil(currentFoods.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderFoods(currentFoods);
            }
        });
    }

    // Hiển thị danh sách thực phẩm ban đầu khi trang tải
    renderFoods(foodDatabase);
});

// Sự kiện đăng xuất
// - Khi nhấn nút đăng xuất, chuyển hướng về trang đăng nhập
document.getElementsByClassName("sign_out")[0].onclick = function () {
    window.location.href = "../pages/sign in.html";
};