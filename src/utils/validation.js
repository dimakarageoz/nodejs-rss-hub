exports.checkRequiredFields = (checkObject, ...fields) => {
    for (const field of fields) {
        if (!checkObject.hasOwnProperty(field)) {
            return field;
        }

        if (checkObject[field] === null || checkObject[field] === undefined) {
            return field;
        }

        if (typeof checkObject[field] === 'string' && checkObject[field].length === 0) {
            return field;
        }
    }

    return null;
};

exports.checkUniqueFields = (mongooseModel, fields, options = {}) => {
    return new Promise((resolve, reject) => {
        const filters = [];

        for (const field in fields) {
            if (fields.hasOwnProperty(field)) {
                const filter = {};
                filter[field] = fields[field];

                filters.push(filter);
            }
        }

        mongooseModel.find()
            .or(filters)
            .then(results => {
                if (results.length === 0) {
                    resolve();

                    return;
                }

                for (const field in fields) {
                    if (fields.hasOwnProperty(field)) {
                        if (fields[field] === results[0][field]) {
                            reject(`${ options.modelName || mongooseModel.modelName } with current ${field} already exist.`);

                            break;
                        }
                    }
                }

                reject('Server error', 500);
            })
            .catch(err => {
                reject(err.message, 500);
            })
        ;
    })
};
