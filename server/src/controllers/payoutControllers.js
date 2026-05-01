const { User, Bank, sequelize } = require('../database/models');

module.exports.topUpBalance = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { amount, cardNumber, expiry, cvc, name } = req.body;
    const user = req.user;

    const bankCard = await Bank.findOne({
      where: {
        cardNumber,
        expiry,
        cvc,
        name,
      },
      transaction: t,
    });

    if (!bankCard) {
      await t.rollback();
      return res
        .status(404)
        .send(
          'Bank card not found or invalid details (Check Name/Number/CVC/Expiry)'
        );
    }

    if (parseFloat(bankCard.balance) < parseFloat(amount)) {
      await t.rollback();
      return res.status(400).send('Insufficient funds on your bank card');
    }

    await bankCard.decrement('balance', { by: amount, transaction: t });
    await user.increment('balance', { by: amount, transaction: t });

    await t.commit();
    await user.reload();

    res.send({
      statusMessage: 'Balance topped up successfully!',
      newBalance: user.balance,
    });
  } catch (err) {
    if (t) await t.rollback();
    next(err);
  }
};

module.exports.withdrawFunds = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { amount, cardNumber, expiry, cvc, name } = req.body;
    const user = req.user;

    if (parseFloat(user.balance) < parseFloat(amount)) {
      await t.rollback();
      return res.status(400).send('Insufficient internal balance');
    }

    const bankCard = await Bank.findOne({
      where: { cardNumber, expiry, cvc, name },
      transaction: t,
    });

    if (!bankCard) {
      await t.rollback();
      return res
        .status(404)
        .send('Target bank card not found or invalid details');
    }

    await user.decrement('balance', { by: amount, transaction: t });
    await bankCard.increment('balance', { by: amount, transaction: t });

    await t.commit();
    await user.reload();

    res.send({
      statusMessage: 'Funds withdrawn successfully!',
      newBalance: user.balance,
    });
  } catch (err) {
    if (t) await t.rollback();
    next(err);
  }
};
