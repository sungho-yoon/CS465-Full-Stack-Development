/* GET Homepage */
const index = (reg, res) => {
    res.render('index', {title: "Travir Getaways"});
};

module.exports = {
    index
};