var app = new Vue({
    el: "#app",
    data: function() {
        return {
            socket: null,
            question: "",
            questions: []
        };
    },
    methods: {
        vote(action, questionId) {
            let index = this.questions.findIndex(q => q.id == questionId);
            let question = this.questions.find(q => q.id == questionId);

            if (action) {
                ++question.approve;
            } else {
                ++question.reject;
            }

            this.questions[index] = question;
            this.refreshQuestions();
        },
        refreshQuestions() {
            this.socket.emit("refreshQuestions", this.questions);
        },
        sendQuestion() {
            let newQuestion = {
                id: this.questions.length + 1,
                label: this.question,
                approve: 0,
                reject: 0
            };
            this.questions.unshift(newQuestion);
            this.question = "";
            this.refreshQuestions();
        },
        defineSocket() {
            this.socket = io();

            this.socket.on("refreshQuestions", questions => {
                this.questions = questions;
            });
        }
    },
    created: function() {
        this.defineSocket();
    }
});
