<template>
    <div class="container" id="app">
        <div class="row">
            <div class="col-12 col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h5>Crear Pregunta</h5>
                    </div>
                    <div class="card-body">
                        <label for="">Nueva pregunta</label>
                        <div class="form-group">
                            <input
                                type="text"
                                v-model="question"
                                class="form-control"
                            />
                        </div>
                    </div>
                    <div class="card-footer">
                        <button
                            v-on:click="sendQuestion"
                            :disabled="!question.length"
                            class="btn btn-block btn-success"
                        >
                            Enviar pregunta
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-8">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Pregunta</th>
                            <th>Aprobación</th>
                            <th>Rechazo</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="question in questions" :key="question.id">
                            <td>{{ question.label }}</td>
                            <td>{{ question.approve }}</td>
                            <td>{{ question.reject }}</td>
                            <td>
                                <button
                                    v-on:click="vote(1, question.id)"
                                    class="btn btn-sm btn-success"
                                >
                                    Aprobar
                                </button>
                                <button
                                    v-on:click="vote(0, question.id)"
                                    class="btn btn-sm btn-danger"
                                >
                                    Rechazar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import io from "socket.io-client";

export default {
    name: "Room",
    data: function() {
        return {
            roomName: "",
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
            this.socket.emit("refreshQuestions", {
                roomName: this.roomName,
                questions: this.questions
            });
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
        defineRoom() {
            var url = new URL(window.location.href);
            this.roomName = url.searchParams.get("roomName");
            this.socket.emit("defineRoom", this.roomName);
        },
        defineSocket() {
            this.socket = io("/room");

            this.socket.on("refreshQuestions", questions => {
                this.questions = questions;
            });

            this.defineRoom();
        }
    },
    created: function() {
        this.defineSocket();
    }
};
</script>
