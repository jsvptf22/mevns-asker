require('mongoose')
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('db connection ok');
    })
    .catch(() => {
        console.log('db connection error');
    });
