var app = new Vue({
    el: "#app",
    data: {
        appName: "LearnNest",
        lessons: [
            {
                id: 1,
                title: "Arts and Crafts",
                location: "Heldon",
                description: "Explore creativity with various arts and crafts projects.",
                price: 30,
                availableInventory: 10,
                image: "images/arts_and_crafts.png",
                rating: 2
            },
            {
                id: 2,
                title: "Chemistry",
                location: "Colindale",
                description: "Dive into the world of chemical reactions and experiments.",
                price: 40,
                availableInventory: 8,
                image: "images/chemistry.png",
                rating: 5
            },
            {
                id: 3,
                title: "Computer Science",
                location: "Hendon",
                description: "Learn the fundamentals of computer science and coding.",
                price: 50,
                availableInventory: 5,
                image: "images/computer_science.png",
                rating: 5
            },
            {
                id: 4,
                title: "Economics",
                location: "Golders Green",
                description: "Understand the basics of economics and market dynamics.",
                price: 45,
                availableInventory: 7,
                image: "images/economics.png",
                rating: 3
            },
            {
                id: 5,
                title: "English",
                location: "Hendon",
                description: "Improve your English language skills in an engaging environment.",
                price: 25,
                availableInventory: 10,
                image: "images/english.png",
                rating: 2
            },
            {
                id: 6,
                title: "Geometry",
                location: "Mill Hill",
                description: "Study the fundamentals of geometry and shapes.",
                price: 35,
                availableInventory: 6,
                image: "images/geometry.png",
                rating: 1
            },
            {
                id: 7,
                title: "Greek",
                location: "Barnet",
                description: "Learn the basics of the Greek language and culture.",
                price: 30,
                availableInventory: 4,
                image: "images/greek.png",
                rating: 5
            },
            {
                id: 8,
                title: "Health",
                location: "Finchley",
                description: "Explore the concepts of health and wellness.",
                price: 20,
                availableInventory: 9,
                image: "images/health.png",
                rating: 4
            },
            {
                id: 9,
                title: "Mathematics",
                location: "Hendon",
                description: "Master mathematical concepts and problem-solving.",
                price: 50,
                availableInventory: 8,
                image: "images/maths.png",
                rating: 5
            },
            {
                id: 10,
                title: "Music",
                location: "Colindale",
                description: "Discover the world of music and learn to play instruments.",
                price: 45,
                availableInventory: 6,
                image: "images/music.png",
                rating: 4
            }
        ],
        cart: [],
        showProduct: true,
        order: {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            city: '',
            postcode: '', 
            phone: '',
        },
        sortAttribute: 'price',
        sortDescending: false,
        checkoutStep: 1,
        showMessage: false,
        successMessage: false ,
        showErros: false,
        errors: {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            city: '',
            postcode: '',
            phone: ''
        },
    },
    computed: {
        cartItemCount() {
            return this.cart.length;
        },
        cartTotal() {
            return this.cart.reduce((total, item) => total + item.price, 0);
        },
        sortedProducts() {
            let sorted = this.lessons.slice().sort((a, b) => {
                if (a[this.sortAttribute] < b[this.sortAttribute]) return this.sortDescending ? 1 : -1;
                if (a[this.sortAttribute] > b[this.sortAttribute]) return this.sortDescending ? -1 : 1;
                return 0;
            });
            return sorted;
        },
        isCartButtonDisabled() {
            return this.cart.length > 0;
        },
        isCheckoutButtonEnabled() {
            return this.cart.length > 0 && this.isValidFirstName && this.isValidLastName && this.isValidEmail && this.isValidAddress && this.isValidCity && this.isValidPostcode && this.isValidPhone;
        },
        isProccedToCheckoutButtonEnabled() {
            return this.cart.length > 0 ;
        },
        isValidFirstName() {
            return /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,50}$/.test(this.order.firstName);
        },
        isValidLastName() {
            return /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,50}$/.test(this.order.lastName);
        },
        isValidEmail() {
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.order.email);
        },
        isValidPhone() {
            return /^(\+44\s?7\d{3}|\(?0\)?7\d{3})\s?\d{3}\s?\d{3}$/.test(this.order.phone);
        },
        isValidAddress() {
            return /^[A-Za-z0-9À-ÖØ-öø-ÿ\s,.'-]{1,100}$/.test(this.order.address);
        },
        isValidCity() {
            return /^[A-Za-z0-9À-ÖØ-öø-ÿ\s,.'-]{1,100}$/.test(this.order.city);
        },
        isValidPostcode() {
            return /^([A-Za-z]{1,2}\d{1,2}[A-Za-z]?)\s?(\d[A-Za-z]{2})$/.test(this.order.postcode);
        },
         groupedCart() {
            const grouped = {};
      
            this.cart.forEach((item) => {
              if (grouped[item.id]) {
                grouped[item.id].quantity += 1;
                grouped[item.id].totalPrice += item.price;
              } else {
                grouped[item.id] = {
                  ...item,
                  quantity: 1,
                  totalPrice: item.price,
                };
              }
            });
            return Object.values(grouped);
          }
    },
    methods: {
        addToCart(lesson) {
            if (lesson.availableInventory > 0) {
                this.cart.push(lesson);
                lesson.availableInventory -= 1;
            }
        },
        canAddToCart(lesson) {
            return lesson.availableInventory > 0;
        },
        cartCount(productId) {
            return this.cart.filter(item => item.id === productId).length;
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
            const itemCountInCart = this.cart.filter((cartItem) => cartItem.id === item.id).length;
    
            if (itemCountInCart > 0) {
                const index = this.cart.findIndex((cartItem) => cartItem.id === item.id);
                if (index !== -1) {
                    this.cart.splice(index, 1);
                }
                const lessonInInventory = this.lessons.find((lesson) => lesson.id === item.id);
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
        validateFields () {
                this.errors = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    address: '',
                    city: '',
                    postcode: '',
                    phone: ''
                };
                if (!this.isValidFirstName) {
                    this.errors.firstName = 'Name must be letters only, up to 50 characters.';
                }
                if (!this.isValidLastName) {
                    this.errors.lastName = 'Last name must be letters only, up to 50 characters.';
                }
                if (!this.isValidEmail) {
                    this.errors.email = 'Please enter a valid email address.';
                }
                if (!this.isValidAddress) {
                    this.errors.address = 'Address must be between 1 and 100 characters.';
                }
                if (!this.isValidCity) {
                    this.errors.city = 'City must be between 1 and 100 characters.';
                }
                if (!this.isValidPostcode) {
                    this.errors.postcode = 'Please enter a valid UK postcode (e.g., SW1A 1AA).';
                }
                if (!this.isValidPhone) {
                    this.errors.phone = 'Please enter a valid UK phone number.';
                }
        
                return Object.values(this.errors).every(error => error === '');
        },
        submitForm(){
            this.validateFields(); 
            if  (Object.values(this.errors).every(error => error === '')) {
            this.successMessage = true;
            setTimeout(() => {
                this.successMessage = false;
                this.showErros = false;
                this.showProduct = true;
                this.checkoutStep = 1;
                this.cart = [];
                this.order = {
                    firstName: '',
                    lastName: '',
                    address: '',
                    city: '',
                    postcode: '',
                    phone: ''
                };
            }, 6000);
        }else {
          this.showErros = true;
        }
    }
    }
});