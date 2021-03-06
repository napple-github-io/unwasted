const chance = require('chance').Chance();
const User = require('../../lib/models/User');
const Review = require('../../lib/models/Review');
const Listing = require('../../lib/models/Listing');
const moment = require('moment');

module.exports = ({
  userCount = 50,
  reviewCount = 10,
  listingsCount = 200
} = {}) => {
  const users = [...Array(userCount)].map(() => ({
    username: chance.word({ syllables: 3 }),
    password: chance.word({ syllables: 2 }),
    email: chance.email(),
    location: {
      address: chance.address(),
      zip: chance.zip()
    },
    role: 'User'
  }));

  return User
    .create(users)
    .then(createdUsers => {
      const reviews = [...Array(reviewCount)].map(() => ({
        reviewer: chance.pickone(createdUsers)._id,
        reviewee: chance.pickone(createdUsers)._id,
        reviewText: chance.sentence(),
        good: chance.bool()
      }));

      const listings = [...Array(listingsCount)].map(() => ({
        title: chance.word({ syllables: 3 }),
        user: chance.pickone(createdUsers)._id,
        description: chance.sentence(),
        location:{
          address: chance.address(),
          zip: chance.zip()
        },
        archived: false,
        category: chance.pickone(['canned goods',
          'produce',
          'dairy',
          'eggs',
          'meat',
          'seafood',
          'cooked foods',
          'garden',
          'pantry staples',
          'herbs',
          'boxed goods',
          'spices',
          'beverages']),
        dietary: {
          dairy: chance.bool({ likelihood: 20 }),
          gluten: chance.bool({ likelihood: 25 }),
          shellfish: chance.bool({ likelihood: 10 }),
          vegetarian: chance.bool({ likelihood: 50 }),
          vegan: chance.bool({ likelihood: 20 }),
          nut: chance.bool({ likelihood: 25 })
        },
        postedDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
        expiration: moment().subtract(2, 'days').format('MMMM Do YYYY, h:mm:ss a')
      }));
      return Promise.all([
        Listing.create(listings),
        Review.create(reviews)
      ]);
    });
};
