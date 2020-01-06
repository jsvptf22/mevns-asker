var app = new Vue({
    el: "#app",
    data: function() {
        return {
            code: ""
        };
    },
    methods: {
        checkCode() {
            if (!this.code.length) {
                alert("Debe indicar el codigo de la sala");
                return;
            }

            $.post(
                "/checkCode/" + this.code,
                function(response) {
                    console.log(response);
                },
                "json"
            );
        }
    }
});
