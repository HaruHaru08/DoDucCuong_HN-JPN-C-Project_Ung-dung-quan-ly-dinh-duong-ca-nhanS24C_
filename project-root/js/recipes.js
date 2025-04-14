// Retrieve logged-in user from localStorage
// - JSON.parse chuyển chuỗi JSON thành object
// - Giả định thông tin người dùng đã được lưu trước đó trong quá trình đăng nhập
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// Hiển thị tên người dùng lên giao diện
// - Lấy phần tử có id="name" và gán nội dung là tên người dùng từ loggedInUser
// - Sử dụng template literal để chèn giá trị name
document.getElementById("name").textContent = `${loggedInUser.name}`;

// Sample data for recipes
// - Lấy danh sách công thức từ localStorage với key "recipes"
// - Nếu không có dữ liệu (null), sử dụng danh sách mặc định chứa 9 công thức
// - Mỗi công thức bao gồm title, author, likes, category, và nutrition (energy, fat, carbohydrate, protein)
const recipes = JSON.parse(localStorage.getItem("recipes")) || [
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

// Pagination variables
// - itemsPerPage: Số công thức hiển thị trên mỗi trang (8)
// - currentPage: Trang hiện tại, bắt đầu từ 1
// - currentRecipes: Biến toàn cục lưu danh sách công thức hiện tại sau khi lọc hoặc sắp xếp
const itemsPerPage = 8;
let currentPage = 1;
let currentRecipes = recipes;

// Function to render recipes with pagination
// - Hiển thị danh sách công thức lên giao diện với phân trang
function renderRecipes(recipesToShow = currentRecipes) {
  // Lấy container chứa danh sách công thức (id="recip_child")
  const recipesContainer = document.getElementById("recip_child");
  // Nếu container không tồn tại, thoát hàm để tránh lỗi
  if (!recipesContainer) return;

  // Xóa nội dung cũ trong container để tránh trùng lặp khi render lại
  recipesContainer.innerHTML = "";
  // Tính toán chỉ số bắt đầu và kết thúc cho phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Cắt danh sách công thức để chỉ lấy các mục cho trang hiện tại
  const paginatedRecipes = recipesToShow.slice(startIndex, endIndex);

  // Duyệt qua từng công thức trong danh sách đã phân trang
  paginatedRecipes.forEach((recipe) => {
    // Tạo một phần tử div mới cho mỗi công thức
    const recipeElement = document.createElement("div");
    // Thêm class "child" để áp dụng kiểu CSS
    recipeElement.classList.add("child");
    // Tạo nội dung HTML cho công thức
    recipeElement.innerHTML = `
            <div class="icon_child">
                <img src="../assets/diversity_3.svg.png" alt="icon" />
                <p>Community Recipes</p>
            </div>
            <div class="content_child">
                <div class="title_content">
                    <p>${recipe.title}</p> <!-- Tiêu đề công thức -->
                    <div class="heart">
                        <span><i class="fa-regular fa-heart"></i> ${recipe.likes}</span> <!-- Icon trái tim và số lượt thích -->
                    </div>
                </div>
                <span class="name_recip">${recipe.author}</span> <!-- Tên tác giả -->
                <div class="icon_content">
                    <img src="../assets/ngũ giác.png" alt="icon" />
                    <span>${recipe.category}</span> <!-- Danh mục công thức -->
                </div>
                <div class="specifications">
                    <table> <!-- Bảng thông tin dinh dưỡng -->
                        <tr><th>By</th><th>Energy</th><th>Fat</th><th>Carbohydrate</th><th>Protein</th></tr>
                        <tr><td>100g</td><td>${recipe.nutrition.energy}</td><td>${recipe.nutrition.fat}</td><td>${recipe.nutrition.carbohydrate}</td><td>${recipe.nutrition.protein}</td></tr>
                    </table>
                </div>
            </div>
        `;
    // Thêm sự kiện click cho phần tử công thức
    // - Khi nhấp, lưu công thức vào localStorage và chuyển hướng đến trang chi tiết
    // Gắn sự kiện click cho recipeElement thay vì .recip_child
    recipeElement.addEventListener("click", () => {
        // Lưu công thức đã chọn vào localStorage
        localStorage.setItem("selectedRecipe", JSON.stringify(recipe));
        // Chuyển hướng đến trang chi tiết công thức
        window.location.href = "../pages/Recipe detail.html";
    });
    // Thêm phần tử công thức vào container
    recipesContainer.appendChild(recipeElement);
  });

  // Gọi hàm renderPagination để hiển thị các nút phân trang
  // - Truyền vào tổng số công thức để tính số trang
  renderPagination(recipesToShow.length);
}

// Function to render pagination controls with page numbers
// - Hiển thị các nút phân trang và xử lý nút Previous/Next
function renderPagination(totalItems) {
  // Tính tổng số trang dựa trên tổng số công thức và số công thức mỗi trang
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  // Lấy container chứa các nút phân trang (id="page-number")
  const pageNumberContainer = document.getElementById("page-number");
  // Nếu container không tồn tại, thoát hàm để tránh lỗi
  if (!pageNumberContainer) return;

  // Xóa các nút phân trang cũ để tránh trùng lặp
  pageNumberContainer.innerHTML = "";

  // Tạo các nút số trang
  for (let i = 1; i <= totalPages; i++) {
    // Tạo nút mới cho mỗi trang
    const pageButton = document.createElement("button");
    // Gán số trang (i) làm nội dung của nút
    pageButton.textContent = i;
    // Thêm class "page-btn" để áp dụng kiểu CSS
    pageButton.classList.add("page-btn");
    // Nếu trang hiện tại trùng với số trang của nút, thêm class "active" để đánh dấu
    if (i === currentPage) pageButton.classList.add("active");
    // Thêm sự kiện click: khi nhấn, cập nhật currentPage và render lại danh sách
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderRecipes(currentRecipes);
    });
    // Thêm nút vào container
    pageNumberContainer.appendChild(pageButton);
  }

  // Xử lý nút Previous và Next
  // - Lấy các nút Previous và Next bằng id
  const prevButton = document.querySelector("#btn-prev");
  const nextButton = document.querySelector("#btn-next");
  // Nếu nút Previous tồn tại
  if (prevButton) {
    // Vô hiệu hóa nút nếu đang ở trang đầu tiên
    prevButton.disabled = currentPage === 1;
    // Thêm sự kiện click: giảm currentPage nếu không phải trang đầu tiên
    prevButton.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderRecipes(currentRecipes);
      }
    };
  }
  // Nếu nút Next tồn tại
  if (nextButton) {
    // Vô hiệu hóa nút nếu đang ở trang cuối cùng
    nextButton.disabled = currentPage === totalPages;
    // Thêm sự kiện click: tăng currentPage nếu chưa phải trang cuối
    nextButton.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderRecipes(currentRecipes);
      }
    };
  }
}

// Search functionality
// - Tìm kiếm công thức dựa trên tiêu đề
const searchInput = document.querySelector(".search_food");
if (searchInput) {
  // Thêm sự kiện input: kích hoạt mỗi khi người dùng nhập
  searchInput.addEventListener("input", (e) => {
    // Lấy giá trị tìm kiếm, chuyển thành chữ thường để so sánh không phân biệt hoa thường
    const searchTerm = e.target.value.toLowerCase();
    // Lọc danh sách công thức, chỉ giữ lại các công thức có tiêu đề chứa từ khóa
    currentRecipes = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchTerm)
    );
    // Đặt lại về trang đầu tiên sau khi lọc
    currentPage = 1;
    // Hiển thị danh sách công thức đã lọc
    renderRecipes(currentRecipes);
  });
}

// Sort functionality
// - Sắp xếp công thức theo chất dinh dưỡng
const sortInput = document.querySelector(".custom_input select");
if (sortInput) {
  // Thêm sự kiện change: kích hoạt khi người dùng chọn một giá trị mới
  sortInput.addEventListener("change", (e) => {
    // Lấy giá trị tiêu chí sắp xếp, chuyển thành chữ thường
    const nutrient = e.target.value.toLowerCase();
    // Nếu chọn "sort by nutrient" (giá trị mặc định), khôi phục danh sách gốc
    if (nutrient === "sort by nutrient") {
      currentRecipes = [...recipes];
    } else {
      // Sắp xếp danh sách công thức theo tiêu chí đã chọn
      currentRecipes = [...recipes].sort((a, b) => {
        // Sắp xếp giảm dần (giá trị lớn hơn đứng trước)
        if (nutrient === "energy")
          return parseInt(b.nutrition.energy) - parseInt(a.nutrition.energy);
        if (nutrient === "fat")
          return parseInt(b.nutrition.fat) - parseInt(a.nutrition.fat);
        if (nutrient === "carbohydrate")
          return (
            parseInt(b.nutrition.carbohydrate) -
            parseInt(a.nutrition.carbohydrate)
          );
        if (nutrient === "protein")
          return parseInt(b.nutrition.protein) - parseInt(a.nutrition.protein);
        return 0; // Giữ nguyên thứ tự nếu không khớp tiêu chí
      });
    }
    // Đặt lại về trang đầu tiên sau khi sắp xếp
    currentPage = 1;
    // Hiển thị danh sách công thức đã sắp xếp
    renderRecipes(currentRecipes);
  });
}

// Category filter functionality
// - Lọc công thức theo danh mục
const categoryInput = document.querySelector("#category");
if (categoryInput) {
  // Thêm sự kiện change: kích hoạt khi người dùng chọn một danh mục mới
  categoryInput.addEventListener("change", (e) => {
    // Lấy giá trị danh mục từ dropdown
    const category = e.target.value;
    // Nếu chọn "category" (giá trị mặc định), hiển thị tất cả công thức
    // Ngược lại, lọc danh sách công thức theo danh mục được chọn
    currentRecipes =
      category === "category"
        ? recipes
        : recipes.filter((recipe) => recipe.category === category);
    // Đặt lại về trang đầu tiên sau khi lọc
    currentPage = 1;
    // Hiển thị danh sách công thức đã lọc
    renderRecipes(currentRecipes);
  });
}

// Initial render
// - Hiển thị danh sách công thức ban đầu khi trang được tải
renderRecipes();

// Thêm sự kiện cho nút "Add Recipe"
// - Khi nhấn, chuyển hướng đến trang thêm công thức mới
document.getElementById("btn-add").onclick = function () {
  window.location.href = "../pages/add recipe.html";
};
// Thêm sự kiện cho nút đăng xuất
// - Lấy phần tử đầu tiên có class "sign_out"
// - Khi nhấn, chuyển hướng về trang đăng nhập
document.getElementsByClassName("sign_out")[0].onclick = function() {
  window.location.href = "../pages/sign in.html";
};