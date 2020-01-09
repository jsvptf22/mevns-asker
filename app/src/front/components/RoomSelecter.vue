<template>
    <div class="container pt-3">
        <div class="row">
            <div class="col-12">
                <div class="input-group mb-3">
                    <input
                        v-model="activeRoom.name"
                        type="text"
                        class="form-control"
                        placeholder="Nombre de sala"
                    />
                    <div class="input-group-append">
                        <button
                            v-if="!activeRoom._id.length"
                            v-on:click="create"
                            class="btn btn-success"
                            type="button"
                        >
                            Crear sala
                        </button>
                        <button
                            v-if="activeRoom._id.length"
                            v-on:click="edit"
                            class="btn btn-primary"
                            type="button"
                        >
                            Modificar sala
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <table class="table table-bodered">
                    <thead>
                        <tr>
                            <td>No.</td>
                            <td>Sala</td>
                            <td>Opciones</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(room, index) in rooms"
                            v-bind:key="room._id"
                        >
                            <td>{{ index + 1 }}</td>
                            <td>{{ room.name }}</td>
                            <td>
                                <button
                                    v-on:click="openRoom(room._id)"
                                    class="btn btn-success"
                                >
                                    Unirse
                                </button>
                                <button
                                    v-on:click="setActiveRoom(room._id)"
                                    class="btn btn-primary"
                                >
                                    Editar
                                </button>
                                <button
                                    v-on:click="remove(room._id)"
                                    class="btn btn-danger"
                                >
                                    Eliminar
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
import Room from "../classes/Room";
import io from "socket.io-client";

export default {
    name: "RoomSelecter",
    data: function() {
        return {
            socket: null,
            activeRoom: new Room({}),
            rooms: []
        };
    },
    methods: {
        create() {
            if (!this.activeRoom.name.length) {
                this.$toast.error("Debe indicar el nombre de la sala", "Error");
                return;
            }

            fetch(`/api/room/${this.activeRoom.name}`, { method: "POST" })
                .then(function(response) {
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        this.list();
                        this.$toast.success(data.message);
                    } else {
                        this.$toast.error(data.message, "Error");
                    }
                });
        },
        list() {
            this.activeRoom = new Room({});
            this.socket.emit("refreshRooms");
        },
        edit() {
            fetch(`/api/room/${this.activeRoom._id}`, {
                method: "PUT",
                body: JSON.stringify(this.activeRoom),
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json"
                }
            })
                .then(function(response) {
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        this.$toast.success(data.message);
                        this.list();
                    } else {
                        this.$toast.error(data.message, "Error");
                    }
                });
        },
        remove(id) {
            fetch(`/api/room/${id}`, { method: "DELETE" })
                .then(function(response) {
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        this.$toast.success(data.message);
                        this.list();
                    } else {
                        this.$toast.error(data.message, "Error");
                    }
                });
        },
        setActiveRoom(id) {
            let room = this.rooms.find(r => r._id == id);
            this.activeRoom = new Room(room);
        },
        openRoom(id) {
            window.open(`/room.html?room=${id}`, "_blank");
        },
        createSocket() {
            this.socket = io("/roomSelecter");

            this.socket.on("refreshRooms", rooms => {
                this.rooms = rooms;
            });

            this.list();
        }
    },
    created() {
        this.createSocket();
    }
};
</script>
