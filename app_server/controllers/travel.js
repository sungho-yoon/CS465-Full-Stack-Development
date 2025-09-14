/* GET travel view */
const travel = (req, res) => {
    res.render('travel', { title: 'Travir Getaways'});
};

module.exports = {
    travel
};