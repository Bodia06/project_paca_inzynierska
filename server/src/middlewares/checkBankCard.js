const { Bank } = require('../database/models');

module.exports.checkBankCard = async (req, res, next) => {
  try {
    const { cardNumber, expiry, cvc } = req.body;
    if (!cardNumber || !expiry || !cvc) {
      return res.status(400).send('Card number, expiry and CVC are required');
    }
    const bankCard = await Bank.findOne({
      where: {
        cardNumber,
        expiry,
        cvc,
      },
    });
    if (!bankCard) {
      return res
        .status(404)
        .send('Invalid card details. Card not found in bank system.');
    }
    req.bankCard = bankCard;
    next();
  } catch (err) {
    next(err);
  }
};
