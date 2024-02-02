const apiUrl =
  "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json";
// SET DEFAULT ACTIVE CATEGORY
let activeCategory = "Men";

// FUNCTION THAT TOGGLES ACTIVE CATEGORY
function showCategory(category) {
  activeCategory = category;
  fetchData();
  updateActiveButton(category);
}

// FUNCTION TO SET CSS TO ACTIVE BUTTON
function updateActiveButton(category) {
  // Reset all buttons to default style
  document.getElementById("menBtn").classList.remove("active-btn");
  document.getElementById("womenBtn").classList.remove("active-btn");
  document.getElementById("kidsBtn").classList.remove("active-btn");

  document.getElementById("menIcon").classList.remove("active-icon");
  document.getElementById("womenIcon").classList.remove("active-icon");
  document.getElementById("kidsIcon").classList.remove("active-icon");
  // Apply active style to the selected button
  document
    .getElementById(`${category.toLowerCase()}Btn`)
    .classList.add("active-btn");
  document
    .getElementById(`${category.toLowerCase()}Icon`)
    .classList.add("active-icon");
}

//   FUNCTION TO FETCH DATA FROM API
function fetchData() {
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server error! Status:${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      renderProducts(data);
    })
    .catch((error) => {
      console.log("Fetch error:", error);
    });
}

// FUNCTION TO CALCULATE DISCOUNT
function calculateDiscount(discountedPrice, originalPrice) {
  return parseInt(((originalPrice - discountedPrice) / originalPrice) * 100);
}

// FUNCTION TO RENDER DATA ON UI
function renderProducts(data) {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = "";
  const category = data.categories.find(
    (category) => category.category_name === activeCategory
  );
  if (category) {
    category.category_products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      const imageUrl = product.image;
      const discountPercentage = calculateDiscount(
        parseFloat(product.price),
        parseFloat(product.compare_at_price)
      );
      const truncatedTitle =
        product.title.length > 10
          ? product.title.substring(0, 10) + "..."
          : product.title;
      productCard.innerHTML = `
      <div class="img-div">
      ${product.badge_text ? `<p class="badge">${product.badge_text}</p>` : ""}
      <img src="${imageUrl}" alt= "${product.title}" class="product-image"/>
      </div>

      <div class="title-div">
      <div class="title">${truncatedTitle}</div>
       <div class="black-dot"></div> 
       <div>${product.vendor}</div>
      </div>

      <div class="title-div">
      <p>Rs ${product.price}.00</p>
      <p class="original-price">${product.compare_at_price}.00</p>
      <p class="discount">${discountPercentage}% Off</p>
      </div>
      
      <button class="cart">Add To Cart</button>
     `;

      productContainer.appendChild(productCard);
    });
  }
}

fetchData();
