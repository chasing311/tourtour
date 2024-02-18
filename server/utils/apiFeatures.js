class APIFeatures {
  /**
     *
     * @param {} mongoQuery mongoose query
     * @param {} reqQuery request query
     */
  constructor(mongoQuery, reqQuery) {
    this.mongoQuery = mongoQuery;
    this.reqQuery = reqQuery;
  }

  filter() {
    const queryObj = { ...this.reqQuery };
    // ignores page, sort
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongoQuery = this.mongoQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(",").join(" ");
      this.mongoQuery = this.mongoQuery.sort(sortBy);
    } else {
      this.mongoQuery = this.mongoQuery.sort("-ratingsAverage");
    }

    return this;
  }

  limitFields() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(",").join(" ");
      this.mongoQuery = this.mongoQuery.select(fields);
    } else {
      this.mongoQuery = this.mongoQuery.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.mongoQuery = this.mongoQuery.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
