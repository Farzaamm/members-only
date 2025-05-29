
const index = (req, res) => {
    res.render('pages/index', {title: 'Home'});
}

const about = (req, res) => {
    res.render('pages/about', {title: 'About'});
}

module.exports = {
    index,
    about
}