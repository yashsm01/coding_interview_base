/**
 * User Repository
 */
const BaseRepository = require('./base.repository');
const { User } = require('../models');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return this.findOne({ email });
    }

    async findByUsername(username) {
        return this.findOne({ username });
    }
}

module.exports = new UserRepository();
