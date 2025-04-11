// Tải thông tin người dùng đã đăng nhập từ localStorage
// - JSON.parse chuyển chuỗi JSON thành object
// - Giả định rằng người dùng đã đăng nhập và thông tin được lưu trước đó
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// Hiển thị tên người dùng lên giao diện
// - Lấy phần tử có id="name" và gán nội dung là tên người dùng từ loggedInUser
// - Sử dụng template literal để chèn giá trị name vào textContent
document.getElementById("name").textContent = `${loggedInUser.name}`;

// Dữ liệu mẫu cho các món ăn
// - Một mảng chứa 9 công thức, mỗi công thức là một object với các thuộc tính:
//   - title: Tên công thức
//   - author: Tác giả của công thức
//   - likes: Số lượt thích của công thức
//   - category: Danh mục công thức (Vegetarian dishes, Desserts, Meat dishes, v.v.)
//   - nutrition: Object chứa thông tin dinh dưỡng (energy, fat, carbohydrate, protein)
const recipes = [
  {
    title: "Turmeric Roasted Cauliflower Salad (lowfodmap)",
    author: "Joana Jardim",
    likes: 37,
    category: "Vegetarian dishes",
    nutrition: {
      energy: "143 kcal",
      fat: "6 g",
      carbohydrate: "18 g",
      protein: "5 g",
    },
  },
  {
    title: "Green Beans With Tofu and Roasted Peanuts",
    author: "Joana Jardim",
    likes: 22,
    category: "Vegetarian dishes",
    nutrition: {
      energy: "170 kcal",
      fat: "8 g",
      carbohydrate: "16 g",
      protein: "8 g",
    },
  },
  {
    title: "High Protein Blueberry Cheesecake",
    author: "Vassilis Stavrou",
    likes: 46,
    category: "Desserts",
    nutrition: {
      energy: "250 kcal",
      fat: "12 g",
      carbohydrate: "30 g",
      protein: "12 g",
    },
  },
  {
    title: "Spicy Sausage and Veggie Stir Fry",
    author: "Vassilis Stavrou",
    likes: 31,
    category: "Meat dishes",
    nutrition: {
      energy: "300 kcal",
      fat: "15 g",
      carbohydrate: "25 g",
      protein: "20 g",
    },
  },
  {
    title: "Vegetable & Egg Scramble",
    author: "Joana Jardim",
    likes: 32,
    category: "Vegetarian dishes",
    nutrition: {
      energy: "200 kcal",
      fat: "10 g",
      carbohydrate: "18 g",
      protein: "14 g",
    },
  },
  {
    title: "Berry Almond Smoothie",
    author: "Vassilis Stavrou",
    likes: 19,
    category: "Desserts",
    nutrition: {
      energy: "180 kcal",
      fat: "9 g",
      carbohydrate: "22 g",
      protein: "9 g",
    },
  },
  {
    title: "Asian Chicken Almond Salad",
    author: "Vassilis Stavrou",
    likes: 27,
    category: "Chicken dishes",
    nutrition: {
      energy: "220 kcal",
      fat: "11 g",
      carbohydrate: "15 g",
      protein: "20 g",
    },
  },
  {
    title: "Berry Almond Smoothie (Full Fat)",
    author: "Joana Jardim",
    likes: 37,
    category: "Desserts",
    nutrition: {
      energy: "250 kcal",
      fat: "12 g",
      carbohydrate: "30 g",
      protein: "10 g",
    },
  },
  {
    title: "Berry Almond Smoothie",
    author: "Joana Jardim",
    likes: 25,
    category: "Desserts",
    nutrition: {
      energy: "150 kcal",
      fat: "12 g",
      carbohydrate: "30 g",
      protein: "10 g",
    },
  },
];

// Lưu danh sách công thức vào localStorage để sử dụng lại sau này
// - JSON.stringify chuyển mảng recipes thành chuỗi JSON
// - Lưu vào localStorage với key "recipes" để có thể truy xuất ở các phiên sau
localStorage.setItem("recipes", JSON.stringify(recipes));

// Lấy danh sách công thức từ localStorage
// - JSON.parse chuyển chuỗi JSON thành mảng
// - Nếu không có dữ liệu (null), trả về mảng rỗng để tránh lỗi
const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];

// Khai báo biến cho phân trang
// - itemsPerPage: Số công thức hiển thị trên mỗi trang (8 công thức)
// - currentPage: Trang hiện tại, bắt đầu từ trang 1
const itemsPerPage = 8;
let currentPage = 1;

// Hàm renderRecipes: Hiển thị danh sách công thức lên giao diện
function renderRecipes(recipesToShow) {
    // Lấy phần tử container có id="nutrition-table" để chứa các công thức
    const recipesContainer = document.getElementById("nutrition-table");
    // Xóa nội dung cũ trong container để tránh hiển thị trùng lặp khi render lại
    recipesContainer.innerHTML = "";

    // Tính toán chỉ số bắt đầu và kết thúc cho phân trang
    // - startIndex: Vị trí bắt đầu của công thức trên trang hiện tại (dựa trên currentPage và itemsPerPage)
    // - endIndex: Vị trí kết thúc của công thức trên trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Lấy danh sách công thức cho trang hiện tại bằng cách cắt mảng recipesToShow
    const paginatedRecipes = recipesToShow.slice(startIndex, endIndex);
    // Tính tổng số trang dựa trên tổng số công thức và số công thức mỗi trang
    // - Math.ceil đảm bảo làm tròn lên để có đủ trang cho tất cả công thức
    const totalPages = Math.ceil(recipesToShow.length / itemsPerPage);

    // Duyệt qua từng công thức trong danh sách đã phân trang
    paginatedRecipes.forEach((recipe) => {
        // Tạo một phần tử div mới cho mỗi công thức
        const recipeElement = document.createElement("div");
        // Thêm class "child" để áp dụng kiểu CSS cho phần tử công thức
        recipeElement.classList.add("child");

        // Tạo nội dung HTML cho mỗi công thức
        // - Bao gồm thông tin như tiêu đề, tác giả, lượt thích, danh mục, và bảng dinh dưỡng
        recipeElement.innerHTML = `
            <div class="Community">
                <img src="../assets/diversity_3.svg.png" alt="icon" />
                <p>Community Recipes</p>
            </div>
            <div class="content">
                <p>${recipe.title}</p> <!-- Tiêu đề công thức -->
                <span class="name-author">${recipe.author}</span> <!-- Tên tác giả -->
                <div class="heart">
                    <span>
                        <i class="fa-regular fa-heart"></i> <!-- Icon trái tim biểu thị lượt thích -->
                        ${recipe.likes} <!-- Số lượt thích -->
                    </span>
                </div>
                <div class="icon-content">
                    <img src="../assets/ngũ giác.png" alt="icon" />
                    <span>${recipe.category}</span> <!-- Danh mục công thức -->
                </div>
                <div class="dosage">
                    <table> <!-- Bảng thông tin dinh dưỡng -->
                        <tr>
                            <th>by</th>
                            <th>Energy</th>
                            <th>Fat</th>
                            <th>Carbohydrate</th>
                            <th>Protein</th>
                        </tr>
                        <tr>
                            <td>100g</td> <!-- Đơn vị tính -->
                            <td>${recipe.nutrition.energy}</td> <!-- Giá trị năng lượng -->
                            <td>${recipe.nutrition.fat}</td> <!-- Giá trị chất béo -->
                            <td>${recipe.nutrition.carbohydrate}</td> <!-- Giá trị carbohydrate -->
                            <td>${recipe.nutrition.protein}</td> <!-- Giá trị protein -->
                        </tr>
                    </table>
                </div>
            </div>
        `;
        // Thêm phần tử công thức vào container
        recipesContainer.appendChild(recipeElement);
    });
    // Gọi hàm renderPagination để hiển thị các nút phân trang
    renderPagination(totalPages);
}

// Hàm renderPagination: Hiển thị các nút phân trang (1, 2, 3, ...)
// - Mục đích là tạo các nút để người dùng chuyển đổi giữa các trang
function renderPagination(totalPages) {
    // Lấy phần tử có id="page-number" để chứa các nút phân trang
    const pageNumberContainer = document.getElementById("page-number");
    // Xóa nội dung cũ trong container để tránh trùng lặp khi render lại
    pageNumberContainer.innerHTML = "";

    // Tạo nút cho từng trang từ 1 đến totalPages
    for (let i = 1; i <= totalPages; i++) {
        // Tạo một nút mới cho mỗi trang
        const pageButton = document.createElement("button");
        // Gán số trang (i) làm nội dung của nút
        pageButton.textContent = i;
        // Thêm class "page-btn" để áp dụng kiểu CSS
        pageButton.classList.add("page-btn");
        // Nếu số trang của nút trùng với trang hiện tại, thêm class "active" để đánh dấu
        if (i === currentPage) {
            pageButton.classList.add("active");
        }
        // Thêm sự kiện click cho nút
        // - Khi nhấn, cập nhật currentPage và gọi filterAndRender để hiển thị danh sách công thức cho trang mới
        pageButton.addEventListener("click", () => {
            currentPage = i;
            filterAndRender();
        });
        // Thêm nút vào container
        pageNumberContainer.appendChild(pageButton);
    }
}

// Lấy các phần tử giao diện để thêm sự kiện lọc và sắp xếp
// - search: Ô nhập liệu tìm kiếm công thức (id="search-food")
// - category: Dropdown chọn danh mục công thức (id="category")
// - sortSelect: Dropdown chọn tiêu chí sắp xếp (trong phần tử có class "sort")
const search = document.getElementById("search-food");
const category = document.getElementById("category");
const sortSelect = document.querySelector(".sort select");

// Thêm sự kiện cho dropdown sắp xếp
// - Khi giá trị thay đổi (người dùng chọn một tiêu chí sắp xếp mới), gọi filterAndRender
if (sortSelect) {
    sortSelect.addEventListener("change", filterAndRender);
}

// Thêm sự kiện cho ô tìm kiếm
// - Khi người dùng nhấn phím Enter trong ô tìm kiếm, gọi filterAndRender
if (search) {
    search.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            filterAndRender();
        }
    });
}

// Thêm sự kiện cho dropdown danh mục
// - Khi giá trị thay đổi (người dùng chọn một danh mục mới), gọi filterAndRender
// - Sử dụng sự kiện "change" vì đây là dropdown, không cần kiểm tra phím như ô tìm kiếm
if (category) {
    category.addEventListener("change", filterAndRender);
}

// Thêm sự kiện cho nút Previous (trang trước)
// - Lấy nút đầu tiên trong phần tử có class "list-page"
const prevButton = document.querySelector(".list-page button:first-of-type");
if (prevButton) {
    prevButton.addEventListener("click", () => {
        // Kiểm tra nếu không phải trang đầu tiên
        if (currentPage > 1) {
            // Giảm số trang hiện tại
            currentPage--;
            // Gọi filterAndRender để hiển thị danh sách công thức cho trang mới
            filterAndRender();
        }
    });
}

// Thêm sự kiện cho nút Next (trang sau)
// - Lấy nút cuối cùng trong phần tử có class "list-page"
const nextButton = document.querySelector(".list-page button:last-of-type");
if (nextButton) {
    nextButton.addEventListener("click", () => {
        // Tính tổng số trang dựa trên danh sách công thức đã lọc
        const totalPages = Math.ceil(getFilteredRecipes().length / itemsPerPage);
        // Kiểm tra nếu chưa phải trang cuối
        if (currentPage < totalPages) {
            // Tăng số trang hiện tại
            currentPage++;
            // Gọi filterAndRender để hiển thị danh sách công thức cho trang mới
            filterAndRender();
        }
    });
}

// Hàm filterAndRender: Lọc và hiển thị công thức dựa trên các điều kiện
function filterAndRender() {
    // Tạo bản sao của danh sách công thức từ storedRecipes
    // - Tránh thay đổi dữ liệu gốc khi lọc và sắp xếp
    let filteredRecipes = [...storedRecipes];

    // Lọc theo tìm kiếm
    // - Lấy giá trị từ ô tìm kiếm, loại bỏ khoảng trắng thừa, chuyển thành chữ thường
    const searchFood = search.value.trim().toLowerCase();
    // Nếu có từ khóa tìm kiếm
    if (searchFood) {
        // Lọc danh sách công thức, chỉ giữ lại các công thức có tiêu đề chứa từ khóa
        // - So sánh không phân biệt hoa thường
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.title.toLowerCase().includes(searchFood)
        );
    }

    // Lọc theo danh mục
    // - Lấy giá trị từ dropdown danh mục, chuyển thành chữ thường
    const categoryTerm = category.value.toLowerCase();
    // Nếu danh mục không phải giá trị mặc định "category"
    if (categoryTerm !== "category") {
        // Lọc danh sách công thức, chỉ giữ lại các công thức có danh mục khớp chính xác
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.category.toLowerCase() === categoryTerm
        );
    }

    // Sắp xếp theo chất dinh dưỡng
    // - Lấy giá trị từ dropdown sắp xếp, chuyển thành chữ thường
    const sortTerm = sortSelect.value.toLowerCase();
    // Nếu có tiêu chí sắp xếp
    if (sortTerm) {
        // Sắp xếp danh sách công thức dựa trên tiêu chí
        filteredRecipes.sort((a, b) => {
            let valA, valB; // Biến lưu giá trị dinh dưỡng của hai công thức để so sánh
            // Kiểm tra tiêu chí sắp xếp
            switch(sortTerm) {
                case "energy": // Sắp xếp theo năng lượng
                    // Chuyển giá trị energy thành số bằng parseFloat
                    valA = parseFloat(a.nutrition.energy);
                    valB = parseFloat(b.nutrition.energy);
                    break;
                case "fat": // Sắp xếp theo chất béo
                    valA = parseFloat(a.nutrition.fat);
                    valB = parseFloat(b.nutrition.fat);
                    break;
                case "carbohydrate": // Sắp xếp theo carbohydrate
                    valA = parseFloat(a.nutrition.carbohydrate);
                    valB = parseFloat(b.nutrition.carbohydrate);
                    break;
                case "protein": // Sắp xếp theo protein
                    valA = parseFloat(a.nutrition.protein);
                    valB = parseFloat(b.nutrition.protein);
                    break;
                default: // Nếu không có tiêu chí hợp lệ
                    return 0; // Giữ nguyên thứ tự hiện tại
            }
            // Sắp xếp giảm dần: công thức có giá trị lớn hơn đứng trước
            return valB - valA;
        });
    }

    // Gọi hàm renderRecipes để hiển thị danh sách công thức đã lọc và sắp xếp
    renderRecipes(filteredRecipes);
}

// Hàm getFilteredRecipes: Lấy danh sách công thức đã lọc để tính số trang
function getFilteredRecipes() {
    // Tạo bản sao của danh sách công thức gốc
    let filteredRecipes = [...storedRecipes];

    // Áp dụng bộ lọc tìm kiếm
    // - Lấy giá trị từ ô tìm kiếm, loại bỏ khoảng trắng thừa, chuyển thành chữ thường
    const searchFood = search.value.trim().toLowerCase();
    // Nếu có từ khóa tìm kiếm
    if (searchFood) {
        // Lọc danh sách công thức, chỉ giữ lại các công thức có tiêu đề chứa từ khóa
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.title.toLowerCase().includes(searchFood)
        );
    }

    // Áp dụng bộ lọc danh mục
    // - Lấy giá trị từ dropdown danh mục, chuyển thành chữ thường
    const categoryTerm = category.value.toLowerCase();
    // Nếu danh mục không phải giá trị mặc định "category"
    if (categoryTerm !== "category") {
        // Lọc danh sách công thức, chỉ giữ lại các công thức có danh mục khớp chính xác
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.category.toLowerCase() === categoryTerm
        );
    }

    // Trả về danh sách công thức đã lọc
    return filteredRecipes;
}

// Gọi hàm hiển thị ban đầu khi trang được tải
// - Đảm bảo danh sách công thức được hiển thị ngay khi trang được tải
filterAndRender();

// Thêm sự kiện cho nút đăng xuất
// - Lấy phần tử đầu tiên có class "sign_out"
// - Khi nhấn, chuyển hướng về trang đăng nhập
document.getElementsByClassName("sign_out")[0].onclick = function() {
    window.location.href = "../pages/sign in.html";
};