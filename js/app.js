var app = new Vue({
  el: "#app",
  data: {
    appName: "LearnNest",
    lessons: [],
    cart: [],
    showProduct: true,
    order: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      postcode: "",
      phone: "",
    },
    sortAttribute: "price",
    sortDescending: false,
    checkoutStep: 1,
    showMessage: false,
    successMessage: false,
    showErrors: false,
    errors: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      postcode: "",
      phone: "",
    },
    searchQuery: "",
  },
  computed: {
    cartItemCount() {
      return this.cart.length;
    },
    cartTotal() {
      if (this.cart.length === 0) {
        console.log("Cart is empty. Total is 0.");
        return 0;
      }

      console.log("Starting cartTotal calculation...");

      return this.cart.reduce((total, item, index) => {
        const itemPrice = parseFloat(item.price);
        const newTotal = total + itemPrice;

        // Debugging each step
        console.log(`Step ${index + 1}:`);
        console.log(`  Current item price: ${itemPrice}`);
        console.log(`  Accumulated total before adding this item: ${total}`);
        console.log(`  New total after adding this item: ${newTotal}`);

        return newTotal;
      }, 0);
    },
    filteredAndSortedProducts() {
      console.log("Evaluating filteredAndSortedProducts");

      // Check if lessons array is properly populated
      if (!Array.isArray(this.lessons)) {
        console.warn("Lessons data is not an array:", this.lessons);
        return [];
      }

      // Step 1: Filter based on searchQuery
      let filteredProducts = this.lessons.filter((lesson) => {
        // Ensure all properties exist and are strings before filtering
        const title = lesson.title ? lesson.title.toLowerCase() : "";
        const location = lesson.location ? lesson.location.toLowerCase() : "";
        const description = lesson.description
          ? lesson.description.toLowerCase()
          : "";
        const price = lesson.price ? lesson.price.toString() : "";
        const availableInventory = lesson.availableInventory
          ? lesson.availableInventory.toString()
          : "";

        return (
          title.includes(this.searchQuery.toLowerCase()) ||
          location.includes(this.searchQuery.toLowerCase()) ||
          description.includes(this.searchQuery.toLowerCase()) ||
          price.includes(this.searchQuery.toLowerCase()) ||
          availableInventory.includes(this.searchQuery.toLowerCase())
        );
      });

      console.log("Filtered products after search query:", filteredProducts);

      // Sort the filtered products
      return [...filteredProducts].sort((a, b) => {
        if (a[this.sortAttribute] < b[this.sortAttribute])
          return this.sortDescending ? 1 : -1;
        if (a[this.sortAttribute] > b[this.sortAttribute])
          return this.sortDescending ? -1 : 1;
        return 0;
      });
    },
    isCartButtonDisabled() {
      return this.cart.length > 0;
    },
    isCheckoutButtonEnabled() {
      return (
        this.cart.length > 0 &&
        this.isValidFirstName &&
        this.isValidLastName &&
        this.isValidEmail &&
        this.isValidAddress &&
        this.isValidCity &&
        this.isValidPostcode &&
        this.isValidPhone
      );
    },
    isProccedToCheckoutButtonEnabled() {
      return this.cart.length > 0;
    },
    isValidFirstName() {
      return /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,50}$/.test(this.order.firstName);
    },
    isValidLastName() {
      return /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,50}$/.test(this.order.lastName);
    },
    isValidEmail() {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        this.order.email
      );
    },
    isValidPhone() {
      return /^(\+44\s?7\d{3}|\(?0\)?7\d{3})\s?\d{3}\s?\d{3}$/.test(
        this.order.phone
      );
    },
    isValidAddress() {
      return /^[A-Za-z0-9À-ÖØ-öø-ÿ\s,.'-]{1,100}$/.test(this.order.address);
    },
    isValidCity() {
      return /^[A-Za-z0-9À-ÖØ-öø-ÿ\s,.'-]{1,100}$/.test(this.order.city);
    },
    isValidPostcode() {
      return /^([A-Za-z]{1,2}\d{1,2}[A-Za-z]?)\s?(\d[A-Za-z]{2})$/.test(
        this.order.postcode
      );
    },
    groupedCart() {
      const grouped = {};
      this.cart.forEach((item) => {
        if (grouped[item._id]) {
          grouped[item._id].quantity += 1; // Increment the quantity
          grouped[item._id].totalPrice =
            grouped[item._id].quantity * item.price; // Calculate total price
        } else {
          grouped[item._id] = {
            ...item,
            quantity: 1, // Initialize quantity
            totalPrice: item.price, // Initialize total price with the item's price
          };
        }
      });
      return Object.values(grouped); // Return grouped items as an array
    },
  },
  methods: {
    fetchLessons() {
      console.log("Fetching lessons from backend...");
      fetch(
        "https://awslearnnest-env.eba-csemqgpy.eu-west-2.elasticbeanstalk.com/lessons",
        {
          method: "GET",
        }
      )
        .then((response) => {
          console.log("Response status:", response.status);
          if (!response.ok) {
            throw new Error(`HTTPS error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched lessons:", data);
          this.lessons = data.map((lesson) => ({
            ...lesson,
            image: `https://awslearnnest-env.eba-csemqgpy.eu-west-2.elasticbeanstalk.com${lesson.image}`,
          }));
          console.log("Updated lessons data:", this.lessons);
        })
        .catch((error) => {
          console.error("Error fetching lessons:", error);
        });
    },
    addToCart(lesson) {
      if (lesson.availableInventory > 0) {
        this.cart.push(lesson);
        lesson.availableInventory -= 1;
      }
    },
    updateLesson(id, newAvailability) {
      fetch(
        `https://awslearnnest-env.eba-csemqgpy.eu-west-2.elasticbeanstalk.com/lessons/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ availableInventory: newAvailability }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update lesson availability");
          }
          return response.json();
        })
        .then((data) => {
          console.log(`Lesson with ID ${id} updated successfully:`, data);
        })
        .catch((error) => {
          console.error(`Error updating lesson with ID ${id}:`, error);
        });
    },
    performSearch() {
      if (!this.searchQuery.trim()) {
        this.fetchLessons();
        return;
      }
      fetch(
        `https://awslearnnest-env.eba-csemqgpy.eu-west-2.elasticbeanstalk.com/search?q=${encodeURIComponent(
          this.searchQuery
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          this.lessons = data.map((lesson) => ({
            ...lesson,
            image: `https://awslearnnest-env.eba-csemqgpy.eu-west-2.elasticbeanstalk.com${lesson.image}`,
          }));
        })
        .catch((error) => console.error("Error performing search:", error));
    },
    canAddToCart(lesson) {
      return lesson.availableInventory > 0;
    },
    cartCount(productId) {
      return this.cart.filter((item) => item.id === productId).length;
    },
    availabilityMessage(lesson) {
      if (lesson.availableInventory === 0) {
        return "All out!";
      } else if (lesson.availableInventory < 5) {
        return `Only ${lesson.availableInventory} left!`;
      } else {
        return "Buy now!";
      }
    },
    showCheckout() {
      this.showProduct = !this.showProduct;
    },
    removeFromCart(item) {
      const index = this.cart.findIndex(
        (cartItem) => cartItem._id === item._id
      );
      if (index !== -1) {
        this.cart.splice(index, 1);
        const lessonInInventory = this.lessons.find(
          (lesson) => lesson._id === item._id
        );
        if (lessonInInventory) {
          lessonInInventory.availableInventory += 1;
        }
      }
    },
    proceedToCheckout() {
      if (this.cart.length === 0) {
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 2000);
        return;
      } else {
        this.checkoutStep = 2;
      }
    },
    backToCart() {
      this.checkoutStep = 1;
    },
    toggleSortOrder() {
      this.sortDescending = !this.sortDescending;
    },
    validateFields(fieldName = null) {
      if (fieldName === null || fieldName === "firstName") {
        this.errors.firstName = this.isValidFirstName
          ? ""
          : "Name must be letters only.";
      }
      if (fieldName === null || fieldName === "lastName") {
        this.errors.lastName = this.isValidLastName
          ? ""
          : "Last name must be letters only.";
      }
      if (fieldName === null || fieldName === "email") {
        this.errors.email = this.isValidEmail
          ? ""
          : "Please enter a valid email.";
      }
      if (fieldName === null || fieldName === "address") {
        this.errors.address = this.isValidAddress ? "" : "Address is required.";
      }
      if (fieldName === null || fieldName === "city") {
        this.errors.city = this.isValidCity ? "" : "City is required.";
      }
      if (fieldName === null || fieldName === "postcode") {
        this.errors.postcode = this.isValidPostcode
          ? ""
          : "Invalid postcode format.";
      }
      if (fieldName === null || fieldName === "phone") {
        this.errors.phone = this.isValidPhone
          ? ""
          : "Invalid phone number format.";
      }

      // Update `showErrors` based on any error present
      this.showErrors = Object.values(this.errors).some(
        (error) => error !== ""
      );
    },
    submitForm() {
      this.validateFields();

      if (Object.values(this.errors).every((error) => error === "")) {
        const order = {
          firstName: this.order.firstName,
          lastName: this.order.lastName,
          phone: this.order.phone,
          email: this.order.email,
          address: this.order.address,
          city: this.order.city,
          postcode: this.order.postcode,
          lessonIDs: this.cart.map((item) => item._id),
        };

        //submit the order
        fetch(
          "https://awslearnnest-env.eba-csemqgpy.eu-west-2.elasticbeanstalk.com/orders",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Order submission failed.");
            }
            return response.json();
          })
          .then(() => {
            console.log("Order placed successfully.");
            // Update each lesson's availability in the database
            this.cart.forEach((item) => {
              this.updateLesson(
                item._id,
                item.availableInventory - item.quantity
              );
            });

            // Reset cart and form after successful order
            this.successMessage = true;
            setTimeout(() => {
              this.successMessage = false;
              this.showErros = false;
              this.showProduct = true;
              this.checkoutStep = 1;
              this.cart = [];
              this.order = {
                firstName: "",
                lastName: "",
                email: "",
                address: "",
                city: "",
                postcode: "",
                phone: "",
              };
            }, 6000);
          })
          .catch((error) => {
            console.error("Order submission failed:", error);
          });
      } else {
        this.showErros = true;
      }
    },
  },
  watch: {
    searchQuery: {
      immediate: true, // Trigger on initialization
      handler() {
        this.performSearch();
      },
    },
  },
  mounted() {
    console.log("Mounted hook called");
    this.fetchLessons();
  },
});
