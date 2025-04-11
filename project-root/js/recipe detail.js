// Sự kiện được kích hoạt khi DOM đã tải xong
// - Đảm bảo tất cả các phần tử HTML đã sẵn sàng trước khi thao tác
document.addEventListener("DOMContentLoaded", () => {
  // Lấy thông tin công thức đã chọn từ localStorage
  // - JSON.parse chuyển chuỗi JSON thành object
  // - Dữ liệu được lưu trước đó (ví dụ: từ trang danh sách công thức)
  const selectedRecipe = JSON.parse(localStorage.getItem("selectedRecipe"));

  // Kiểm tra nếu có công thức được chọn
  if (selectedRecipe) {
      // Cập nhật danh mục công thức
      // - Lấy phần tử có class "category" và gán nội dung là danh mục của công thức
      document.querySelector(".category").textContent = selectedRecipe.category;

      // Cập nhật tên công thức
      // - Lấy phần tử con ".name" trong cấu trúc DOM và gán nội dung là tiêu đề công thức
      document.querySelector(".right .table .text .name").textContent = selectedRecipe.title;

      // Cập nhật tác giả
      // - Lấy phần tử con ".Author" trong cấu trúc DOM và gán nội dung là tên tác giả
      document.querySelector(".right .table .text .Author").textContent = selectedRecipe.author;

      // Cập nhật số lượt thích
      // - Lấy phần tử con trong ".heart" và gán nội dung HTML bao gồm icon trái tim và số lượt thích
      // - Sử dụng innerHTML để chèn cả thẻ <i> và giá trị likes
      document.querySelector(".heart span").innerHTML = `<i class="fa-regular fa-heart"></i> ${selectedRecipe.likes}`;

      // Cập nhật thông tin dinh dưỡng
      // - Lấy phần tử con trong ".energy" và gán giá trị năng lượng (loại bỏ " kcal" để chỉ hiển thị số)
      document.querySelector(".energy p span").textContent = selectedRecipe.nutrition.energy.replace(" kcal", "");
      // Cập nhật giá trị chất béo trong biểu đồ dinh dưỡng
      document.querySelector(".analysis .chart .nutrition .fat").textContent = selectedRecipe.nutrition.fat;
      // Cập nhật giá trị carbohydrate trong biểu đồ dinh dưỡng
      document.querySelector(".analysis .chart .nutrition .carbohydrate").textContent = selectedRecipe.nutrition.carbohydrate;
      // Cập nhật giá trị protein trong biểu đồ dinh dưỡng
      document.querySelector(".analysis .chart .nutrition .protein").textContent = selectedRecipe.nutrition.protein;
      // Fiber không có trong dữ liệu gốc, được comment để tránh lỗi
      // - Nếu cần hiển thị fiber, cần thêm dữ liệu vào selectedRecipe.nutrition
      // document.querySelector(".analysis .chart .nutrition .fiber").textContent = selectedRecipe.nutrition.fiber || "N/A";

      // Cập nhật biểu đồ dinh dưỡng (pie chart)
      // - Kiểm tra nếu có dữ liệu dinh dưỡng trong công thức
      if (selectedRecipe.nutrition) {
          // Lấy các giá trị dinh dưỡng từ object nutrition
          const { fat, carbohydrate, protein } = selectedRecipe.nutrition;
          // Chuyển các giá trị từ chuỗi (ví dụ: "6 g") thành số bằng parseFloat, loại bỏ " g"
          const fatValue = parseFloat(fat.replace(" g", ""));
          const carbValue = parseFloat(carbohydrate.replace(" g", ""));
          const proteinValue = parseFloat(protein.replace(" g", ""));
          // Tính tổng giá trị dinh dưỡng để làm cơ sở tính phần trăm
          const total = fatValue + carbValue + proteinValue;

          // Tính phần trăm của từng chất dinh dưỡng
          // - Chia giá trị riêng lẻ cho tổng, nhân 100 để ra phần trăm, làm tròn đến 1 chữ số thập phân
          const fatPercentage = ((fatValue / total) * 100).toFixed(1);
          const carbPercentage = ((carbValue / total) * 100).toFixed(1);
          const proteinPercentage = ((proteinValue / total) * 100).toFixed(1);

          // Lấy phần tử pie chart để cập nhật kiểu hiển thị
          const pieChart = document.querySelector(".pie-chart");
          // Cập nhật background của pie chart bằng conic-gradient
          // - Sử dụng phần trăm để phân chia màu sắc đại diện cho fat, carbohydrate, protein
          // - #e64a64 cho fat, #e8a878 cho carbohydrate, #17a589 cho protein
          pieChart.style.background = `
              conic-gradient(
                  #e64a64 ${fatPercentage}%,
                  #e8a878 ${fatPercentage}% ${parseFloat(fatPercentage) + parseFloat(carbPercentage)}%,
                  #17a589 ${parseFloat(fatPercentage) + parseFloat(carbPercentage)}% 100%
              )
          `;

          // Cập nhật nhãn phần trăm trên giao diện
          // - Gán giá trị phần trăm vào các phần tử tương ứng
          document.querySelector(".fat-label").textContent = `${fatPercentage}%`;
          document.querySelector(".carb-label").textContent = `${carbPercentage}%`;
          document.querySelector(".protein-label").textContent = `${proteinPercentage}%`;
      }
  }
});

// Sự kiện thứ hai được kích hoạt khi DOM đã tải xong
// - Xử lý dropdown danh mục chỉnh sửa trên giao diện chi tiết công thức
document.addEventListener("DOMContentLoaded", () => {
  // Lấy các phần tử giao diện liên quan đến dropdown danh mục
  // - categoryInput: Ô nhập liệu để hiển thị danh mục hiện tại
  // - categoryList: Danh sách các lựa chọn danh mục
  // - categorySpan: Phần tử hiển thị danh mục ban đầu
  // - categoryDropdown: Container bao quanh dropdown
  const categoryInput = document.getElementById("category-input");
  const categoryList = document.getElementById("category-list");
  const categorySpan = document.getElementById("category");
  const categoryDropdown = document.querySelector(".category-dropdown");

  // Kiểm tra xem các phần tử có tồn tại trong DOM không
  // - Nếu thiếu bất kỳ phần tử nào, ghi log lỗi và thoát để tránh lỗi runtime
  if (!categoryInput || !categoryList || !categorySpan || !categoryDropdown) {
      console.error("Một hoặc nhiều element không tồn tại trong DOM");
      return;
  }

  // Hiển thị dropdown và input khi nhấn vào span
  // - Khi người dùng nhấp vào categorySpan, chuyển sang chế độ chỉnh sửa
  categorySpan.addEventListener("click", (e) => {
      // Ẩn span để hiển thị input và dropdown
      categorySpan.style.display = "none";
      // Hiển thị toàn bộ dropdown (bao gồm input và danh sách)
      categoryDropdown.style.display = "block";
      // Hiển thị ô nhập liệu
      categoryInput.style.display = "block";
      // Hiển thị danh sách các lựa chọn danh mục ngay lập tức
      categoryList.style.display = "block";
  });

  // Toggle danh sách khi nhấn vào input
  // - Khi nhấp vào ô nhập liệu, hiển thị hoặc ẩn danh sách tùy thuộc vào trạng thái hiện tại
  categoryInput.addEventListener("click", (e) => {
      // Nếu danh sách đang ẩn thì hiển thị, nếu đang hiển thị thì ẩn
      categoryList.style.display = categoryList.style.display === "none" ? "block" : "none";
  });

  // Cập nhật giá trị khi chọn một mục trong danh sách dropdown
  // - Khi nhấp vào một mục <li> trong danh sách
  categoryList.addEventListener("click", (e) => {
      // Kiểm tra nếu phần tử được nhấp là thẻ <li>
      if (e.target.tagName === "LI") {
          // Cập nhật giá trị của ô nhập liệu bằng nội dung của mục được chọn
          // - trim() loại bỏ khoảng trắng thừa
          categoryInput.value = e.target.textContent.trim();
          // Ẩn danh sách sau khi chọn
          categoryList.style.display = "none";
          // Cập nhật nội dung của span bằng giá trị đã chọn
          categorySpan.textContent = e.target.textContent.trim();
          // Hiển thị lại span
          categorySpan.style.display = "block";
          // Ẩn toàn bộ dropdown
          categoryDropdown.style.display = "none";
          // Thêm lại hình ảnh vào span (ngũ giác)
          // - Tạo phần tử img và thêm vào đầu span để giữ giao diện nhất quán
          const img = document.createElement("img");
          img.src = "../assets/ngũ giác.png";
          img.alt = "";
          categorySpan.prepend(img);
      }
  });

  // Ẩn dropdown khi nhấp ra ngoài
  // - Lắng nghe sự kiện click trên toàn bộ tài liệu
  document.addEventListener("click", (e) => {
      // Kiểm tra nếu vị trí nhấp không nằm trong dropdown và không phải là span
      if (!categoryDropdown.contains(e.target) && e.target !== categorySpan) {
          // Ẩn danh sách các lựa chọn
          categoryList.style.display = "none";
          // Ẩn toàn bộ dropdown
          categoryDropdown.style.display = "none";
          // Hiển thị lại span
          categorySpan.style.display = "block";
      }
  });
});