new Vue({
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
      successMessage: false,
      searchQuery: "",
      errors: {},
  },
  computed: {
      cartItemCount() {
          return this.cart.length;
      },
      cartTotal() {
          return this.cart.reduce((total, item) => total + item.price, 0);
      },
      filteredAndSortedProducts() {
          let filtered = this.lessons.filter(lesson =>
              lesson.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              lesson.location.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
          return filtered.sort((a, b) => {
              if (a[this.sortAttribute] < b[this.sortAttribute]) return this.sortDescending ? 1 : -1;
              if (a[this.sortAttribute] > b[this.sortAttribute]) return this.sortDescending ? -1 : 1;
              return 0;
          });
      },
      groupedCart() {
          let grouped = {};
          this.cart.forEach(item => {
              if (grouped[item._id]) {
                  grouped[item._id].quantity++;
                  grouped[item._id].totalPrice += item.price;
              } else {
                  grouped[item._id] = { ...item, quantity: 1, totalPrice: item.price };
              }
          });
          return Object.values(grouped);
      },
      isCheckoutButtonEnabled() {
          return (
              this.cart.length > 0 &&
              this.order.firstName &&
              this.order.lastName &&
              this.order.email &&
              this.order.address &&
              this.order.city &&
              this.order.postcode &&
              this.order.phone
          );
      },
  },
  methods: {
      fetchLessons() {
          fetch("http://AWSLearnNest-env.eba-csemqgpy.eu-west-2.elasticbeanstalk.com/lessons")
              .then(res => res.json())
              .then(data => {
                  this.lessons = data;
              })
              .catch(err => console.error(err));
      },
      addToCart(lesson) {
          if (lesson.availableInventory > 0) {
              this.cart.push(lesson);
              lesson.availableInventory--;
          }
      },
      removeFromCart(item) {
          const index = this.cart.findIndex(cartItem => cartItem._id === item._id);
          if (index !== -1) {
              this.cart.splice(index, 1);
              const lesson = this.lessons.find(lesson => lesson._id === item._id);
              if (lesson) lesson.availableInventory++;
          }
      },
      proceedToCheckout() {
          this.checkoutStep = 2;
      },
      backToCart() {
          this.checkoutStep = 1;
      },
      performSearch() {
          if (!this.searchQuery.trim()) {
              this.fetchLessons();
          }
      },
      submitForm() {
          fetch("http://AWSLearnNest-env.eba-csemqgpy.eu-west-2.elasticbeanstalk.com/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  ...this.order,
                  lessonIDs: this.cart.map(item => item._id),
              }),
          })
              .then(res => {
                  if (res.ok) {
                      this.successMessage = true;
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
                      setTimeout(() => (this.successMessage = false), 3000);
                  }
              })
              .catch(err => console.error(err));
      },
      availabilityMessage(lesson) {
          if (lesson.availableInventory === 0) return "All out!";
          if (lesson.availableInventory < 5) return `Only ${lesson.availableInventory} left!`;
          return "Buy now!";
      },
      canAddToCart(lesson) {
          return lesson.availableInventory > 0;
      },
  },
  mounted() {
      this.fetchLessons();
  },
});