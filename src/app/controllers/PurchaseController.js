const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    const purchasedAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    await Purchase.create({ ad, content })

    Queue.create(PurchaseMail.key, {
      ad: purchasedAd,
      user,
      content
    }).save()

    return res.send()
  }

  async accept (req, res) {
    const purchase = await Purchase.findById(req.params.id).populate('ad')

    if (req.userId !== String(purchase.ad.author)) {
      // Ad não pertence ao vendedor
      return res.status(400).json({ error: 'The advertisement isn`t yours' })
    }

    const ad = await Ad.findByIdAndUpdate(
      purchase.ad._id,
      { purchasedBy: purchase._id },
      {
        new: true
      }
    )

    return res.json(ad)
  }
}

module.exports = new PurchaseController()
