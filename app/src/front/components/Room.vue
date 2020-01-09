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
                        <tr v-for="question in questions" :key="question._id">
                            <td>{{ question.label }}</td>
                            <td>{{ question.approve }}</td>
                            <td>{{ question.reject }}</td>
                            <td>
                                <button
                                    v-on:click="vote(1, question._id)"
                                    class="btn btn-sm btn-success"
                                >
                                    Aprobar
                                </button>
                                <button
                                    v-on:click="vote(0, question._id)"
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
import Room from "./../classes/Room";

export default {
    name: "Room",
    data: function() {
        return {
            Room: null,
            socket: null,
            question: "",
            questions: []
        };
    },
    methods: {
        vote(action, questionId) {
            fetch(
                `/api/room/${this.Room._id}/questions/${questionId}/vote/${action}`,
                {
                    method: "POST"
                }
            )
                .then(function(response) {
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        this.refreshQuestions();
                        this.$toast.success(data.message);
                    } else {
                        this.$toast.error(data.message, "Error");
                    }
                });
        },
        refreshQuestions() {
            this.socket.emit("refreshQuestions", this.Room._id);
        },
        sendQuestion() {
            if (!this.question.length) {
                this.$toast.error("Debe indicar la pregunta", "Error");
                return;
            }

            fetch(`/api/room/${this.Room._id}/questions/${this.question}`, {
                method: "POST"
            })
                .then(function(response) {
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        this.question = "";
                        this.refreshQuestions();
                        this.$toast.success(data.message);
                    } else {
                        this.$toast.error(data.message, "Error");
                    }
                });
        },
        defineRoom() {
            var url = new URL(window.location.href);
            let roomId = url.searchParams.get("room");

            fetch(`/api/room/${roomId}`, {
                method: "GET"
            })
                .then(function(response) {
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        this.Room = new Room(data.data);
                        this.socket.emit("defineRoom", this.Room._id);
                        this.refreshQuestions();
                    } else {
                        this.$toast.error(data.message, "Error");
                    }
                });
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
