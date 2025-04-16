// Tải thông tin người dùng đã đăng nhập từ localStorage, nếu không có thì dùng giá trị mặc định là "User"
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || { name: "User" };
// Hiển thị tên người dùng lên giao diện
document.getElementById("name").textContent = `${loggedInUser.name}`;

// Tải cơ sở dữ liệu thực phẩm từ localStorage, nếu không có thì dùng danh sách mặc định
let foodDatabase = JSON.parse(localStorage.getItem("foodDatabase")) || [
    { id: 1, name: "Ackee, canned, drained", source: "McCance and Widdowson's", category: "Fruits", energy: 151, fat: 15, carbohydrate: 1, protein: 3, quantity: 100 },
    { id: 2, name: "Chicken Breast, grilled", source: "USDA", category: "Meat", energy: 165, fat: 3.6, carbohydrate: 0, protein: 31, quantity: 100 },
    { id: 3, name: "Brown Rice, cooked", source: "USDA", category: "Grains", energy: 123, fat: 1, carbohydrate: 26, protein: 2.7, quantity: 100 },
    { id: 4, name: "Broccoli, steamed", source: "Nutrition Australia", category: "Vegetables", energy: 35, fat: 0.4, carbohydrate: 7, protein: 3, quantity: 100 },
    { id: 5, name: "Salmon, baked", source: "USDA", category: "Meat", energy: 208, fat: 13, carbohydrate: 0, protein: 22, quantity: 100 },
    { id: 6, name: "Almonds, raw", source: "Nutrition Australia", category: "Grains", energy: 579, fat: 50, carbohydrate: 22, protein: 21, quantity: 100 },
    { id: 7, name: "Greek Yogurt, plain", source: "McCance and Widdowson's", category: "Dairy", energy: 59, fat: 0.4, carbohydrate: 3.6, protein: 10, quantity: 100 },
    { id: 8, name: "Sweet Potato, boiled", source: "Nutrition Australia", category: "Vegetables", energy: 86, fat: 0.1, carbohydrate: 20, protein: 1.6, quantity: 100 },
    { id: 9, name: "Egg, boiled", source: "USDA", category: "Meat", energy: 68, fat: 4.8, carbohydrate: 0.6, protein: 6, quantity: 100 }
];

// Hàm lưu cơ sở dữ liệu thực phẩm vào localStorage với xử lý lỗi
function saveToLocalStorage() {
    try {
        localStorage.setItem("foodDatabase", JSON.stringify(foodDatabase));
    } catch (error) {
        console.error("Lỗi khi lưu vào localStorage:", error);
        alert("Không thể lưu dữ liệu. Vui lòng thử lại.");
    }
}

// Sự kiện được kích hoạt khi trang web tải xong
document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử giao diện để tương tác
    const createFoodBtn = document.querySelector(".creat_food");
    const foodChild = document.querySelector(".food_child");
    const searchInput = document.querySelector(".search_food");
    const sortSelect = document.querySelector(".custom_input select");
    const categorySelect = document.querySelector("#category");
    const prevBtn = document.getElementById("btn-prev");
    const nextBtn = document.getElementById("btn-next");

    // Thiết lập số lượng mục trên mỗi trang và trang hiện tại
    const itemsPerPage = 9;
    let currentPage = 1;
    let currentFoods = [...foodDatabase];

    // Sự kiện khi nhấn nút "Create new food" để mở modal thêm thực phẩm
    createFoodBtn.addEventListener("click", function () {
        if (document.querySelector(".main")) return;

        const mainForm = document.createElement("div");
        mainForm.classList.add("main");
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
                <span>Micronutrients</span>
                <div class="specifications">
                    <div class="columns">
                        <div class="column">
                            <p><span>Cholesterol</span><input type="text" /><span>mg</span></p>
                            <p><span>Water</span><input type="text" /><span>g</span></p>
                            <p><span>Vitamin B-12</span><input type="text" /><span>ug</span></p>
                            <p><span>Vitamin E</span><input type="text" /><span>mg</span></p>
                            <p><span>Lactose</span><input type="text" /><span>g</span></p>
                            <p><span>Sugars</span><input type="text" /><span>g</span></p>
                            <p><span>Magnesium</span><input type="text" /><span>mg</span></p>
                            <p><span>Zinc</span><input type="text" /><span>mg</span></p>
                            <p><span>Manganese</span><input type="text" /><span>mg</span></p>
                            <p><span>Riboflavin</span><input type="text" /><span>mg</span></p>
                            <p><span>Folate, total</span><input type="text" /><span>ug</span></p>
                            <p><span>Fatty acids, total saturated</span><input type="text" /><span>g</span></p>
                            <p><span>Chloride</span><input type="text" /><span>mg</span></p>
                        </div>
                        <div class="column">
                            <p><span>Fiber</span><input type="text" /><span>g</span></p>
                            <p><span>Vitamin A</span><input type="text" /><span>ug</span></p>
                            <p><span>Vitamin C</span><input type="text" /><span>mg</span></p>
                            <p><span>Vitamin K</span><input type="text" /><span>ug</span></p>
                            <p><span>Alcohol</span><input type="text" /><span>g</span></p>
                            <p><span>Calcium</span><input type="text" /><span>mg</span></p>
                            <p><span>Phosphorus</span><input type="text" /><span>mg</span></p>
                            <p><span>Copper</span><input type="text" /><span>mg</span></p>
                            <p><span>Selenium</span><input type="text" /><span>ug</span></p>
                            <p><span>Niacin</span><input type="text" /><span>mg</span></p>
                            <p><span>Folic acid</span><input type="text" /><span>ug</span></p>
                            <p><span>Fatty acids, total monounsaturated</span><input type="text" /><span>g</span></p>
                        </div>
                        <div class="column">
                            <p><span>Sodium</span><input type="text" /><span>mg</span></p>
                            <p><span>Vitamin B-6</span><input type="text" /><span>mg</span></p>
                            <p><span>Vitamin D (D2 + D3)</span><input type="text" /><span>ug</span></p>
                            <p><span>Starch</span><input type="text" /><span>g</span></p>
                            <p><span>Caffeine</span><input type="text" /><span>mg</span></p>
                            <p><span>Iron</span><input type="text" /><span>mg</span></p>
                            <p><span>Potassium</span><input type="text" /><span>mg</span></p>
                            <p><span>Fluoride</span><input type="text" /><span>ug</span></p>
                            <p><span>Thiamin</span><input type="text" /><span>mg</span></p>
                            <p><span>Pantothenic acid</span><input type="text" /><span>mg</span></p>
                            <p><span>Fatty acids, total trans</span><input type="text" /><span>g</span></p>
                            <p><span>Fatty acids, total polyunsaturated</span><input type="text" /><span>g</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="button">
                <button class="cancel-btn">Hủy</button>
                <button class="save-btn">Lưu và đóng</button>
            </div>
        `;

        document.body.appendChild(mainForm);

        const saveBtn = mainForm.querySelector(".save-btn");
        saveBtn.addEventListener("click", function () {
            const inputs = mainForm.querySelectorAll(".infor input, .macronutrients input");
            let isValid = true;
            const newFood = {};
            inputs.forEach(input => {
                const fieldName = input.name;
                const value = input.value.trim();
            
                if (fieldName === "name") {
                    // Chỉ áp dụng lọc cho trường name
                    const nameRegex = /^[A-Za-z\s]+$/; // Chỉ chấp nhận chữ cái và khoảng trắng
                    if (value) {
                        if (nameRegex.test(value)) {
                            newFood[fieldName] = value; // Giá trị hợp lệ
                        } else {
                            // Nếu không hợp lệ, loại bỏ số và ký tự đặc biệt
                            newFood[fieldName] = value.replace(/[^A-Za-z\s]/g, "");
                        }
                    } else {
                        newFood[fieldName] = ""; // Giá trị rỗng nếu không nhập
                    }
                } else {
                    // Các trường khác giữ nguyên logic
                    newFood[fieldName] = value || (fieldName === "source" ? "" : "0");
                }
            });
            const category = mainForm.querySelector("#category").value;
            if (category === "category") {
                isValid = false;
                mainForm.querySelector("#category").style.border = "1px solid red";
            } else {
                newFood.category = category;
            }

            if (isValid) {
                const numericFields = ["energy", "fat", "carbohydrate", "protein", "quantity"];
                numericFields.forEach(field => {
                    if (!(field in newFood)) {
                        newFood[field] = "0";
                    }
                    if (isNaN(parseFloat(newFood[field])) || parseFloat(newFood[field]) < 0) {
                        isValid = false;
                        mainForm.querySelector(`input[name="${field}"]`).style.border = "1px solid red";
                    }
                });

                if (isValid) {
                    const newFoodEntry = {
                        id: foodDatabase.length + 1,
                        name: newFood.name || "",
                        source: newFood.source || "My foods",
                        category: newFood.category,
                        energy: parseFloat(newFood.energy) || 0,
                        fat: parseFloat(newFood.fat) || 0,
                        carbohydrate: parseFloat(newFood.carbohydrate) || 0,
                        protein: parseFloat(newFood.protein) || 0,
                        quantity: parseFloat(newFood.quantity) || 100
                    };
                    foodDatabase.push(newFoodEntry);
                    saveToLocalStorage();
                    currentFoods = [...foodDatabase];
                    mainForm.remove();
                    renderFoods(currentFoods);
                    renderPagination(Math.ceil(currentFoods.length / itemsPerPage)); // Cập nhật phân trang
                } else {
                    alert("Vui lòng nhập số không âm cho các giá trị dinh dưỡng");
                }
            } else {
                alert("Vui lòng chọn danh mục thực phẩm");
            }
        });

        mainForm.querySelector(".cancel-btn").addEventListener("click", function () {
            mainForm.remove();
        });

        mainForm.querySelector(".close-btn").addEventListener("click", function () {
            mainForm.remove();
        });
    });

    function createMainElement(foodData) {
        const main = document.createElement("div");
        main.className = "main";
        main.innerHTML = `
            <div>
                <div class="title">
                    <p>Thông tin thực phẩm</p>
                    <p>Kiểm tra và cập nhật thông tin về thực phẩm</p>
                    <i class="fa-solid fa-xmark close-btn"></i>
                </div>
                <div class="infor">
                    <div class="left">
                        <p class="name-row">
                            <span>Tên</span>
                            <input type="text" name="name" value="${foodData.name}" />
                        </p>
                        <p class="category-row">
                            <span>Danh mục</span>
                            <select id="category">
                                <option value="category">Category</option>
                                <option value="Grains" ${foodData.category === "Grains" ? "selected" : ""}>Grains</option>
                                <option value="Meat" ${foodData.category === "Meat" ? "selected" : ""}>Meat</option>
                                <option value="Fruits" ${foodData.category === "Fruits" ? "selected" : ""}>Fruits</option>
                                <option value="Vegetables" ${foodData.category === "Vegetables" ? "selected" : ""}>Vegetables</option>
                            </select>
                        </p>
                    </div>
                    <div class="right">
                        <p class="source-row">
                            <span>Nguồn</span>
                            <input type="text" name="source" value="${foodData.source}" />
                        </p>
                        <p class="quantity-row">
                            <span>Số lượng</span>
                            <input type="text" name="quantity" value="${foodData.quantity}" />
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
                            <p><span>Energy</span><input type="text" name="energy" value="${foodData.energy}" /><span>kcal</span></p>
                            <p><span>Carbohydrate</span><input type="text" name="carbohydrate" value="${foodData.carbohydrate}" /><span>g</span></p>
                        </div>
                        <div class="right_macronutrional">
                            <p><span>Fat</span><input type="text" name="fat" value="${foodData.fat}" /><span>g</span></p>
                            <p><span>Protein</span><input type="text" name="protein" value="${foodData.protein}" /><span>g</span></p>
                        </div>
                    </div>
                    <span>Micronutrients</span>
                    <div class="specifications">
                        <div class="columns">
                            <div class="column">
                                <p><span>Cholesterol</span><input type="text" value="0.0" /><span>mg</span></p>
                                <p><span>Water</span><input type="text" value="76.7" /><span>g</span></p>
                                <p><span>Vitamin B-12</span><input type="text" value="0.0" /><span>ug</span></p>
                                <p><span>Vitamin E</span><input type="text" value="" /><span>mg</span></p>
                                <p><span>Lactose</span><input type="text" value="0.0" /><span>g</span></p>
                                <p><span>Sugars</span><input type="text" value="0.8" /><span>g</span></p>
                                <p><span>Magnesium</span><input type="text" value="40.0" /><span>mg</span></p>
                                <p><span>Zinc</span><input type="text" value="0.6" /><span>mg</span></p>
                                <p><span>Manganese</span><input type="text" /><span>mg</span></p>
                                <p><span>Riboflavin</span><input type="text" value="0.07"/><span>mg</span></p>
                                <p><span>Folate, total</span><input type="text" value="41.0"/><span>ug</span></p>
                                <p><span>Fatty acids, total saturated</span><input type="text" /><span>g</span></p>
                                <p><span>Chloride</span><input type="text" value="340.0"/><span>mg</span></p>
                            </div>
                            <div class="column">
                                <p><span>Fiber</span><input type="text" value="" /><span>g</span></p>
                                <p><span>Vitamin A</span><input type="text" value="" /><span>ug</span></p>
                                <p><span>Vitamin C</span><input type="text" value="30.0" /><span>mg</span></p>
                                <p><span>Vitamin K</span><input type="text" value="" /><span>ug</span></p>
                                <p><span>Alcohol</span><input type="text" value="" /><span>g</span></p>
                                <p><span>Calcium</span><input type="text" value="35.0" /><span>mg</span></p>
                                <p><span>Phosphorus</span><input type="text" value="47.0" /><span>mg</span></p>
                                <p><span>Copper</span><input type="text" value="0.27" /><span>mg</span></p>
                                <p><span>Selenium</span><input type="text" /><span>ug</span></p>
                                <p><span>Niacin</span><input type="text" value="0.6"/><span>mg</span></p>
                                <p><span>Folic acid</span><input type="text" /><span>ug</span></p>
                                <p><span>Fatty acids, total monounsaturated</span><input type="text" /><span>g</span></p>
                            </div>
                            <div class="column">
                                <p><span>Sodium</span><input type="text" value="240.0" /><span>mg</span></p>
                                <p><span>Vitamin B-6</span><input type="text" value="0.06" /><span>mg</span></p>
                                <p><span>Vitamin D (D2 + D3)</span><input type="text" value="0.0" /><span>ug</span></p>
                                <p><span>Starch</span><input type="text" value="0.0" /><span>g</span></p>
                                <p><span>Caffeine</span><input type="text" value="" /><span>mg</span></p>
                                <p><span>Iron</span><input type="text" value="0.7" /><span>mg</span></p>
                                <p><span>Potassium</span><input type="text" value="270.0" /><span>mg</span></p>
                                <p><span>Fluoride</span><input type="text" value="" /><span>ug</span></p>
                                <p><span>Thiamin</span><input type="text" value="0.03"/><span>mg</span></p>
                                <p><span>Pantothenic acid</span><input type="text" /><span>mg</span></p>
                                <p><span>Fatty acids, total trans</span><input type="text" value="0.0"/><span>g</span></p>
                                <p><span>Fatty acids, total polyunsaturated</span><input type="text" /><span>g</span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button">
                    <button class="cancel-btn">Hủy</button>
                    <button class="save-btn">Lưu và đóng</button>
                </div>
            </div>
        `;

        document.querySelector(".container").appendChild(main);

        const saveBtn = main.querySelector(".save-btn");
        saveBtn.addEventListener("click", () => {
            const inputs = main.querySelectorAll(".infor input, .macronutrients input");
            let isValid = true;
            const updatedFood = {};

            inputs.forEach(input => {
                if (input.value.trim()) {
                    updatedFood[input.name] = input.value;
                } else {
                    updatedFood[input.name] = input.name === "name" || input.name === "source" ? "" : "0";
                }
            });

            const category = main.querySelector("#category").value;
            if (category === "category") {
                isValid = false;
                main.querySelector("#category").style.border = "1px solid red";
            } else {
                updatedFood.category = category;
            }

            if (isValid) {
                const numericFields = ["energy", "fat", "carbohydrate", "protein", "quantity"];
                numericFields.forEach(field => {
                    if (!(field in updatedFood)) {
                        updatedFood[field] = "0";
                    }
                    if (isNaN(parseFloat(updatedFood[field])) || parseFloat(updatedFood[field]) < 0) {
                        isValid = false;
                        main.querySelector(`input[name="${field}"]`).style.border = "1px solid red";
                    }
                });

                if (isValid) {
                    const index = foodDatabase.findIndex(f => f.id === foodData.id);
                    if (index !== -1) {
                        foodDatabase[index] = {
                            ...foodDatabase[index],
                            name: updatedFood.name || "",
                            source: updatedFood.source || "My foods",
                            category: updatedFood.category,
                            energy: parseFloat(updatedFood.energy) || 0,
                            fat: parseFloat(updatedFood.fat) || 0,
                            carbohydrate: parseFloat(updatedFood.carbohydrate) || 0,
                            protein: parseFloat(updatedFood.protein) || 0,
                            quantity: parseFloat(updatedFood.quantity) || 100
                        };
                        saveToLocalStorage();
                        currentFoods = [...foodDatabase];
                        main.remove();
                        renderFoods(currentFoods);
                        renderPagination(Math.ceil(currentFoods.length / itemsPerPage)); // Cập nhật phân trang
                    }
                } else {
                    alert("Vui lòng nhập số không âm cho các giá trị dinh dưỡng");
                }
            } else {
                alert("Vui lòng chọn danh mục thực phẩm");
            }
        });

        main.querySelector(".cancel-btn").addEventListener("click", () => {
            main.remove();
        });

        main.querySelector(".close-btn").addEventListener("click", () => {
            main.remove();
        });
    }

    foodChild.addEventListener("click", (event) => {
        const child = event.target.closest(".child");
        if (!child) return;

        const name = child.querySelector(".text p:first-child").textContent;
        const foodData = foodDatabase.find(f => f.name === name);
        if (foodData) {
            createMainElement(foodData);
        }
    });

    // Hàm hiển thị danh sách thực phẩm với phân trang
    function renderFoods(foods) {
        foodChild.innerHTML = "";
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedFoods = foods.slice(start, end);

        paginatedFoods.forEach(food => {
            const foodElement = document.createElement("div");
            foodElement.className = "child";
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
            foodChild.appendChild(foodElement);
        });

        // Cập nhật phân trang sau khi render danh sách
        const totalPages = Math.ceil(foods.length / itemsPerPage);
        renderPagination(totalPages);
    }

    // Hàm hiển thị các nút phân trang
    function renderPagination(totalPages) {
        const pageNumberContainer = document.getElementById("page-number");
        if (!pageNumberContainer) return; // Kiểm tra nếu phần tử không tồn tại

        pageNumberContainer.innerHTML = ""; // Xóa nội dung cũ

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.classList.add("page-btn");
            if (i === currentPage) {
                pageButton.classList.add("active"); // Đánh dấu trang hiện tại
            }
            pageButton.addEventListener("click", () => {
                currentPage = i;
                renderFoods(currentFoods); // Hiển thị lại danh sách cho trang mới
            });
            pageNumberContainer.appendChild(pageButton);
        }
    }

    // Sự kiện tìm kiếm thực phẩm
    searchInput.addEventListener("input", function (e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        currentFoods = foodDatabase.filter(food =>
            food.name.toLowerCase().includes(searchTerm) ||
            food.source.toLowerCase().includes(searchTerm) ||
            food.category.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        renderFoods(currentFoods);
    });

    // Sự kiện sắp xếp thực phẩm
    sortSelect.addEventListener("change", function (e) {
        const sortBy = e.target.value.toLowerCase();
        switch (sortBy) {
            case "energy":
                currentFoods.sort((a, b) => b.energy - a.energy);
                break;
            case "fat":
                currentFoods.sort((a, b) => b.fat - a.fat);
                break;
            case "carbohydrate":
                currentFoods.sort((a, b) => b.carbohydrate - a.carbohydrate);
                break;
            case "protein":
                currentFoods.sort((a, b) => b.protein - a.protein);
                break;
            default:
                currentFoods = [...foodDatabase];
        }
        currentPage = 1;
        renderFoods(currentFoods);
    });

    // Sự kiện lọc theo danh mục
    if (categorySelect) {
        categorySelect.addEventListener("change", function (e) {
            const category = e.target.value;
            if (category === "category") {
                currentFoods = [...foodDatabase];
            } else {
                currentFoods = foodDatabase.filter(food =>
                    food.category.toLowerCase() === category.toLowerCase()
                );
            }
            currentPage = 1;
            renderFoods(currentFoods);
        });
    }

    // Sự kiện nút Previous (trang trước)
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderFoods(currentFoods);
            }
        });
    }

    // Sự kiện nút Next (trang sau)
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const totalPages = Math.ceil(currentFoods.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderFoods(currentFoods);
            }
        });
    }

    // Hiển thị danh sách thực phẩm lần đầu khi trang tải
    renderFoods(foodDatabase);
});
document.getElementsByClassName("sign_out")[0].onclick=function(){
    window.location.href="../pages/sign in.html"
}
