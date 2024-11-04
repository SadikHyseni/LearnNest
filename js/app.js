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
                image: "images/arts_and_crafts.png"
            },
            {
                id: 2,
                title: "Chemistry",
                location: "Colindale",
                description: "Dive into the world of chemical reactions and experiments.",
                price: 40,
                availableInventory: 8,
                image: "images/chemistry.png"
            },
            {
                id: 3,
                title: "Computer Science",
                location: "Hendon",
                description: "Learn the fundamentals of computer science and coding.",
                price: 50,
                availableInventory: 5,
                image: "images/computer_science.png"
            },
            {
                id: 4,
                title: "Economics",
                location: "Golders Green",
                description: "Understand the basics of economics and market dynamics.",
                price: 45,
                availableInventory: 7,
                image: "images/economics.png"
            },
            {
                id: 5,
                title: "English",
                location: "Hendon",
                description: "Improve your English language skills in an engaging environment.",
                price: 25,
                availableInventory: 10,
                image: "images/english.png"
            },
            {
                id: 6,
                title: "Geometry",
                location: "Mill Hill",
                description: "Study the fundamentals of geometry and shapes.",
                price: 35,
                availableInventory: 6,
                image: "images/geometry.png"
            },
            {
                id: 7,
                title: "Greek",
                location: "Barnet",
                description: "Learn the basics of the Greek language and culture.",
                price: 30,
                availableInventory: 4,
                image: "images/greek.png"
            },
            {
                id: 8,
                title: "Health",
                location: "Finchley",
                description: "Explore the concepts of health and wellness.",
                price: 20,
                availableInventory: 9,
                image: "images/health.png"
            },
            {
                id: 9,
                title: "Mathematics",
                location: "Hendon",
                description: "Master mathematical concepts and problem-solving.",
                price: 50,
                availableInventory: 8,
                image: "images/maths.png"
            },
            {
                id: 10,
                title: "Music",
                location: "Colindale",
                description: "Discover the world of music and learn to play instruments.",
                price: 45,
                availableInventory: 6,
                image: "images/music.png"
            }
        ],
        cart: [],
        showProduct: true,
        order: {
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            zip: null,
            phone: '',
            gift: false
        }
    },
    computed: {
        cartItemCount() {
            return this.cart.length;
        },
        cartTotal() {
            return this.cart.reduce((total, item) => total + item.price, 0);
        },
        canAddToCart() {
            return (lesson) => {
                return this.cart.filter(item => item.id === lesson.id).length < lesson.availableInventory;
            };
        }
    },
    methods: {
        addToCart(lesson) {
            if (this.canAddToCart(lesson)) {
                this.cart.push(lesson);
            }
        },
        showCheckout() {
            this.showProduct = !this.showProduct;
        },
        removeFromCart(item) {
            const index = this.cart.indexOf(item);
            if (index !== -1) {
                this.cart.splice(index, 1);
            }
        },
        submitForm(){
            alert('Order placed successfully!');
            this.cart = [];
            this.order = {
                firsName: '',
                lastName: '',
                address: '',
                city: '',
                zip: null,
                phone: '',
                gift: false
            };
            this.showProduct = true;
        }
    }
});